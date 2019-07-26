import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueGridLayout from "vue-grid-layout";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  GridLayout: VueGridLayout.GridLayout,
  GridItem: VueGridLayout.GridItem,
  render: h => h(App)
}).$mount("#app");
