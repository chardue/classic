// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-analytics.js";
  import {getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
  import { getFirestore, getDoc, doc} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBXss8NUpz5Z-wa7byCWEZZeIU9VzLVjDc",
    authDomain: "loginpage-3127a.firebaseapp.com",
    projectId: "loginpage-3127a",
    storageBucket: "loginpage-3127a.firebasestorage.app",
    messagingSenderId: "949988067658",
    appId: "1:949988067658:web:2f086b2f64b63e763a19b3",
    measurementId: "G-3R2M0Q3H1R"
  };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    const auth = getAuth();
    const db = getFirestore();

    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("Authenticated user UID:", user.uid);
            const docRef = doc(db, "users", user.uid);
            getDoc(docRef)
                .then((docSnap) => {
                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        console.log("User data:", userData);
                        document.getElementById('loggedUsername').innerText = userData.username;
                        document.getElementById('loggedUserEmail').innerText = userData.email;
                    } else {
                        console.log("No such document found!");
                    }
                })
                .catch((error) => {
                    console.error("Error getting document:", error);
                });
        } else {
            console.log("No user is logged in.");
        }
    });

    const logoutButton = document.getElementById('logout');
    logoutButton.addEventListener('click', () => {
        signOut(auth)
        .then(() => {
            console.log("User signed out successfully.");
            window.location.href = "../index.html"; // Redirect to the login page
        }).catch((error) => {
            console.error("Error signing out:", error);
        });
    })
