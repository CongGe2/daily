// ─── Portfolio Landscape PDF · 金承旭 ───
// Landscape A4, editorial-minimalist design
// Generated for jhin.ink portfolio

#set page(
  flipped: true,
  paper: "a4",
  margin: (left: 24mm, right: 24mm, top: 20mm, bottom: 16mm),
  background: none,
)

#set text(
  font: ("Noto Sans SC", "Microsoft YaHei", "Segoe UI"),
  size: 10pt,
  fill: rgb("#1a1a18"),
  lang: "zh",
)

// ─── Colors ───
#let accent = rgb("#b0966e")
#let accent-light = rgb("#d4c4ae")
#let accent-dim = rgb("#f4efe8")
#let bg = rgb("#fafaf8")
#let bg-alt = rgb("#f4f2ee")
#let text-primary = rgb("#1a1a18")
#let text-secondary = rgb("#6b6965")
#let text-tertiary = rgb("#9e9b96")
#let border = rgb("#e4e1dc")
#let card-bg = rgb("#ffffff")

// ─── Helper functions ───
#let serif = ("Noto Serif SC", "STSong", "SimSun")
#let sans = ("Noto Sans SC", "Microsoft YaHei", "Segoe UI")

#let project-page(
  index: "",
  title: "",
  subtitle: "",
  role: "",
  category: "",
  description: "",
  metrics: (),
  image-path: "",
  image-alt: "",
  process-images: (),
  reflection: none,
) = {
  page(
    background: align(right + bottom, place(dx: 0pt, dy: 0pt, {
      rect(width: 45%, height: 100%, fill: bg-alt)
    })),
  )[
    // ─── Page grid ───
    #set page(margin: (left: 24mm, right: 24mm, top: 20mm, bottom: 16mm))

    #grid(
      columns: (1fr, 1.35fr),
      column-gutter: 32pt,
      rows: auto,
      row-gutter: 0pt,
    )[
      // ─── LEFT: Project Info ───
      #block(spacing: 8pt)[
        // Index number
        #text(font: serif, size: 13pt, fill: accent, weight: "regular")[#index]

        // Title
        #text(font: serif, size: 26pt, weight: 700, fill: text-primary, hyphenate: false)[#title]

        // Subtitle
        #text(font: sans, size: 11pt, fill: text-secondary, style: "italic")[#subtitle]

        // Role tag
        #block(spacing: 0pt, above: 12pt)[
          #set text(font: sans, size: 9pt, fill: accent, weight: 600)
          #box(inset: (x: 10pt, y: 4pt), stroke: 0.5pt + accent, radius: 2pt)[#role]
        ]

        // Category
        #text(font: sans, size: 10pt, fill: text-tertiary)[#category]

        // Description
        #block(above: 14pt, below: 12pt)[
          #set text(font: sans, size: 10pt, fill: text-secondary, weight: 400)
          #set par(leading: 0.65em, justify: false)
          #description
        ]

        // Metrics
        #block(above: 8pt)[
          #set text(font: sans, size: 9pt)
          #grid(
            columns: metrics.len(),
            column-gutter: 16pt,
            row-gutter: 0pt,
            ..metrics.map(m => {
              align(center, [
                #text(font: serif, size: 22pt, weight: 700, fill: accent)[#m.at(0)]
                #text(font: sans, size: 8pt, fill: text-tertiary)[#m.at(1)]
              ])
            })
          )
        ]

        // Reflection
        #if reflection != none [
          #block(above: 16pt)[
            #set text(font: sans, size: 9pt, fill: text-tertiary, style: "italic")
            #set par(leading: 0.55em)
            #box(
              inset: (left: 10pt, top: 8pt, bottom: 8pt),
              stroke: (left: 1.5pt + accent-light),
              fill: accent-dim,
            )[#reflection]
          ]
        ]
      ]

      // ─── RIGHT: Image Area ───
      #block[
        // Main hero image
        #if image-path != "" [
          #align(center + horizon)[
            #box(
              width: 100%,
              height: 320pt,
              fill: rgb("#ffffff"),
              stroke: 0.5pt + border,
            )[
              #image(image-path, width: 100%, height: 100%, fit: "cover")
            ]
          ]
        ] else [
          // Generated visual for projects without images
          #align(center + horizon)[
            #box(
              width: 100%,
              height: 320pt,
              fill: gradient.linear(
                (rgb("#1a1008"), 0%),
                (rgb("#2a1810"), 50%),
                (rgb("#c8a050"), 100%),
                angle: 135deg,
              ),
              stroke: 0.5pt + border,
            )[
              #align(center + horizon)[
                #text(font: sans, size: 48pt, fill: white)[🔥]
                #text(font: serif, size: 22pt, weight: 700, fill: rgb("#c8a050"))[MIDNIGHT GRILL]
                #text(font: sans, size: 11pt, fill: rgb("#8a8780"))[深夜食堂 · Unity 2D]
              ]
            ]
          ]
        ]

        // Process images row
        #if process-images.len() > 0 [
          #block(above: 12pt)[
            #grid(
              columns: process-images.len(),
              column-gutter: 10pt,
              row-gutter: 0pt,
              ..process-images.map(p => {
                align(center, [
                  #box(
                    width: 100%,
                    height: 80pt,
                    fill: card-bg,
                    stroke: 0.5pt + border,
                  )[
                    #image(p, width: 100%, height: 100%, fit: "cover")
                  ]
                ])
              })
            )
          ]
        ]
      ]
    ]

    // Footer
    #place(
      bottom + left,
      dx: 0pt,
      dy: -8pt,
    )[
      #text(font: sans, size: 7pt, fill: text-tertiary)[金承旭 JIN CHENGXU · Portfolio · jhin.ink]
    ]
    #place(
      bottom + right,
      dx: 0pt,
      dy: -8pt,
    )[
      #text(font: sans, size: 7pt, fill: text-tertiary)[#index / 12]
    ]
  ]
}

