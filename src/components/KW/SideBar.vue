<template>
  <div>
    <!-- <a-button type="primary" @click="visible = true"> Open </a-button> -->
    <!-- <a-drawer
      title="Basic Drawer"
      placement="right"
      :closable="false"
      :visible="visible"
      :after-visible-change="afterVisibleChange"
      @close="onClose"
    > -->
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
      ],
      kw: {},
      visible: false,
    };
  },
  methods: {
    // afterVisibleChange(val) {
    //   console.log('visible', val);
    // },
    // showDrawer() {
    //   this.visible = true;
    // },
    // onClose() {
    //   this.visible = false;
    // },
    OpenModelDialog(cinvcode) {
      this.$root.$emit("OpenModelDialog", [this.kw.id, cinvcode]);
    },
    Setkw(kw) {
      this.kw = kw;
      this.visible = true;
    },
  },
  mounted() {
    this.$root.$on("click", this.Setkw);
  },
};
</script>