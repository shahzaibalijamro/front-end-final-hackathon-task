import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { auth, db } from "./config.js";
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
const loginBtn = document.querySelector('.nav-login-btn');
const logoutBtn = document.querySelector('.nav-logout-btn');
const navUsername = document.querySelector('.nav-username')
const currentUser = [];
const dashboardForm = document.querySelector('#dashboard-form');
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log(user.uid);
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            currentUser.push({
                name: doc.data().name,
                uid: doc.data().uid
            })
        });
        navUsername.style.display = 'block';
        navUsername.innerHTML = `Hello! ${currentUser[0].name}`
        logoutBtn.style.display = 'block';
    } else {

    }
});


logoutBtn.addEventListener('click', ()=>{
    signOut(auth).then(() => {
        loginBtn.style.display = 'none';
        window.location = 'login.html';
      }).catch((error) => {
        alert(error)
      });
})