<template>
  <div>
    <Top title="BOM库目视图" version="beta1.2" />
    <SearchBar />
    <Center />
    <SideBar />
  </div>
</template>

<script>
import Top from "./Top.vue";
import SearchBar from "./KW/SearchBar.vue";
import Center from "./KW/Center.vue";
import SideBar from "./KW/SideBar.vue";
export default {
  name: "KW",
  components: {
    SearchBar,
    Center,
    SideBar,
    Top,
  },
};
</script>

<style>
</style>