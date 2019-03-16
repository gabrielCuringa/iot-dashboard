<template>
  <div class="content">
    <div class="container-fluid">
      <h2>Le bâtiment {{$route.params.buildingName}}</h2>
      <h3>Piloter l'ESP32</h3>
      <p>{{$route.params.id}}</p>

      <div class="row">
        <div class="col-12"></div>
      </div>
    </div>
  </div>
</template>
<script>
import mqtt from "../helpers/mqtt.js";
import api from "../helpers/api.js";

export default {
  data() {
    return {};
  },
  mounted() {
    console.log("la");
    //mqtt.publish(mqtt.topics.temperature, "mon message");
    /*mqtt.receive((topic, message) => {
      console.log(topic);
      console.log(message.toString());
      this.sensorType = message.sensor;
      this.sensorValue = message.value;
    });*/
  },
  methods: {
    lightUp() {}
  }
};
</script>
<style>
</style>
