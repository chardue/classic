// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-analytics.js";
  import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
  import { getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
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

  function showMessage(message, divId) {
    var messageDiv = document.getElementById(divId);
    messageDiv.classList.remove("hidden"); // Show the message
    messageDiv.innerHTML = message;

    // After 5 seconds, hide it smoothly
    setTimeout(function() {
        messageDiv.classList.add("hidden");
    }, 5000);
  }

  /*function showMessage(message, divId){
    var messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(function(){
        messageDiv.style.opacity = 0;
    },5000)
  } */
  const signUp = document.getElementById('submitSignUp');
  signUp.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const username = document.getElementById('rUsername').value;

    const auth = getAuth();
    const db = getFirestore();

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        const userData = {
            email: email,
            username: username,
        };
        showMessage('Account Created Successfully!', 'signUpMessage');
        const docRef = doc(db, "users", user.uid);
        setDoc(docRef,userData)
        .then(()=>{
            window.location.href = 'login.html';
        })
        .catch((error)=>{
            console.error("error writing document", error);
        });
      })

      .catch((error)=>{
        const errorCode = error.code;
        if(errorCode == 'auth/email-already-in-use'){
            showMessage('Email Address Already Exists !!!', 'signUpMessage');
        }
        else {
            showMessage('Unable to create User', 'signUpMessage');
        }
      })
  });

  const login = document.getElementById('submitLogin');
  login.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('lEmail').value;
    const password = document.getElementById('lPassword').value;

    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        showMessage('Login Successful!', 'loginMessage');
        const user = userCredential.user;
        localStorage.setItem('loggedInUserId', user.uid);
        // Redirect to the home page or dashboard
        window.location.href = 'html/home.html';
      })
      .catch((error) => {
        const errorCode = error.code;
        if(errorCode ==='auth/invalid-credential'){
            showMessage('Incorrect Email or Password!', 'loginMessage');
        }
        else {
            showMessage('Unable to Login, Account does not exist!', 'loginMessage');
        }
      });
  });