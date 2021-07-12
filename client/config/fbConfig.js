import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAXmFRwjEZ00Qh_64IbLIr4GaYdfAqw4b0",
  authDomain: "graphql-blueprint.firebaseapp.com",
  projectId: "graphql-blueprint",
  storageBucket: "graphql-blueprint.appspot.com",
  messagingSenderId: "578469797415",
  appId: "1:578469797415:web:907bfb7f0027eedcf77802"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.firestore().settings({ timestampsInSnapshots: true })

export default firebase;