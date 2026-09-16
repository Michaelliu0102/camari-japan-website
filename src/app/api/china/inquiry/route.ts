import { parseChinaInquiry } from "@/china/inquiry";
import { loadChinaContent } from "@/china/loader";
import { chinaPageReady } from "@/china/routes";
import { isChinaBuild, isChinaPreview } from "@/china/config";
export const runtime="nodejs";
export async function POST(request:Request) {
  // This phase does not send preview submissions to international recipients.
  if(!isChinaBuild||isChinaPreview)return Response.json({error:"预览模式不发送询盘。"},{status:403});
  const webhook=process.env.CHINA_CONTACT_WEBHOOK_URL;
  if(!webhook||!webhook.startsWith("https://"))return Response.json({error:"询盘服务尚未启用。"},{status:503});
  const {settings,records}=await loadChinaContent();
  if(!chinaPageReady("/contact",settings,records)||!settings.contact.formEnabled||!settings.contact.privacyNotice?.trim())return Response.json({error:"询盘服务尚未启用。"},{status:503});
  const origin=request.headers.get("origin");
  if(!origin||origin!==new URL(request.url).origin)return Response.json({error:"请求来源不正确。"},{status:403});
  if(Number(request.headers.get("content-length"))>20000)return Response.json({error:"提交内容过长。"},{status:413});
  let input:unknown;
  try { const text=await request.text();if(text.length>20000)return Response.json({error:"提交内容过长。"},{status:413});input=JSON.parse(text); }
  catch {return Response.json({error:"提交内容格式不正确。"},{status:400});}
  const parsed=parseChinaInquiry(input);
  if(!parsed.ok)return Response.json({error:parsed.error},{status:400});
  if(parsed.value.consent!=="yes")return Response.json({error:"请先确认个人信息使用说明。"},{status:400});
  try {
    const response=await fetch(webhook,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({market:"china",locale:"zh",...parsed.value}),signal:AbortSignal.timeout(10000)});
    if(!response.ok)return Response.json({error:"暂时无法提交，请通过电话或邮箱联系我们。"},{status:502});
    return Response.json({ok:true});
  }catch{return Response.json({error:"暂时无法提交，请通过电话或邮箱联系我们。"},{status:502});}
}
