import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js';
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js';

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
    const ticketListContainer = document.getElementById('ticketList');
    
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

        filteredTickets.forEach((ticket) => {
            const ticketElement = document.createElement('li');
            if (!ticket.owner || ticket.owner === '') {
                ticketElement.innerHTML = `
                    ticket ID <a href="#">${ticket.id}</a> not owned
                    <button class="buyabutton" dataticketid="${ticket.id}">buy</button>
                `;
            } else {
                ticketElement.innerHTML = `
                    Ticket ID: <a href="#">${ticket.id}</a> owned by ${ticket.owner}
                `;
            }

            ticketListContainer.appendChild(ticketElement);
        });

        const buyButtons = document.querySelectorAll('.buyabutton');
        buyButtons.forEach(button => {
            button.addEventListener('click', function() {
                const ticketId = button.getAttribute('dataticketid');
                buyTicket(ticketId);
            });
        });

    } catch (error) {
        ticketListContainer.innerHTML = '<p>error loading tickets</p>';
    }
}

async function displaySeminarTickets(ticketIdFilter = '') {
    const seminarTicketListContainer = document.getElementById('seminarTicketList');
    
    try {
        const seminarticketsRef = collection(db, 'SeminarTicket');
        const querySnapshot = await getDocs(seminarticketsRef);

        if (querySnapshot.empty) {
            seminarTicketListContainer.innerHTML = '<p>no seminar tickets available</p>';
            return;
        }

        seminarTicketListContainer.innerHTML = '';
        let filteredSeminarTickets = [];
        querySnapshot.forEach((doc) => {
            const seminarticket = doc.data();
            if (ticketIdFilter === '' || seminarticket.id.toLowerCase().includes(ticketIdFilter.toLowerCase())) {
                filteredSeminarTickets.push({
                    id: doc.id,
                    ...seminarticket,
                });
            }
        });

        filteredSeminarTickets.forEach((seminarticket) => {
            const ticketSeminarElement = document.createElement('li');
            
            if (!seminarticket.owner || seminarticket.owner === '') {
                ticketSeminarElement.innerHTML = `
                    seminar ticket ID <a href="#">${seminarticket.id}</a> not owned
                    <button class="buyaseminarbutton" buyseminarbuttonid="${seminarticket.id}">buy</button>
                `;
            } else {
                ticketSeminarElement.innerHTML = `
                    seminar ticket ID <a href="#">${seminarticket.id}</a> owned by ${seminarticket.owner}
                `;
            }
        
            seminarTicketListContainer.appendChild(ticketSeminarElement);
        });

        const buySeminarButtons = document.querySelectorAll('.buyaseminarbutton');
        buySeminarButtons.forEach(button => {
            button.addEventListener('click', function() {
                const ticketId = button.getAttribute('buyseminarbuttonid');
                buySeminarTicket(ticketId);
            });
        });

    } catch (error) {
        seminarTicketListContainer.innerHTML = '<p>error loading seminar tickets</p>';
    }
}





function buyTicket(ticketId) {
    window.location.href = `buyEventTicket.html?ticketId=${ticketId}`;
}

function buySeminarTicket(ticketId) {
    window.location.href = `buySeminarTicket.html?ticketId=${ticketId}`;
}

document.getElementById('filterButton').addEventListener('click', function() {
    const ticketIdFilter = document.getElementById('ticketIdFilter').value.trim();
    displayTickets(ticketIdFilter);
    displaySeminarTickets(ticketIdFilter);
});

displayTickets();
displaySeminarTickets();
