# Biome + Bun 迁移指南

## 🎯 迁移目标

- ✅ 移除 ESLint 生态（7 个包 → 0 个）
- ✅ 添加 Biome（1 个包，快 25-100 倍）
- ✅ 切换到 Bun 包管理器（快 10-25 倍）

---

## 📋 执行步骤

### 第 1 步：安装 Bun（如果尚未安装）

**Windows PowerShell：**
```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

**验证安装：**
```bash
bun --version
# 应显示：1.x.x
```

---

### 第 2 步：删除旧的包管理器文件

```bash
# 删除 pnpm 文件
rm pnpm-lock.yaml

# 删除 node_modules（可选，推荐）
rm -rf node_modules
```

---

### 第 3 步：使用 Bun 安装依赖

```bash
bun install
```

这会创建 `bun.lockb` 文件（Bun 的 lockfile）。

---

### 第 4 步：初始化 Git（避免 Biome 警告）

如果项目还没有 `.git` 目录：
```bash
git init
```

---

### 第 5 步：测试 Biome

**运行检查：**
```bash
bun run lint
```

**自动修复：**
```bash
bun run lint:fix
```

**格式化代码：**
```bash
bun run format
```

---

## 📊 变更对比

### package.json 变更

**移除的包（7 个）：**
- ❌ `@eslint/eslintrc`
- ❌ `@typescript-eslint/eslint-plugin`
- ❌ `@typescript-eslint/parser`
- ❌ `eslint`
- ❌ `eslint-config-next`
- ❌ `eslint-plugin-react`
- ❌ `eslint-plugin-react-hooks`

**新增的包（1 个）：**
- ✅ `@biomejs/biome` (1.9.4)

**新的脚本命令：**
```json
{
  "lint": "biome check .",
  "lint:fix": "biome check --write .",
  "format": "biome format --write ."
}
```

---

## 🔧 Biome 配置说明

已创建 `biome.json` 配置文件，包含：

### 格式化配置
- 缩进：2 空格
- 引号：单引号（JSX 双引号）
- 分号：自动（asNeeded）
- 行宽：100 字符

### Lint 规则
- ✅ React Hooks 规则（useHookAtTopLevel）
- ✅ 依赖数组检查（useExhaustiveDependencies）
- ✅ 未使用变量警告（noUnusedVariables）
- ✅ 无障碍规则（a11y）
- ⚠️ 允许 `any` 类型（noExplicitAny: off）
- ⚠️ 允许非空断言（noNonNullAssertion: off）

---

## 🚀 速度对比

| 任务 | ESLint + pnpm | Biome + Bun | 提升 |
|------|--------------|-------------|------|
| **Lint 检查** | ~3-5s | ~0.1-0.3s | **15-50x** |
| **依赖安装** | ~10-15s | ~1-2s | **8-12x** |
| **格式化** | ~2-3s (Prettier) | ~0.05-0.1s | **25-50x** |

---

## ⚠️ 注意事项

### 1. Next.js 兼容性

**移除 `eslint-config-next` 后：**
- ❌ `next lint` 命令将不可用
- ✅ 使用 `bun run lint` 代替
- ✅ TypeScript 编译仍会捕获类型错误

### 2. VS Code 集成

**安装 Biome 扩展：**
1. 打开 VS Code
2. 搜索并安装：`Biome`
3. 禁用 ESLint 扩展（如果已安装）

**配置自动保存格式化：**
在 `.vscode/settings.json` 添加：
```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "[javascript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[typescript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "biomejs.biome"
  }
}
```

### 3. Git 忽略文件

确保 `.gitignore` 包含：
```
node_modules/
.next/
bun.lockb  # 或提交此文件（推荐）
```

---

## 🔍 验证迁移

### 运行完整检查：
```bash
# 1. Lint 检查
bun run lint

# 2. 类型检查
bun run build

# 3. 开发服务器
bun run dev
```

### 预期结果：
- ✅ 无 ESLint 相关错误
- ✅ Biome 检查通过
- ✅ TypeScript 编译成功
- ✅ 开发服务器正常启动

---

## 📝 后续优化（可选）

### 1. 添加 Pre-commit Hook

安装 `husky`：
```bash
bun add -D husky lint-staged
bunx husky init
```

在 `.husky/pre-commit` 添加：
```bash
bunx lint-staged
```

在 `package.json` 添加：
```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["biome check --write"]
  }
}
```

### 2. 使用 Bun 作为运行时（实验性）

```bash
# 替代 next dev
bun --bun run dev

# 替代 next build
bun --bun run build
```

---

## 🆘 故障排除

### 问题 1：Biome 检查失败

**原因：** 代码不符合 Biome 规则

**解决：**
```bash
# 自动修复大部分问题
bun run lint:fix

# 查看具体错误
bun run lint
```

### 问题 2：依赖安装失败

**原因：** Bun 与某些包不兼容

**解决：**
```bash
# 回退使用 pnpm
pnpm install
```

### 问题 3：VS Code 仍使用 ESLint

**解决：**
1. 禁用 ESLint 扩展
2. 重启 VS Code
3. 确保 Biome 扩展已启用

---

## ✅ 迁移完成清单

- [ ] Bun 已安装并验证
- [ ] 已删除 `pnpm-lock.yaml` 和 `node_modules`
- [ ] 运行 `bun install` 成功
- [ ] `biome.json` 配置文件存在
- [ ] `bun run lint` 通过
- [ ] `bun run dev` 正常启动
- [ ] VS Code Biome 扩展已安装
- [ ] 旧的 ESLint 配置文件已删除（`.eslintrc.*`）

---

## 📚 相关文档

- Biome 官方文档：https://biomejs.dev
- Bun 官方文档：https://bun.sh
- Biome VS Code 扩展：https://marketplace.visualstudio.com/items?itemName=biomejs.biome
