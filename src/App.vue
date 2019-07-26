<template>
  <div id="app">
    <nav>
      <ul>
        <li>
          <button @click="add">Add Item</button>
          <input type="checkbox" name="Edit" v-model="edit" />
        </li>
      </ul>
      <div v-if="addMode">
        <input type="text" v-model="link" />
        <textarea v-model="query" cols="30" rows="10"></textarea>
        <input type="text" v-model="valuelocs" placeholder="x.y.z,z.a.b,.." />
        <input type="text" v-model="keys" placeholder="health,mana,... " />
        <select v-model="selectedChart">
          <option v-for="key in Object.keys(charts)" :key="key">{{key}}</option>
        </select>
        <button @click="addItem(link,selectedChart,query)">Add</button>
      </div>
    </nav>
    <div id="main">
      <grid-layout
        :layout="layout"
        :col-num="24"
        :row-height="40"
        :is-draggable="edit"
        :is-resizable="edit"
        :vertical-compact="true"
        :use-css-transforms="true"
      >
        <grid-item
          class="baseComponent"
          v-for="(item,index) in layout"
          :static="item.static"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          :key="index"
        >
          <component
            v-bind:is="item.selectedChart"
            :data="item.chartData"
            :style="myStyles"
            style="width:100%"
          />
          <!-- <div style="width:100%;height:100%;position:relative"> -->
          <!-- <input
              type="text"
              v-model="item.src"
              v-if="edit"
              style="position:absolute;top:5px;left:1%;width:80%"
          />-->
          <button
            style="position:absolute;top:25px;right:20px"
            v-if="edit"
            @click="deleteItem(index)"
          >❌</button>

          <!-- <iframe v-bind:src="item.src" width="100%" height="100%"></iframe> -->
          <!-- </div> -->
        </grid-item>
      </grid-layout>
    </div>
  </div>
</template>

<style>
#base {
  display: grid;
  grid-template-areas: nav main;
  grid-template-columns: 10% 89%;
  grid-template-rows: auto;
  grid-gap: 0.8%;
  min-height: 98vh;
}

#app {
  background-color: #95adbe;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100vw;
  height: 100%;
  display: grid;
  grid-template-areas: nav main;
  grid-template-columns: 10% 89%;
  grid-template-rows: auto;
  grid-gap: 0.8%;
  min-height: 100vh;
}
nav {
  background-color: #204969;
}

.baseComponent {
  background-color: whitesmoke;
  width: 25vw;
  height: 25vh;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  width: 50%;
  border-radius: 2px;
}
.baseComponent:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.3);
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>

<script>
import * as name from "chartjs-plugin-colorschemes";
import barChart from "@/components/barChart.vue";
import lineChart from "@/components/lineChart.vue";
import pieChart from "@/components/pieChart.vue";

import _ from "lodash";
import axios from "axios";

var testLayout = [];
export default {
  name: "app",
  data() {
    return {
      layout: testLayout,
      index: testLayout.length,
      addMode: false,
      link: "https://graphql-pokemon.now.sh/?",
      selectedChart: "",
      edit: false,
      query: "",
      valuelocs: "",
      keys: "",
      charts: { barChart: barChart, lineChart: lineChart, pieChart: pieChart }
    };
  },
  computed: {
    // index() {
    //   return this.layout.length;
    // },
    myStyles() {
      return {
        height: "100%",
        width: "100%"
      };
    },
    keyArray() {
      return this.keys.split(",");
    }
  },
  components: {},
  methods: {
    add: function() {
      this.addMode = !this.addMode;
    },
    addItem: async function(src, selectedChart, query) {
      // let self = this;
      let res = await axios.post(
        src,
        { query: query },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      let rawData = await res.data.data;
      //   let keys = Object.keys(rawData);
      let dataSets = [];
      //   console.log(this.valueArray);
      let valueArray;
      if (this.valuelocs === "") {
        valueArray = Array(this.keyArray.length).fill("value");
      } else {
        valueArray = this.valuelocs.split(",");
      }

      this.keyArray.forEach((key, index) => {
        dataSets.push({
          label: key,
          data: rawData[key].map(x => parseFloat(_.get(x, valueArray[index])))
        });
      });
      console.log(dataSets);

      let data = {
        labels: rawData[this.keyArray[0]].map(x => x.label),
        datasets: dataSets
      };

      //   console.log(data);
      let item = {
        x: 0,
        y: 0,
        w: 2,
        h: 2,
        i: this.index + "",
        src: src,
        selectedChart: this.charts[selectedChart],
        // chartData: {
        //   labels: ["January", "February"],
        //   datasets: [
        //     {
        //       label: "Data One",
        //       backgroundColor: ["#f87979", "#23f456"],
        //       data: [40, 20]
        //     }
        //   ]
        // },
        chartData: data,
        chartOptions: null
      };
      this.index++;
      this.layout.push(item);
      this.src = "";
      this.selectedChart = "";
      this.addMode = false;
    },
    deleteItem: function(index) {
      this.layout = this.layout.filter((i, j) => j !== index);
    }
  }
};
</script>
