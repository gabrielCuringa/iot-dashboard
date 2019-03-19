import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import Vuetify from "vuetify";
import VueApexCharts from "vue-apexcharts";
import "vuetify/dist/vuetify.min.css"; // Ensure you are using css-loader
import "material-design-icons-iconfont/dist/material-design-icons.css";

// LightBootstrap plugin
import LightBootstrap from "./light-bootstrap-main";

// router setup
import routes from "./routes/routes";

import "./registerServiceWorker";
// plugin setup
Vue.use(VueRouter);
Vue.use(Vuetify, {
  iconfont: "md"
});
Vue.use(LightBootstrap);
Vue.use(VueApexCharts);
Vue.component("apexchart", VueApexCharts);

Vue.prototype.$lastTopicSub = [];
Vue.prototype.$isCreateTopicSub = [];

// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkActiveClass: "nav-item active",
  scrollBehavior: to => {
    if (to.hash) {
      return { selector: to.hash };
    } else {
      return { x: 0, y: 0 };
    }
  }
});

/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: h => h(App),
  router
});
