<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-xl-3 col-md-6">
          <stats-card>
            <div slot="header" class="icon-warning">
              <i class="nc-icon nc-preferences-circle-rotate text-warning"></i>
            </div>
            <div slot="content">
              <p class="card-category">{{sensorType}}</p>
              <h4 class="card-title">{{sensorValue}}</h4>
            </div>
            <div slot="footer">
              <i class="fa fa-refresh"></i>Updated now
            </div>
          </stats-card>
        </div>
      </div>
      <!-- Buildings list -->
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

            <!--<template v-slot:expand="props">
              <p>{{props.item.name}}</p>
              <ul v-if="props.item.rooms.length>0">
                <li v-for="room in props.item.rooms">
                  <router-link
                    :to="{ name: 'Room', params: { id: room._id, buildingName: props.item.name, rooms: props.items.rooms }}"
                  >{{room.name}}</router-link>
                </li>
              </ul>
            </template>-->
          </v-data-table>
        </div>
      </div>
      <!--<div class="row">
        <div class="col-12">
          <card class="strpied-tabled-with-hover" body-classes="table-full-width table-responsive">
            <template slot="header">
              <h4 class="card-title">Liste des bâtiments</h4>
              <p class="card-category">Vue générale des capteurs présents dans les bâtiments</p>
            </template>
            <l-table
              class="table-hover table-striped"
              :columns="buildings.columns"
              :data="buildings.datas"
            ></l-table>
          </card>
        </div>
      </div>-->
      <!--<div class="row">
        <div class="col-md-8">
          <chart-card
            :chart-data="lineChart.data"
            :chart-options="lineChart.options"
            :responsive-options="lineChart.responsiveOptions"
          >
            <template slot="header">
              <h4 class="card-title">Users Behavior</h4>
              <p class="card-category">24 Hours performance</p>
            </template>
            <template slot="footer">
              <div class="legend">
                <i class="fa fa-circle text-info"></i> Open
                <i class="fa fa-circle text-danger"></i> Click
                <i class="fa fa-circle text-warning"></i> Click Second Time
              </div>
              <hr>
              <div class="stats">
                <i class="fa fa-history"></i> Updated 3 minutes ago
              </div>
            </template>
          </chart-card>
        </div>

        <div class="col-md-4">
          <chart-card :chart-data="pieChart.data" chart-type="Pie">
            <template slot="header">
              <h4 class="card-title">Email Statistics</h4>
              <p class="card-category">Last Campaign Performance</p>
            </template>
            <template slot="footer">
              <div class="legend">
                <i class="fa fa-circle text-info"></i> Open
                <i class="fa fa-circle text-danger"></i> Bounce
                <i class="fa fa-circle text-warning"></i> Unsubscribe
              </div>
              <hr>
              <div class="stats">
                <i class="fa fa-clock-o"></i> Campaign sent 2 days ago
              </div>
            </template>
          </chart-card>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <chart-card
            :chart-data="barChart.data"
            :chart-options="barChart.options"
            :chart-responsive-options="barChart.responsiveOptions"
            chart-type="Bar"
          >
            <template slot="header">
              <h4 class="card-title">2014 Sales</h4>
              <p class="card-category">All products including Taxes</p>
            </template>
            <template slot="footer">
              <div class="legend">
                <i class="fa fa-circle text-info"></i> Tesla Model S
                <i class="fa fa-circle text-danger"></i> BMW 5 Series
              </div>
              <hr>
              <div class="stats">
                <i class="fa fa-check"></i> Data information certified
              </div>
            </template>
          </chart-card>
        </div>

        <div class="col-md-6">
          <card>
            <template slot="header">
              <h5 class="title">Tasks</h5>
              <p class="category">Backend development</p>
            </template>
            <l-table :data="tableData.data" :columns="tableData.columns">
              <template slot="columns"></template>

              <template slot-scope="{row}">
                <td>
                  <base-checkbox v-model="row.checked"></base-checkbox>
                </td>
                <td>{{row.title}}</td>
                <td class="td-actions text-right">
                  <button
                    type="button"
                    class="btn-simple btn btn-xs btn-info"
                    v-tooltip.top-center="editTooltip"
                  >
                    <i class="fa fa-edit"></i>
                  </button>
                  <button
                    type="button"
                    class="btn-simple btn btn-xs btn-danger"
                    v-tooltip.top-center="deleteTooltip"
                  >
                    <i class="fa fa-times"></i>
                  </button>
                </td>
              </template>
            </l-table>
            <div class="footer">
              <hr>
              <div class="stats">
                <i class="fa fa-history"></i> Updated 3 minutes ago
              </div>
            </div>
          </card>
        </div>
      </div>-->
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
      buildings: [],
      editTooltip: "Edit Task",
      deleteTooltip: "Remove",
      pieChart: {
        data: {
          labels: ["40%", "20%", "40%"],
          series: [40, 20, 40]
        }
      },
      lineChart: {
        data: {
          labels: [
            "9:00AM",
            "12:00AM",
            "3:00PM",
            "6:00PM",
            "9:00PM",
            "12:00PM",
            "3:00AM",
            "6:00AM"
          ],
          series: [
            [287, 385, 490, 492, 554, 586, 698, 695],
            [67, 152, 143, 240, 287, 335, 435, 437],
            [23, 113, 67, 108, 190, 239, 307, 308]
          ]
        },
        options: {
          low: 0,
          high: 800,
          showArea: false,
          height: "245px",
          axisX: {
            showGrid: false
          },
          lineSmooth: true,
          showLine: true,
          showPoint: true,
          fullWidth: true,
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
      },
      barChart: {
        data: {
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "Mai",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
          ],
          series: [
            [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895],
            [412, 243, 280, 580, 453, 353, 300, 364, 368, 410, 636, 695]
          ]
        },
        options: {
          seriesBarDistance: 10,
          axisX: {
            showGrid: false
          },
          height: "245px"
        },
        responsiveOptions: [
          [
            "screen and (max-width: 640px)",
            {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc(value) {
                  return value[0];
                }
              }
            }
          ]
        ]
      },
      tableData: {
        data: [
          {
            title:
              'Sign contract for "What are conference organizers afraid of?"',
            checked: false
          },
          {
            title:
              "Lines From Great Russian Literature? Or E-mails From My Boss?",
            checked: true
          },
          {
            title:
              "Flooded: One year later, assessing what was lost and what was found when a ravaging rain swept through metro Detroit",
            checked: true
          },
          {
            title: "Create 4 Invisible User Experiences you Never Knew About",
            checked: false
          },
          { title: 'Read "Following makes Medium better"', checked: false },
          { title: "Unfollow 5 enemies from twitter", checked: false }
        ]
      }
    };
  },
  mounted() {
    //mqtt.publish(mqtt.topics.temperature, "mon message");
    //mqtt.subscribe(mqtt.topics.building_room_sensor);
    this.initDatas(true);
  },
  methods: {
    startReceivingDatasMqtt() {
      mqtt.receive((topic, message) => {
        console.log("DANS RECEIVE");
        console.log(topic);
        console.log(message);

        var urlHashed = topic.split("/");
        var buildingName = urlHashed[3]; //building name
        var roomName = urlHashed[4]; //building name

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
              api.post("/generic/buildings", createBuilding, newbuildingid => {
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
              });
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
    },
    publish() {
      mqtt.publish(mqtt.topics.temperature, { message: "bonjour", bcd: "efg" });
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
