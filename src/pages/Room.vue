<template>
  <div class="content">
    <div class="container-fluid">
      <h2>Le bâtiment {{$route.params.buildingname}}</h2>
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
            <div slot="footer">
              <i class="fa fa-refresh"></i>Updated now
            </div>
          </stats-card>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <chart-card
            :chart-data="lineChart.data"
            :chart-options="lineChart.options"
            :responsive-options="lineChart.responsiveOptions"
          >
            <template slot="header">
              <h4 class="card-title">Températures</h4>
            </template>
            <template slot="footer">
              <div class="legend">
                <i class="fa fa-circle text-info"></i> Temperature
              </div>
              <hr>
              <div class="stats">
                <i class="fa fa-history"></i> Updated 3 minutes ago
              </div>
            </template>
          </chart-card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ChartCard from "src/components/Cards/ChartCard.vue";
import StatsCard from "src/components/Cards/StatsCard.vue";
import mqtt from "../helpers/mqtt.js";
import api from "../helpers/api.js";

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
      sensors: [],
      lineChart: {
        data: {
          labels: [],
          series: [[]]
        },
        options: {
          low: 0,
          high: 40,
          showArea: true,
          axisX: {
            showGrid: true
          },
          lineSmooth: true,
          showLine: true,
          showPoint: true,
          fullWidth: false,
          chartPadding: {
            right: 50
          }
        },
        responsiveOptions: [
          [
            "screen and (max-width: 640px)",
            {
              axisX: {
                labelInterpolationFnc(value) {
                  return value[0];
                }
              }
            }
          ]
        ]
      }
    };
  },
  mounted() {
    mqtt.unsubscribe(mqtt.topics.building_room_sensor);
    api.get("/generic/rooms/" + this.$route.query.id, result => {
      //init room datas
      this.room = result[0];

      this.room.temperatures.forEach(temperature => {
        //console.log(temperature);
        this.lineChart.data.labels.push(this.convertDate(temperature.date));
        this.lineChart.data.series[0].push(temperature.value);
      });

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

      mqtt.subscribe(this.TOPIC_TEMPERATURES);
      mqtt.subscribe(this.TOPIC_BRIGHTNESS);
      //this.room.sensors.forEach(element => {});
      //api.get("/generic/sensors/"+)
    });

    mqtt.receive((topic, message) => {
      console.log(topic);

      if (topic == this.TOPIC_TEMPERATURES) {
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
            });
          }
        );
      } else if (topic == this.TOPIC_BRIGHTNESS) {
        console.log(message);
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
    convertDate(date) {
      var newDate = new Date(date);
      return newDate.getHours() + "h" + newDate.getMinutes();
    }
  }
};
</script>
<style>
</style>
