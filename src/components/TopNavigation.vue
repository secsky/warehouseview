<template>
  <a-breadcrumb style="margin-left: 25px">
    <a-breadcrumb-item>
      <router-link to="/">首页</router-link>
    </a-breadcrumb-item>
    <a-breadcrumb-item v-if="visible">
      <router-link to="/oil">中国油价</router-link>
    </a-breadcrumb-item>
    <a-breadcrumb-item v-if="visible">
      <router-link to="/dispatchfix">发运单修复</router-link>
    </a-breadcrumb-item>
    <a-breadcrumb-item>
      <router-link to="/kw">库位图</router-link>
    </a-breadcrumb-item>
    <a-breadcrumb-item>
      <router-link to="/kworder">库位订单图</router-link>
    </a-breadcrumb-item>
    <a-breadcrumb-item v-if="visible">
      <router-link to="/ecr">库存展望</router-link>
    </a-breadcrumb-item>
    <a-breadcrumb-item v-if="visible">
      <router-link to="/podetails">采购情况表</router-link>
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>
<script>
export default {
  computed: {
    visible() {
      return location.hostname === 'localhost'
    }
  }
}
</script>
