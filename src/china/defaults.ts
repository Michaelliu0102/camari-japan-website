import type { ChinaSiteSettings } from "./content";
export const chinaSiteDefaults: ChinaSiteSettings = {
  _id: "chinaSiteSettings", status: "draft", brandName: "卡玛瑞国际有限公司", legalName: "卡玛瑞贸易（浙江）有限公司",
  siteTitle: "CAMARI 中国｜材料与定制产品", seoDescription: "了解 CAMARI 的材料选择与定制产品服务，探索汽车内饰、空间设计与生活方式产品的应用。",
  home: {status:"draft",eyebrow:"材料 · 设计 · 定制",title:"从材料触感，\n到产品体验。",description:"为汽车内饰、空间设计与生活方式产品，探索适合的材料与定制方案。",image:"/uploads/hero/video/higgsfield/01-color-swatches-real-16x9-exact.jpg",ctaLabel:"探索材料",brandTitle:"连接材料与创意",brandBody:"从选材、设计到定制开发，CAMARI 与客户共同梳理项目需求，让材料服务于具体的使用场景。"},
  about:{status:"draft",title:"关于 CAMARI",paragraphs:["CAMARI INTERNATIONAL 专注于材料及定制产品，为汽车内饰、空间设计与生活方式项目提供选材和开发支持。","我们重视触感、设计与实际应用之间的关系，并根据项目要求沟通样品、加工方式与交付安排。"]},
  contact:{status:"draft",companyName:"卡玛瑞国际有限公司",phone:"+86 (573) 82680007",email:"info@camari-international.com",address:"浙江省嘉兴市禾兴北路1525号",formEnabled:false},
  downloads:{status:"draft",title:"资料下载",description:"查阅材料目录、技术规格与维护说明。",files:[]}
};
export const chinaMaterialDrafts: Record<string, {name:string;introTitle:string;introBody:string;description:string}> = {
  alcantara:{name:"Alcantara",introTitle:"触感与设计的多种可能",introBody:"Alcantara 是源自意大利的材料，以柔软触感与丰富的设计应用为特点，可用于汽车内饰、室内空间、时尚及消费电子产品。具体颜色、加工方式与性能要求需结合项目确认。",description:"探索 Alcantara 的触感、颜色与应用。"},
  leather:{name:"意大利真皮",introTitle:"天然皮革的质感与细节",introBody:"真皮系列提供不同的表面处理与触感选择，可用于汽车、家具和室内设计。纹理、颜色和性能因具体系列而异，请以对应产品规格及样品为准。",description:"适用于汽车与空间设计的真皮材料。"},
  fabric:{name:"织物",introTitle:"为经典内饰选择织物",introBody:"织物系列涵盖千鸟格、格纹及其他内饰面料，为经典车型修复和定制项目提供选材方向。具体图案、规格和适用车型请与我们确认。",description:"经典车型修复与定制内饰的织物选择。"},
  "vegan-leather":{name:"合成皮革",introTitle:"适配不同场景的表面材料",introBody:"合成皮革系列包括超纤等不同材料方案，可根据应用场景选择触感、纹理和技术规格。具体性能、认证及加工范围以相应产品资料为准。",description:"了解超纤与其他合成皮革系列。"}
};
export const chinaCategoryDrafts: Record<string,{title:string;description:string}> = {
  "automotive-interior-accessories":{title:"汽车内饰配件",description:"围绕车内使用场景，探索材料选择与内饰配件定制。"},
  "tech-accessories":{title:"数码配件",description:"为日常数码产品提供材质、触感与外观的定制选择。"},
  lifestyle:{title:"生活方式产品",description:"将材料触感融入日常收纳、出行及生活配件。"},
  "corporation-gift":{title:"企业礼品",description:"结合品牌表达与使用需求，开发定制礼品及配件。"}
};
