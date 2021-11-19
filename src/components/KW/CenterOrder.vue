<template>
  <div>
    <div class="dot">
      # 更新日志
      <br />## 0.3
      <br />更换table样式到div,增加搜索计数
      <br />## 0.4
      <br />货位大小自适应
      <br />## 0.5
      <br />搜索框样式调整,默认隐藏搜索计数,按[空格]搜索闲置库位
      <br />## 0.6
      <br />移动端适配
      <br />## 1.0
      <br />更换平台
      <br />## 1.1
      <br />增加货位存货详情
      <br />## 1.2
      <br />优化后台逻辑,增加searchtip字段显示搜索提示
      <br />[空格]搜索闲置库位,[错误]搜索可能有问题的库位
      <br />## 1.3
      <br />优化显示效果
      <br />## 1.4
      <br />增加订单自动判断
      <br />## 1.5
      <br />根据订单推算理论用量
      <br />## 1.6
      <br />优化后台逻辑
      <br />
    </div>
    <ul v-for="(v, k) in finfo" class="clearfix" :key="k">
      <li class="货架" :title="v.name">{{ k }}</li>
      <li
        class="货位"
        v-for="(value, key) in v.data"
        :style="style(key, value)"
        @click="m(value.name, key)"
        :key="key"
      >
        <div class="货位编码">{{ key }}</div>
        <span>{{ value.name }}({{ value.data.length }})</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      autoreload: true,
      info: [],
      keyword: "",
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
      let cinv = this.keyword.substring(3)
      let searchtype = this.keyword.substring(0, 3)
      // console.log(cinv, searchtype)
      switch (searchtype) {
        case 'ch:':
          for (let [key, value] of Object.entries(this.info)) {
            for (let [k, v] of Object.entries(value.data)) {
              for (let c of v.data) {
                if (c.cinvcode.indexOf(cinv) !== -1) {
                  if (tmp[key] === undefined) tmp[key] = { data: { [k]: { name: v.name, data: [] } } }
                  if (tmp[key].data === undefined) tmp[key].data = { [k]: { name: v.name, data: [] } }
                  if (tmp[key].data[k] === undefined) tmp[key].data[k] = { name: v.name, data: [] }
                  tmp[key].data[k].data.push(c)
                }
              }
              // break
            }
            // break
          }
          return tmp
          break;
        case 'mc:':
          for (let [key, value] of Object.entries(this.info)) {
            for (let [k, v] of Object.entries(value.data)) {
              for (let c of v.data) {
                if (c.cinvname.indexOf(cinv) !== -1) {
                  if (tmp[key] === undefined) tmp[key] = { data: { [k]: { name: v.name, data: [] } } }
                  if (tmp[key].data === undefined) tmp[key].data = { [k]: { name: v.name, data: [] } }
                  if (tmp[key].data[k] === undefined) tmp[key].data[k] = { name: v.name, data: [] }
                  tmp[key].data[k].data.push(c)
                }
              }
              // break
            }
            // break
          }
          return tmp
        default:
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
          break;
      }

      // for (let k in this.info) {
      //   for (let x in this.info[k].data) {
      //     if (this.keyword === " ") {
      //       if (this.info[k].data[x].data.length === 0) {
      //         this.setTmp(tmp, k, x);
      //       }
      //     } else if (/^wl:.+/.test(this.keyword)) {
      //       let cinv = this.keyword.substring(3)
      //       // console.log(x)
      //       for (let a of this.info[k].data[x].data) {
      //         // console.log(a)
      //         if (a.cinvcode.indexOf(cinv) !== -1) {
      //           // console.log(a)
      //           if (tmp[k] === undefined) tmp[k] = { data: { [x]: { name: this.info[k].data[x].name, data: [] } } };
      //           // tmp[k]["name"] = this.info[k]["name"];
      //           console.log('@@@@', tmp)
      //           tmp[k]["data"][x].data.push(a);
      //         }
      //       }

      //     } else if (this.keyword === "错误") {
      //       if (
      //         this.info[k].data[x].data.length === 0 &&
      //         this.info[k].data[x].name !== "闲置"
      //       ) {
      //         this.setTmp(tmp, k, x);
      //       } else if (
      //         this.info[k].data[x].data.length !== 0 &&
      //         this.info[k].data[x].name === "闲置"
      //       )
      //         this.setTmp(tmp, k, x);
      //     } else if (this.info[k].data[x].name.indexOf(this.keyword) != -1) {
      //       this.setTmp(tmp, k, x);
      //     }
      //   }
      // }
      // console.log(tmp)
      // return tmp;
    },
  },
  methods: {
    setTmp(tmp, k, x, c) {
      if (tmp[k] === undefined) tmp[k] = {};
      // tmp[k]["name"] = this.info[k]["name"];
      if (tmp[k]["data"] === undefined) tmp[k]["data"] = {};
      tmp[k]["data"][x] = this.info[k].data[x];
    },
    m(x, key) {
      let id = x;
      console.log(id)
      let kw = {};
      kw = this.finfo[id.split('/')[0]]["data"][key];
      kw["id"] = key;
      this.$root.$emit("click", kw);
    },
    style(key, value) {
      if (value.data.length === 0) {
        return "";
      } else if (/^1W.{2}/.test(key)) {
        // console.log({ backgroundColor: "rbg(0,0,0)" })
        return { backgroundColor: "#99CCFF" };
      } else if (/^1X.{2}/.test(key)) {
        return { backgroundColor: "#0066CC" };
      } else {
        return { backgroundColor: "orange" };
      }
    },
    reload() {
      this.axios
        .post(`http://${location.host}/kworderapi`)
        .then((response) => {
          this.info = response.data;
        })
        .catch((error) => this.$message.warning("数据加载失败!"));
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
    this.$root.$on("setkeyword", (keyword) => {
      (this.keyword = keyword),
        this.$root.$emit("setSearchCount", this.flength);
    });
    setInterval(() => {
      if (this.autoreload) this.reload();
    }, 60000);
  },
  activated() {
    if (this.info.length === 0) this.reload();
    console.log("库位图自动刷新");
    this.autoreload = true;
  },
  deactivated() {
    console.log("关闭库位图自动刷新");
    this.autoreload = false;
  },
  beforeDestroy() {
    this.$root.$off("setkeyword");
  },
};
</script>

<style scoped>
@keyframes showdot {
  0% {
  }

  30% {
    height: 100px;
    width: 400px;
    border-radius: 15px;
  }

  100% {
    border-radius: 20px;
    height: 250px;
    width: 400px;
    overflow: scroll;
  }
}

.dot {
  padding: 5px;
  height: 10px;
  width: 10px;
  background: #fba;
  border-radius: 50%;
  overflow: hidden;
  position: fixed;
  right: 30px;
  top: 30px;
  /* transition: all 0.3s; */
}

.dot:hover {
  border-radius: 5px;
  border: 1px orange solid;
  box-shadow: 4px 4px 3px rgba(0, 0, 0, 0.3);
  background: #fff;
  border-radius: 0;
  animation: showdot 1s;
  animation-fill-mode: forwards;
}
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
  transition: all 0.2s;
}

.货架 {
  width: 70px;
  color: white;
  font-size: 26px;
  background-color: gray;
}

.货位 .货位编码 {
  font-size: 20px;
  font-weight: bold;
  box-sizing: border-box;
  /* transition: all 0.5s; */
}

span {
  padding-top: 0;
  display: inline-block;
  font-size: 6px;
  color: black;
}
.货位:hover {
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.3);
  transform: scale(1.2);
  border: 1px green solid;
}
/* .货位:hover span {
  font-weight: bold;
} */
</style>