<script setup lang="ts"></script>

<template>
  <footer class="site-footer">
    <div class="page-container footer-inner">
      <div class="footer-cols">
        <div class="footer-col">
          <p class="col-title">客服中心</p>
          <p>常見問題</p>
          <p>退換貨服務</p>
          <p>聯絡我們</p>
        </div>
        <div class="footer-col">
          <p class="col-title">關於 momo</p>
          <p>公司介紹</p>
          <p>隱私權政策</p>
          <p>徵才資訊</p>
        </div>
        <div class="footer-col">
          <p class="col-title">支付與物流</p>
          <p>多元付款方式</p>
          <p>24h到貨說明</p>
          <p>門市取貨</p>
        </div>
      </div>
      <p class="disclaimer">
        本網站為前端技術練習作品，所有商品、品牌與資料皆為虛構 Mock
        Data，純粹模擬學習用途，與真實 momo 購物網無任何關係。
      </p>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  background: #2b2b2b;
  color: #c7c7c7;
  margin-top: 32px;
  padding: 32px 0;
  font-size: 12px;
}
.footer-cols {
  display: flex;
  gap: 48px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}
.footer-col p {
  margin: 0 0 8px;
}
.col-title {
  color: var(--momo-white);
  font-weight: 700;
  font-size: 13px;
}
.disclaimer {
  border-top: 1px solid #444;
  padding-top: 16px;
  color: #888;
  line-height: 1.6;
}
</style>
