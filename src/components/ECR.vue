<template>
  <div class="main">
    <Top title="ECR变更查询" version="alpha" />
    <a-input-search
      :placeholder="placeholdertip"
      style="width: 200px"
      v-model="keyword"
      @search="reload"
    />
    <a-tabs default-active-key="1" @change="callback">
      <a-tab-pane key="1" tab="母件查询">
        <a-table
          :columns="columns"
          :data-source="rows"
          :row-key="(record) => rows.indexOf(record)"
          size="middle"
          :pagination="pagination"
          width="800px"
        >
          <span slot="action" slot-scope="text, record">
            <a @click="showDetail(record.子件编码)">{{ text }}</a>
          </span>
          <template slot="title">
            {{ sumword }}
          </template>
        </a-table>
        <a-modal
          width="1000px"
          v-model="Visible"
          title="详细信息"
          centered
          @ok="() => (Visible = false)"
        >
          <a-table
            :columns="detailcolumns"
            :data-source="detailRows"
            :row-key="(record) => detailRows.indexOf(record)"
            size="small"
            :pagination="pagination"
          >
          </a-table>
        </a-modal>
      </a-tab-pane>
      <a-tab-pane key="2" tab="子件查询" force-render>
        <a-table
          :columns="childcolumns"
          :data-source="childRows"
          :row-key="(record) => childRows.indexOf(record)"
          size="small"
          :pagination="pagination"
          ><template slot="title">
            {{ childsumword }}
          </template>
        </a-table>
      </a-tab-pane>
    </a-tabs>
    <a-spin v-if="show" size="small" /> <br /><br />
  </div>
</template>

<script>
import Top from "./Top.vue";
export default {
  name: "ECR",
  components: {
    Top,
  },
  data() {
    return {
      placeholdertip: "请输入母件编码",
      childRows: [],
      childcolumns: [],
      detailRows: [],
      detailcolumns: [],
      show: false,
      keyword: "",
      rows: [],
      columns: [],
      Visible: false,
      pagination: {
        // total: 0,
        pageSize: 15, //每页中显示10条数据
        showSizeChanger: true,
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
      },
      sumword: "",
      childsumword: "",
    };
  },
  methods: {
    callback(key) {
      this.keyword = "";
      key == 1
        ? (this.placeholdertip = "请输入母件编码")
        : (this.placeholdertip = "请输入子件编码");
    },
    showDetail(cinvcode) {
      this.detailRows = [];
      this.detailcolumns = [];
      this.Visible = true;
      this.axios
        .post(`http://${location.host}/zw/detail`, { cinvcode: cinvcode })
        .then((response) => {
          let tempcolumns = [];
          for (let t in response.data[0]) {
            tempcolumns.push({ title: t, dataIndex: t });
          }
          // tempcolumns['净量']['scopedSlots']={ customRender: 'action' }
          this.detailRows = response.data;
          this.detailcolumns = tempcolumns;
        });
    },
    reload() {
      if (this.placeholdertip == "请输入母件编码") {
        this.rows = [];
        this.axios
          .post(`http://${location.host}/ecr`, { keyword: this.keyword })
          .then((response) => {
            if (response.data === "tooshort") {
              this.$message.warning("编码长度不对!");
              return;
            }
            if (response.data.length === 0) {
              this.$message.warning("查询不到相关信息！");
              return;
            }
            this.rows = response.data; //设置存货信息
            let tempcolumns = [];
            for (let t in this.rows[0]) {
              t === "净量"
                ? tempcolumns.push({
                    title: t,
                    dataIndex: t,
                    scopedSlots: { customRender: "action" },
                  })
                : tempcolumns.push({ title: t, dataIndex: t });
            }
            // tempcolumns['净量']['scopedSlots']={ customRender: 'action' }
            this.columns = tempcolumns;
            this.axios
              .post(`http://${location.host}/zw/lite`, {
                cinvcode: this.keyword,
              })
              .then((response) => {
                let ruku =
                  response.data[0]["预计可用量"] === null
                    ? 0
                    : response.data[0]["预计可用量"];
                let chuku =
                  response.data[0]["预计出库量"] === null
                    ? 0
                    : response.data[0]["预计出库量"];
                this.sumword = `母件:${this.keyword} 预计可用量${ruku}，预计出库量${chuku}，净量${
                  (ruku*1000 - chuku*1000)/1000
                }`;
              });
          })
          .then(() => {
            let count = 0;
            for (let row of this.rows) {
              // console.log(row);
              this.axios
                .post(`http://${location.host}/zw/lite`, {
                  cinvcode: row["子件编码"],
                })
                .then((response) => {
                  row["预计可用量"] = response.data[0]["预计可用量"];
                  row["预计出库量"] = response.data[0]["预计出库量"];
                  row["净量"] =
                    (row["预计可用量"] * 1000 - row["预计出库量"] * 1000) /
                    1000;
                  this.show = ++count === this.rows.length ? false : true;
                });
              // count++;
            }
          })
          .catch((error) => {
            this.$message.warning("数据加载失败!");
            return;
          });
      } else {
        this.childRows = [];
        this.childcolumns = [];
        this.axios
          .post(`http://${location.host}/zw/detail`, { cinvcode: this.keyword })
          .then((response) => {
            if (response.data === "tooshort") {
              this.$message.warning("编码长度不对!");
              return;
            }
            if (response.data.length === 0) {
              this.$message.warning("查询不到相关信息！");
              return;
            }
            let tempcolumns = [];
            for (let t in response.data[0]) {
              tempcolumns.push({ title: t, dataIndex: t });
            }
            this.childRows = response.data;
            this.childcolumns = tempcolumns;
          });
        this.axios
          .post(`http://${location.host}/zw/lite`, {
            cinvcode: this.keyword,
          })
          .then((response) => {
            let ruku =
              response.data[0]["预计可用量"] === null
                ? 0
                : response.data[0]["预计可用量"];
            let chuku =
              response.data[0]["预计出库量"] === null
                ? 0
                : response.data[0]["预计出库量"];
            this.childsumword = `子件:${this.keyword} 预计可用量${ruku}，预计出库量${chuku}，净量${
              (ruku*1000 - chuku*1000)/1000
            }`;
          });
      }
    },
  },
};
</script>

<style scoped>
.main {
  margin: 0 50px;
}
</style>