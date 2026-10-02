import { defineField } from "sanity";
import { missingChineseFields } from "../../china/content";
export const chinaStatusField = defineField({
  name:"chinaStatus",title:"中文发布状态 / China Publication",type:"string",initialValue:"draft",
  description:"中文状态独立于英日文。中国站包含英文站全部内容。Global 市场内容自动纳入中国站范围，也可另选 China；完整中文审核后方可正式展示。",
  options:{list:[{title:"待完善 / Draft",value:"draft"},{title:"审核通过 / Ready",value:"ready"},{title:"中国站隐藏 / Hidden",value:"hidden"}],layout:"radio"},
  validation:rule=>rule.custom((value,context)=>{
    if(value!=="ready")return true;
    const missing=missingChineseFields(context.document??{});
    return missing.length?`请先补齐中文内容：${missing.join("、")}`:true;
  })
});
export const chinaMarketsField = defineField({name:"markets",title:"展示市场 / Target Markets",type:"array",of:[{type:"string"}],description:"中国站包含 Global 市场内容；China 可用于新增中国市场内容。英日站仍使用原有市场规则。",options:{list:[{title:"Global",value:"global"},{title:"Japan",value:"japan"},{title:"China 中国大陆",value:"china"}],layout:"tags"}});
