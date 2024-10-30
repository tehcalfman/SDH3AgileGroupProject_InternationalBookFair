// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { 
    getFirestore, 
    collection, 
    getDocs, 
    addDoc,
    updateDoc,
    doc,
    query,
    where 
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAE-pV4A3lk9WC8uVkBfX977WvrMZmBxBs",
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

// Load and display available stalls
async function loadStalls() {
    const stallsGrid = document.getElementById('availableStalls');
    if (!stallsGrid) return;

    try {
        const q = query(collection(db, 'stalls'), where('available', '==', true));
        const querySnapshot = await getDocs(q);
        
        stallsGrid.innerHTML = ''; // Clear existing stalls

        querySnapshot.forEach((doc) => {
            const stall = doc.data();
            const stallElement = document.createElement('div');
            stallElement.className = 'stall-card';
            stallElement.innerHTML = `
                <h3>${stall.name}</h3>
                <button class="reserve-btn" data-stall-id="${doc.id}">
                    Reserve Stall
                </button>
            `;

            // Add click event listener to reserve button
            const reserveBtn = stallElement.querySelector('.reserve-btn');
            reserveBtn.addEventListener('click', () => openReservationModal(doc.id));

            stallsGrid.appendChild(stallElement);
        });
    } catch (error) {
        console.error("Error loading stalls:", error);
    }
}

// Handle reservation modal
function openReservationModal(stallId) {
    const modal = document.getElementById('reservationModal');
    const stallIdInput = document.getElementById('stallId');
    if (modal && stallIdInput) {
        stallIdInput.value = stallId;
        modal.style.display = 'block';
    }
}

// Handle reservation form submission
async function handleReservation(event) {
    event.preventDefault();
    
    const stallId = document.getElementById('stallId').value;
    const reservationDate = document.getElementById('startDate').value;
    const vendorType = document.getElementById('vendorType').value;
    
    // Validate vendor type
    if (!['author', 'exhibitor'].includes(vendorType)) {
        alert('Please select a valid vendor type (Author or Exhibitor).');
        return;
    }
    
    // Validate the date
    const selectedDate = new Date(reservationDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        alert('Please select a future date for your reservation.');
        return;
    }

    const formData = {
        stallId: stallId,
        vendorType: vendorType,
        reservationDate: reservationDate,
        companyName: document.getElementById('companyName').value,
        contactPerson: document.getElementById('contactPerson').value,
        contactEmail: document.getElementById('contactEmail').value,
        contactPhone: document.getElementById('contactPhone').value,
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    try {
        // Check if stall is already reserved for this date
        const reservationsRef = collection(db, 'reservations');
        const reservationQuery = query(
            reservationsRef,
            where('stallId', '==', stallId),
            where('reservationDate', '==', reservationDate)
        );
        
        const existingReservations = await getDocs(reservationQuery);
        
        if (!existingReservations.empty) {
            alert('This stall is already reserved for the selected date. Please choose another date.');
            return;
        }

        // Create reservation
        await addDoc(collection(db, 'reservations'), formData);
        
        // Close modal and refresh stalls
        const modal = document.getElementById('reservationModal');
        modal.style.display = 'none';
        document.getElementById('reservationForm').reset();
        loadStalls();
        
        alert('Reservation submitted successfully!');
    } catch (error) {
        console.error("Error submitting reservation:", error);
        alert('Error submitting reservation. Please try again.');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Load initial stalls
    loadStalls();

    // Setup reservation form
    const reservationForm = document.getElementById('reservationForm');
    if (reservationForm) {
        reservationForm.addEventListener('submit', handleReservation);
    }

    // Setup modal close button
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            const modal = document.getElementById('reservationModal');
            modal.style.display = 'none';
        });
    }

    // Setup filter handlers
    const typeFilter = document.getElementById('typeFilter');
    const sizeFilter = document.getElementById('sizeFilter');
    
    if (typeFilter) typeFilter.addEventListener('change', loadStalls);
    if (sizeFilter) sizeFilter.addEventListener('change', loadStalls);

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('reservationModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});