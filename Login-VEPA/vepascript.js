 // Import the functions you need from the SDKs you need
       
 import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
 import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

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
  const auth = getAuth(app);

  document.addEventListener('DOMContentLoaded', function() {
    const signOutBtn = document.querySelector('.sign-out-btn');
    
    if (signOutBtn) {
        signOutBtn.addEventListener('click', async function() {
            const button = this;
            try {
                if (confirm('Are you sure you want to sign out?')) {
                   
                    button.disabled = true;
                    button.textContent = 'Signing out...';
                    
                    await signOut(auth);
                    console.log('User signed out successfully');
                    window.location.href = 'login.html';
                }
            } catch (error) {
                console.error('Error signing out:', error);
                alert('Error signing out. Please try again.');
                
                
                button.disabled = false;
                button.textContent = 'Sign Out';
            }
        });
    }
});