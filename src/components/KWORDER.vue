<template>
  <div>
    <Top title="BOM库订单目视图" version="beta1.6" />
    <SearchBar />
    <CenterOrder />
    <SideBar />
  </div>
</template>

<script>
import Top from "./Top.vue";
import SearchBar from "./KW/SearchBar.vue";
import CenterOrder from "./KW/CenterOrder.vue";
import SideBar from "./KW/SideBar.vue";
export default {
  name: "KWORDER",
  components: {
    SearchBar,
    CenterOrder,
    SideBar,
    Top,
  },
};
</script>

<style>
</style>