import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js';
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js';
import { query, where } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js';


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
const db = getFirestore(app);

async function displayTickets(ticketIdFilter = '') {
    const ticketListContainer = document.getElementById('ticketListContainer');
    try {
        const ticketsRef = collection(db, 'ticket');
        const querySnapshot = await getDocs(ticketsRef);

        if (querySnapshot.empty) {
            ticketListContainer.innerHTML = '<p>no tickets available</p>';
            return;
        }

        ticketListContainer.innerHTML = '';
        let filteredTickets = [];
        querySnapshot.forEach((doc) => {
            const ticket = doc.data();
            if (ticketIdFilter === '' || ticket.id.toLowerCase().includes(ticketIdFilter.toLowerCase())) {
                filteredTickets.push({
                    id: doc.id,
                    ...ticket,
                });
            }
        });

        if (filteredTickets.length === 0) {
            ticketListContainer.innerHTML = '<p>no tickets found for the given filter</p>';
            return;
        }

        filteredTickets.forEach((ticket) => {
            const ticketElement = document.createElement('div');
            ticketElement.classList.add('ticket-card');
            ticketElement.innerHTML = `
                <h3>ticket ID ${ticket.id}</h3>
                <p><strong>owner</strong> ${ticket.owner || 'not owned'}</p>
            `;
            ticketListContainer.appendChild(ticketElement);
        });
    } catch (error) {
        ticketListContainer.innerHTML = '<p>error loading tickets/p>';
    }
}

function handleFilterButtonClick() {
    const ticketIdFilter = document.getElementById('ticketIdFilter').value.trim();
    displayTickets(ticketIdFilter);
}

document.getElementById('filterButton').addEventListener('click', handleFilterButtonClick);

displayTickets();

