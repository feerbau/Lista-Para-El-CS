// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";
// If you are using v7 or any earlier version of the JS SDK, you should import firebase using namespace import
// import * as firebase from "firebase/app"

import "firebase/firestore";


// Your web app's Firebase configuration

let firebaseConfig = {
  apiKey: "AIzaSyAvAxlmNhpWrcImbJZ1Ezr0UKXfvTPGvns",
  authDomain: "listabotcs.firebaseapp.com",
  projectId: "listabotcs",
  storageBucket: "listabotcs.appspot.com",
  messagingSenderId: "604996605028",
  appId: "1:604996605028:web:8375390981fd30b6493b71",
};

// Initialize Firebase

class FirebaseRepository {
  constructor(db) {
    this.db = db;
    console.log(db);
  }


  async addHeadline(username) {
    const querySnapshot = await this.findByUsernameInCollection(username);
    if (querySnapshot === null) {
      this.db
        .collection("headlines")
        .add({
          player: username,
        })
        .then((doc) => {
          return "Agregado exitosamente";
        })
        .catch((err) => {
          throw err;
        });
    } else {
      return "Ya estas en la lista pa";
    }
  }

  async removeHeadline(username) {
    const querySnapshot = await this.findByUsernameInCollection(username);
    querySnapshot.forEach(function (doc) {
      doc.ref.delete();
    });
  }

  async addSustitute(username) {
    const querySnapshot = await this.findByUsernameInCollection(username, "sustitutes");
    if (querySnapshot === null) {
      this.db
        .collection("sustitutes")
        .add({
          player: username,
        })
        .then((doc) => {
          return "Vas como suplente pa, estate atento, si entras de titular te aviso.";
        })
        .catch((err) => {
          throw err;
        });
    } else {
      return "Ya estas en la lista pa";
    }
  }

  async removeSustitute(username) {
    const querySnapshot = await this.findByUsernameInCollection(username, "sustitutes");
    querySnapshot.forEach(function (doc) {
      doc.ref.delete();
    });
  }


  async findByUsernameInCollection(username, collectionName = "headlines") {
    let querySnapshot = await db
      .collection(collectionName)
      .where("player", "==", username)
      .get();
    if (querySnapshot.empty) {
      return null;
    }
    return querySnapshot;
  }

  async setTime(time) {
    deleteEveryDocumentOf("time")
    this.db
      .collection("time")
      .add({
        hour: time,
      })
      .then((doc) => {
        return "Hora seteada paa";
      })
      .catch((err) => {
        throw err;
      });
  }

  /*
  async getTimeSnapshot() {
    let querySnapshot = await db.collection("time").get();
    console.log(this.mapToJSON(querySnapshot))
    if (querySnapshot.empty) {
      return null;
    }
    return querySnapshot;
  }*/


  //Getters JSON

  mapToJSON(querySnapshot) {
    querySnapshot.docs.map((doc) => console.log(doc));
    return querySnapshot.docs.map((doc) => doc.data());
  }

  async getEveryDocumentOf(collectionName){
    let querySnapshot = await db
    .collection(collectionName)
    .get();
    return querySnapshot
  }

  async getHeadlines(){
    const querySnapshot = await this.getEveryDocumentOf("headlines");
    let JSONBruto= this.mapToJSON(querySnapshot)
    return JSONBruto.map((doc) => {
        return doc['player']
      });
  }

  async getSustitutes(){
    const querySnapshot = await this.getEveryDocumentOf("sustitutes");
    let JSONBruto= this.mapToJSON(querySnapshot)
    return JSONBruto.map((doc) => {
        return doc['player']
      });
  }

  async getHeadlines(){
    const querySnapshot = await this.getEveryDocumentOf("headlines");
    let JSONBruto= this.mapToJSON(querySnapshot)
    return JSONBruto.map((doc) => {
        return doc['player']
      });
  }
  
  async getTime(){
    const querySnapshot = await this.getEveryDocumentOf("time");
    let JSONBruto= this.mapToJSON(querySnapshot)
    return JSONBruto.map((doc) => {
        return doc['hour']
      });
  }


  //Deletes

  async deleteEveryDocumentOf(collectionName){
    const querySnapshot = await this.getEveryDocumentOf(collectionName);
    querySnapshot.forEach(function (doc) {
      doc.ref.delete();
    });
  }

  async cleanFirebase(){
    //TODO limpiar la coleccion Sustitutes, Headlines, Time
    deleteEveryDocumentOf("time")
    deleteEveryDocumentOf("sustitutes")
    deleteEveryDocumentOf("headlines")
  }

}

let app = firebase.initializeApp(firebaseConfig);
let db = firebase.firestore(app);