// ═══════════════════════════════════════
// COVER PAGE
// ═══════════════════════════════════════

#page(
  background: align(center + horizon, place(dx: 0pt, dy: 0pt, {
    rect(width: 100%, height: 100%, fill: rgb("#131110"))
  })),
  margin: (left: 32mm, right: 32mm, top: 24mm, bottom: 24mm),
)[
  #set text(fill: rgb("#e8e6e2"))
  #set align(center + horizon)

  // Accent line
  #box(width: 60pt, height: 2pt, fill: accent)
  #v(28pt)

  // Name
  #text(font: serif, size: 48pt, weight: 700, fill: rgb("#f0efe8"), tracking: 2pt)[金承旭]
  #v(4pt)
  #text(font: sans, size: 18pt, fill: accent-light, weight: 300, tracking: 8pt)[JIN CHENGXU]

  #v(24pt)

  // Description
  #text(font: sans, size: 13pt, fill: rgb("#a09c96"), style: "italic")[
    澳门科技大学 · 产品设计专业
  ]

  #v(8pt)

  #text(font: sans, size: 12pt, fill: rgb("#807c76"))[
    产品设计 / UI-UX / AI 原生设计思维 / 三维建模
  ]

  #v(36pt)

  // Stats row
  #grid(
    columns: (1fr, 1fr, 1fr, 1fr),
    column-gutter: 32pt,
    [
      #text(font: serif, size: 36pt, weight: 700, fill: accent)[10]
      #text(font: sans, size: 9pt, fill: rgb("#807c76"))[完成项目]
    ],
    [
      #text(font: serif, size: 36pt, weight: 700, fill: accent)[4]
      #text(font: sans, size: 9pt, fill: rgb("#807c76"))[AI 工具链]
    ],
    [
      #text(font: serif, size: 36pt, weight: 700, fill: accent)[3]
      #text(font: sans, size: 9pt, fill: rgb("#807c76"))[线上 Demo]
    ],
    [
      #text(font: serif, size: 36pt, weight: 700, fill: accent)[1]
      #text(font: sans, size: 9pt, fill: rgb("#807c76"))[国际展览]
    ],
  )

  #v(36pt)

  #text(font: sans, size: 10pt, fill: rgb("#605c56"))[
    jhin.ink · 1416907076\@qq.com · 澳门/大湾区
  ]

  #v(8pt)

  #text(font: sans, size: 9pt, fill: rgb("#484440"))[
    作品集 PDF · Landscape Edition · 2026
  ]
]

