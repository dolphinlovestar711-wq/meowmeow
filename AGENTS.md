# AGENTS.md

## 專案概述

本專案為「毛孩好伴 Pet Paradise」寵物用品單頁網站，使用 Bootstrap 5 建置。頁面由上到下包含導覽列、輪播圖、關於我們、產品介紹與頁尾資訊。

主要維護檔案：

- `index.html`：首頁 HTML 結構與內容。
- `css/style.css`：自訂樣式，所有非 Bootstrap 的樣式集中維護於此。
- `images/`：網站圖片資源，包含 logo、banner、輪播圖、關於我們圖片與產品圖片。
- `js/`：目前未放自訂 JavaScript。

## 技術規格

- HTML 語系：`zh-Hant`
- CSS 框架：Bootstrap 5
- Icon：Bootstrap Icons
- 自訂 CSS：`css/style.css`
- Bootstrap CSS/JS 目前使用 CDN 載入。

目前 `index.html` 載入順序：

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
<link href="css/style.css" rel="stylesheet">
```

Bootstrap JS 放在 `</body>` 前：

```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
```

## 頁面區塊

`index.html` 目前主要區塊如下：

- `nav.navbar`：網站選單與 logo。
- `header#home`：Bootstrap carousel 輪播圖，共 5 張。
- `section#about`：關於我們，左圖右文。
- `section#products`：產品介紹，共 4 張 Bootstrap card。
- `footer#contact`：頁尾資訊，包含公司資訊、社群連結與版權宣告。

導覽列錨點需與區塊 ID 對應：

- `#home`
- `#about`
- `#products`
- `#contact`

## 圖片資源

圖片集中放在 `images/`。目前使用狀態如下：

| 用途 | 檔案 |
|---|---|
| Logo | `images/logo.png` |
| 輪播第 1 張 | `images/banner.png` |
| 輪播第 2 張 | `images/image_2 .png` |
| 輪播第 3 張 | `images/image_3.png` |
| 輪播第 4 張 | `images/image_4.png` |
| 輪播第 5 張 | `images/image_5.png` |
| 關於我們圖片 | `images/image_2 .png` |
| 產品：天然鮮食罐 | `images/天然鮮食罐.png` |
| 產品：潔牙零食 | `images/潔牙零食.png` |
| 產品：互動逗貓棒 | `images/互動逗貓棒.jpg` |
| 產品：耐咬玩具球 | `images/耐咬玩具球.jpg` |
| Banner 原始備份 | `images/banner-original.png` |

注意：`image_2 .png` 檔名中 `2` 後方有空白字元。HTML 中目前以 URL 編碼寫作：

```html
images/image_2%20.png
```

若未來可整理檔名，建議改成 `image_2.png`，並同步更新所有 HTML 引用。

## 圖片尺寸紀錄

目前輪播圖片尺寸：

| 檔案 | 尺寸 |
|---|---|
| `banner.png` | 1774 x 887 px |
| `image_2 .png` | 701 x 561 px |
| `image_3.png` | 701 x 561 px |
| `image_4.png` | 701 x 561 px |
| `image_5.png` | 701 x 561 px |

`banner-original.png` 是 `banner.png` 的原始備份，目前兩者尺寸相同。

## CSS 維護規範

請將所有自訂樣式維護在：

```text
css/style.css
```

不要再把自訂樣式寫回 `index.html` 的 `<style>` 區塊，避免後續多頁共用時難以維護。

主要 CSS 區塊：

- `:root`：品牌色、文字色、背景色等變數。
- `.navbar`、`.navbar-brand`、`.brand-logo`：導覽列與 logo。
- `.hero-carousel`：首頁輪播圖。
- `.about-section`、`.about-photo`、`.about-copy`：關於我們。
- `.products-section`、`.product-card`：產品卡片。
- `.site-footer`、`.footer-title`、`.social-link`：頁尾。
- `@media (max-width: 767.98px)`：手機版樣式。

目前輪播圖片顯示規則：

```css
.hero-carousel .carousel-item {
  height: clamp(260px, 32vw, 430px);
  background: #f7f1ed;
}

.hero-carousel img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
```

`object-fit: cover` 會讓輪播圖填滿相同區塊大小，但不同長寬比圖片可能被裁切。若需完整顯示圖片，可改為：

```css
object-fit: contain;
```

## 產品卡片維護

產品卡片位於 `section#products`，每個產品使用以下結構：

```html
<article class="card product-card">
  <img src="images/example.png" class="card-img-top" alt="產品名稱">
  <div class="card-body">
    <h3 class="card-title">產品名稱</h3>
    <p class="card-text">產品描述。</p>
    <div class="price">NT$ 000</div>
  </div>
</article>
```

若新增或刪除產品，請同步注意 Bootstrap grid 欄位。現況為 `col-sm-6`，因此手機一欄、較大螢幕兩欄。

## 修改注意事項

- 修改圖片前，先確認圖片實際檔名與副檔名。
- 中文檔名目前可用，但交接或部署到伺服器時需確認主機支援 UTF-8 路徑。
- 若要離線使用，建議改用本地 `bootstrap-5.3.8-dist/` 內的 Bootstrap 檔案，並將 Bootstrap Icons 也改成本地資源。
- 不要刪除 `images/banner-original.png`，除非確定不再需要 banner 原始備份。
- 新增 CSS 時優先沿用既有色彩變數與 Bootstrap 結構。

## 快速檢查清單

修改後建議檢查：

- 頁首 logo 是否正常顯示。
- 輪播 5 張圖片是否能切換。
- 手機版選單是否能展開。
- 關於我們圖片與文字是否左右排列，手機版是否自然上下排列。
- 4 張產品卡圖片、標題、描述與價格是否正確。
- 頁尾公司資訊、社群連結與版權文字是否存在。
- `index.html` 是否仍載入 `css/style.css`。
