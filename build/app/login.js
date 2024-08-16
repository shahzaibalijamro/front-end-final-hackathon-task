import { signInWithEmailAndPassword , sendPasswordResetEmail , GoogleAuthProvider , signInWithPopup , GithubAuthProvider,  onAuthStateChanged  } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { auth } from "./config.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
const form = document.querySelector('#logInForm');
const email = document.querySelector('#emailInput');
const passwordInput = document.querySelector('#passwordInput');


// signs in through email and password
form.addEventListener('submit', event =>{
    event.preventDefault();
    signInWithEmailAndPassword(auth, email.value, passwordInput.value)
    .then((userCredential) => {
        window.location = 'index.html';
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorCode)
    });
})