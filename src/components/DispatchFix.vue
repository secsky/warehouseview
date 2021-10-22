<template>
  <div>
    <Top title="发运单修复" version="alpha" />
    <a-table
      :columns="columns"
      :data-source="dispatchlist"
      :row-key="(record) => dispatchlist.indexOf(record)"
      size="middle"
      :pagination="pagination"
      width="800px"
    >
      <span slot="action" slot-scope="text, record">
        <a href="javascript:;" @click="repair(record.cDLCode)">修复</a>
      </span>
    </a-table>
  </div>
</template>

<script>
import Top from "./Top.vue";
export default {
  name: "DispatchFix",
  components: {
    Top,
  },
  data() {
    return {
      rows: [],
      columns: [
        { title: "发运单号", dataIndex: "cDLCode", width: "100px" },
        // { title: "备注", dataIndex: "cMemo" },
        { title: "客户", dataIndex: "cDefine13", width: "900px" },
        {
          title: "操作",
          width: "200px",
          scopedSlots: { customRender: "action" },
        },
      ],
      pagination: {
        // total: 0,
        pageSize: 15, //每页中显示10条数据
        showSizeChanger: true,
        // pageSizeOptions: ["10", "20", "50", "100"],//每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
      },
      dispatchlist: [],
    };
  },
  methods: {
    reload(){
      this.axios
      .post(`http://${location.host}/dispatch/check`)
      .then((response) => {
        this.dispatchlist = response.data; //设置存货信息
      })
      .catch((error) => this.$message.warning("数据加载失败!"));
    },
    repair(code) {
      if(confirm("你确定要修复吗？")){
        this.axios
        .post(`http://${location.host}/dispatch/${code}`)
        .then((response) => {
          // console.log(response.data);
          if(response.data==="OK") this.$message.success("修复成功!");
          setTimeout(()=>{
            this.reload();
          },500)
        })
        .catch((error) => this.$message.warning("发生异常，请向管理员反馈!"));
      }
      
    },
  },
  activated() {
    this.reload();
  },
};
</script>

<style scoped>
div{
  max-width: 1300px;
  margin: 0 auto;
  /* background-color: rgb(185, 183, 183); */
}
</style>