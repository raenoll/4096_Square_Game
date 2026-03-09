# 4096 Square Game - Google Play 上架完整指南

## 目录

1. [项目概述](#1-项目概述)
2. [环境准备](#2-环境准备)
3. [本地开发与测试](#3-本地开发与测试)
4. [Google Play 开发者账号](#4-google-play-开发者账号)
5. [应用图标制作](#5-应用图标制作)
6. [签名密钥配置](#6-签名密钥配置)
7. [构建发布版 APK/AAB](#7-构建发布版-apkaab)
8. [Google Play Console 配置](#8-google-play-console-配置)
9. [商品详情填写](#9-商品详情填写)
10. [内容分级](#10-内容分级)
11. [隐私政策与数据安全](#11-隐私政策与数据安全)
12. [测试轨道发布](#12-测试轨道发布)
13. [正式发布](#13-正式发布)
14. [审核注意事项](#14-审核注意事项)
15. [常见问题 FAQ](#15-常见问题-faq)
16. [命令速查表](#16-命令速查表)

---

## 1. 项目概述

本项目使用 **Capacitor 8.x** 将 HTML5 游戏打包为原生 Android 应用。

```
项目结构（Android 部分）:
android/
├── app/
│   ├── build.gradle                    # 应用级构建配置
│   ├── proguard-rules.pro              # 代码混淆规则
│   └── src/main/
│       ├── AndroidManifest.xml         # 应用清单
│       ├── java/.../MainActivity.java  # 主 Activity
│       ├── assets/public/              # Web 资源（自动同步）
│       └── res/
│           ├── mipmap-*/               # 应用图标（各分辨率）
│           ├── drawable-*/             # 启动画面
│           ├── values/                 # 字符串、主题、颜色
│           └── layout/                 # 布局文件
├── build.gradle                        # 项目级构建配置
├── variables.gradle                    # 版本变量
└── gradle/                             # Gradle Wrapper
```

**当前配置：**
- 应用 ID：`com.game4096.squaregame`
- 最低 SDK：24（Android 7.0）
- 目标 SDK：36（Android 15）
- 版本号：1.0（versionCode: 1）

---

## 2. 环境准备

### 必须安装

| 工具 | 最低版本 | 用途 |
|------|---------|------|
| Node.js | 18+ | 构建工具链 |
| npm | 9+ | 包管理 |
| Android Studio | Ladybug (2024.2+) | IDE 和构建 |
| JDK | 17+ | Java 编译 |
| Android SDK | API 36 | 编译目标 |

### 安装步骤

#### 1) 安装 Android Studio

从 https://developer.android.com/studio 下载并安装。

#### 2) 配置 Android SDK

打开 Android Studio → Settings → SDK Manager：
- **SDK Platforms**：勾选 Android 15 (API 36)
- **SDK Tools**：勾选以下项：
  - Android SDK Build-Tools
  - Android SDK Command-line Tools
  - Android SDK Platform-Tools
  - Android Emulator

#### 3) 配置环境变量

```bash
# macOS/Linux - 添加到 ~/.bashrc 或 ~/.zshrc
export ANDROID_HOME=$HOME/Android/Sdk
# macOS 用户:
# export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin

# Windows - 在系统环境变量中添加：
# ANDROID_HOME = C:\Users\你的用户名\AppData\Local\Android\Sdk
```

#### 4) 安装项目依赖

```bash
npm install
npm run build
npx cap sync android
```

---

## 3. 本地开发与测试

### 在模拟器中运行

```bash
# 同步 Web 资源到 Android 项目
npm run build && npm run cap:sync:android

# 在 Android Studio 中打开项目
npm run cap:open:android

# 或通过命令行直接运行（需要已创建模拟器）
npx cap run android
```

### 在真机上运行

1. **手机开启开发者模式**：设置 → 关于手机 → 连续点击"版本号"7 次
2. **开启 USB 调试**：设置 → 开发者选项 → USB 调试
3. 用 USB 连接手机到电脑
4. 运行：
```bash
npx cap run android --target <设备ID>
# 查看已连接设备：
adb devices
```

### 实时开发（Live Reload）

```bash
# 修改 capacitor.config.ts 添加 server.url（仅开发用，发布前删除）
# server: {
#   url: 'http://你的IP:8080',
#   cleartext: true,
# }
```

---

## 4. Google Play 开发者账号

### 注册流程

1. 访问 [Google Play Console](https://play.google.com/console)
2. 使用 Google 账号登录
3. 支付 **一次性注册费 $25**（约 ¥180）
4. 填写开发者信息：
   - 开发者名称（会公开显示）
   - 联系邮箱
   - 联系电话
   - 网站（可选）

### 个人 vs 组织账号

| | 个人账号 | 组织账号 |
|---|---------|---------|
| 费用 | $25 一次性 | $25 一次性 |
| 验证 | 身份验证 | D-U-N-S 编号 + 身份验证 |
| 时间 | 几天 | 1-2 周 |
| 推荐 | 个人开发者 | 公司/团队 |

> **注意**：Google 从 2023 年起要求新开发者完成身份验证后才能发布应用。个人账号需要提交有效身份证件。

---

## 5. 应用图标制作

### 图标规格

Google Play 要求的图标：

| 类型 | 尺寸 | 用途 |
|------|------|------|
| Play Store 高清图标 | 512 × 512 px | 商店展示 |
| 自适应图标前景层 | 108 × 108 dp (432 × 432 px) | 应用启动器 |
| 自适应图标背景层 | 108 × 108 dp (432 × 432 px) | 应用启动器 |

### Android 各分辨率图标

| 密度 | 尺寸 | 目录 |
|------|------|------|
| mdpi | 48 × 48 px | `mipmap-mdpi/` |
| hdpi | 72 × 72 px | `mipmap-hdpi/` |
| xhdpi | 96 × 96 px | `mipmap-xhdpi/` |
| xxhdpi | 144 × 144 px | `mipmap-xxhdpi/` |
| xxxhdpi | 192 × 192 px | `mipmap-xxxhdpi/` |

### 自动生成图标

```bash
# 安装 canvas 依赖（如未安装）
npm install canvas --save-dev

# 生成 Android 图标
node scripts/generate-android-icons.js
```

### 使用 Android Studio 生成（推荐）

1. 在 Android Studio 中打开项目
2. 右键 `res` 目录 → New → Image Asset
3. 选择 **Launcher Icons (Adaptive and Legacy)**
4. 导入你的 512×512 图标作为前景层
5. 设置背景颜色为 `#faf8ef`
6. 自动生成所有分辨率的图标

---

## 6. 签名密钥配置

### 生成签名密钥（Keystore）

```bash
# 生成发布用签名密钥（请妥善保存！丢失后无法更新应用！）
keytool -genkey -v \
  -keystore release-key.jks \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -alias 4096-game-key \
  -storepass 你的密钥库密码 \
  -keypass 你的密钥密码 \
  -dname "CN=你的名字, OU=个人, O=个人, L=城市, ST=省份, C=CN"
```

> **⚠️ 重要**：
> - 密钥文件 (`release-key.jks`) 必须安全备份，**丢失将无法发布应用更新**
> - 不要将密钥文件提交到 Git 仓库
> - 记住密码，无法找回

### 配置 Gradle 签名

在 `android/` 目录下创建 `keystore.properties`（不要提交到 Git）：

```properties
storeFile=../release-key.jks
storePassword=你的密钥库密码
keyAlias=4096-game-key
keyPassword=你的密钥密码
```

修改 `android/app/build.gradle`，添加签名配置：

```groovy
// 在 android { } 块内添加：

def keystorePropertiesFile = rootProject.file("keystore.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    // ...已有配置...

    signingConfigs {
        release {
            if (keystorePropertiesFile.exists()) {
                storeFile file(keystoreProperties['storeFile'])
                storePassword keystoreProperties['storePassword']
                keyAlias keystoreProperties['keyAlias']
                keyPassword keystoreProperties['keyPassword']
            }
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### 确保 .gitignore 排除敏感文件

```
# 已在 .gitignore 中
*.jks
*.keystore
keystore.properties
```

---

## 7. 构建发布版 APK/AAB

### Google Play 要求使用 AAB 格式

从 2021 年 8 月起，Google Play 要求新应用必须使用 **Android App Bundle (AAB)** 格式。

### 构建步骤

```bash
# 1. 确保 Web 资源是最新的
npm run build
npx cap sync android

# 2. 进入 android 目录
cd android

# 3. 构建 Release AAB
./gradlew bundleRelease

# 构建完成后，AAB 文件位于：
# android/app/build/outputs/bundle/release/app-release.aab

# 如果也需要 APK（用于测试）：
./gradlew assembleRelease
# APK 位于：android/app/build/outputs/apk/release/app-release.apk
```

### 版本号管理

每次发布更新时，需要递增版本号。编辑 `android/app/build.gradle`：

```groovy
defaultConfig {
    applicationId "com.game4096.squaregame"
    versionCode 2          // 每次发布递增（整数）
    versionName "1.1"      // 用户可见的版本号
}
```

---

## 8. Google Play Console 配置

### 创建应用

1. 登录 [Google Play Console](https://play.google.com/console)
2. 点击 **"创建应用"**
3. 填写基本信息：
   - **应用名称**：4096 Square Game
   - **默认语言**：中文（简体）或 English
   - **应用/游戏**：游戏
   - **免费/付费**：免费
4. 勾选声明并点击 **"创建应用"**

### 设置面板任务清单

Google Play Console 有一个任务清单，必须完成所有项目才能发布：

- [ ] 商品详情（名称、描述、截图等）
- [ ] 内容分级
- [ ] 目标受众
- [ ] 隐私政策
- [ ] 数据安全
- [ ] 应用访问权限
- [ ] 广告声明
- [ ] 应用类别和联系方式

---

## 9. 商品详情填写

### 必填信息

#### 应用名称和描述

```
应用名称（30 字符以内）：
4096 Square Game

简短说明（80 字符以内）：
经典数字拼图游戏升级版！滑动合并方块，挑战4096！

完整说明（4000 字符以内）：
4096 Square Game 是一款令人上瘾的数字益智游戏！

🎮 游戏玩法：
• 上下左右滑动，让相同数字的方块合并
• 2+2=4, 4+4=8... 一路合并到 4096！
• 每次滑动后会随机出现新的数字方块
• 当棋盘填满且无法合并时，游戏结束

✨ 特色功能：
• 简洁优雅的界面设计
• 流畅的动画效果
• 触觉反馈（振动）增强游戏体验
• 自动保存游戏进度
• 最高分记录
• 支持手势滑动操作
• 无广告，无内购

🧠 锻炼你的策略思维：
4096 不只是运气游戏，你需要策略和规划！
合理安排每一步滑动，让数字不断翻倍，
向终极目标 4096 发起挑战！

📱 完美适配各种屏幕尺寸
支持手机和平板，流畅运行。

免费下载，无广告打扰。开始你的 4096 挑战之旅！
```

#### 应用截图要求

| 类型 | 数量 | 尺寸要求 |
|------|------|---------|
| 手机截图 | 2-8 张 | 最小 320px，最大 3840px，宽高比 16:9 或 9:16 |
| 7 英寸平板截图 | 最多 8 张 | （可选但推荐） |
| 10 英寸平板截图 | 最多 8 张 | （可选但推荐） |
| 功能图片 | 1 张 | 1024 × 500 px |

#### 截图获取方法

```bash
# 方法 1：通过模拟器截图
# 在 Android Studio 模拟器中运行应用，使用截图按钮

# 方法 2：通过 adb 从真机截图
adb shell screencap /sdcard/screenshot.png
adb pull /sdcard/screenshot.png ./screenshots/

# 方法 3：使用 Android Studio 的设备镜像
# View → Tool Windows → Device Manager → 截图按钮
```

**截图建议：**
1. 游戏初始界面
2. 游戏中（展示合并动画）
3. 达到高分时的界面
4. 游戏结束界面

---

## 10. 内容分级

Google Play 使用 **IARC（国际年龄分级联盟）** 系统。

### 填写问卷

1. 进入 Google Play Console → 内容分级
2. 选择 **"游戏"** 类别
3. 回答问卷（针对本游戏的回答）：
   - 暴力内容：**无**
   - 色情内容：**无**
   - 受管制物质：**无**
   - 赌博：**无**
   - 广告：**无**
   - 用户交互：**无**（无多人/社交功能）
   - 个人信息收集：**无**
   - 位置共享：**无**

### 预期分级结果

| 地区 | 分级 |
|------|------|
| ESRB（美国） | Everyone |
| PEGI（欧洲） | PEGI 3 |
| GRAC（韩国） | 全年龄 |
| IARC（通用） | 3+ |

---

## 11. 隐私政策与数据安全

### 隐私政策

Google Play **要求所有应用都提供隐私政策**。需要一个可公开访问的 URL。

**隐私政策模板：**

```
隐私政策

最后更新日期：[日期]

4096 Square Game（"本应用"）由 [开发者名称] 开发。

信息收集与使用：
本应用不收集、存储或传输任何个人信息。
游戏数据（如分数和游戏进度）仅保存在您的设备本地。

第三方服务：
本应用不使用任何第三方分析、广告或追踪服务。

数据安全：
所有游戏数据存储在您的设备上，不会通过互联网传输。

儿童隐私：
本应用不针对 13 岁以下的儿童收集任何信息。

变更通知：
如果我们的隐私政策发生变化，将在此页面更新。

联系方式：
如有任何隐私相关问题，请联系 [你的邮箱]
```

**托管方式：**
- GitHub Pages（免费）
- 自己的网站
- Google Sites（免费）
- 使用第三方隐私政策生成器网站

### 数据安全声明

在 Google Play Console 中填写数据安全表单：

1. **是否收集或共享数据？** → 否
2. **是否使用加密传输？** → 不适用（无网络传输）
3. **用户能否请求删除数据？** → 不适用（无服务器端数据）
4. **是否遵循 Google 的家庭政策？** → 不适用

---

## 12. 测试轨道发布

Google Play 提供多个测试轨道，建议在正式发布前先做测试：

### 测试轨道类型

| 轨道 | 测试人数 | 审核 | 用途 |
|------|---------|------|------|
| 内部测试 | 最多 100 人 | 无需审核 | 开发团队测试 |
| 封闭测试 | 自定义 | 需审核 | 小范围用户测试 |
| 公开测试 | 不限 | 需审核 | 大范围公测 |

### 内部测试发布（推荐首选）

1. 进入 Google Play Console → 测试 → 内部测试
2. 创建新版本
3. 上传 AAB 文件 (`app-release.aab`)
4. 添加版本说明
5. 添加测试人员（通过 Google 邮箱列表或 Google 群组）
6. 点击 **"开始发布到内部测试"**

> **提示**：内部测试版无需等待审核，上传后几分钟即可安装测试。

### 测试人员安装

1. 测试人员会收到 Google Play 的加入测试邀请链接
2. 接受邀请后，可在 Google Play 商店搜索并安装应用
3. 或直接使用测试链接安装

---

## 13. 正式发布

### 发布前检查清单

- [ ] 应用在多种设备上测试通过
- [ ] 所有商品详情信息已填写完整
- [ ] 截图质量良好且准确展示应用
- [ ] 内容分级已完成
- [ ] 隐私政策已发布且 URL 可访问
- [ ] 数据安全声明已填写
- [ ] 目标受众已设置
- [ ] 应用类别已选择
- [ ] 联系信息已填写
- [ ] 签名密钥已安全备份
- [ ] versionCode 已递增（非首次发布时）

### 发布步骤

1. 进入 Google Play Console → 正式版
2. 点击 **"创建新版本"**
3. 上传 AAB 文件
4. 填写版本说明（此次更新的内容）
5. 点击 **"审核版本"**
6. 确认无错误或警告
7. 点击 **"开始发布到正式版"**

### 审核时间

- 首次提交：通常 **3-7 天**（新开发者账号可能更长）
- 后续更新：通常 **1-3 天**
- 被拒后重新提交：可能需要更长时间

---

## 14. 审核注意事项

### WebView 应用特别注意

Google Play 对 WebView 应用有特殊审核标准：

1. **不要只是包装一个网页**：确保应用提供原生体验
   - ✅ 我们已集成触觉反馈（Haptics）
   - ✅ 自定义启动画面
   - ✅ 状态栏适配
   - ✅ 原生手势支持

2. **功能完整性**：
   - 应用必须功能完整，不能是半成品
   - 所有按钮和功能必须正常工作

3. **最低功能要求**：
   - Google Play 拒绝功能过于简单的应用
   - 确保游戏有足够的交互性和可玩性

### 常见拒绝原因及应对

| 拒绝原因 | 应对策略 |
|---------|---------|
| WebView 包装应用 | 强调原生集成（触觉、启动画面、手势） |
| 功能不足 | 突出游戏策略性、计分系统、持续挑战性 |
| 缺少隐私政策 | 确保隐私政策 URL 有效且内容完整 |
| 元数据不当 | 不要在描述中使用误导性关键词 |
| 模仿/抄袭 | 使用独特的名称和图标设计，突出差异化 |

### 应对 "Minimum Functionality" 拒绝

如果被以"最低功能"理由拒绝，可考虑添加：
- 多种游戏模式（计时模式、挑战模式）
- 成就系统
- 统计数据（游戏次数、最高分、平均分）
- 主题切换（深色模式）
- 设置页面

---

## 15. 常见问题 FAQ

### Q: Google Play 注册费用是多少？
**A:** 一次性费用 $25 美元（约 ¥180），支付后永久有效，不需要年费。

### Q: 与 Apple 开发者计划有什么区别？
**A:** Apple 每年收费 $99（约 ¥688），Google 只需一次性 $25。Google 的审核通常更快、更宽松。

### Q: 应用体积有限制吗？
**A:** AAB 格式下，下载大小上限为 **200MB**（可通过 Play Asset Delivery 扩展到 2GB）。我们的应用约 5-8MB，完全没问题。

### Q: 多久能上线？
**A:** 首次提交通常需要 3-7 天审核。新开发者账号的首个应用可能需要更长时间。

### Q: 可以同时上架 App Store 和 Google Play 吗？
**A:** 可以！本项目已配置了 iOS 和 Android 双平台支持。使用同一套 Web 代码，分别打包即可。

### Q: 如何处理应用更新？
**A:**
1. 修改游戏代码
2. 递增 `versionCode` 和 `versionName`
3. 重新构建 AAB：`npm run build && npx cap sync android && cd android && ./gradlew bundleRelease`
4. 在 Google Play Console 上传新版本

### Q: 签名密钥丢了怎么办？
**A:** 如果使用了 Google Play App Signing（推荐），Google 持有上传密钥，你可以申请重置上传密钥。但如果没使用此功能，密钥丢失将无法再更新应用。

### Q: Google Play App Signing 是什么？
**A:** 这是 Google 提供的密钥管理服务。上传 AAB 时，Google 会用自己的密钥重新签名。好处是：即使你丢失上传密钥，也可以联系 Google 重置。**强烈建议启用。**

### Q: 需要适配平板吗？
**A:** 建议适配。本游戏是响应式设计，在平板上也能正常运行。Google Play 不强制要求，但适配平板可以获得更多用户。

### Q: 应用被拒了怎么办？
**A:** 仔细阅读拒绝邮件中的原因说明，对照上面的"审核注意事项"进行修改，然后重新提交。可以在 Google Play Console 中回复审核团队进行申诉。

---

## 16. 命令速查表

```bash
# === 环境检查 ===
node -v                          # 检查 Node.js 版本
java -version                    # 检查 JDK 版本
adb devices                      # 检查已连接的 Android 设备

# === 开发构建 ===
npm run build                    # 构建 Web 资源
npx cap sync android             # 同步到 Android 项目
npx cap open android             # 在 Android Studio 中打开
npx cap run android              # 直接运行（模拟器/真机）

# === 发布构建 ===
cd android
./gradlew bundleRelease          # 构建 Release AAB
./gradlew assembleRelease        # 构建 Release APK
./gradlew clean                  # 清理构建产物

# === 签名密钥 ===
keytool -genkey -v \
  -keystore release-key.jks \
  -keyalg RSA -keysize 2048 \
  -validity 10000 \
  -alias 4096-game-key           # 生成签名密钥

keytool -list -v \
  -keystore release-key.jks      # 查看密钥信息

# === 版本管理 ===
# 编辑 android/app/build.gradle 中的：
# versionCode（整数，每次递增）
# versionName（用户可见版本号）

# === 一键构建发布 ===
npm run build && \
npx cap sync android && \
cd android && \
./gradlew bundleRelease && \
echo "AAB 文件位于: app/build/outputs/bundle/release/app-release.aab"
```

---

## 附：Google Play 与 App Store 对比

| 项目 | Google Play | App Store |
|------|------------|-----------|
| 注册费用 | $25 一次性 | $99/年 |
| 审核时间 | 3-7 天（首次） | 1-3 天 |
| 应用格式 | AAB | IPA |
| 签名方式 | Keystore + App Signing | 证书 + 描述文件 |
| 测试分发 | 内部/封闭/公开测试轨道 | TestFlight |
| 最低 SDK | API 24+ (Android 7.0) | iOS 16.0+ |
| 分成比例 | 15%（前 $1M）/ 30% | 15%（前 $1M）/ 30% |
| 开发工具 | Android Studio | Xcode |
