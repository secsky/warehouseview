<template>
  <div>
    <ul v-for="(v, k) in finfo" class="clearfix" :key="k">
      <li class="货架" :title="v.name">{{ k }}</li>
      <li
        class="货位"
        v-for="(value, key) in v.data"
        :style="style(value.data)"
        @click="m(key)"
        :key="key"
      >
        <div class="货位编码">{{ key }}</div>
        <span>{{ value.name }}({{ value.data.length }})</span>
      </li>
    </ul>
    <!-- <ul v-for="(v, k) in finfo" class="clearfix" :key="k">
      <li class="货架" :title="v.name">$$k$$</li>
      <li
        class="货位"
        v-for="(value, key) in v.data"
        :style="style(value.data)"
        @click="m(key)"
        :key="key"
      >
        <div class="货位编码">$$key$$</div>
        <span>$$value.name$$($$value.data.length$$)</span>
      </li>
    </ul> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      info: [],
      //   kw: {},
      keyword: "",
      // chxx: { name: '', code: '', data: { title: [], rows: [] } },
      //   chxx: { data: {} },
      counter: 0,
    };
  },
  computed: {
    searchtip() {
      if (this.keyword === " ") {
        return "闲置库位";
      } else if (this.keyword === "错误") {
        return "参考结果,请排查核实!";
      }
      return undefined;
    },
    flength() {
      let tmp = 0;
      for (let k in this.finfo) {
        for (let x in this.finfo[k].data) {
          tmp += 1;
        }
      }
      return tmp;
    },
    finfo() {
      let tmp = {};
      for (let k in this.info) {
        for (let x in this.info[k].data) {
          if (this.keyword === " ") {
            if (this.info[k].data[x].data.length === 0) {
              this.setTmp(tmp, k, x);
            }
          } else if (this.keyword === "错误") {
            if (
              this.info[k].data[x].data.length === 0 &&
              this.info[k].data[x].name !== "闲置"
            ) {
              this.setTmp(tmp, k, x);
            } else if (
              this.info[k].data[x].data.length !== 0 &&
              this.info[k].data[x].name === "闲置"
            )
              this.setTmp(tmp, k, x);
          } else if (this.info[k].data[x].name.indexOf(this.keyword) != -1) {
            this.setTmp(tmp, k, x);
          }
        }
      }
      return tmp;
    },
  },
  methods: {
    setTmp(tmp, k, x) {
      if (tmp[k] === undefined) tmp[k] = {};
      tmp[k]["name"] = this.info[k]["name"];
      if (tmp[k]["data"] === undefined) tmp[k]["data"] = {};
      tmp[k]["data"][x] = this.info[k].data[x];
    },
    m(x) {
      let id = x;
      let kw = {};
      kw = this.info[id.substring(0, 2)]["data"][id];
      kw["id"] = id;
      this.$root.$emit("click", kw);
    },
    style(o) {
      if (o.length === 0) {
        return "";
      } else {
        return { backgroundColor: "orange" };
      }
    },
    reload() {
      this.axios
        .post(`http://${location.host}/kwapi`)
        .then((response) => {
          this.info = response.data;
        })
        .catch(error=>this.$message.warning('数据加载失败!'));
    },
    getchxx(cinvcode, cinvname) {
      // console.log(cinvcode, cinvname);
      this.chxx = { data: {} };
      var data = new URLSearchParams(); //解决POST请求变Options请求,请求数据在request.form
      data.append("bm", cinvcode);
      data.append("name", cinvname);
      data.append("kw", this.kw.id);
      this.axios
        .post("http://127.0.0.1:8080/chapi", data)
        .then((response) => {
          // console.log(response.data);
          this.chxx = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
  mounted() {
    this.$root.$on("setkeyword",(keyword)=>{this.keyword=keyword,this.$root.$emit("setSearchCount", this.flength);});
    setInterval(() => {
      this.reload();
    }, 60000);
  },
  activated(){
    if(this.info.length===0) this.reload();
  },
  beforeDestroy() {
    this.$root.$off("setkeyword");
  },
};
</script>

<style scoped>
.clearfix::after {
  content: "";
  clear: both;
  display: table;
}

.货架,
.货位 {
  border-radius: 5px;
  padding: 0 auto;
  margin: 2px;
  float: left;
  list-style: none;
  height: 50px;
  background-color: #bbe9ff;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.货架 {
  width: 38px;
  color: white;
  font-size: 26px;
  background-color: gray;
  /* box-shadow: 0 0 5px rgba(0,0,0,0.4); */
}

.货位 .货位编码 {
  font-size: 20px;
  font-weight: bold;
}

span {
  padding-top: 0;
  display: inline-block;
  font-size: 6px;
  color: black;
}

.货位:hover span {
  font-weight: bold;
}
</style>