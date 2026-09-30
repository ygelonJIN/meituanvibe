# meituanvibe

金费清开发中 - 个人网站/项目

## 项目信息

- **域名**: meituanvibe.tech
- **托管**: Cloudflare Workers
- **Workers.dev 备用**: https://meituanvibe.joss13.workers.dev
- **GitHub**: https://github.com/ygelonJIN/meituanvibe
- **项目目录（U盘）**: /Volumes/TUF ESD-T1A Media/美团

## 本地开发 & 部署

```bash
# 本地预览
cd /Volumes/TUF\ ESD-T1A\ Media/美团
wrangler dev

# 手动部署
wrangler deploy
```

## 自动部署

已配置 GitHub Actions，push 到 `main` 分支会自动部署。

需要在 GitHub 仓库 Settings → Secrets 中配置：
- `CLOUDFLARE_API_TOKEN` — Cloudflare API Token
- `CLOUDFLARE_ACCOUNT_ID` — Cloudflare 账户 ID

## Cloudflare 配置要点

1. **域名 DNS**: 需要在 Cloudflare DNS 中添加 A 记录（`@` → `192.0.2.1`，Proxied）
2. **Workers 路由**: `meituanvibe.tech/*` → meituanvibe Worker
3. **workers_dev**: 保留启用作为备用访问地址
