# Project Guide — Jason0411202.github.io

這份文件給 Claude Code 與後續維護者：定義 lesson 頁面的寫作規範與 callout 語義規則，避免風格漂移。

---

## 1. Callout 顏色語義規則 (Single Source of Truth)

專案有 5 種 callout，定義在 `lessons/_shared.css`。**顏色 ≠ 裝飾，顏色 = 語義**。寫 callout 時先決定「想傳達什麼語氣」，再選對應的 class。

| Class | 顏色 | Icon | 語義 | 用在 |
|-------|------|------|------|------|
| `callout-tip` | 紫 (ecc 品牌色) | `i` | 💡 **核心訣竅 / 黃金法則 / Pro Tip** | 整節最該記住的金句、進階技巧、Aha-moment insight。**用得稀少才有份量**。一個小節最多 1 個。 |
| `callout-info` | 青 | `i` | ℹ️ 補充說明 / 知識點 / How-to | 背景資訊、概念解釋、延伸補充、操作小細節 |
| `callout-success` | 綠 | `✓` | ✓ 最佳實踐 / 推薦做法 | 「應該這樣做」、推薦模式、結業總結、養成的好習慣 |
| `callout-warn` | 橙 | `!` | ⚠ 注意事項 / 容易踩坑 | 容易搞錯、需要小心、輕度陷阱、初學者常見誤解 |
| `callout-danger` | 紅 | `!` | ✗ 禁止 / 危險 / 不可逆 | Anti-pattern、絕對不要做、嚴重後果、會破壞別人的 git history 這類 |

### 判斷流程

寫 callout 前，照這個順序自問：

1. **會造成嚴重後果或無法挽回嗎？** → `callout-danger`
2. **這是「容易踩坑、要注意」嗎？** → `callout-warn`
3. **這是「推薦做法 / 最佳實踐」嗎？** → `callout-success`
4. **這是「整節最值得記住的訣竅」嗎？** → `callout-tip`（稀少使用）
5. **以上都不是 → 預設 `callout-info`**

### 反模式

- ❌ 把 `callout-tip` 當預設 callout 用（紫色到處貼，失去份量）
- ❌ 用顏色表達美觀偏好而非語義（「這頁紅色太多，改紫色平衡一下」）
- ❌ 同一小節出現兩個以上 `callout-tip`

---

## 2. Lesson 小節標準格式

每個 lesson `<section>` 大致依以下順序鋪陳，**實際可依小節內容省略部分**：

```
1. 標題 (h2 / h3 + section-eyebrow)
2. 概念講解、佔位符格式指令      ← 解釋 What / Why，可帶 placeholder 範本指令
3. 實戰、實際範例指令            ← 真實可跑的範例 (code-block / table / timeline)
4. 備註資訊框 (callout)          ← 該節的精華、注意事項、補充
```

具體可參考模板：[`lessons/opensource/01_git_daily.html`](lessons/opensource/01_git_daily.html)

### 為什麼這個順序

- **先概念再實戰**：避免讀者照抄指令但不懂在做什麼
- **佔位符 → 實際範例**：先給語法骨架（`git restore --source=<commit> <file>`），再給可直接抄的具體例子（`git restore --source=a1b2c3d src/auth.ts`）
- **callout 放小節尾巴**：作為「這節記住這個就好」的封閉式提醒，不是穿插打斷主敘述

### 彈性

- 純概念小節可省略「實戰範例」
- 純流程演練小節可省略「概念講解」
- callout 不是每節必備；沒有真正的提醒就不要硬塞

---

## 3. 課程系列維護

新增課程系列時：

- 每個系列獨立資料夾：`lessons/<topic>/`
- **不要**把新系列的章節塞進現有系列的 sidebar / JS 陣列
- index.html 用獨立的 sidebar card + 獨立 JS 陣列註冊新系列

詳見既有結構：`lessons/opensource/`、`lessons/devops/`、`lessons/grpc/`、`lessons/redis/`、`lessons/cassandra/`。
