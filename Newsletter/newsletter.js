import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js';
import { getFirestore, collection, query, orderBy, limit, getDocs, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js';

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

async function checkUserSubscription(userId) {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.newsletter !== true) {
            window.location.href = 'subscribenewsletter.html';
            return false;
        }
        return true;
    } else {
        return false;
    }
}

async function fetchNewsletters() {
    const newslettersRef = collection(db, 'newsletters');
    const q = query(newslettersRef, orderBy('timestamp', 'desc'), limit(10));
    const querySnapshot = await getDocs(q);

    const newsletters = [];
    querySnapshot.forEach(doc => {
        const newsletterData = doc.data();
        newsletters.push({
            title: newsletterData.title,
            content: newsletterData.content,
            author: newsletterData.author
        });
    });

    displayNewsletters(newsletters);
}

function displayNewsletters(newsletters) {
    const newsletterContainer = document.getElementById('newsletterContainer');
    newsletterContainer.innerHTML = '';
    newsletters.forEach(newsletter => {
        const newsletterElement = document.createElement('div');
        newsletterElement.classList.add('newsletter');

        const titleElement = document.createElement('h3');
        titleElement.textContent = newsletter.title;

        const contentElement = document.createElement('p');
        contentElement.textContent = newsletter.content;

        const authorElement = document.createElement('p');
        authorElement.textContent = `By: ${newsletter.author}`;

        newsletterElement.appendChild(titleElement);
        newsletterElement.appendChild(contentElement);
        newsletterElement.appendChild(authorElement);

        newsletterContainer.appendChild(newsletterElement);
    });
}

function displaySubscriptionMessage() {
    const newsletterContainer = document.getElementById('newsletterContainer');
    newsletterContainer.innerHTML = '<p>you must subscribe to the newsletter to see this content</p>';
}

document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userId = user.uid;
            const isSubscribed = await checkUserSubscription(userId);

            if (isSubscribed) {
                fetchNewsletters();
            } else {
                displaySubscriptionMessage();
            }
        } else {
            window.location.href = 'login.html';
        }
    });
});
