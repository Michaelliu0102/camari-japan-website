# CAMARI JAPAN - Global Design System & Architecture

## 0. Brand Soul (品牌灵魂)
* **Slogan**: The Intersection of Texture and Precision (質感と精密さの交差点)
* **Vibe**: 意大利顶级面料的艺术冲击力 ✖️ 日本高端建筑/工程的严谨与留白。
* **Key Concept**: **Ma (間)** - 强调空间、呼吸感与极简主义，克制即奢华。

---

## 1. Color Palette (色彩系统)
整体色彩极其克制，让面料本身的纹理与色彩成为视觉中心。

* **`#FFFFFF` (Pure White)**: 主背景色，代表空间的纯净。
* **`#F2EFE9` (Warm Stone / Linen)**: 高级暖灰色，用于 Section 分割，衬托面料质感。
* **`#1A1A1A` (Charcoal Black)**: 主文本色，避免纯黑，呈现高级纸质印刷感。
* **`#A68A5E` (Accent Gold)**: 暗金色，极精简地用于序号或特殊点缀。
* **`rgba(255, 255, 255, 0.1)`**: 玻璃拟态基础色，专用于导航栏。

---

## 2. Typography (字体排版规范 - 全球免费商用)
所有字体均遵循 SIL Open Font License，确保商业合规。

### 2.1 Serif (衬线体) - 视觉核心：意式奢华
* **Font Family**: 'Playfair Display' 或 'Cinzel'
* **Usage**: 大标题 (H1, H2)、产品大类名称 (MATERIAL, ALCANTARA)。
* **Rules**: 
    * 强制设置 `letter-spacing: 0.15em - 0.2em`。
    * 大多数情况下使用 **All Caps (全大写)**。
    * 'Playfair Display' 的斜体用于展现面料的柔美曲线。

### 2.2 Sans-Serif (无无衬线体) - 视觉核心：日式严谨
* **Font Family**: 'Noto Sans JP' (日文) / 'Montserrat' 或 'Inter' (英文)
* **Usage**: 正文、技术参数表、按钮、标签。
* **Rules**:
    * 日文正文行高 `line-height: 1.8 - 2.0` 以体现“间 (Ma)”。
    * 英文标签字号 `10px - 12px`，全大写，`letter-spacing: 0.3em - 0.4em`。

---

## 3. Global Components (不可变全局组件)

### 3.1 Navigator (导航栏 - 动态适配版)
* **Layout**: 
    * **左侧**: `logo-outline`。
    * **右侧**: 导航菜单、**线性搜索图标 (Search Icon)**、`JP / EN` 切换按钮。
* **Search Icon Style**: 线条粗细必须与 `logo-outline` 保持一致 (0.5px 视觉效果)。
* **Dynamic Theme (背景感知)**:
    * **灰色基调视频/深色背景**: 文字与图标为白色 (`#FFFFFF`)。顶部需有极淡的黑色渐变遮罩以确保白色 Logo 锐利。
    * **浅色背景区域**: 自动切换为深碳色 (`#1A1A1A`) 文字与描边。
* **Glassmorphism**: 始终保持 `backdrop-filter: blur(20px)`。

### 3.2 Footer (页脚 - 非对称画廊风格)
* **Layout**: 
    * **左侧 (60%)**: 巨大的空心 Logo，下方紧跟双语 Slogan，利用极大负空间提升品牌高度。
    * **右侧 (40%)**: 合并展示 COMPANY, LEGAL, CONTACT；订阅区域仅保留极细的底边线。
* **Bottom Bar**: 左侧 Copyright，右侧全球城市列表 (TOKYO | MILANO | LONDON | NEW YORK)，全大写且字间距极宽。
* **Background**: 强制使用 **`#FFFFFF` (纯白)** 以确保视觉上的无限延伸感。

---

## 4. Layout & Spacing (布局与留白)

### 4.1 Desktop & Ma (间)
* **Spacing**: Section 垂直间距保持在 `120px - 160px`。
* **Grid**: 偏好非对称布局（如 7:5 比例），打破传统对称。

### 4.2 Mobile/Tablet (响应式适配)
* **Breakpoints**: 需完美适配 **iPad Pro (11-inch)** 竖屏及各种手机端。
* **Interaction**: 移动端导航转为极简两线汉堡菜单；所有多列网格转为 100% 宽度垂直堆叠。

---

## 5. Interactive UI & Data Logic (交互与数据逻辑)

### 5.1 Color Selection Sync (产品详情页核心)
* **Logic**: 点击颜色方块 (Swatch)，实时更新左侧主展示图及上方的颜色编号/名称。
* **Visual**: 选中状态需有 1px 黑色边框；图片切换需平滑淡入淡出。

### 5.2 SKU & Data Architecture
* **Scale**: 架构需支持 10+ Article，每个 Article 包含 70+ 颜色变体，总计几百个 SKU。
* **Search Interaction**: 点击搜索图标后拉出全屏半透明玻璃拟态层，提供实时联想搜索功能。

---

## 6. Tech Stack (技术架构)
* **Framework**: Next.js (App Router)
* **Styling**: Tailwind CSS
* **CMS**: Sanity.io (用于管理庞大的颜色 SKU、图片及 SEO 元数据)
* **Hardware Context**: 针对 **M4 芯片 MacBook Air** 优化，确保极速预览与流畅的实时滤镜渲染。

---

## 7. AI Agent Directives (AI 开发准则)
1. **Fidelity**: 严禁擅自修改 `logo-outline` (0.5px 描边) 和 `letter-spacing` 等精密参数。
2. **Data-Driven**: 严禁手动创建几百个 SKU 页面，必须通过读取 JSON 数据动态渲染。
3. **Transition**: 确保 Navigator 主题切换、搜索层拉帘等动效时间控制在 `500ms`，采用 `ease-in-out`。
