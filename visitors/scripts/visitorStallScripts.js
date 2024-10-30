// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { 
    getFirestore, 
    collection, 
    getDocs,
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

// Load and display stalls
async function loadStalls() {
    const stallsList = document.getElementById('stallsList');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const noResults = document.getElementById('noResults');
    const template = document.getElementById('stallTemplate');

    try {
        loadingIndicator.style.display = 'block';
        noResults.style.display = 'none';

        const stallsRef = collection(db, 'stalls');
        const stallsSnapshot = await getDocs(stallsRef);

        // Clear existing stalls
        const existingStalls = stallsList.querySelectorAll('.stall-card:not(template)');
        existingStalls.forEach(stall => stall.remove());

        if (stallsSnapshot.empty) {
            loadingIndicator.style.display = 'none';
            noResults.style.display = 'block';
            return;
        }

        stallsSnapshot.forEach(doc => {
            const stall = doc.data();
            const stallCard = template.content.cloneNode(true);

            // Populate stall card
            stallCard.querySelector('.vendor-name').textContent = stall.vendorName || 'Unknown Vendor';
            stallCard.querySelector('.vendor-type').textContent = stall.type || 'General';
            stallCard.querySelector('.stall-description').textContent = stall.description || 'No description available';
            stallCard.querySelector('.categories').textContent = `Categories: ${stall.categories?.join(', ') || 'General'}`;
            stallCard.querySelector('.location').textContent = `Location: ${stall.location || 'TBD'}`;

            stallsList.appendChild(stallCard);
        });

        loadingIndicator.style.display = 'none';
    } catch (error) {
        console.error("Error loading stalls:", error);
        loadingIndicator.style.display = 'none';
    }
}

// Filter stalls
function filterStalls() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const stallType = document.getElementById('stallTypeFilter').value;
    const genre = document.getElementById('genreFilter').value;
    const stallCards = document.querySelectorAll('.stall-card:not(template)');
    const noResults = document.getElementById('noResults');
    
    let visibleStalls = 0;

    stallCards.forEach(card => {
        const vendorName = card.querySelector('.vendor-name').textContent.toLowerCase();
        const vendorType = card.querySelector('.vendor-type').textContent.toLowerCase();
        const categories = card.querySelector('.categories').textContent.toLowerCase();

        const matchesSearch = vendorName.includes(searchTerm);
        const matchesType = stallType === 'all' || vendorType.includes(stallType);
        const matchesGenre = genre === 'all' || categories.includes(genre);

        if (matchesSearch && matchesType && matchesGenre) {
            card.style.display = '';
            visibleStalls++;
        } else {
            card.style.display = 'none';
        }
    });

    noResults.style.display = visibleStalls === 0 ? 'block' : 'none';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadStalls();

    // Setup filter listeners
    document.getElementById('searchInput').addEventListener('input', filterStalls);
    document.getElementById('stallTypeFilter').addEventListener('change', filterStalls);
    document.getElementById('genreFilter').addEventListener('change', filterStalls);
}); 