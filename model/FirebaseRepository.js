// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAvAxlmNhpWrcImbJZ1Ezr0UKXfvTPGvns",
    authDomain: "listabotcs.firebaseapp.com",
    projectId: "listabotcs",
    storageBucket: "listabotcs.appspot.com",
    messagingSenderId: "604996605028",
    appId: "1:604996605028:web:fbc4a894d51f3dfd493b71"
}
// Initialize Firebase
let app = firebase.initializeApp(firebaseConfig)
let db = firebase.firestore(app)


var docRef = db.collection("cities")
console.log(docRef)


