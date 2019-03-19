<template>
  <div class="content">
    <div class="container-fluid">
      <a href="/#/admin/overview">Retour</a>
      <h2>
        <b>{{$route.params.buildingname}} - salle {{this.room.name}}</b>
      </h2>
      <h3>Piloter l'ESP32</h3>
      <div class="row">
        <div class="col-xl-3 col-md-6">
          <stats-card>
            <div slot="header" class="icon-warning">
              <i class="nc-icon nc-light-3 text-warning"></i>
            </div>
            <div slot="content">
              <button
                v-if="!led"
                type="button"
                class="btn-simple btn btn-xs btn-info"
                @click="light()"
              >Allumer la LED</button>
              <button
                v-if="led"
                type="button"
                class="btn-simple btn btn-xs btn-info"
                @click="light()"
              >Éteindre la LED</button>
              <p class="card-category"></p>
              <h4 class="card-title"></h4>
            </div>
          </stats-card>
        </div>
      </div>

      <div class="row">
        <div class="col-xl-3 col-md-6">
          <stats-card>
            <div slot="header" class="icon-warning">
              <i class="nc-icon nc-explore-2 text-danger"></i>
            </div>
            <div slot="content">
              <p class="card-category">Température</p>
              <h4 class="card-title">{{lastTemperature}}°C</h4>
            </div>
          </stats-card>
        </div>

        <div class="col-xl-3 col-md-6">
          <stats-card>
            <div slot="header" class="icon-warning">
              <i class="nc-icon nc-bulb-63 text-warning"></i>
            </div>
            <div slot="content">
              <p class="card-category">Luminosité</p>
              <h4 class="card-title">{{lastLuminosite}} lum</h4>
            </div>
          </stats-card>
        </div>
      </div>
    </div>
    <div ref="chart" class="chart"></div>
  </div>
</template>
<script>
import ChartCard from "src/components/Cards/ChartCard.vue";
import StatsCard from "src/components/Cards/StatsCard.vue";
import mqtt from "../helpers/mqtt.js";
import api from "../helpers/api.js";
import ApexCharts from "apexcharts";

export default {
  components: {
    ChartCard,
    StatsCard
  },
  data() {
    return {
      TOPIC_TEMPERATURES: "",
      TOPIC_BRIGHTNESS: "",
      room: {},
      led: false,
      lastTemperature: 0.0,
      lastLuminosite: 0.0,
      sensors: []
    };
  },
  mounted() {
    api.get("/generic/rooms/" + this.$route.query.id, result => {
      //init room datas

      this.room = result[0];
      //console.log(result[0].temperatures.length);
      this.updateGraphic(result[0]);
      //this.room.temperatures.forEach(temperature => {
      //console.log(temperature);
      /*this.lineChart.data.labels.push(this.convertDate(temperature.date));
        this.lineChart.data.series[0].push(temperature.value);*/

      /*this.series.data.push(temperature.value);
      });*/

      //init topic etc
      this.TOPIC_TEMPERATURES =
        mqtt.topics.base_url +
        "/" +
        this.$route.params.buildingname +
        "/" +
        this.room.name +
        "/temperatures";

      this.TOPIC_BRIGHTNESS =
        mqtt.topics.base_url +
        "/" +
        this.$route.params.buildingname +
        "/" +
        this.room.name +
        "/brightness";

      this.$lastTopicSub.push(this.TOPIC_TEMPERATURES);
      this.$lastTopicSub.push(this.TOPIC_BRIGHTNESS);
      mqtt.subscribe(this.TOPIC_TEMPERATURES);
      mqtt.subscribe(this.TOPIC_BRIGHTNESS);
      //this.room.sensors.forEach(element => {});
      //api.get("/generic/sensors/"+)
    });

    mqtt.receive((topic, message) => {
      if (topic == this.TOPIC_TEMPERATURES) {
        console.log("ROOM");
        console.log(message);
        this.lastTemperature = message.value;
        var temperature = {
          value: message.value,
          date: new Date()
        };
        api.update(
          "/generic/rooms/" + this.$route.query.id,
          {
            temperatures: temperature
          },
          result => {
            api.get("/generic/rooms/" + this.$route.query.id, resultat => {
              this.room = resultat[0];
              this.updateGraphic(resultat[0]);
            });
          }
        );
      } else if (topic == this.TOPIC_BRIGHTNESS) {
        // on ne stocke pas la luminosité, on n'affiche que la dernière valeur envoyée par l'ESP
        this.lastLuminosite = message.value;
      }
    });
  },
  methods: {
    light() {
      this.led = !this.led;
      let ledString = this.led ? "on" : "off";

      mqtt.publish(
        mqtt.topics.base_url +
          "/" +
          this.$route.params.buildingname +
          "/" +
          this.room.name +
          "/led",
        ledString
      );
    },
    updateGraphic(datas) {
      var temperatures = [];
      var categories = [];
      for (let i = 0; i < datas.temperatures.length; i++) {
        temperatures.push(datas.temperatures[i].value);
        categories.push(datas.temperatures[i].date);
      }
      this.initChart(temperatures, categories);
    },
    initChart(data, categories) {
      var options = {
        chart: {
          height: 350,
          type: "area"
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: "smooth"
        },
        series: [
          {
            name: "températures",
            data: data
          }
        ],

        xaxis: {
          type: "datetime",
          categories: categories
        },
        tooltip: {
          x: {
            format: "dd/MM/yy HH:mm"
          }
        }
      };

      if (this.$refs.chart) {
        // HTML element exists
        var chart = new ApexCharts(this.$refs.chart, options);
        chart.render();
      }
    }
  }
};
</script>
<style>
</style>
