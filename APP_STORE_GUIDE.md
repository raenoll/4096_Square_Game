# 4096 Square Game - App Store 上架完整指南

## 目录
1. [项目结构说明](#1-项目结构说明)
2. [前置准备](#2-前置准备)
3. [本地开发与测试](#3-本地开发与测试)
4. [Apple 开发者账号](#4-apple-开发者账号)
5. [Xcode 项目配置](#5-xcode-项目配置)
6. [App Icon 制作](#6-app-icon-制作)
7. [构建与签名](#7-构建与签名)
8. [TestFlight 测试](#8-testflight-测试)
9. [App Store Connect 配置](#9-app-store-connect-配置)
10. [提交审核](#10-提交审核)
11. [审核注意事项](#11-审核注意事项)
12. [常见问题](#12-常见问题)

---

## 1. 项目结构说明

```
4096_Square_Game/
├── index.html              # 游戏源文件（原始）
├── package.json            # npm 项目配置
├── capacitor.config.ts     # Capacitor 配置
├── www/                    # Web 资源目录（构建输出）
│   └── index.html          # iOS 适配版本（含 safe area + Haptics）
├── ios/                    # iOS 原生项目（Capacitor 生成）
│   └── App/
│       ├── App.xcodeproj   # Xcode 项目文件
│       ├── App/
│       │   ├── AppDelegate.swift
│       │   ├── Info.plist
│       │   ├── Assets.xcassets/   # App Icon + Splash Screen
│       │   ├── Base.lproj/        # Storyboard
│       │   └── public/            # Web 资源（自动同步）
│       └── Packages/              # Swift Package 插件
├── scripts/
│   └── generate-icon.js    # App Icon 生成脚本
└── APP_STORE_GUIDE.md      # 本文档
```

**技术方案：** 使用 [Capacitor](https://capacitorjs.com/) 将 HTML5 游戏封装为原生 iOS 应用。Capacitor 在 WKWebView 中加载游戏，同时提供原生 API 访问能力（触觉反馈、状态栏等）。

---

## 2. 前置准备

### 必需环境
- **macOS**（必须，Xcode 只能在 Mac 上运行）
- **Xcode 15+**（从 Mac App Store 安装）
- **Node.js 18+**（推荐使用 nvm 管理）
- **Apple ID**（用于注册开发者账号）

### 安装依赖

```bash
# 克隆项目后
npm install

# 构建 web 资源并同步到 iOS 项目
npm run build
npx cap sync ios
```

---

## 3. 本地开发与测试

### 在 Xcode 中运行

```bash
# 打开 Xcode 项目
npx cap open ios
```

在 Xcode 中：
1. 选择目标模拟器（如 iPhone 15 Pro）
2. 点击 ▶ 运行按钮
3. 游戏将在模拟器中启动

### 修改 Web 内容后同步

```bash
# 将 index.html 复制到 www/ 并同步到 iOS
npm run build
npx cap sync ios
```

### 真机测试
1. 将 iPhone 通过 USB 连接到 Mac
2. 在 Xcode 中选择你的设备
3. 首次运行需要信任开发者证书（设置 > 通用 > VPN与设备管理）

---

## 4. Apple 开发者账号

### 4.1 注册 Apple Developer Program

1. 访问 https://developer.apple.com/programs/
2. 点击 "Enroll"（注册）
3. 使用 Apple ID 登录
4. 选择账号类型：
   - **个人** ($99/年) - 适合独立开发者
   - **组织** ($99/年) - 需要 D-U-N-S 编号
5. 完成付款
6. 等待审核（通常 24-48 小时）

### 4.2 创建证书和配置文件

注册成功后，在 Xcode 中操作最为便捷：

1. 打开 Xcode > Settings (⌘,) > Accounts
2. 添加 Apple ID
3. 选择你的 Team
4. Xcode 会自动管理证书和配置文件

**或手动在 Developer Portal 操作：**
1. 登录 https://developer.apple.com/account
2. Certificates, IDs & Profiles
3. 创建 **App ID**: `com.yourname.game4096`
4. 创建 **iOS Distribution Certificate**
5. 创建 **Provisioning Profile**（App Store 类型）

---

## 5. Xcode 项目配置

### 5.1 打开项目

```bash
npx cap open ios
```

### 5.2 基础设置

在 Xcode 中选择 App target > General：

| 设置项 | 值 |
|--------|-----|
| Display Name | 4096 |
| Bundle Identifier | com.yourname.game4096 |
| Version | 1.0.0 |
| Build | 1 |
| Deployment Target | iOS 16.0 (推荐) |

### 5.3 签名配置

在 Signing & Capabilities：
1. 勾选 "Automatically manage signing"
2. 选择你的 Team
3. Xcode 会自动创建 Provisioning Profile

### 5.4 设备方向（可选调整）

在 General > Deployment Info：
- ✅ Portrait（竖屏）
- ✅ Landscape Left（横屏左）
- ✅ Landscape Right（横屏右）

游戏已支持横竖屏自适应，建议全部启用。

---

## 6. App Icon 制作

### 方式一：使用设计工具（推荐）

1. 使用 Figma / Sketch / Photoshop 等设计一个 1024×1024 的 PNG 图标
2. 设计建议：
   - 使用游戏主题色 `#faf8ef` 做背景
   - 放置 "4096" 文字或方块元素
   - **不要**添加圆角（iOS 系统会自动添加）
   - **不要**使用透明背景
3. 将 PNG 文件命名为 `AppIcon-512@2x.png`
4. 放置到 `ios/App/App/Assets.xcassets/AppIcon.appiconset/`

### 方式二：使用生成脚本

```bash
npm install canvas       # 安装 canvas 库
node scripts/generate-icon.js  # 生成图标
```

### 方式三：在线工具

使用 [App Icon Generator](https://www.appicon.co/) 等在线工具，上传 1024×1024 图片自动生成全套尺寸。

---

## 7. 构建与签名

### 7.1 同步最新 Web 资源

```bash
npm run build
npx cap sync ios
```

### 7.2 Archive 构建

1. 在 Xcode 中，选择设备为 "Any iOS Device (arm64)"
2. 菜单 Product > Archive
3. 等待构建完成（首次可能需要几分钟）
4. 构建成功后会自动打开 Organizer 窗口

### 7.3 导出/上传

在 Organizer 窗口中：
1. 选择刚刚创建的 Archive
2. 点击 "Distribute App"
3. 选择 "App Store Connect"
4. 按向导完成上传

---

## 8. TestFlight 测试

### 8.1 内部测试

1. 登录 https://appstoreconnect.apple.com/
2. 进入你的 App
3. TestFlight > 内部测试
4. 添加测试人员（最多 100 人）
5. 测试人员会收到邮件邀请，通过 TestFlight App 安装

### 8.2 测试要点

- [ ] 游戏触摸滑动操作流畅
- [ ] 音效和背景音乐正常播放
- [ ] 分数保存和恢复正常（localStorage）
- [ ] 道具系统（炸弹、交换）工作正常
- [ ] 多语言切换正常
- [ ] 横竖屏切换布局正确
- [ ] 刘海屏（iPhone X+）内容不被遮挡
- [ ] 触觉反馈（合并方块时的振动）正常
- [ ] 内存使用正常，无崩溃
- [ ] 在不同机型测试（SE, 标准, Pro Max, iPad）

---

## 9. App Store Connect 配置

### 9.1 创建 App

1. 登录 https://appstoreconnect.apple.com/
2. "我的 App" > "+" > "新建 App"
3. 填写：
   - **平台**: iOS
   - **名称**: 4096 - Square Game
   - **主要语言**: 简体中文 或 英文
   - **Bundle ID**: com.yourname.game4096
   - **SKU**: game4096-v1

### 9.2 必备元数据

#### 截图（必需）
至少需要以下尺寸的截图（各 1-10 张）：

| 设备 | 截图尺寸 |
|------|---------|
| iPhone 6.9" | 1320 x 2868 |
| iPhone 6.7" | 1290 x 2796 |
| iPhone 6.5" | 1242 x 2688 或 1284 x 2778 |
| iPhone 5.5" | 1242 x 2208 |
| iPad Pro 13" | 2048 x 2732 |
| iPad Pro 12.9" | 2048 x 2732 |

**截图制作建议：**
- 在模拟器中运行游戏，使用 ⌘+S 截图
- 使用 [Screenshots Pro](https://screenshots.pro/) 等工具添加文字和背景
- 展示游戏核心玩法和特色功能

#### App 描述（必需）

**简短描述示例：**
> 挑战你的数字极限！4096 是一款让人欲罢不能的益智数字游戏。滑动方块，合并数字，向 4096 发起挑战！

**详细描述示例：**
> 4096 Square Game 是一款精心设计的数字益智游戏。
>
> 🎮 游戏特色：
> • 简洁优雅的界面设计
> • 流畅的触摸操作和动画效果
> • 道具系统 - 炸弹和交换让游戏更有策略性
> • 支持 12 种语言
> • 原创背景音乐（宁静/欢快两种风格）
> • 支持游戏手柄操作
> • 自动保存游戏进度
> • 一步撤销功能
>
> 📱 完美适配各种 iPhone 和 iPad 屏幕。
>
> 免费游戏，无广告，无内购。

#### 关键词（100 字符以内）
```
4096,2048,益智,数字,方块,puzzle,number,游戏,脑力,数学
```

#### 其他必需信息
- **分类**: Games > Puzzle
- **年龄分级**: 4+ (无不当内容)
- **价格**: 免费
- **隐私政策 URL**: 必须提供（见下方）

### 9.3 隐私政策

即使不收集任何用户数据，App Store 也要求提供隐私政策。

**选项一：** 在 GitHub Pages 上托管一个简单的隐私政策页面。

**隐私政策模板：**
> 4096 Square Game 隐私政策
>
> 最后更新：[日期]
>
> 4096 Square Game 不收集、存储或传输任何个人数据。
> 所有游戏数据（如分数、游戏进度）仅保存在您的设备本地存储中。
> 本应用不使用任何第三方分析工具或广告服务。
> 本应用不需要网络连接即可运行。
>
> 如有疑问，请联系：[your-email@example.com]

**选项二：** 使用免费的隐私政策生成器（如 [PrivacyPolicyTemplate.net](https://privacypolicytemplate.net/)）

---

## 10. 提交审核

### 10.1 提交前检查清单

- [ ] App Icon 已设置（1024×1024）
- [ ] 截图已上传（至少 6.7" 和 5.5"）
- [ ] App 描述已填写（中英文）
- [ ] 隐私政策 URL 可访问
- [ ] 年龄分级已完成
- [ ] 联系信息已填写
- [ ] Build 已通过 TestFlight 测试
- [ ] 版本号和 Build 号正确

### 10.2 提交

1. 在 App Store Connect 中选择你的 Build
2. 填写审核备注（可选）：
   > "This is a number puzzle game similar to 2048, built with HTML5 and wrapped with Capacitor. The game runs entirely offline and does not collect any user data."
3. 点击 "提交以供审核"

### 10.3 审核周期

- **首次提交**: 通常 24-48 小时
- **更新**: 通常 24 小时内
- **加急审核**: 可在 https://developer.apple.com/contact/app-store/ 申请

---

## 11. 审核注意事项

### 11.1 WebView 应用的审核风险

Apple 对 WebView 包装的应用有较严格的要求（Guideline 4.2 - Minimum Functionality）。

**本游戏通过审核的有利因素：**
✅ 丰富的游戏功能（道具系统、多种操作方式）
✅ 离线运行（不依赖远程服务器加载内容）
✅ 原生触觉反馈集成（Haptics API）
✅ 精致的 UI 和流畅的动画
✅ 多语言支持（12 种语言）
✅ 支持多种输入方式（触摸、手柄）
✅ 完全免费，无广告

**如果被拒绝，可能的改进方向：**
- 添加 Game Center 排行榜集成
- 添加 Widget 小组件（显示最高分）
- 添加 iCloud 数据同步
- 添加 Siri Shortcuts 支持
- 添加 SharePlay 多人对战

### 11.2 常见拒绝原因

| 原因 | 解决方案 |
|------|---------|
| Guideline 4.2 - 功能不足 | 强调原生特性集成 |
| 截图不合规 | 使用真实游戏截图，不含设备框 |
| 隐私政策缺失 | 提供有效的隐私政策 URL |
| Bug / 崩溃 | 充分测试后再提交 |
| 元数据不准确 | 确保描述与实际功能一致 |

---

## 12. 常见问题

### Q: 开发过程中需要 macOS 吗？
**A:** 是的，Xcode 只能在 macOS 上运行，这是构建和提交 iOS 应用的必需工具。如果没有 Mac，可以考虑：
- 使用 Mac mini（最便宜的 Mac 选项）
- 使用云 Mac 服务（如 MacStadium、AWS Mac instances）
- 使用 GitHub Actions + Xcode Cloud

### Q: 费用汇总是多少？
**A:**
- Apple Developer Program: $99/年（必需）
- Mac 电脑: 如果还没有（必需）
- 其他: 无（游戏免费，无第三方付费服务）

### Q: 如何更新已上架的 App？
**A:**
1. 修改 `index.html` 中的游戏代码
2. 运行 `npm run build && npx cap sync ios`
3. 在 Xcode 中递增 Build 号
4. Archive 并上传新版本
5. 在 App Store Connect 中提交新版本审核

### Q: 能同时上架 iPad 吗？
**A:** 可以！当前配置已支持 iPad。游戏的响应式布局会自动适配 iPad 屏幕。只需在 App Store Connect 中上传 iPad 截图即可。

### Q: capacitor.config.ts 中的 appId 需要修改吗？
**A:** 需要将 `com.game4096.squaregame` 修改为你自己的 Bundle ID（与 Apple Developer Portal 中注册的 App ID 一致）。

---

## 快速命令参考

```bash
# 安装依赖
npm install

# 构建 web 资源
npm run build

# 同步到 iOS 项目
npx cap sync ios

# 在 Xcode 中打开
npx cap open ios

# 生成 App Icon（需要先安装 canvas）
node scripts/generate-icon.js

# 一键构建并同步
npm run prepare
```
