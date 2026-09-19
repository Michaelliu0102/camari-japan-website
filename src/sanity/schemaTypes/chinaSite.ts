import { defineField, defineType } from "sanity";
import { resourcePathField } from "./editorialFields";
const status = (name="status")=>defineField({name,title:"发布状态",type:"string",initialValue:"draft",options:{list:[{title:"待完善",value:"draft"},{title:"审核通过",value:"ready"},{title:"隐藏",value:"hidden"}]}});
const text=(name:string,title:string)=>defineField({name,title,type:"text",rows:3});
const string=(name:string,title:string)=>defineField({name,title,type:"string"});
export const chinaSite = defineType({
  name:"chinaSite",title:"中国站设置 / China Website",type:"document",
  description:"仅用于 camari-international.com.cn。不会影响英文或日文首页与联系方式。",
  fields:[status(),string("brandName","对外展示名"),string("legalName","备案主体公司名"),string("icpNumber","ICP备案号（取得后填写）"),string("siteTitle","首页 SEO 标题"),text("seoDescription","首页 SEO 描述"),
    defineField({name:"home",title:"首页发布状态",description:"首页使用与英文站相同的完整模板。请在 Home Page Settings 的简体中文字段编辑文案；这里控制中国站发布状态。",type:"object",fields:[status(),string("eyebrow","引导文字"),text("title","主标题"),text("description","首页介绍"),resourcePathField("image","现有封面路径"),defineField({name:"coverImage",title:"封面图片",type:"image",options:{hotspot:true}}),string("ctaLabel","按钮文字"),string("brandTitle","品牌介绍标题"),text("brandBody","品牌介绍正文")]}),
    defineField({name:"about",title:"公司介绍发布状态",description:"完整公司介绍在 About Page Settings 的简体中文字段编辑。",type:"object",fields:[status(),string("title","标题"),defineField({name:"paragraphs",title:"正文段落",type:"array",of:[{type:"text"}]})]}),
    defineField({name:"contact",title:"中国站联系方式",type:"object",fields:[status(),string("companyName","公司展示名"),string("email","联系邮箱"),string("phone","联系电话"),text("address","地址"),string("wechat","微信号"),defineField({name:"formEnabled",title:"启用询盘表单",type:"boolean",description:"仅当服务端中国站接收地址已配置且站点审核通过时，表单才可发送。"}),text("privacyNotice","表单个人信息使用说明")]}),
    defineField({name:"downloads",title:"下载中心发布状态",description:"中国站复用完整 Download Page Settings 下载中心，文件说明在其简体中文字段编辑。",type:"object",fields:[status(),string("title","标题"),text("description","说明"),defineField({name:"files",title:"文件",type:"array",of:[{type:"object",fields:[string("title","文件名称"),text("description","文件说明"),resourcePathField("href","现有文件路径"),defineField({name:"file",title:"上传文件",type:"file"})],preview:{select:{title:"title"}}}]})]})
  ].map(field=>["home","about","downloads"].includes(field.name)?{...field,fields:("fields" in field?field.fields:[])?.map((child:{name:string})=>child.name==="status"?child:{...child,hidden:true})}:field),preview:{prepare:()=>({title:"中国站 · camari-international.com.cn"})}
});
