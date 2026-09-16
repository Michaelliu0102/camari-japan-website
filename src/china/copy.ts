import editorialCopy from "./editorial-copy.json" with { type: "json" };
// Shared static interface translations. CMS zh values take precedence in adapters.
// Untranslated editorial copy retains its complete English source in the preview.
const copy: Record<string,string> = {
  ...editorialCopy,
  'BRAND VALUE':'品牌价值','LOCAL SERVICE.\nGLOBAL REACH.':'立足本地，\n连接全球。','ABOUT US':'关于我们','Tailored Surfaces\nBespoke Creations':'精选材料\n定制成就','Speak with our team about material specification,\nbespoke production, and project-fit solutions.':'与我们的团队讨论材料规格、\n定制生产及适合项目的解决方案。','INQUIRY NOW':'咨询项目','OUR LOCATION':'我们的办公地点','VIEW':'查看','View':'查看','Previous slide':'上一张','Next slide':'下一张','Scroll to explore':'向下探索','COOKIE PREFERENCES':'Cookie 设置',
  'Across China, Italy, Japan, and Australia, CAMARI connects local material expertise, certified manufacturing, and coordinated logistics in one responsive network, from concept to delivery.':'CAMARI 的服务网络覆盖中国、意大利、日本和澳大利亚，将本地材料经验、认证制造与协同物流连接起来，从创意构想到最终交付为客户提供支持。',
  'News, materials, exhibitions, and project notes':'新闻、材料资讯、展会与项目动态','Back to Media':'返回资讯','View Material':'查看材料','Case Notes':'案例说明','Discuss a Program':'讨论项目需求','Plan a comparable material program.':'为您的项目规划适合的材料方案。','Tactile Silence':'触感中的从容','interior leather collection':'室内真皮系列','Interior Article':'室内应用系列','colours':'种颜色','Breadcrumb':'当前位置','Material briefing':'材料需求沟通','Article and color matching':'系列与色彩匹配','Prototype surface review':'样品表面评审','Production support':'生产支持','Process':'流程','View Cases':'查看案例','Materials Selected\nProducts Realized':'精选材料\n实现产品',
  'Floor Mat':'脚垫','Headrest Pillow':'头枕','Key Fob':'钥匙包','Lumbar Cushion':'腰靠','Seat Belt Cover':'安全带护肩','Steering Wheel Cover':'方向盘套','Storage Box':'收纳箱','AirPods Case':'AirPods 保护套','iPad Cover':'iPad 保护套','iWatch Strap':'手表表带','MacBook Cover':'MacBook 保护套','MagSafe Accessory':'MagSafe 配件','Alcantara Phone Case':'Alcantara 手机壳','Leather Phone Case':'真皮手机壳','Backpack':'双肩包','Cap':'帽子','Cardholder':'卡包','Duffle Bag':'旅行包','Luggage Case':'行李箱','Passport Holder':'护照夹','Pouch':'收纳袋','Spectacle Case':'眼镜盒','Wallet':'钱包','Washbag':'洗漱包','Watch Case':'腕表收纳盒','Business Card Holder':'名片夹','Desk Mat':'桌垫','Mouse Mat':'鼠标垫','Notebook':'笔记本','Seat Cushion':'坐垫','Tray':'收纳托盘',
  'Filter':'筛选','Contact Sales':'联系销售','Product code: ':'产品编号：','Maintenance and clean':'清洁与保养','Home':'首页','About':'关于我们','Material':'材料','Materials':'材料','Products':'产品','Product':'产品','PRODUCT':'产品','Media':'资讯','Contact':'联系我们','Contact Us':'联系我们','Company Profile':'公司介绍',
  'Leather':'真皮','Vegan Leather':'合成皮革','Fabric':'织物','Premium Italian Surface Material':'意大利优质表面材料','Top selection Italian leather':'精选意大利真皮','High-performance alternatives':'高性能替代材料','Technical and decorative textiles':'功能性与装饰性织物',
  'AUTO':'汽车','AUTOMOTIVE':'汽车','INTERIOR':'室内','OUTDOOR':'户外','TECH':'科技','Automotive':'汽车','Interior':'室内','Outdoor':'户外','Consumer Electronics':'消费电子','Hospitality':'酒店','Retail':'零售','Workspace':'办公空间',
  'Automotive Interior Accessories':'汽车内饰配件','Tech Accessories':'数码配件','Lifestyle':'生活方式','Corporate Gifts':'企业礼品','Press & Notes':'新闻与动态','News, exhibitions, and material stories':'新闻、展会与材料故事','Downloads':'资料下载','Download':'下载','Brand and material files for project teams':'面向项目团队的品牌与材料资料',
  'Privacy Policy':'隐私政策','Cookie Policy':'Cookie 政策','Terms of Use':'使用条款','Sitemap':'网站地图','Search':'搜索','Search materials':'搜索材料','Search materials and products':'搜索材料与产品','Close':'关闭','Menu':'菜单','Open menu':'打开菜单','Close menu':'关闭菜单','View all':'查看全部','View All':'查看全部','View details':'查看详情','View Details':'查看详情','Learn More':'了解更多','Learn more':'了解更多',
  'The Intersection of Texture and Precision':'触感与精工的交汇','The Intersection of':'触感与精工','Texture and Precision':'在此交汇','Discover the Collection':'探索材料系列','Bespoke Surfaces':'定制表面材料','Product — OEM':'产品 — OEM','Material programs for automotive, product, hospitality, and architectural teams.':'为汽车、产品、酒店和建筑设计团队提供材料方案。','CUSTOMIZED PRODUCTS MADE OF ALCANTARA, LEATHER AND FABRIC':'采用 Alcantara、真皮与织物制作的定制产品',
  'B2B Manufacturing':'企业定制生产','From specification to production.':'从产品规格到制造交付。','Customization & Production':'定制与生产','B2B development, sampling and made-to-spec production':'面向企业的开发、打样与按规格生产','Explore':'探索','Company':'公司介绍','ABOUT CAMARI':'关于 CAMARI','Manufacturing':'生产制造','OUR FACTORY':'我们的工厂','CAMARI showroom interior':'CAMARI 展厅内部',
  'Premium Collection':'精选系列','Sustainable Collection':'可持续材料系列','Textile Collection':'织物系列','The sensory revolution':'感官体验的革新','The Art of Italian Innovation':'意大利创新工艺','Performance without compromise':'兼顾触感与性能','High-Performance Alternatives':'高性能替代材料','The Architecture of Weave':'织物的结构之美','AQUAPELLE Microfiber Leather':'AQUAPELLE 超纤皮革',
  'THICKNESS':'厚度','UNIT WEIGHT':'单位重量','WIDTH':'幅宽','BREAKING LOAD':'断裂强力','WEAR RESISTANCE':'耐磨性','TO LIGHT':'耐光性','TO RUBBERY':'耐摩擦性','FR VERSION':'阻燃版本','UNIT':'单位','CODE':'色号','GRAIN':'纹理','FINISH':'表面处理','Thickness':'厚度','Weight':'重量','Width':'幅宽','Composition':'成分','Color':'颜色','Colors':'颜色','Colour':'颜色','Code':'色号','Collection':'系列','Collections':'系列','Specifications':'技术规格','Technical Specifications':'技术规格','Technical specifications':'技术规格','Certifications':'认证','Care & Maintenance':'清洁与保养','Care and Maintenance Guide':'清洁与保养指南','Use and maintenance guidance for installed surfaces.':'已安装表面材料的使用与保养说明。','Related Products':'相关产品','Related Materials':'相关材料','Related Projects':'相关案例','Projects':'应用案例','Applications':'应用场景','Application':'应用场景','Frequently Asked Questions':'常见问题','FAQ':'常见问题','Related Downloads':'相关下载',
  'Back':'返回','Back to materials':'返回材料','Back to products':'返回产品','Back to news':'返回新闻','View collection':'查看系列','View Collection':'查看系列','Explore collection':'探索系列','Explore Collection':'探索系列','All':'全部','All Materials':'全部材料','All materials':'全部材料','All Products':'全部产品','All products':'全部产品','Available Colors':'可选颜色','Available colors':'可选颜色','Available Files':'可下载文件','File':'文件','Files':'文件','Download PDF':'下载 PDF','PDF Download':'下载 PDF','No results found':'未找到相关结果','No results found.':'未找到相关结果。','No matching results.':'未找到匹配结果。','Loading...':'正在加载…','Loading…':'正在加载…',
  'Send a message':'发送需求','Send Message':'发送需求','Send message':'发送需求','Message':'需求说明','Your message':'您的需求','Name':'姓名','Your name':'您的姓名','Company name':'公司名称','Company Name':'公司名称','Email':'电子邮箱','Email address':'电子邮箱','Phone':'联系电话','Phone number':'联系电话','Submit':'提交','Send':'发送','Sending...':'正在提交…','Sending…':'正在提交…','Required':'必填','Optional':'选填','Country':'国家或地区','Region':'地区','Subject':'主题','Subscribe':'订阅','Subscribe to our newsletter':'订阅我们的通讯','Newsletter':'邮件通讯','Thank you':'感谢您的联系','Request a sample':'申请样品','Request samples':'申请样品','Contact our team':'联系我们的团队',
  'JAPAN':'日本','CHINA':'中国','AUSTRALIA':'澳大利亚','ITALY':'意大利','Tokyo':'东京','Jiaxing':'嘉兴','Adelaide':'阿德莱德','Milan':'米兰','Address':'地址','Telephone':'电话','Our offices':'我们的办公室','Global Network':'全球网络','Global network':'全球网络',
  'Accept all':'全部接受','Reject optional':'拒绝非必要项','Save preferences':'保存偏好','Cookie settings':'Cookie 设置','Cookie Settings':'Cookie 设置','Necessary':'必要项','Analytics':'统计分析','Marketing':'营销','Preferences':'偏好设置'
};
const caseInsensitiveCopy = new Map(Object.entries(copy).map(([en,zh])=>[en.toLowerCase(),zh]));
export function chineseCopy<T>(value:T):T {
  if(typeof value==='string') {
    if(Object.hasOwn(copy,value))return copy[value] as T;
    const translated=caseInsensitiveCopy.get(value.toLowerCase());
    if(translated!==undefined)return translated as T;
    if(value.includes(" | "))return value.split(" | ").map(part=>chineseCopy(part)).join(" | ") as T;
    const spec=value.match(/^(.+) Spec Sheet$/);
    if(spec)return `${spec[1]} 技术规格表` as T;
    const technical=value.match(/^Technical specification PDF for (.+)\.$/);
    if(technical)return `${technical[1]} 技术规格 PDF。` as T;
    return value;
  }
  if(Array.isArray(value))return value.map(chineseCopy) as T;
  if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([key,item])=>[key,chineseCopy(item)])) as T;
  return value;
}

export function withChineseCopy<T extends {en:unknown}>(value:T):T & {zh:T['en']} {
  return {...value,zh:chineseCopy(value.en)};
}
