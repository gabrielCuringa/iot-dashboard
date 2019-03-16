export default {
  checkEntityExistence: (collections, element, callback) => {
    if (collections.length == 0) {
      console.log("va retourner null");
      callback(false);
      return;
    } else {
      collections.forEach((item, index) => {
        console.log(item);
        console.log(
          "is " + item.name.toLowerCase() + " == " + element.toLowerCase()
        );
        if (item.name.toLowerCase() == element.toLowerCase()) {
          console.log("checked !!");
          callback(item);
          return;
        }

        if (index == collections.length - 1) {
          console.log("va retourner null");
          callback(false);
          return;
        }
      });
    }
  }
};
