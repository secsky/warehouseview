import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueRouter from 'vue-router'
import KW from "./components/KW.vue";
import Welcome from "./components/Welcome.vue";
import OilPrice from "./components/OilPrice.vue";
import DispatchFix from "./components/DispatchFix.vue";
import ECR from "./components/ECR.vue";
import PODetails from "./components/PODetails.vue";
import Print from "../plugin/print.js"
Vue.use(Print)
// import dayjs from "dayjs"
// import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import { Drawer, Modal, Table, Tag, Input, Badge, ConfigProvider, Breadcrumb, Icon, message, Spin, Tabs, Button } from 'ant-design-vue'
Vue.use(VueRouter)
Vue.use(Drawer).use(Modal).use(Table).use(Tag).use(Input).use(Badge).use(ConfigProvider).use(Breadcrumb).use(Icon).use(Spin).use(Tabs).use(Button)
Vue.use(VueAxios, axios);
Vue.config.productionTip = false;
Vue.prototype.$message = message;
// Vue.filter('dataTime', (value, format = 'YYYY-MM-DD HH:mm:ss') => {
//   return dayjs(value).format(format)
// })
const routes = [
  { path: '/kw', component: KW },
  { path: '/', component: Welcome },
  { path: '/oil', component: OilPrice },
  { path: '/dispatchfix', component: DispatchFix },
  { path: '/ecr', component: ECR },
  { path: '/podetails', component: PODetails }
]
const router = new VueRouter({
  routes // (缩写) 相当于 routes: routes
})
new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
