<template>
  <div style="width: 1200px; margin: 0 auto">
    <Top title="中国油价" />
    <a-table
      :columns="columns"
      :data-source="oilprice"
      :row-key="(record) => oilprice.indexOf(record)"
      size="small"
      :pagination="pagination"
    >
      <span slot="customTitle"><a-icon type="smile-o" />省份</span>
      <span slot="you" slot-scope="youjia">
        <a-tag :color="youjia > 7 ? 'red' : 'green'">
          {{ youjia }}
        </a-tag>
      </span>
    </a-table>
  </div>
</template>

<script>
import Top from "./Top.vue";
export default {
  components: { Top },
  data() {
    return {
      pagination: {
        // total: 0,
        pageSize: 50, //每页中显示10条数据
        showSizeChanger: true,
        // pageSizeOptions: ["10", "20", "50", "100"],//每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
      },
      oilprice: [],
      columns: [
        {
          dataIndex: "province",
        //   title: "省份",
          slots: { title: "customTitle" },//*1标题栏插槽,设置标题栏样式<span slot="customTitle"><a-icon type="smile-o" />省份</span>
        },
        { dataIndex: "92", title: "92", scopedSlots: { customRender: "you" } },//*2作用域插槽,设置内容显示样式<span slot="you" slot-scope="youjia">
        { dataIndex: "95", title: "95", scopedSlots: { customRender: "you" } },//*2作用域插槽,设置内容显示样式
        { dataIndex: "97", title: "97", scopedSlots: { customRender: "you" } },//*2作用域插槽,设置内容显示样式
      ],
    };
  },
  activated(){
    if(this.oilprice.length===0)
    this.axios.get(`http://${location.host}/oil`)
      .then(response =>this.oilprice = response.data)
      .catch(error=>this.$message.warning('数据加载失败!'));
  },
};
</script>

<style>
</style>