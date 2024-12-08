// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
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
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    const auth = firebase.auth();
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    // Check if user is already logged in
    auth.onAuthStateChanged((user) => {
        console.log('Auth state changed:', user ? 'logged in' : 'logged out');
        if (user) {
            console.log('User is logged in:', user.email);
            window.location.href = 'admin.html';
        }
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        
        console.log('Attempting login with email:', email);
        
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            console.log('Login successful:', userCredential.user.email);
            window.location.href = 'admin.html';
        } catch (error) {
            console.error('Login error:', error);
            
            let errorText;
            switch (error.code) {
                case 'auth/user-not-found':
                    errorText = 'No user found with this email';
                    break;
                case 'auth/wrong-password':
                    errorText = 'Incorrect password';
                    break;
                case 'auth/invalid-email':
                    errorText = 'Invalid email format';
                    break;
                default:
                    errorText = `Error: ${error.message}`;
            }
            
            errorMessage.style.display = 'block';
            errorMessage.textContent = errorText;
        }
    });
}); 