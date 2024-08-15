import { createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { auth, db } from "./config.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js"; 
const registerForm = document.querySelector('#registerForm');
const registerFirstName = document.querySelector('#registerFirstName');
const registerLastName = document.querySelector('#registerLastName');
const registerEmail = document.querySelector('#registerEmail');
const registerPassword = document.querySelector('#registerPassword');
const registerRePassword = document.querySelector('#registerRePassword');
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,20}$/;
registerForm.addEventListener('submit', event => {
    event.preventDefault();
    if (passwordRegex.test(registerPassword.value)) {
        if (registerPassword.value === registerRePassword.value) {
            createUserWithEmailAndPassword(auth, registerEmail.value, registerPassword.value)
                .then(async (userCredential) => {
                    const user = userCredential.user;
                    console.log(user);
                    const docRef = await addDoc(collection(db, "users"), {
                        name: registerFirstName.value + " " + registerLastName.value,
                        uid: user.uid
                    });
                    window.location = 'login.html';
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    alert(errorCode)
                });
            return;
        }
        else {
            alert('Both passwords donot match')
        }
    } else {
        alert('Password must have at least one upper character, one lower, and a number')
    }
})