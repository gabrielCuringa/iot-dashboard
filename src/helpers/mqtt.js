var mqtt = require("mqtt");
const initMqttUrl = "m1/miage/dc"; //dc pour Dekeyser & Curinga

var options = {
  hostname: "broker.hivemq.com",
  port: 8000,
  path: "/mqtt",
  clientId: "iot-m1miage-dc",
  connectTimeout: 5000,
  reconnectPeriod: 1000 * 1
};

var client = mqtt.connect(options);

export default {
  /** TOPIC FORMAT **/
  // /building_identifier/room_identifier/sensor_name
  topics: {
    base_url: initMqttUrl,
    all: initMqttUrl + "/#",
    create: initMqttUrl + "/create",
    building_room_temperature: initMqttUrl + "/+/+/temperatures"
  },
  publish: (topic, message) => {
    client.publish(topic, message);
  },
  subscribe: (topic, options = {}) => {
    client.subscribe(topic, options);
  },
  receive: callback => {
    client.on("message", function(topic, message) {
      callback(topic, JSON.parse(message.toString()));
    });
  },
  unsubscribe: topic => {
    client.unsubscribe(topic);
  }
};
