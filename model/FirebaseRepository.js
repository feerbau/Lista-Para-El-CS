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

  mapToJSON(querySnapshot) {
    querySnapshot.docs.map((doc) => console.log(doc));
    return querySnapshot.docs.map((doc) => doc.data());
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
    const querySnapshot = await this.getTime();
    if (querySnapshot != null) {
        querySnapshot.forEach(function (doc) {
        doc.ref.delete();
      });
    }
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

  async getTime() {
    let querySnapshot = await db.collection("time").get();
    console.log(this.mapToJSON(querySnapshot))
    if (querySnapshot.empty) {
      return null;
    }
    return querySnapshot;
  }

}
let app = firebase.initializeApp(firebaseConfig);
let db = firebase.firestore(app);

async function test() {
  const fbase = new FirebaseRepository(db);
  //fbase.setTime("14:30")
  //fbase.addHeadline("nacho");
  //fbase.removeHeadline("nacho");
  //fbase.addSustitute("nacho");
  //fbase.removeSustitute("nacho");
  //fbase.mapToJSON(querySnapshot)
}

test();