// ═══════════════════════════════════════
// PROJECT PAGES
// ═══════════════════════════════════════

// ─── 01 · Rift Speaker ───
#project-page(
  index: "01",
  title: "Rift 便携蓝牙音箱",
  subtitle: "独立产品设计 · 概念至 CMF 完整落地",
  role: "硬件 / CMF",
  category: "产品设计 · 2026",
  description: "以「斜切分割」为核心设计语言，打破圆柱体音箱的视觉单调。Kvadrat 声学织物 × 阳极氧化铝两种材质沿斜切线对峙——既定义了视觉身份，又自然划分了声学功能区。15 位用户深度访谈验证核心假设：用户不是在买音箱，是在买一件值得放在看得见的地方的物件。",
  metrics: (("12", "概念方案"), ("8", "CMF 材质"), ("15", "用户访谈"), ("3", "迭代周期")),
  image-path: "images/optimized/rift-speaker-thumb.jpg",
  process-images: ("images/rift/optimized/rift-concept-sketches.jpg", "images/rift/optimized/rift-cmf-detail.jpg", "images/rift/optimized/rift-form-exploration.jpg"),
  reflection: "反思：下次会更早引入用户测试验证 CMF 触感偏好，而非仅凭个人审美判断。",
)

// ─── 02 · Eclipse Arena ───
#project-page(
  index: "02",
  title: "Eclipse Arena · 星蚀竞技场",
  subtitle: "游戏 UI 设计系统 · 高保真交互原型",
  role: "AI + 游戏UI",
  category: "UI/UX 设计 · 2026",
  description: "科幻竞技场游戏完整 UI 设计语言系统，覆盖 6 大核心界面。NanoBanana2 AI 生成 8 位英雄角色原画与战斗场景背景。React 18 + Framer Motion 实现 AnimatePresence 页面转场、Spring 3D 卡片倾斜、Canvas 粒子系统、实时 HUD 模拟。桌面端/平板双断点响应式适配，~3000 行 TypeScript 代码。",
  metrics: (("6", "核心界面"), ("15", "复用组件"), ("8", "AI 角色"), ("~3K", "行代码")),
  image-path: "images/eclipse-arena/menu.png",
  process-images: (),
  reflection: "反思：动画系统应先做关键帧草稿再编码，直接用 Framer Motion 调参效率低于先设计后实现。",
)

// ─── 03 · MidnightGrill ───
#project-page(
  index: "03",
  title: "MidnightGrill · 深夜食堂",
  subtitle: "Unity 2D 模拟经营游戏开发",
  role: "Unity / 交互",
  category: "Unity 2D 游戏 · 2026",
  description: "从零开发的 Unity 2D 模拟经营游戏。玩家扮演深夜食堂主厨，接待各色顾客，管理食材库存，解锁新菜品。项目覆盖完整的游戏开发管线：需求设计 → 玩法原型 → 美术资源制作 → 脚本逻辑 → 打包测试。核心系统包括订单管理、食材烹饪状态机、顾客满意度评估与动态难度调节。",
  metrics: (("C#", "Unity"), ("2D", "引擎"), ("5+", "菜品"), ("3", "核心循环")),
  image-path: "",
  process-images: (),
  reflection: "反思：第一次做完整游戏，最大的教训是「先做可玩原型再补内容」——花了两周做菜单界面，但核心烹饪交互才是玩家真正关心的。",
)

