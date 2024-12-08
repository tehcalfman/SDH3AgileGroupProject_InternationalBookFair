  
       // Import the functions you need from the SDKs you need
       
        import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
        import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

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

        const loginForm = document.getElementById("loginForm");
        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");
        const statusDiv = document.getElementById("login-status");
      
      function updateStatus(message, isError = false) {
          statusDiv.textContent = message;
          statusDiv.style.color = isError ? 'red' : 'green';
      }
      
      async function handleLogin(email, password) {
          try {
              updateStatus("Logging in...");
              const userCredential = await signInWithEmailAndPassword(auth, email, password);
              console.log("Login successful!", userCredential.user);
              updateStatus("Login successful!");
           
              window.location.href = "vepa_page.html";
          } catch (error) {
              console.error("Login error:", error);
              let errorMessage;
              
              switch (error.code) {
                  case 'auth/wrong-password':
                      errorMessage = "Incorrect password. Please try again.";
                      break;
                  case 'auth/user-not-found':
                      errorMessage = "No account found with this email.";
                      break;
                  case 'auth/invalid-email':
                      errorMessage = "Invalid email address.";
                      break;
                  default:
                      errorMessage = "Login error: " + error.message;
              }
              
              updateStatus(errorMessage, true);
          }
      }
      
     
      loginForm.addEventListener("submit", async (e) => {
          e.preventDefault();
          
          const email = emailInput.value.trim();
          const password = passwordInput.value.trim();
          
          if (!email || !password) {
              updateStatus("Please enter both email and password", true);
              return;
          }
          
          await handleLogin(email, password);
      });
      
     
      document.getElementById("sign-up").addEventListener("click", () => {
          window.location.href = "../RegisterCode/registerpage.html";
      });
      
      document.getElementById("staff-login").addEventListener("click", () => {
          // window.location.href = "staff login page";
      });
      
      document.getElementById("admin-login").addEventListener("click", () => {
          // window.location.href = "admin login page";
      });