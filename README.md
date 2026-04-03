# 银发AI同行（微信小程序 + H5 MVP）

本仓库现已提供**可直接导入微信开发者工具**的小程序版本，同时保留 H5 原型页面用于快速展示。

## 1) 导入微信开发者工具

1. 打开微信开发者工具，点击「新建项目」。
2. `AppID` 可用测试号（`touristappid`）先本地调试。
3. 选择项目目录：`/workspace/test/miniprogram`。
4. 点击创建后即可预览以下页面：
   - 学习主页：`pages/index/index`
   - 内容后台：`pages/admin/admin`
   - KPI 看板：`pages/dashboard/dashboard`

## 2) 交付物映射

### 可上线小程序（本次新增）
- 小程序主体：`miniprogram/`（包含 `app.json`、页面、课程数据、项目配置）

### 内容管理后台（最简可用）
- 小程序后台页：`miniprogram/pages/admin/admin`（上架/下架、模板编辑、审核）
- H5 后台页：`admin.html`

### 数据看板（核心 KPI）
- 小程序看板页：`miniprogram/pages/dashboard/dashboard`
- H5 看板页：`dashboard.html`

### 试点运营手册
- `docs/pilot-operations.md`

## 3) 已实现核心能力

1. 账号体系：手机号 / 微信登录二选一，简化流程。
2. 入门测评：9 题（认知+焦虑+场景），输出画像与周计划。
3. 个性化路径：办公增效、生活助手（每条 10 个微课）。
4. 微课结构：示例、练习、校验清单、小测。
5. 可视化演示：提示词对比、引用核验、隐私脱敏。
6. 练习复习：闪卡 + 间隔复习提醒。
7. 社区：匿名/脱敏发布、点赞、收藏。
8. 助教：每周直播和群答疑入口信息。
9. 隐私安全：敏感信息检测、内容风险提示、数据导出/删除。

## 4) H5 原型快速预览（可选）

```bash
cd /workspace/test
python3 -m http.server 8080
# 浏览器打开 http://localhost:8080
```