// ─── 04 · MindSpace ───
#project-page(
  index: "04",
  title: "MindSpace 冥想 App",
  subtitle: "Stable Diffusion 驱动的 UX 设计流程",
  role: "AI + UX",
  category: "UX 设计 · 2026",
  description: "以 Stable Diffusion 为概念加速器完成冥想 App 的全链路 UX 设计——从用户研究、功能架构到高保真界面的完整推导。核心创新在于将 SD 融入传统 UX 流程：40+ 轮 Prompt 迭代完成视觉方向探索，将概念探索从 1-2 周压缩至 2 天，效率提升约 5 倍。定义 AI 在 UX 中的最佳使用边界——加速器而非替代品。",
  metrics: (("40+", "Prompt 迭代"), ("6", "视觉方向"), ("5×", "效率提升"), ("80+", "概念图")),
  image-path: "images/optimized/mindspace-thumb.jpg",
  process-images: (),
  reflection: "反思：AI 生成 UI 的「假细节」问题——按钮文字乱码、图标变形——需要通过严格的图标系统约束来解决。",
)

// ─── 05 · AI Video Workflow ───
#project-page(
  index: "05",
  title: "AI 视频工作流探索",
  subtitle: "从随机到可控 · Continuity Bible 方法论",
  role: "AI / 视频",
  category: "AI 工作流 · 2026",
  description: "探索 AI 视频生成的「可控性」边界——建立 Continuity Bible 角色一致性管理系统、Anchor Image 视觉锚点策略、分层生成（背景→角色→特效→合成）工作流。即梦/Runway/NanoBanana2 三平台 ~60 轮对比测试。核心成果是将生成可用率从 ~25% 系统性提升至 85%+。这是展示「控制 AI 随机性」能力的核心项目——对 AI 岗位是硬通货。",
  metrics: (("~60", "生成轮次"), ("3", "AI 平台"), ("25→85%", "可用率"), ("4", "核心策略")),
  image-path: "images/knight/blender-01-sunset.jpg",
  process-images: (),
  reflection: "核心发现：AI 视频的「随机性」不是 bug，是 feature——关键在于建立足够强的约束系统让随机性在可控范围内发挥。",
)

// ─── 06 · VR Device ───
#project-page(
  index: "06",
  title: "磁吸悬浮 VR 体感设备",
  subtitle: "从电影道具调研到 3D 打印原型",
  role: "概念 / 硬件",
  category: "产品设计 · 2026",
  description: "从科幻电影道具调研出发，完成 VR 体感辅助设备的完整产品设计流程。12 个概念方案中经历「全身外骨骼→上臂固定→腰腿磁吸」三次重大方向转变——每次推翻都在缩小问题空间。最终方案以磁吸模块化设计预估减重 60%，通过 Rhino 7 建模与 3D 打印进行原型验证。",
  metrics: (("12", "概念方案"), ("-60%", "预估减重"), ("4", "迭代版本"), ("5", "月开发周期")),
  image-path: "images/optimized/vr-keyshot-thumb.jpg",
  process-images: ("images/optimized/vr-detail-hero.jpg", "images/case-study/page-30.jpg", "images/optimized/vr-process-thumb.jpg"),
  reflection: "反思：全身外骨骼的浪漫 → 腰腿磁吸方案的务实——设计师最容易犯的错误是爱上自己的第一个想法。",
)

// ─── 07 · SmartDorm ───
#project-page(
  index: "07",
  title: "SmartDorm 智能宿舍收纳",
  subtitle: "跨专业团队项目 · 三模块产品系统",
  role: "产品 / 系统",
  category: "产品设计 · 2025",
  description: "跨专业团队合作项目，针对大学宿舍空间限制设计的三模块智能收纳系统。从用户行为观察出发，定位到三大核心场景：桌面理线、床下收纳、墙面利用。每个模块独立可用的同时形成系统化收纳解决方案。负责产品概念设计与 CMF 方案，协调工业设计与电子工程两个方向。",
  metrics: (("3", "产品模块"), ("跨专业", "团队"), ("4", "用户场景"), ("1", "学期")),
  image-path: "images/optimized/smartdorm-hero.jpg",
  process-images: (),
  reflection: "反思：三模块独立设计导致视觉语言不够统一——如果有下次，会先定义系统级设计语言再展开各个模块。",
)

