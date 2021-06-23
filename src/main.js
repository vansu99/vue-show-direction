import Vue from "vue";
import App from "./App.vue";
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
