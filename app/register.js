//                      importing firebase necessities

import { createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { auth, db } from "./config.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js"; 
import { uploadBytes, getDownloadURL, ref, getStorage } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js";



//                      Variables and constants

const registerForm = document.querySelector('#registerForm');
const registerFirstName = document.querySelector('#registerFirstName');
const registerLastName = document.querySelector('#registerLastName');
const registerEmail = document.querySelector('#registerEmail');
const registerPassword = document.querySelector('#registerPassword');
const registerRePassword = document.querySelector('#registerRePassword');
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,20}$/;
const file = document.querySelector("#file");
const storage = getStorage();
let url = "";



//                      registering user

registerForm.addEventListener('submit', event => {
    event.preventDefault();
    const pfp = file.files[0];
    if (passwordRegex.test(registerPassword.value)) {
        if (registerPassword.value === registerRePassword.value) {
            createUserWithEmailAndPassword(auth, registerEmail.value, registerPassword.value)
                .then(async (userCredential) => {
                    if (pfp) {
                        url = await uploadFile(pfp, registerEmail.value);
                        
                    }
                    const user = userCredential.user;
                    const docRef = await addDoc(collection(db, "users"), {
                        name: registerFirstName.value + " " + registerLastName.value,
                        pfp: url,
                        email: registerEmail.value,
                        uid: user.uid
                    });
                    window.location = 'login.html';
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    alert(error)
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



//                uploading user's pfp on the firestore storage

async function uploadFile(file, userEmail) {
    const storageRef = ref(storage, userEmail);
    try {
        const uploadImg = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(uploadImg.ref);
        return url;
    } catch (error) {
        console.error(error);
        throw error;
    }
}