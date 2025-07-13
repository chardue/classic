import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-analytics.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, GithubAuthProvider, fetchSignInMethodsForEmail, linkWithCredential } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
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

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// Google Login
const googleLogin = document.getElementById('googleLogin');
googleLogin.addEventListener('click', async () => {
  await handleLogin(googleProvider, "Google");
});

// GitHub Login
const githubLogin = document.getElementById('githubLogin');
githubLogin.addEventListener('click', async () => {
  await handleLogin(githubProvider, "GitHub");
});

// Unified login handler
async function handleLogin(provider, providerName) {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userDocRef = doc(db, "users", user.uid);
    const existingDoc = await getDoc(userDocRef);

    if (!existingDoc.exists()) {
      await setDoc(userDocRef, {
        username: user.displayName || "User",
        email: user.email || "No email"
      });
      console.log(`New ${providerName} user saved to Firestore.`);
    }

    console.log("Login successful, redirecting...");
    window.location.href = "html/home.html";

  } catch (error) {
    if (error.code === "auth/account-exists-with-different-credential") {
      const pendingCred = error.credential;
      const email = error.customData?.email;

      // Get the existing sign-in methods for this email
      const methods = await fetchSignInMethodsForEmail(auth, email);

      if (methods.includes('google.com')) {
        alert(`You’ve previously signed in with Google using ${email}. Please sign in with Google first to link GitHub.`);

        // Optional: Auto sign in with Google to link GitHub
        const googleProvider = new GoogleAuthProvider();
        const googleResult = await signInWithPopup(auth, googleProvider);

        // Link GitHub credential
        await linkWithCredential(googleResult.user, pendingCred);
        console.log("GitHub account linked to Google account.");

        // Redirect after linking
        window.location.href = "html/home.html";
      } else {
        alert(`Account exists with another provider for email ${email}. Sign in with that first.`);
      }

    } else if (error.code === "auth/popup-closed-by-user") {
      console.warn(`${providerName} popup closed by user.`);
    } else {
      console.error(`${providerName} login error:`, error);
    }
  }
}

