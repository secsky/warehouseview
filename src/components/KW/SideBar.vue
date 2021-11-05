<template>
  <div>
    <a-drawer
      :title="'库位号：' + kw.id + '@' + kw.name"
      placement="right"
      :visible="visible"
      @close="visible = false"
      width="400px"
    >
      <a-table
        :columns="columns"
        :data-source="kw.data"
        :row-key="(record) => record.cinvcode"
        size="middle"
        :pagination="pagination"
      >
        <!-- <template slot="title">
          <a-button type="primary" @click="Fetchinfo"> 获取 </a-button>
        </template> -->
        <template slot="cinvcode" slot-scope="text">
          <a href="javascript:;" @click.prevent="OpenModelDialog(text)">{{
            text
          }}</a>
        </template>
      </a-table>
    </a-drawer>
    <ModelWindow />
  </div>
</template>
<script>
import ModelWindow from "./ModelWindow.vue";
export default {
  components: {
    ModelWindow,
  },
  data() {
    return {
      pagination: {
        // total: 0,
        pageSize: 15, //每页中显示10条数据
        showSizeChanger: true,
        // pageSizeOptions: ["10", "20", "50", "100"],//每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
      },
      columns: [
        {
          title: "存货编码",
          dataIndex: "cinvcode",
          scopedSlots: { customRender: "cinvcode" },
        },
        {
          title: "存货名称",
          dataIndex: "cinvname",
        },
        {
          title: "数量",
          dataIndex: "quantity",
        },
        ,
        {
          title: "理论量",
          dataIndex: "realquantity",
        },
      ],
      kw: {},
      visible: false,
    };
  },
  methods: {
    Fetchinfo() {
      // console.log(this.kw.name === "闲置");
      if (this.kw.name === "闲置") return;
      this.axios
        .post(`http://${location.host}/kw/order`, {
          info: this.kw.name,
        })
        .then((response) => {
          // console.log(response.data);
          // this.chxx = response.data;
          let data = response.data;
          if (!Array.isArray(data)) return;
          for (let row of data) {
            let t = this.kw.data.filter((current, index, arr) => {
              return current.cinvcode === row.子件编码;
            });
            if (t.length > 0) t[0]["realquantity"] = row.数量;
            else
              this.kw.data.push({
                cinvcode: row.子件编码,
                cinvname: row.子件名称,
                quantity: 0,
                realquantity: row.数量,
              });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    OpenModelDialog(cinvcode) {
      this.$root.$emit("OpenModelDialog", [this.kw.id, cinvcode]);
    },
    Setkw(kw) {
      this.kw = { ...kw };
      this.kw.data = [...kw.data];
      // console.log("@@@", this.kw.data === kw.data);
      this.visible = true;
      this.Fetchinfo();
    },
  },
  mounted() {
    this.$root.$on("click", this.Setkw);
  },
};
</script>