// ─── 08 · Terrin ───
#project-page(
  index: "08",
  title: "Terrin 陶瓷首饰品牌",
  subtitle: "品牌官网 UI 设计与品牌策略",
  role: "品牌 / UI",
  category: "UI 设计 · 2026",
  description: "为独立陶瓷首饰品牌 Terrin 完成的品牌官网 UI 设计。从品牌定位、用户画像到高保真界面完整交付。强调陶瓷材质的温润感与手工痕迹——设计语言围绕「不完美的完美」展开，避免工业化的精致感，保留手工品牌的温度。包含 Hero 叙事、产品展示、匠人故事、购买流程等关键页面。",
  metrics: (("5", "核心页面"), ("品牌", "从零定义"), ("陶瓷", "材质语言"), ("Figma", "高保真")),
  image-path: "images/optimized/terrin-hero-thumb.jpg",
  process-images: (),
  reflection: "反思：首版以桌面端为主，移动适配成本高——验证了「移动优先」不是口号。后续项目强制 390px 小屏先行。",
)

// ─── 09 · Bench System ───
#project-page(
  index: "09",
  title: "景区公共座椅 Redesign",
  subtitle: "行为洞察驱动的系统重设计",
  role: "公共设施",
  category: "产品设计 · 2025",
  description: "实地调研 60+ 座椅使用场景，发现「弃椅选花坛」反常现象——游客宁坐花坛边缘也不使用公共座椅。定位三大根因：面壁式布局缺乏景观朝向、单人座位刚性隔离社交需求、人车混流缺乏安全缓冲区。提出「安全层+观景层+社交层」三维一体系统化方案，以 Before/After 对比展示设计推导过程。",
  metrics: (("60+", "场景观察"), ("3", "核心问题"), ("3层", "系统方案"), ("1:7", "白膜验证")),
  image-path: "images/optimized/bench-before-after.jpg",
  process-images: (),
  reflection: "反思：公共设计最难的不是做方案，是验证——没法让景区真的换椅子，只能靠白膜模型和用户访谈间接验证。",
)

// ─── 10 · Ceramic Lion ───
#project-page(
  index: "10",
  title: "《汉魂·狮魄》陶瓷艺术",
  subtitle: "汉代虎形意象 → 当代陶瓷狮塑",
  role: "雕塑 / 材质",
  category: "陶瓷雕塑 · 2025",
  description: "深入研究汉代虎形艺术造型语言——从画像石、青铜器、陶俑中提取核心造型基因（张力线条、蹲踞姿态、装饰性肌理），将汉代虎形意象转化为当代陶瓷狮塑。作品入选澳大利亚 Anlan Museum 公开展览，完成从文化研究到陶瓷工艺的完整创作闭环。",
  metrics: (("汉代", "文化溯源"), ("陶瓷", "工艺实现"), ("1", "国际展览"), ("Anlan", "Museum")),
  image-path: "images/optimized/thumb-ceramic.jpg",
  process-images: (),
  reflection: "反思：从文化符号到三维造型的转译过程中，「像不像汉代」和「好不好看」之间的平衡点需要更多用户反馈来校准。",
)

// ─── 11 · RingFit Dashboard ───
#project-page(
  index: "11",
  title: "RingFit Dashboard",
  subtitle: "健身数据追踪面板 · Claude Code 全流程开发",
  role: "数据 / 游戏",
  category: "Vibe Coding · 2026",
  description: "个人健康数据驱动的交互式仪表盘。SVG BMI 半圆仪表实时渲染身体数据变化，12 周趋势预测模型基于历史数据推算减脂进度，燃脂效率排行将健身环运动数据转化为可视化竞技榜单。Vite + React 技术栈，GitHub Actions 自动化部署。从需求到上线全程 Claude Code 辅助，验证 AI 辅助开发的实际效能。",
  metrics: (("React", "Vite"), ("SVG", "仪表盘"), ("12周", "预测模型"), ("CI/CD", "自动部署")),
  image-path: "images/optimized/ringfit-dashboard.jpg",
  process-images: (),
  reflection: "反思：Vibe Coding 的效率优势在 UI 层非常明显，但数据处理逻辑还是需要人工把关——AI 对业务规则的理解仍有盲区。",
)

