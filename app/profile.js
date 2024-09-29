//                      importing firebase necessities

import { onAuthStateChanged, signOut, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { auth, db } from "./config.js";
import { collection, getDocs, query, where, doc, setDoc, addDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { uploadBytes, getDownloadURL, ref, getStorage } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js";



//                      Variables and constants

const navUsername = document.querySelector('.nav-username')
const currentUser = [];
const profileWrapper = document.querySelector('.profile-wrapper');
const pfp = document.querySelector('#pfp');
const resetBtn = document.querySelector('#reset-Btn');
const storage = getStorage();
const currentUserBlogs = [];
let url;



//                      Checking user's current status

onAuthStateChanged(auth, async (user) => {
    if (user) {
        // getting current user data from firestore
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            currentUser.push({
                name: doc.data().name,
                uid: doc.data().uid,
                pfp: doc.data().pfp,
                email: user.email,
                id: doc.id
            })
        });
        pfp.src = currentUser[0].pfp;
        navUsername.innerHTML = `${currentUser[0].name}`
        renderProf(currentUser[0])
        // mega function
        function renderProf(user) {
            // sending current user data to the rendering func
            renderProfile(user.pfp, user.name)
            // password reset functionality
            const resetBtn = document.querySelector('#reset-Btn');
            resetBtn.addEventListener('click', (e) => {
                e.preventDefault();
                passwordReset(user.email)
            });
            // update name functionality
            const editPfpBtn = document.querySelector('#editPfpBtn');
            const editNameBtn = document.querySelector('#editNameBtn');
            const fileInput = document.querySelector('#fileInput');
            editNameBtn.addEventListener('click', async () => {
                const editedName = prompt('Enter new name!');
                // sending the updated name to the database
                const nameRef = doc(db, "users", user.id);
                await updateDoc(nameRef, {
                    name: editedName
                });
                user.name = editedName;
                navUsername.innerHTML = editedName;
                renderProf(user)
                // updating all user's posted blogs with the new name
                getMyBlogs(editedName)
                showSnackbarAfterNameUpdate()
            })
            editPfpBtn.addEventListener('click', () => {
                fileInput.click();
            });
            fileInput.addEventListener('change', async (event) => {
                const file = event.target.files[0];
                url = await uploadFile(file, user.email);
                const dpRef = doc(db, "users", user.id);
                await updateDoc(dpRef, {
                    pfp: url
                });
                user.pfp = await url;
                pfp.src = user.pfp;
                // rerendering the function to show the update val
                renderProf(user)
                // confirmation alert
                showSnackbarAfterPfpUpdate()
                event.target.value = ''
            });
        }
    } else {
        window.location = 'login.html'
    }
});



//                      Password reset core function

function passwordReset(email) {
    sendPasswordResetEmail(auth, email)
        .then(() => {
            alert(`Password reset email has been sent to your registered email address
"${email}"`)
        })
        .catch((error) => {
            const errorMessage = error.message;
            alert(errorMessage)
        });
}



//           uploading the updated profile picture on the firestore storage

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



//                      rendering data on the screen

function renderProfile(pfp, name) {
    profileWrapper.innerHTML = `
        <div class="max-w-[225px] mx-auto relative">
            <img class="w-full rounded-full mx-auto" id="pfp" src=${pfp} alt="">
            <div class="absolute bottom-0 right-0 rounded-full p-2 cursor-pointer" id="editPfpBtn">
                <img src="../edit.png" alt="Edit" class="w-6 h-6">
            </div>
        </div>
        <div class="flex justify-center mt-5 items-center">
            <h1 class="text-center font-semibold text-3xl text-black">${name}</h1>
            <img id="editNameBtn" src="../edit.png" alt="Edit" class="w-4 ms-1 cursor-pointer mt-1 h-4">
        </div>
        <div class="text-center">
            <button id="reset-Btn" type="submit" class="btn mt-5 text-white font-bold bg-[#7749f8] border-[#7749f8] btn-active hover:bg-[#561ef3] btn-neutral">Reset Password?</button>
        </div>
        <input type="file" id="fileInput" accept="image/*" class="hidden">
        `
}



//        getting current userblogs to then update it's name

async function getMyBlogs(userName) {
    const usersRef = collection(db, "blogs");
    const q = query(usersRef, where("uid", "==", currentUser[0].uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        currentUserBlogs.push({
            id: doc.id
        })
    });
    for (let i = 0; i < currentUserBlogs.length; i++) {
        const editedName = userName;
        const userNameRef = doc(db, "blogs", currentUserBlogs[i].id);
        await updateDoc(userNameRef, {
            name: editedName
        });
    }
}



//                  confirmation alert for pfp update

function showSnackbarAfterPfpUpdate() {
    var snackbar = document.getElementById("snackbar");
    snackbar.className = "show";
    setTimeout(function () { snackbar.className = snackbar.className.replace("show", ""); }, 3000);
}



//                  confirmation alert for name update

function showSnackbarAfterNameUpdate() {
    var snackbar = document.getElementById("snackbar2");
    snackbar.className = "show";
    setTimeout(function () { snackbar.className = snackbar.className.replace("show", ""); }, 3000);
}