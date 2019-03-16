import { async } from "q";

let BASE_URL = "http://localhost:8081/api";
let headers = {
  Accept: "application/json",
  "Content-Type": "application/json"
};

export default {
  get: (url, callback) => {
    fetch(BASE_URL + "" + url, {
      method: "GET",
      headers: headers
    })
      .then(response => response.json())
      .then(json => {
        callback(json);
      })
      .catch(error => {
        callback(error);
      });
  },
  post: (url, datas, callback) => {
    console.log("Je poste sur cette url = " + url);
    fetch(BASE_URL + "" + url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(datas)
    })
      .then(response => response.json())
      .then(json => {
        callback(json);
      })
      .catch(error => {
        callback(error);
      });
  },
  update: (url, datas, callback) => {
    fetch(BASE_URL + "" + url, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify(datas)
    })
      .then(response => response.json())
      .then(json => {
        callback(json);
      })
      .catch(error => {
        callback(error);
      });
  }
};
