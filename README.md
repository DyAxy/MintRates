# MintRate

一个开源的汇率计算器，基于 **Telegram MiniApp**  
简洁、快速，随时在 Telegram 内完成多种汇率的换算。


## ✨ 特性

* 📱 **Telegram MiniApp**：无需额外安装，直接在 TG 内打开
* ⚡ **即时汇率**：实时获取并计算
* 🎨 **现代化界面**：基于 **Next.js 15 + Tailwind CSS 4** 打造
* 🌙 **暗黑模式支持**
* 🌍 **多币种切换、多币种显示**
* 🪶 **轻量易用**：前端无复杂依赖

## 🛠 技术栈

* [Next.js 15](https://nextjs.org/)
* [Tailwind CSS 4](https://tailwindcss.com/)
* [Telegram MiniApp API](https://core.telegram.org/bots/webapps)

## 🚀 本地开发

```bash
# 克隆项目
git clone https://github.com/DyAxy/MintRates.git
cd MintRates

# 安装依赖
bun install

# 启动开发环境
bun dev

# 打开浏览器访问 http://localhost:3000
```

## 📦 构建 & 部署

```bash
pnpm build
pnpm start
```

推荐部署到：

* [Vercel](https://vercel.com/)（官方支持 Next.js）
* [Netlify](https://www.netlify.com/)
* 或你喜欢的服务器
