// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { 
    getFirestore, 
    collection, 
    getDocs,
    query,
    where,
    doc,
    updateDoc,
    addDoc 
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

// Firebase configuration - exactly the same
const firebaseConfig = {
    apiKey: "AIzaSyAE-pV4A3lk9WC8uVkBfX977WvrMZmBxBs",
    authDomain: "internation-book-store.firebaseapp.com",
    projectId: "internation-book-store",
    storageBucket: "internation-book-store.firebasestorage.app",
    messagingSenderId: "837866886262",
    appId: "1:837866886262:web:6f4f74bb2a3252555c7b57",
    measurementId: "G-896HTYFSTF"
};

// Initialize Firebase - exactly like exhibitor version
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Load stalls from Firebase
async function loadStalls() {
    const stallsList = document.getElementById('stallsList');
    if (!stallsList) return;

    try {
        const stallsRef = collection(db, 'stalls');
        const reservationsRef = collection(db, 'reservations');
        
        // Get all stalls
        const stallsSnapshot = await getDocs(stallsRef);
        
        // Get active reservations
        const reservationsSnapshot = await getDocs(query(reservationsRef, where('status', '==', 'active')));
        const activeReservations = new Map(
            reservationsSnapshot.docs.map(doc => [doc.data().stallId, doc.data()])
        );

        // Clear existing stalls except template
        const template = stallsList.querySelector('.stall-card.template');
        stallsList.innerHTML = '';
        stallsList.appendChild(template);

        let total = 0, available = 0, reserved = 0;

        stallsSnapshot.forEach((stallDoc) => {
            const stall = stallDoc.data();
            const stallId = stallDoc.id;
            const reservation = activeReservations.get(stallId);
            
            total++;
            if (!reservation) available++; else reserved++;

            const stallCard = template.cloneNode(true);
            stallCard.classList.remove('template');
            stallCard.dataset.stallId = stallId;

            // Update stall card content
            stallCard.querySelector('.stall-id').textContent = stall.name || stallId;
            const statusElement = stallCard.querySelector('.stall-status');
            const status = reservation ? 'reserved' : 'available';
            statusElement.textContent = status.charAt(0).toUpperCase() + status.slice(1);
            statusElement.setAttribute('data-status', status);

            // Update stall details
            stallCard.querySelector('.stall-location').textContent = stall.location || 'Not specified';
            stallCard.querySelector('.stall-type').textContent = stall.type || 'Standard';
            stallCard.querySelector('.stall-size').textContent = stall.size || 'Regular';

            // Setup action buttons
            const checkInBtn = stallCard.querySelector('.check-in-btn');
            const checkOutBtn = stallCard.querySelector('.check-out-btn');
            const reportIssueBtn = stallCard.querySelector('.report-issue-btn');
            const viewDetailsBtn = stallCard.querySelector('.view-details-btn');

            // Show/hide buttons based on status
            checkInBtn.style.display = !reservation ? '' : 'none';
            checkOutBtn.style.display = reservation ? '' : 'none';

            // Add event listeners
            checkInBtn.addEventListener('click', () => handleCheckIn(stallId));
            checkOutBtn.addEventListener('click', () => handleCheckOut(stallId));
            reportIssueBtn.addEventListener('click', () => showReportIssueModal(stallId));
            viewDetailsBtn.addEventListener('click', () => viewStallDetails(stallId));

            stallsList.appendChild(stallCard);
        });

        // Update statistics
        document.getElementById('totalStalls').textContent = total;
        document.getElementById('availableStalls').textContent = available;
        document.getElementById('reservedStalls').textContent = reserved;

    } catch (error) {
        console.error("Error loading stalls:", error);
    }
}

