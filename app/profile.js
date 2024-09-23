import { onAuthStateChanged, signOut, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { auth, db } from "./config.js";
import { collection, getDocs, query, where, doc, setDoc, addDoc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
const navUsername = document.querySelector('.nav-username')
const currentUser = [];
const profileWrapper = document.querySelector('.profile-wrapper');
const pfp = document.querySelector('#pfp');
const resetBtn = document.querySelector('#reset-Btn');
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log(user.uid);
        console.log(user);
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            currentUser.push({
                name: doc.data().name,
                uid: doc.data().uid,
                pfp: doc.data().pfp,
                email: user.email
            })
        });
        pfp.src = currentUser[0].pfp;
        navUsername.innerHTML = `${currentUser[0].name}`
        profileWrapper.innerHTML = `
        <div class="max-w-[225px] mx-auto relative">
            <img class="w-full rounded-full mx-auto" id="pfp" src=${currentUser[0].pfp} alt="">
            <div class="absolute bottom-0 right-0 rounded-full p-2 cursor-pointer" id="editPfpBtn">
                <img src="../edit.png" alt="Edit" class="w-6 h-6">
            </div>
        </div>
        <h1 class="text-center mt-5 font-semibold text-3xl text-black">${currentUser[0].name}</h1>
        <div class="text-center">
            <button id="reset-Btn" type="submit" class="btn mt-5 text-white font-bold bg-[#7749f8] border-[#7749f8] btn-active hover:bg-[#561ef3] btn-neutral">Reset Password?</button>
        </div>
        <input type="file" id="fileInput" accept="image/*" class="hidden">
        `
        const resetBtn = document.querySelector('#reset-Btn');
        resetBtn.addEventListener('click', (e) => {
            e.preventDefault();
            passwordReset(currentUser[0].email)
        });
        const editPfpBtn = document.querySelector('#editPfpBtn');
        const fileInput = document.querySelector('#fileInput');
        editPfpBtn.addEventListener('click', () => {
            fileInput.click();
        });
        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    document.querySelector('#pfp').src = e.target.result;
                };
                reader.readAsDataURL(file);
                console.log(file);
            }
        });
    } else {
        window.location = 'login.html'
    }
});

function passwordReset(email) {
    sendPasswordResetEmail(auth, email)
        .then(() => {
            alert('Password reset email sent to your registered email address!')
        })
        .catch((error) => {
            const errorMessage = error.message;
            alert(errorMessage)
        });
}