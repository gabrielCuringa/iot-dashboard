<template>
  <div class="content">
    <div class="container-fluid">
      <!-- Buildings list -->
      <h2>Liste des bâtiments</h2>
      <p>Vous pouvez cliquer sur un bâtiment pour afficher la liste des salles qu'il contient.</p>
      <div class="row">
        <div class="col-12">
          <v-data-table
            class="elevation-1"
            :headers="buildingsHeader"
            :items="buildings"
            hide-actions
            item-key="name"
          >
            <template slot="items" scope="props">
              <tr @click="props.item.expanded = !props.item.expanded">
                <td>{{ props.item.name }}</td>
                <td>{{ props.item.address }}</td>
              </tr>

              <div v-if="props.item.rooms.length>0">
                <tr class="expand" v-show="props.item.expanded">
                  <td colspan="100%">
                    <v-expansion-panel>
                      <v-expansion-panel-content v-model="props.item.expanded">
                        <ol>
                          <li v-for="room in props.item.rooms" v-bind:key="room.name">
                            <router-link
                              :to="{ name: 'Room', params: { buildingname: props.item.name, roomname: room.name}, query: {id: room._id}}"
                            >Salle {{room.name}}</router-link>
                          </li>
                        </ol>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </td>
                </tr>
              </div>
            </template>
          </v-data-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ChartCard from "src/components/Cards/ChartCard.vue";
import StatsCard from "src/components/Cards/StatsCard.vue";
import LTable from "src/components/Table.vue";
import mqtt from "../helpers/mqtt.js";
import api from "../helpers/api.js";
import utils from "../helpers/utils.js";

export default {
  components: {
    LTable,
    ChartCard,
    StatsCard
  },
  data() {
    return {
      buildingsHeader: [
        {
          text: "Name",
          sortable: true,
          value: "name"
        },
        {
          text: "Address",
          sortable: true,
          value: "address"
        }
      ],
      sensorType: "",
      sensorValue: "",
      buildings: []
    };
  },
  mounted() {
    if (this.$lastTopicSub.length > 0) {
      this.$lastTopicSub.forEach(topicToUnsub => {
        mqtt.unsubscribe(topicToUnsub);
      });
      this.$lastTopicSub = [];
    } else {
      console.log("subscribe to create");
      mqtt.subscribe(mqtt.topics.create, { qos: 2 });
    }

    this.initDatas(true);
  },
  methods: {
    startReceivingDatasMqtt() {
      mqtt.receive((topic, message) => {
        if (topic == mqtt.topics.create) {
          console.log("OVERVIEW");
          var buildingName = message.building;
          var roomName = message.room;

          utils.checkEntityExistence(
            this.buildings,
            buildingName,
            checkedBuilding => {
              if (!checkedBuilding) {
                console.log("Le batiment n'existe pas");
                var createBuilding = {
                  name: buildingName,
                  address: message.address,
                  rooms: []
                };
                api.post(
                  "/generic/buildings",
                  createBuilding,
                  newbuildingid => {
                    var createRoom = {
                      name: roomName,
                      temperatures: []
                    };
                    api.post("/generic/rooms", createRoom, newroomid => {
                      var updateRoomInBuilding = {
                        rooms: newroomid
                      };
                      api.update(
                        "/generic/buildings/" + newbuildingid,
                        updateRoomInBuilding,
                        result => {
                          console.log(
                            "Salle " + roomName + " ajoutée à " + buildingName
                          );
                          this.initDatas(false);
                        }
                      );
                    });
                  }
                );
              } else {
                console.log("Le batiment existe");
                console.log(checkedBuilding);
                utils.checkEntityExistence(
                  checkedBuilding.rooms,
                  roomName,
                  checkedRoom => {
                    if (!checkedRoom) {
                      console.log("La salle n'existe pas");
                      var createRoom = {
                        name: roomName,
                        temperatures: []
                      };
                      api.post("/generic/rooms", createRoom, aNewroomid => {
                        var updateRoom = {
                          rooms: aNewroomid
                        };
                        console.log("Salle créée");
                        api.update(
                          "/generic/buildings/" + checkedBuilding._id,
                          updateRoom,
                          result => {
                            this.initDatas(false);
                            console.log(
                              "Salle " +
                                checkedRoom.name +
                                " ajoutée à " +
                                checkedBuilding.name
                            );
                          }
                        );
                      });
                    } else {
                      console.log("Batiment + salle existent");
                      api.update(
                        "/generic/buildings/" + checkedBuilding._id,
                        {
                          rooms: checkedRoom._id
                        },
                        result => {
                          console.log(
                            "Salle " +
                              checkedRoom.name +
                              " ajoutée à " +
                              checkedBuilding.name
                          );
                          this.initDatas(false);
                          console.log(
                            message.sensor +
                              " -> " +
                              message.value +
                              " -> " +
                              message.date
                          );
                        }
                      );
                    }
                  }
                );
              }
            }
          );
        }
      });
    },
    initDatas(listen) {
      api.get("/generic/buildings", buildingsDatas => {
        var buildingsTemp = [];

        if (buildingsDatas.length > 0) {
          buildingsDatas.forEach(building => {
            var buildingTemp = {
              expanded: false,
              _id: building._id,
              name: building.name,
              address: building.address,
              rooms: []
            };
            if (building.rooms.length > 0) {
              building.rooms.forEach((room, index) => {
                api.get("/generic/rooms/" + room, roomResp => {
                  buildingTemp["rooms"].push(roomResp[0]);
                  console.log(building.rooms.length - 1 + " / " + index);
                  if (building.rooms.length - 1 == index) {
                    this.buildings = buildingsTemp;
                    console.log(this.buildings);
                    if (listen) this.startReceivingDatasMqtt();
                  }
                });
              });
            } else {
              if (listen) this.startReceivingDatasMqtt();
              this.buildings = buildingsTemp;
            }

            buildingsTemp.push(buildingTemp);
          });
        } else {
          if (listen) this.startReceivingDatasMqtt();
        }
      });
    }
  }
};
</script>
<style>
tr.expand td {
  padding: 0 !important;
}

tr.expand .expansion-panel {
  box-shadow: none;
}

tr.expand .expansion-panel li {
  border: none;
}
</style>
