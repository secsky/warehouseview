<template>
  <H1>{{ title }} <a-tag v-if="version" color="purple" style="position:absolute;top:15px"> {{version}} </a-tag></H1>
</template>

<script>
export default {
  name: "Top",
  props: ["title","version"],
  activated() {
    document.title = this.title;
  },
};
</script>

<style scoped>
h1 {
  text-align: center;
  font-size: 50px;
  position: relative;
}
</style>