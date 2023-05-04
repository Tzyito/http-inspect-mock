import { BaseJson, ItemJson } from "@/interface/toJson";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";

/*
 * @Author: tzyito
 * @Date: 2022-11-09
 * @LastEditTime: 2022-11-22
 * @LastEditors: tzyito
 * @Description:
 */
const baseType = [
  { type: "int", value: 0 },
  { type: "uint", value: 0 },
  { type: "int32", value: 0 },
  { type: "int64", value: 0 },
  { type: "int8", value: 0 },
  { type: "float", value: 0 },
  { type: "float64", value: 0 },
  { type: "string", value: "''" },
  { type: "Boolean", value: false },
  { type: "time.Time", value: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss") },
]; // 基础类型

const specialType = ["*", "[]"]; //特殊类型
/**
 * 转换思路:
 * 1. 首先拆分字符串获取所有结构体列表，循环转换为interface的形式，以及生成默认值，存储在一个map中
 * 2. 遍历map，通过遍历每个变量类型，匹配基础变量类型/自定义变量/未知变量，再改变默认值(自定义变量/未知变量)
 */
const str =
  'type AOrder struct {\n ID          bson.ObjectId `json:"id,omitempty" bson:"_id,omitempty" descrption:"objectID"`\n OrderNumber string        `json:"order_number" bson:"order_number" description:"昆仑订单号"`\n OfficerID   string        `json:"officer_id" bson:"officer_id" description:"工单id，与昆仑交互使用该id"`\n CustomerID  string        `json:"customer_id" bson:"customer_id" description:"客户id"`\n Status types.OrderStatus `json:"status" bson:"status" description:"订单状态"`\n Type   types.OrderType   `json:"type" bson:"type" description:"订单类型"`\n Source types.OrderSource `json:"source" bson:"source" description:"订单来源"`\n Remark string            `json:"remark" bson:"remark" description:"备注"`\n ComboCode      string                 `json:"combo_code" bson:"combo_code" description:"套餐代码,用于追溯"`\n ComboName      string                 `json:"combo_name" bson:"combo_name" description:"套餐名称"`\n ProductType    types.OrderProductType `json:"product_type" bson:"product_type" description:"产品类型"`\n ComboAmount    uint                   `json:"combo_amount" bson:"combo_amount" description:"套餐金额，*1000存储"`\n DiscountAmount uint                   `json:"discount_amount" bson:"discount_amount" description:"优惠金额，*1000存储"`\n PayAmount      uint                   `json:"pay_amount" bson:"pay_amount" description:"实际支付金额，*1000存储"`\n PayCount       int                    `json:"pay_count" bson:"pay_count" description:"购买数量"`\n ComboConfig    []OrderCombo      `json:"combo_config" bson:"combo_config" description:"套餐配置"`\n CreateTime   time.Time `json:"create_time" bson:"create_time" description:"创建时间"`\n UpdateTime   time.Time `json:"update_time" bson:"update_time" description:"更新时间"`\n PayTime      time.Time `json:"pay_time" bson:"pay_time" description:"订单支付时间"`\n PayWay       string    `json:"pay_way" bson:"pay_way" description:"支付方式"`\n SerialNumber string    `json:"serial_number" bson:"serial_number" description:"流水号"`\n}\ntype OrderCombo struct {\n ID            bson.ObjectId          `json:"id,omitempty" bson:"_id,omitempty" descrption:"objectID"`\n ProductType   types.OrderProductType `json:"product_type" bson:"product_type" description:"产品类型"`\n ProductCode   string                 `json:"product_code" bson:"product_code" description:"产品代码"`\n ProductName   string                 `json:"product_name" bson:"product_name" description:"产品名称"`\n ComboCode     string                 `json:"combo_code" bson:"combo_code" description:"套餐代码"`\n ComboName     string                 `json:"combo_name" bson:"combo_name" description:"套餐名称"`\n ComboConfig   []OrderComboCofig      `json:"combo_config" bson:"combo_config" description:"套餐配置"`\n ComboAmount   uint                   `json:"combo_amount" bson:"combo_amount" description:"套餐金额，*1000存储"`\n ComboTimeUnit types.OrderComboUnit   `json:"combo_time_unit" bson:"combo_time_unit" description:"套餐时间单位，次、月、年"`\n}';
export const useTransferStructToJson = (structs: string) => {
  const structMap: BaseJson = {};
  //  eg: ['type Order struct {}','type Obj struct {}']
  /* eslint-disable */
  const allStructList = structs.match(/.*(\{[^\}]+\})/g) || [] // 拆分结构体对象列表
  // 结构体列表 | eg:[' Order ', ' Obj ']
  const structNameList = (structs.match(/\s[A-Z].*\s(?=struct)/g) as string[]).map((item) => item.replaceAll(/\s/g, '')) || [] // 所有结构体名列表

  allStructList?.forEach((struct) => {
    const key = (struct.match(/\s[A-Z].*\s(?=struct)/g) as string[])[0].replaceAll(/\s/g, '')
    structMap[key] = transferStructToInterface(struct)
  })

  for (let [key, list] of Object.entries(structMap)) {
    for (let i = 0; i < (list as []).length; i++) {
      const { str, type } = findDefaultValue(list[i].value, structNameList)
      list[i].value = str
      list[i].type = type
    }
  }

  for (let [key, list] of Object.entries(structMap)) {
    // 生成数组结构以及生成uid
    structMap[key] = renderChildrenTree(structMap, list)
  }

  return { structMap, structNameList }
}
const renderChildrenTree = (structMap: BaseJson, structItem: ItemJson[]) => {
  let res: ItemJson[] = JSON.parse(JSON.stringify(structItem))
  for (let i = 0; i < res.length; i++) {
    const { value, type } = res[i]
    if (type === 'customType') {
      const childrenName = /(?<=\[\]).*/.test(value) ? (value.match(/(?<=\[\]).*/) as RegExpMatchArray)[0] : value
      res[i].children = renderChildrenTree(structMap, structMap[childrenName])
      continue
    }
    res[i].id = uuidv4()
  }
  return res
}
const transferStructToInterface = (struct: string): ItemJson[] => {
  const list = struct.split('\n')
  const structNameList = []
  for (let i = 1; i < list.length - 1; i++) {
    const l = list[i].split('`') // 分离表述以及变量名
    if (l[0] !== '' && l[1] !== '') {
      const varType = l[0] //基础变量类型
      const desAndVarName = l[1] //描述和变量
      let map: any = {}
      const defaultVarName = varType.trim().split(/\s+/)[0] // 默认key名
      const defaultValType = varType.trim().split(/\s+/)[1] // 默认key对应的value值

      // let desAndVarName = "json:\",omitempty\" bson:\"_id,omitempty\" description:"昆仑订单号""
      desAndVarName.split(' ').forEach((item: string) => {
        item = item.replaceAll(/\\|"/g, '')
        if (item.includes('json')) {
          // 匹配json对应的key
          map['key'] = (item.match(/(?<=json:).*/) as string[])[0].split(',')[0]
        }
        if (item.includes('description')) {
          map['des'] = (item.match(/(?<=description:).*/) as string[])[0]
        }
      })
      map['value'] = defaultValType
      map['type'] = defaultValType
      if (!map['key']) {
        map['key'] = defaultVarName
      }
      if (!map['des']) {
        map['des'] = '默认描述'
      }
      structNameList.push(map)
    }
  }
  return structNameList
}
/**
 * 先查找基础类型中是否存在。不存在则去找自定义类型列表
 * @param defaultValType
 * @returns
 */
const findDefaultValue = (defaultValType: string, structList: string[]) => {
  let str: any = defaultValType
  let type: any = 'unknownType'
  // 基础类型中查找
  for (let it of baseType) {
    if (it.type === defaultValType) {
      str = it.value
      type = 'baseType'
      break
    }
  }
  // 自定义类型中寻找 ['Order', 'OrderCombo'] defaultValType: *Order
  for (let target of structList) {
    // 'Order *Order
    const reg = new RegExp('^(\\*|\\[\\])?' + target + '\\b')
    const testHas = reg.test(defaultValType)
    // 判断参数中是否在自定义数组中
    if (testHas) {
      // 在特殊参数列表中查找 ['*', '[]']
      const regHeade = new RegExp('.*' + '(?=' + target + ')')
      const regBankName = new RegExp('(?<=.*)' + target)
      const attrs = (defaultValType.match(regHeade) as any[])[0]
      const name = (defaultValType.match(regBankName) as any[])[0]
      str = attrs === '[]' ? attrs + name : name
      type = 'customType'
      break
    }
  }

  return {
    str,
    type,
  }
}
// const res = findDefaultValue('type.Order', ['OrderCombo', 'Order'])
// console.log(res)
