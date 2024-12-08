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

const urlParams = new URLSearchParams(window.location.search);
const ticketId = urlParams.get('ticketId');


if (ticketId) {
  document.getElementById('eventTicket').textContent += ticketId;
}

async function submitForm() {
  const name = document.getElementById('name').value;

  try {
    if (!ticketId) {
      throw new Error('ticket ID is null or undefined');
    }

    const ticketsRef = collection(db, 'SeminarTicket');
    const q = query(ticketsRef, where('id', '==', ticketId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error(`ticket with ID ${ticketId} does not exist`);
    }

    const ticketDoc = querySnapshot.docs[0];

    const ticketData = ticketDoc.data();
    if (ticketData.owner === null || ticketData.owner === undefined) {
      await updateDoc(ticketDoc.ref, { owner: name });
      alert(`ticket ${ticketId} purchased successfully`);
      window.location.href = '/ticket.html';
    } else {
      alert(`ticket ${ticketId} is already owned by ${ticketData.owner}`);
    }
  } catch (error) {
    alert(error.message);
  }
}

document.getElementById('purchaseButton').addEventListener('click', submitForm);
