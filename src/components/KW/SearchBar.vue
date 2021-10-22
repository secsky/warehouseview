<template>
  <nav class="searchbar">
    <a-badge :count="count">
      <a-input-search v-model="keyword" enter-button/>
    </a-badge>
  </nav>
</template>

<script>
export default {
  name: "SearchBar",
  data() {
    return {
      keyword: "",
      count: 0,
    };
  },
  watch: {
    keyword() {
      this.$root.$emit("setkeyword", this.keyword);
    },
  },
  mounted() {
    let _this = this;
    this.$root.$on("setSearchCount", (count) => {
      _this.count = count;
    });
  },
};
</script>

<style scoped>
.searchbar {
  /* position:sticky;
    top: 0;
    left: 0; */
  width: 90px;
  background-color: transparent;
  margin-left: 45px;
  margin-bottom: 8px;
  position: sticky;
  top: 20px;
  /* right:15px; */
  transition: width 0.5s;
}

.searchbar:hover {
  width: 200px;
}
</style>