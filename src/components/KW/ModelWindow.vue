<template>
  <a-modal
    width="1000px"
    v-model="Visible"
    :title="
      chxx.name === undefined ? '载入中...' : chxx.cinvcode + '@' + chxx.name
    "
    centered
    @ok="() => (Visible = false)"
  >
    <template slot="footer"></template>
    <a-table
      :columns="columns"
      :data-source="chxx.rows"
      :row-key="record => chxx.rows.indexOf(record)"
      size="middle"
      :pagination="pagination"
    >
      <!-- <template slot="cinvcode" slot-scope="text">
          <a href="javascript:;" @click.prevent="OpenModelDialog">{{ text }}</a>
        </template> -->
    </a-table>
  </a-modal>
</template>

<script>
export default {
  name: "ModelWindow",
  // computed:{
  //   columns(){
  //     // console.log(this.chxx);
  //     let temp=[];
  //     for(let t of this.chxx.data.title){
  //       temp.append({title: t,dataIndex:t});
  //     }
  //     return temp;
  //   },
  //   rows(){
  //     return undefined;
  //   },
  // },
  data() {
    return {
      rows: [],
      columns: [],
      pagination: {
        // total: 0,
        pageSize: 15, //每页中显示10条数据
        showSizeChanger: true,
        // pageSizeOptions: ["10", "20", "50", "100"],//每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
      },
      // columns: [
      //   {
      //     title: "存货编码",
      //     dataIndex: "cinvcode",
      //     scopedSlots: { customRender: "cinvcode" },
      //   },
      //   {
      //     title: "存货名称",
      //     dataIndex: "cinvname",
      //   },
      //   {
      //     title: "数量",
      //     dataIndex: "quantity",
      //   },
      // ],
      Visible: false,
      chxx: { data: {} },
    };
  },
  methods: {
    OpenModelDialog(args) {
      // console.log(args);
      let kwid = args[0];
      let cinvcode = args[1];
      // [kwid,cinvcode]=[... args];
      this.Visible = true;
      this.chxx = { data: {} };
      // console.log(this.chxx.name === undefined);
      this.columns = [];
      let data = new URLSearchParams(); //解决POST请求变Options请求,请求数据在request.form
      data.append("bm", cinvcode);
      data.append("name", "undefined");
      data.append("kw", kwid);
      this.axios
        .post(`http://${location.host}/chapi`, data)
        .then((response) => {
          // console.log(response.data);
          this.chxx = response.data; //设置存货信息
          let tempcolumns = [];
          // console.log(Object.keys(this.chxx.rows[0]))
          for(let t in this.chxx.rows[0]){
            tempcolumns.push({title:t,dataIndex:t})
          }
          this.columns=tempcolumns;
        })
        .catch(error=>this.$message.warning('数据加载失败!'));
    },
  },
  mounted() {
    this.$root.$on("OpenModelDialog", this.OpenModelDialog);
  },
  destroyed() {
    this.$root.$off("OpenModelDialog", this.OpenModelDialog);
  },
};
</script>

<style>
</style>