// Handle check-in
async function handleCheckIn(stallId) {
    showConfirmationModal('Are you sure you want to check in this stall?', async () => {
        try {
            const reservation = {
                stallId: stallId,
                status: 'active',
                checkInTime: new Date().toISOString(),
                type: 'walk-in'
            };
            
            await addDoc(collection(db, 'reservations'), reservation);
            await loadStalls(); // Refresh the display
        } catch (error) {
            console.error("Error during check-in:", error);
        }
    });
}

// Handle check-out
async function handleCheckOut(stallId) {
    showConfirmationModal('Are you sure you want to check out this stall?', async () => {
        try {
            const reservationsRef = collection(db, 'reservations');
            const q = query(reservationsRef, 
                where('stallId', '==', stallId),
                where('status', '==', 'active')
            );
            
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (document) => {
                await updateDoc(doc(db, 'reservations', document.id), {
                    status: 'completed',
                    checkOutTime: new Date().toISOString()
                });
            });
            
            await loadStalls(); // Refresh the display
        } catch (error) {
            console.error("Error during check-out:", error);
        }
    });
}

// Show confirmation modal
function showConfirmationModal(message, onConfirm) {
    const modal = document.getElementById('confirmationModal');
    const confirmMsg = document.getElementById('confirmationMessage');
    const confirmBtn = document.getElementById('confirmAction');
    const cancelBtn = document.getElementById('cancelAction');

    confirmMsg.textContent = message;
    modal.style.display = 'block';

    confirmBtn.onclick = async () => {
        await onConfirm();
        modal.style.display = 'none';
    };

    cancelBtn.onclick = () => {
        modal.style.display = 'none';
    };
}

// Show report issue modal
function showReportIssueModal(stallId) {
    const modal = document.getElementById('reportIssueModal');
    const form = document.getElementById('issueForm');
    const cancelBtn = modal.querySelector('.cancel-btn');

    modal.style.display = 'block';

    form.onsubmit = async (e) => {
        e.preventDefault();
        
        const issueData = {
            stallId: stallId,
            type: document.getElementById('issueType').value,
            description: document.getElementById('issueDescription').value,
            timestamp: new Date().toISOString(),
            status: 'pending'
        };

        try {
            await addDoc(collection(db, 'issues'), issueData);
            modal.style.display = 'none';
            form.reset();
        } catch (error) {
            console.error("Error reporting issue:", error);
        }
    };

    cancelBtn.onclick = () => {
        modal.style.display = 'none';
        form.reset();
    };
}

// View stall details
function viewStallDetails(stallId) {
    // Implement view details functionality
    console.log(`Viewing details for stall ${stallId}`);
}

// Event Listeners - similar to exhibitor version
document.addEventListener('DOMContentLoaded', () => {
    loadStalls();

    // Setup filter handlers
    const statusFilter = document.getElementById('statusFilter');
    const stallSearch = document.getElementById('stallSearch');
    const toggleAvailable = document.getElementById('toggleAvailable');

    if (statusFilter) statusFilter.addEventListener('change', filterStalls);
    if (stallSearch) stallSearch.addEventListener('input', filterStalls);
    if (toggleAvailable) {
        toggleAvailable.addEventListener('click', () => {
            toggleAvailable.classList.toggle('active');
            filterStalls();
        });
    }
});

// Filter stalls
function filterStalls() {
    const statusFilter = document.getElementById('statusFilter').value;
    const searchTerm = document.getElementById('stallSearch').value.toLowerCase();
    const showAvailableOnly = document.getElementById('toggleAvailable').classList.contains('active');

    const stallCards = document.querySelectorAll('.stall-card:not(.template)');
    stallCards.forEach(card => {
        const stallId = card.querySelector('.stall-id').textContent.toLowerCase();
        const stallStatus = card.querySelector('.stall-status').getAttribute('data-status');
        
        let show = true;
        
        if (statusFilter !== 'all' && statusFilter !== stallStatus) show = false;
        if (searchTerm && !stallId.includes(searchTerm)) show = false;
        if (showAvailableOnly && stallStatus !== 'available') show = false;
        
        card.style.display = show ? '' : 'none';
    });
}