<template>
  <a-config-provider :locale="zh_CN">
    <div id="app">
      <TopNavigation/>
      <keep-alive>
      <router-view/>
      </keep-alive>
    </div>
  </a-config-provider>
</template>

<script>
import TopNavigation from "./components/TopNavigation.vue";
import zh_CN from "ant-design-vue/lib/locale-provider/zh_CN";
import moment from "moment";
import "moment/locale/zh-cn";

moment.locale("zh-cn");
export default {
  name: "App",
  components: {
    TopNavigation,
  },
  data() {
    return {
      zh_CN,
    };
  },
};
</script>