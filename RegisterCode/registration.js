import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { getFirestore, doc, collection, addDoc, setDoc  } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';

const firebaseConfig = {

    apiKey: "AIzaSyAE-pV4A3lK9WC0uVkBfX977MvrMZmBxBs",
  
    authDomain: "internation-book-store.firebaseapp.com",
  
    projectId: "internation-book-store",
  
    storageBucket: "internation-book-store.firebasestorage.app",
  
    messagingSenderId: "837866886262",
  
    appId: "1:837866886262:web:6f4f74bb2a3252555c7b57",
  
    measurementId: "G-896HTYFSTF"
  
  };
  


  const app = initializeApp(firebaseConfig);
  const auth = getAuth();
  const db = getFirestore(app);
  
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', registerUser);
  }
  
  async function registerUser(event) {
    event.preventDefault();
  
    const name = document.getElementById('nameRegister').value;
    const email = document.getElementById('loginEmailRegister').value;
    const password = document.getElementById('userPasswordRegister').value;
    const role = document.getElementById('userroleRegister').value;
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        role: role,
        uid: user.uid, 
      });
  
      alert("User has registered successfully");
      window.location.href = "admin.html";
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert("This email is already registered Please use another email or log in");
      } else {
        alert("Registration failed " + error.message);
      }
    }
  }