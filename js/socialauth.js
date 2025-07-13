import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-analytics.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBXss8NUpz5Z-wa7byCWEZZeIU9VzLVjDc",
  authDomain: "loginpage-3127a.firebaseapp.com",
  projectId: "loginpage-3127a",
  storageBucket: "loginpage-3127a.firebasestorage.app",
  messagingSenderId: "949988067658",
  appId: "1:949988067658:web:2f086b2f64b63e763a19b3",
  measurementId: "G-3R2M0Q3H1R"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
auth.languageCode = 'en';
const analytics = getAnalytics(app);
const db = getFirestore();

const provider = new GoogleAuthProvider();

const googleLogin = document.getElementById('googleLogin');
googleLogin.addEventListener('click', async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userDocRef = doc(db, "users", user.uid);
    const existingDoc = await getDoc(userDocRef);

    if (!existingDoc.exists()) {
      // Save the user data in Firestore if not already saved
      await setDoc(userDocRef, {
        username: user.displayName || "User",
        email: user.email || "No email"
      });
      console.log("New Google user saved to Firestore.");
    }

    window.location.href = "html/home.html";
  } catch (error) {
    console.error("Google login error:", error);
  }
});
