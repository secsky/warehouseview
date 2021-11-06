<template>
  <div>
    <a-drawer
      ref="printCons"
      :title="'库位号：' + kw.id + '@' + kw.name"
      placement="right"
      :visible="visible"
      @close="visible = false"
      width="400px"
      ><a href="javascript:;" title="仅供参考">
        <a-tag color="blue" v-if="msg !== ''">
          {{ msg }}
        </a-tag></a
      >
      <!-- <button @click="goPrint">打印</button> -->
      <a-table
        :columns="columns"
        :data-source="kw.data"
        :row-key="(record) => record.cinvcode"
        size="middle"
        :pagination="pagination"
      >
        <!-- <template slot="title"> {{ msg }} </template> -->
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
      msg: "",
    };
  },
  methods: {
    goPrint() {
      console.log(this);
      this.$print(this.$refs.printCons);
      // print(this.$refs.printCons.$el);
    },
    Fetchinfo() {
      this.msg = "";
      if (this.kw.name === "闲置") return;
      this.axios
        .post(`http://${location.host}/kw/order`, {
          info: this.kw.name,
        })
        .then((response) => {
          this.msg = `订单号:${response.data.csocode} 成品:${response.data.cinvcode} 数量:${response.data.quantity} 计数:${response.data.counts}`;
          let data = response.data.data;
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
<style scoped>
.msg {
  margin-top: 0;
  margin-bottom: 0;
  color: red;
  font-weight: 700;
  font-size: 10px;
}
</style>