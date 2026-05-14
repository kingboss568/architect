# 500 Tools · taiwanarch.com

五個專業領域 × 100 個可直接操作的工具 = **506 個自包含的 HTML 頁面**。

## 內容

| 編號 | 行業 | 入口 | 主標 |
|---|---|---|---|
| 001 | 建築土木 | `arch.html` | 建築之美,源於精準。 |
| 002 | 室內設計 | `interior.html` | 設計,是看不見的藝術。 |
| 003 | 房地產 | `realestate.html` | 用數據,看見價值。 |
| 004 | 景觀園藝 | `landscape.html` | 讓自然,回到生活。 |
| 005 | 機電水電 | `mep.html` | 讓建築,活起來。 |

每個工具是「直接可用」的迷你 web app,不是外部連結索引。

## 工具類型

| 類型 | 說明 | 範例 |
|---|---|---|
| **calc** | 計算機:輸入 → 公式 → 即時結果 | 容積率、房貸、電壓降 |
| **conv** | 雙向換算:左右兩側互動式換算 | 坪 ↔ m²、°C ↔ °F |
| **lookup** | 查表:可搜尋的資料表 | 鋼筋規格、地震分區、CNS 照度 |
| **check** | 檢核清單:勾選追蹤進度 | 建造執照文件、竣工驗收 |
| **ref** | 參考卡:條文、公式速查 | 配色法則、綠建築九大指標 |

## 技術特色

- **純靜態**,無需後端、無需 build,直接上傳即可運作
- **CSS / 引擎 JS 全部內聯到每個 HTML**,即使 `assets/` 資料夾遺失,單一頁面仍能完整運作
- **每頁 36 KB 左右**,500 頁總計約 18 MB
- **506 / 506 頁含 AdSense**(`ca-pub-0268893833921284`)
- 響應式設計,手機與桌機都好看
- Apple Store 風格美編

## 部署

1. 解壓 `500tools.zip`
2. 將整個 `500tools/` 資料夾上傳到網域根目錄
3. 訪問 `https://taiwanarch.com/500tools/`

完整目錄樹:

```
500tools/
├── index.html              ← 主入口
├── arch.html               ← 001 建築土木 hub
├── interior.html           ← 002 室內設計 hub
├── realestate.html         ← 003 房地產 hub
├── landscape.html          ← 004 景觀園藝 hub
├── mep.html                ← 005 機電水電 hub
├── arch/001.html ~ 100.html       ← 100 個建築土木工具
├── interior/001.html ~ 100.html   ← 100 個室內設計工具
├── realestate/001.html ~ 100.html ← 100 個房地產工具
├── landscape/001.html ~ 100.html  ← 100 個景觀園藝工具
├── mep/001.html ~ 100.html        ← 100 個機電水電工具
└── assets/
    ├── style.css
    ├── engine.js
    └── render.js
```

`assets/` 資料夾保留作為**原始檔備份**,但因為已全部內聯,即使該資料夾上傳失敗,506 個頁面仍可正常運作。

## AdSense

每一個頁面在工具操作區下方都有橫幅廣告位置,使用您的發布商 ID:

```html
ca-pub-0268893833921284
```

廣告標籤已經正確嵌入。Google AdSense 會自動填入廣告。如要分流量到不同廣告位,可登入 AdSense 後台建立廣告單元並替換每頁的 `data-ad-slot` 值(目前為 `auto`)。

## 維護

要調整工具內容,編輯 `build/tools-{arch|interior|realestate|landscape|mep}.js`,
重新執行 `node build/build.js` 即可重新生成 506 個頁面。
