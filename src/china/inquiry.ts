export function parseChinaInquiry(input: unknown): {ok:true;value:Record<string,string>}|{ok:false;error:string} {
  if(!input||typeof input!=="object")return {ok:false,error:"提交内容格式不正确。"};
  const source=input as Record<string,unknown>;
  const limits:Record<string,number>={name:100,company:200,email:254,phone:50,message:5000,consent:10,website:200};
  const value:Record<string,string>={};
  for(const [key,limit]of Object.entries(limits)) {
    value[key]=typeof source[key]==="string"?source[key].trim():"";
    if(value[key].length>limit)return {ok:false,error:"填写内容过长，请精简后重试。"};
  }
  if(value.website)return {ok:false,error:"无法提交该请求。"};
  if(!value.name||!value.company||!value.email||!value.message)return {ok:false,error:"请填写姓名、公司、邮箱和项目需求。"};
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email))return {ok:false,error:"请输入有效的电子邮箱。"};
  return {ok:true,value};
}
