// Your web app's Firebase configuration



let firebaseConfig = {
    apiKey: "AIzaSyAvAxlmNhpWrcImbJZ1Ezr0UKXfvTPGvns",
    authDomain: "listabotcs.firebaseapp.com",
    projectId: "listabotcs",
    storageBucket: "listabotcs.appspot.com",
    messagingSenderId: "604996605028",
    appId: "1:604996605028:web:8375390981fd30b6493b71"
}

// Initialize Firebase

class FirebaseRepository{
    constructor(db){
        this.db = db
        console.log(db)
    }

    addTitular(username){
        this.db.collection("titulares").add({
            "jugador": username
        }).then((doc) => {
            return "Agregado exitosamente"
        }).catch((err) => {
            throw err
        })
    }

    removeTitular(username){
        db.collection("cities").doc("nacho").delete().then(() => {
            console.log("Document successfully deleted!");
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }

    mapToJSON(querySnapshot){
        querySnapshot.docs.map(doc => console.log(doc))
        return querySnapshot.docs.map(doc => doc.data())
    }

    async findByUsernameInCollection(username, collectionName = "titulares"){
        let querySnapshot = await db.collection("titulares").where("jugador", "==", username).get()
        if(querySnapshot.empty){
            return null
        }
        return querySnapshot 
    }

}
let app = firebase.initializeApp(firebaseConfig)
let db = firebase.firestore(app)

async function test(){
    const fbase = new FirebaseRepository(db)
    const querySnapshot = await fbase.findByUsernameInCollection("nacho")
    fbase.mapToJSON(querySnapshot)
    //await fbase.removeTitular("nacho")
}

test()