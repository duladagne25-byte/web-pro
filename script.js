// ============================================
// 🔴 FIREBASE CONFIGURATION - REPLACE THIS! 🔴
// ============================================
// Go to: https://console.firebase.google.com/
// Create project → Add web app → Copy config below
// ============================================

const firebaseConfig = {
  apiKey: "AIzaSyBSa8gM4d5oCDE6dg6qh6nyQyir4aSa-Sw",
  authDomain: "ethio-dev.firebaseapp.com",
  projectId: "ethio-dev",
  storageBucket: "ethio-dev.firebasestorage.app",
  messagingSenderId: "206426718747",
  appId: "1:206426718747:web:cbcb9dbd37c6c18d3a6ebe",
  measurementId: "G-MVL5SXGN4G"
};

// ============================================
// 🔴 CHANGE ABOVE VALUES WITH YOUR FIREBASE 🔴
// ============================================

// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Show message
window.showMessage = function(message, type) {
    const msgDiv = document.getElementById('message');
    msgDiv.innerHTML = `<div class="message ${type}">${message}</div>`;
    setTimeout(() => msgDiv.innerHTML = '', 4000);
}

// Switch tabs
window.switchTab = function(tab) {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(t => t.classList.remove('active'));
    if(tab === 'login') {
        tabs[0].classList.add('active');
        document.getElementById('login-form').classList.add('active');
        document.getElementById('register-form').classList.remove('active');
    } else {
        tabs[1].classList.add('active');
        document.getElementById('register-form').classList.add('active');
        document.getElementById('login-form').classList.remove('active');
    }
    document.getElementById('message').innerHTML = '';
}

// Register
window.register = async function() {
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;

    if(!name || !email || !password) {
        showMessage('❌ Please fill all fields', 'error');
        return;
    }
    if(password.length < 6) {
        showMessage('❌ Password must be at least 6 characters', 'error');
        return;
    }
    if(!email.includes('@')) {
        showMessage('❌ Enter valid email', 'error');
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        showMessage('✅ Registered successfully!', 'success');
        document.getElementById('reg-name').value = '';
        document.getElementById('reg-email').value = '';
        document.getElementById('reg-password').value = '';
        setTimeout(() => switchTab('login'), 2000);
    } catch(error) {
        if(error.code === 'auth/email-already-in-use') {
            showMessage('❌ Email already registered', 'error');
        } else if(error.code === 'auth/invalid-email') {
            showMessage('❌ Invalid email', 'error');
        } else {
            showMessage('❌ ' + error.message, 'error');
        }
    }
}

// Login
window.login = async function() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    if(!email || !password) {
        showMessage('❌ Fill all fields', 'error');
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, email, password);
        showMessage('✅ Login successful!', 'success');
        document.getElementById('login-email').value = '';
        document.getElementById('login-password').value = '';
    } catch(error) {
        if(error.code === 'auth/user-not-found') {
            showMessage('❌ No account found', 'error');
        } else if(error.code === 'auth/wrong-password') {
            showMessage('❌ Wrong password', 'error');
        } else {
            showMessage('❌ ' + error.message, 'error');
        }
    }
}

// Logout
window.logout = async function() {
    await auth.signOut();
    showMessage('✅ Logged out', 'success');
}

// Format date
function formatDate(timestamp) {
    if(!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
}

// Get avatar letter
function getAvatarLetter(name) {
    if(!name || name === '') return '👤';
    return name.charAt(0).toUpperCase();
}

// Monitor auth state
onAuthStateChanged(auth, (user) => {
    if(user) {
        // Logged in - Show Dashboard
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('dashboard-container').style.display = 'block';
        
        const displayName = user.displayName || user.email.split('@')[0];
        document.getElementById('welcome-name').innerHTML = `Hello, ${displayName}! 👋`;
        document.getElementById('user-email').innerText = user.email;
        document.getElementById('user-id').innerText = user.uid.substring(0, 12) + '...';
        document.getElementById('user-since').innerText = formatDate(user.metadata.creationTime);
        
        const avatarLetter = getAvatarLetter(displayName);
        const avatarDiv = document.getElementById('user-avatar');
        if(avatarLetter === '👤') {
            avatarDiv.innerHTML = '👤';
        } else {
            avatarDiv.innerHTML = avatarLetter;
            avatarDiv.style.fontSize = '40px';
        }
    } else {
        // Logged out - Show Auth
        document.getElementById('auth-container').style.display = 'block';
        document.getElementById('dashboard-container').style.display = 'none';
        
        // Clear inputs
        document.getElementById('login-email').value = '';
        document.getElementById('login-password').value = '';
        document.getElementById('reg-name').value = '';
        document.getElementById('reg-email').value = '';
        document.getElementById('reg-password').value = '';
        document.getElementById('message').innerHTML = '';
    }
});
