import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js';
import { getFirestore, collection, query, where, getDocs, updateDoc } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyAE-pV4A3lK9WC0uVkBfX977MvrMZmBxBs",
  authDomain: "internation-book-store.firebaseapp.com",
  projectId: "internation-book-store",
  storageBucket: "internation-book-store.appspot.com",
  messagingSenderId: "837866886262",
  appId: "1:837866886262:web:6f4f74bb2a3252555c7b57",
  measurementId: "G-896HTYFSTF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById('purchaseButton').addEventListener('click', async () => {
    const email = document.getElementById('email').value.trim();

    if (!email) {
        alert("please enter your email to subscribe to the newsletter");
        return;
    }

    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        querySnapshot.forEach(async (docSnapshot) => {
            const userDocRef = docSnapshot.ref;
            await updateDoc(userDocRef, { newsletter: true });
            alert(`successfully subscribed ${email} to the newsletter!`);
        });
    } else {
        alert("user not found Please register before subscribing to the newsletter");
    }

    document.getElementById('purchaseForm').reset();
});
