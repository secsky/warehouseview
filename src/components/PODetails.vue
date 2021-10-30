<template>
  <div class="main">
    <Top title="采购情况表" version="alpha" />
    <a-table
      :columns="columns"
      :data-source="rows"
      size="middle"
      :pagination="pagination"
      width="800px"
      :rowKey="(record, index) => record.idx"
    >
    </a-table>
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
      rows: [],
      columns: [],
      pagination: {
        pageSize: 15, //每页中显示10条数据
        showSizeChanger: true,
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
      },
    };
  },
  methods: {},
  mounted() {
    this.rows = [];
    this.axios.post(`http://${location.host}/podetails`).then((response) => {
      if (response.data.length === 0) {
        this.$message.warning("查询不到相关信息！");
        return;
      }
      let temprows = {};
      let filterwords = ["销售订单号", "采购员", "分类"];
      let sumwords = ["采购数", "入库数"];
      let idx = 0;
      for (let row of response.data) {
        let tempfilter = "";
        row["idx"] = idx++;
        for (let word of filterwords) {
          tempfilter += (row[word] ?? "无") + "@";
        }
        tempfilter = tempfilter.substring(0, tempfilter.length - 1);
        temprows[tempfilter] === undefined
          ? (temprows[tempfilter] = [row])
          : temprows[tempfilter].push(row);
      }
      for (let categlory in temprows) {
        let tempcataglory = {};
        for (let [key, value] of Object.entries(categlory.split("@"))) {
          tempcataglory[filterwords[key]] = value;
          tempcataglory["children"] = [];
          tempcataglory["idx"] = categlory;
          for (let sumword of sumwords) tempcataglory[sumword] = 0;
        }
        for (let row of temprows[categlory]) {
          tempcataglory.children.push(row);
          for (let sumword of sumwords) tempcataglory[sumword] += row[sumword];
        }
        this.rows.push(tempcataglory);
      }
      this.rows = this.rows.filter((row) => row["入库数"] - row["采购数"] < 0);
      //   this.rows.sort((a, b) => -a.销售订单号.localeCompare(b.销售订单号));
      //   console.log("@@@@", this.rows);
      let tempcolumns = [];
      for (let t in response.data[0]) {
        t === "净量"
          ? tempcolumns.push({
              title: t,
              dataIndex: t,
              scopedSlots: { customRender: "action" },
            })
          : tempcolumns.push({
              title: t,
              dataIndex: t,
              ellipsis: true,
              sorter: (a, b) => -a[t].localeCompare(b[t]),
              sortDirections: ["descend", "ascend"],
            });
      }
      tempcolumns.pop("idx");
      // tempcolumns['净量']['scopedSlots']={ customRender: 'action' }
      this.columns = tempcolumns;
    });
  },
};
</script>

<style scoped>
.main {
  margin: 0 50px;
}
</style>