var mqtt = require("mqtt");
const initMqttUrl = "m1/miage/dc"; //dc pour Dekeyser & Curinga

var options = {
  hostname: "broker.hivemq.com",
  port: 8000,
  path: "/mqtt",
  clientId: "iot-m1miage-dc",
  connectTimeout: 5000
};

var client = mqtt.connect(options);

export default {
  topics: {
    all: initMqttUrl + "/#",
    temperature: initMqttUrl + "/temperature"
  },
  publish: (topic, message) => {
    client.on("connect", function() {
      console.log("mqtt client is connected");
      client.publish(topic, message);
    });
  },
  subscribe: (topic, options = {}) => {
    client.subscribe(topic, options);
  },
  receive: callback => {
    client.on("message", function(topic, message) {
      callback(topic, JSON.parse(message.toString()));
    });
  }
};
