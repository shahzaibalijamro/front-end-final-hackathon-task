import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { auth } from "./config.js";
const registerForm = document.querySelector('#registerForm');
const registerFirstName = document.querySelector('#registerFirstName');
const registerLastName = document.querySelector('#registerLastName');
const registerEmail = document.querySelector('#registerEmail');
const registerPassword = document.querySelector('#registerPassword');
const registerRePassword = document.querySelector('#registerRePassword');
// createUserWithEmailAndPassword(auth, email, password)
//   .then((userCredential) => {
//     // Signed up 
//     const user = userCredential.user;
//     // ...
//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     // ..
//   });

registerForm.addEventListener('click', event =>{
    event.preventDefault();
    console.log(registerFirstName.value);
    console.log(registerLastName.value);
    console.log(registerEmail.value);
    console.log(register.value);
    console.log(register.value);
    console.log(register.value);
    
})