// ─── 12 · Knight (Live) ───
#project-page(
  index: "12",
  title: "迷茫的骑士 · AI 微电影",
  subtitle: "AI 视频工作流实战验证 · 进行中",
  role: "AI / 电影",
  category: "进行中 · 2026 —",
  description: "本作品集的终极验证项目——一部完全由 AI 辅助生成的微电影。将 Continuity Bible 角色管理、Anchor Image 视觉锁定、分层生成策略三件武器投入实战。当前进度 60%：Bible 体系已完成，Anchor Image 场景锚点已建立，逐场景生成进行中，后期合成待启动。这是从「会用 AI 工具」到「能量化改进 AI 产出」的能力跃迁。",
  metrics: (("60%", "整体进度"), ("✓", "Bible"), ("✓", "Anchor"), ("🔄", "逐场景")),
  image-path: "images/knight/blender-04-after-rain.jpg",
  process-images: (),
  reflection: "「所有项目必须先过我妈能不能看懂测试。如果我妈看不懂我在做什么，说明叙事失败了。」——我的设计方法论隐藏规则。",
)

// ═══════════════════════════════════════
// BACK COVER
// ═══════════════════════════════════════

#page(
  background: align(center + horizon, place(dx: 0pt, dy: 0pt, {
    rect(width: 100%, height: 100%, fill: rgb("#131110"))
  })),
  margin: (left: 32mm, right: 32mm, top: 24mm, bottom: 24mm),
)[
  #set text(fill: rgb("#e8e6e2"))
  #set align(center + horizon)

  #text(font: serif, size: 32pt, weight: 700, fill: rgb("#f0efe8"))[让我们聊聊]

  #v(20pt)

  #text(font: sans, size: 12pt, fill: accent-light)[
    寻找产品设计 / UI-UX / AI 方向实习
  ]
  #v(4pt)
  #text(font: sans, size: 11pt, fill: rgb("#807c76"))[
    Base 澳门 · 大湾区，可远程
  ]

  #v(28pt)

  // Contact grid
  #grid(
    columns: (1fr, 1fr, 1fr),
    column-gutter: 24pt,
    row-gutter: 16pt,
    align(center, [
      #text(font: sans, size: 10pt, fill: rgb("#605c56"))[📧 邮箱]
      #text(font: sans, size: 11pt, fill: accent-light)[1416907076\@qq.com]
    ]),
    align(center, [
      #text(font: sans, size: 10pt, fill: rgb("#605c56"))[📞 电话]
      #text(font: sans, size: 11pt, fill: accent-light)[17765961764]
    ]),
    align(center, [
      #text(font: sans, size: 10pt, fill: rgb("#605c56"))[🌐 作品集]
      #text(font: sans, size: 11pt, fill: accent-light)[jhin.ink]
    ]),
    align(center, [
      #text(font: sans, size: 10pt, fill: rgb("#605c56"))[💬 微信]
      #text(font: sans, size: 11pt, fill: accent-light)[JCX-1416907076]
    ]),
    align(center, [
      #text(font: sans, size: 10pt, fill: rgb("#605c56"))[🔗 GitHub]
      #text(font: sans, size: 11pt, fill: accent-light)[github.com/congge2]
    ]),
    align(center, [
      #text(font: sans, size: 10pt, fill: rgb("#605c56"))[🎓 学校]
      #text(font: sans, size: 11pt, fill: accent-light)[澳门科技大学]
    ]),
  )

  #v(32pt)

  #box(width: 60pt, height: 1pt, fill: accent)
  #v(20pt)

  #text(font: sans, size: 9pt, fill: rgb("#484440"))[
    © 2026 金承旭 JIN CHENGXU · 产品设计（本科在读）
  ]
]
