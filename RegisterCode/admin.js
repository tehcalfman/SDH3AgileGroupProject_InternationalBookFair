import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { getFirestore, doc, collection, getDocs, updateDoc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';

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
const auth = getAuth(app);

const adminPanel = document.getElementById('admin-panel');
const userList = document.getElementById('user-list');
const editUserModal = document.getElementById('edit-user-modal');
const editUserForm = document.getElementById('edit-user-form');

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userSnap = await getDocs(collection(db, 'users'));

        if (userSnap.docs.some(d => d.id === user.uid && d.data().role === 'admin')) {
            adminPanel.style.display = 'block';
            loadUsers();
        } else {
            alert("You do not have access to this page");
        }
    }
});

async function loadUsers() {
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    userList.innerHTML = '';

    usersSnapshot.forEach(doc => {
        const userData = doc.data();
        const li = document.createElement('li');
        li.textContent = `${userData.name} (${userData.email}) - Role: ${userData.role}`;
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.onclick = () => showEdit(doc.id, userData);
        li.appendChild(editButton);
        userList.appendChild(li);
    });
}

function showEdit(uid, userData) {
    editUserModal.style.display = 'block';
    document.getElementById('edit-name').value = userData.name;
    document.getElementById('edit-email').value = userData.email;
    document.getElementById('edit-role').value = userData.role;
    document.getElementById('edit-uid').value = uid;
}

editUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const uid = document.getElementById('edit-uid').value;
    const name = document.getElementById('edit-name').value;
    const email = document.getElementById('edit-email').value;
    const role = document.getElementById('edit-role').value;

    const userDocRef = doc(db, 'users', uid);

    await updateDoc(userDocRef, { name, email, role });

    alert('User updated successfully');
    editUserModal.style.display = 'none';
    loadUsers();
});
