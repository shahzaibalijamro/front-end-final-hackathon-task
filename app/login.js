//                      importing firebase necessities

import { signInWithEmailAndPassword , sendPasswordResetEmail , GoogleAuthProvider , signInWithPopup , GithubAuthProvider,  onAuthStateChanged  } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { auth } from "./config.js";



//                      Variables and constants

const form = document.querySelector('#logInForm');
const email = document.querySelector('#emailInput');
const passwordInput = document.querySelector('#passwordInput');
const loginBtn = document.querySelector('.loginBtn');


// signs in through email and password
form.addEventListener('submit', event =>{
    event.preventDefault();
    loginBtn.innerHTML = 'logging in....'
    signInWithEmailAndPassword(auth, email.value, passwordInput.value)
    .then((userCredential) => {
        loginBtn.innerHTML = 'Login'
        window.location = 'dashboard.html';
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorCode)
    });
})