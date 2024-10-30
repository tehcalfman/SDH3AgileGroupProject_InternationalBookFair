let currentStallId = null;

// UI Functions for modal management
function showAddStallForm() {
    const modal = document.getElementById('stallFormModal');
    modal.style.display = 'block';
    
    // Reset form if adding new stall
    if (!currentStallId) {
        document.getElementById('stallForm').reset();
        document.getElementById('modalTitle').textContent = 'Add New Stall';
        document.getElementById('deleteStallBtn').style.display = 'none';
    }
}

function closeModal() {
    const modal = document.getElementById('stallFormModal');
    modal.style.display = 'none';
    document.getElementById('stallForm').reset();
    currentStallId = null;
}

// Close modal if clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('stallFormModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Load stalls from Firebase
async function loadStalls() {
    console.log('Loading stalls...'); // Debug log
    try {
        const snapshot = await db.collection('stalls').get();
        const stallsList = document.getElementById('stallsList');
        stallsList.innerHTML = '';

        snapshot.forEach(doc => {
            const stall = doc.data();
            console.log('Stall data:', stall); // Debug log
            const row = `
                <tr>
                    <td>${stall.stallId || '-'}</td>
                    <td>${stall.stallName || '-'}</td>
                    <td>${stall.stallType || '-'}</td>
                    <td>${stall.status || 'available'}</td>
                    <td>${stall.vendorName || '-'}</td>
                    <td>${stall.bookCategories || '-'}</td>
                    <td>${stall.scheduleDate ? formatSchedule(stall.scheduleDate, stall.scheduleStart, stall.scheduleEnd) : '-'}</td>
                    <td>
                        <button onclick="editStall('${doc.id}')" class="edit-btn">Edit</button>
                    </td>
                </tr>
            `;
            stallsList.innerHTML += row;
        });
    } catch (error) {
        console.error("Error loading stalls:", error);
        alert('Error loading stalls: ' + error.message);
    }
}

// Format schedule helper function
function formatSchedule(date, start, end) {
    if (!date || !start || !end) return '-';
    return `${date}, ${start} - ${end}`;
}

// Initialize everything when the document loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Document loaded'); // Debug log
    
    // Test Firebase connection
    async function testConnection() {
        try {
            await db.collection('stalls').get();
            console.log('Successfully connected to Firebase!');
        } catch (error) {
            console.error('Firebase connection error:', error);
            alert('Error connecting to Firebase: ' + error.message);
        }
    }
    
    testConnection();
    loadStalls();

    // Add form submission handler
    const stallForm = document.getElementById('stallForm');
    stallForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Form submitted'); // Debug log

        const stallData = {
            stallId: document.getElementById('stallId').value,
            stallName: document.getElementById('stallName').value,
            status: 'available',
            createdAt: new Date()
        };

        console.log('Creating new stall:', stallData); // Debug log

        try {
            const docRef = await db.collection('stalls').add(stallData);
            console.log('Added stall with ID:', docRef.id);
            closeModal();
            loadStalls();
        } catch (error) {
            console.error("Error creating stall:", error);
            alert('Error creating stall: ' + error.message);
        }
    });

    // Add filter event listeners
    document.getElementById('statusFilter').addEventListener('change', applyFilters);
    document.getElementById('stallTypeFilter').addEventListener('change', applyFilters);
});

// Filter function
async function applyFilters() {
    const statusFilter = document.getElementById('statusFilter').value;
    const typeFilter = document.getElementById('stallTypeFilter').value;

    try {
        let query = db.collection('stalls');
        
        if (statusFilter !== 'all') {
            query = query.where('status', '==', statusFilter);
        }
        if (typeFilter !== 'all') {
            query = query.where('stallType', '==', typeFilter);
        }

        const snapshot = await query.get();
        const stallsList = document.getElementById('stallsList');
        stallsList.innerHTML = '';

        snapshot.forEach(doc => {
            const stall = doc.data();
            const row = `
                <tr>
                    <td>${stall.stallId || '-'}</td>
                    <td>${stall.stallName || '-'}</td>
                    <td>${stall.stallType || '-'}</td>
                    <td>${stall.status || 'available'}</td>
                    <td>${stall.vendorName || '-'}</td>
                    <td>${stall.bookCategories || '-'}</td>
                    <td>${stall.scheduleDate ? formatSchedule(stall.scheduleDate, stall.scheduleStart, stall.scheduleEnd) : '-'}</td>
                    <td>
                        <button onclick="editStall('${doc.id}')" class="edit-btn">Edit</button>
                    </td>
                </tr>
            `;
            stallsList.innerHTML += row;
        });
    } catch (error) {
        console.error("Error applying filters:", error);
        alert('Error applying filters: ' + error.message);
    }
}