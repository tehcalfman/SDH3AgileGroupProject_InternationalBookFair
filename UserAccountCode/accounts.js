import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, updateDoc, where } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAE-pV4A3lK9WC0uVkBfX977MvrMZmBxBs",
  authDomain: "internation-book-store.firebaseapp.com",
  projectId: "internation-book-store",
  storageBucket: "internation-book-store.firebasestorage.app",
  messagingSenderId: "837866886262",
  appId: "1:837866886262:web:6f4f74bb2a3252555c7b57",
  measurementId: "G-896HTYFSTF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getUser(db) {
  const userCol = collection(db, 'users');
  const userSnapshot = await getDocs(userCol);
  return userSnapshot.docs.map(doc => doc.data());
}

const loggedUser = 0;

onAuthStateChanged(auth, (user)=>{
  if (user){
    loggedUser = user;
  }
  else{
    console.log("No user")
  }
});

(async function() {
const userList = await getUser(db);
let userMail = "";
let userName = "";
let userRole = "";

userList.forEach(i => {
  if (i.email === loggedUser.email) {
    userMail = i.email;
    userName = i.name;
    userRole = i.role;
    console.log("User logged");
  } else {
    console.log("User not logged");
  }
});

document.getElementById("username").innerHTML = userName;
document.getElementById("email").innerHTML = userMail;
document.getElementById("role").innerHTML = userRole;

})();

document.getElementById("Submit").addEventListener("click", async() =>{
  const newUsername = document.getElementById("newUsername").value;
  const newMail = document.getElementById("newEmail").value;
  const newRole = document.querySelector('input[name="role"]:checked').value;
  
  try{
    const q = query(collection(db, "users"), where("email","==",loggedUser.email));
    const querySnap = await getDocs(q);
    
    querySnap.forEach(async (doc) =>{
      const userRef = doc.ref;

      await updateDoc(userRef, {
        email:newMail,
        name:newUsername,
        role:newRole
      });

      console.log("Document updooted");
    });

  }catch(e){
    console.error("Error updooting document: ",e);
  }

})


