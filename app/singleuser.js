//                      importing firebase necessities

import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { auth, db } from "./config.js";
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";



//                      Variables and constants

const loginBtn = document.querySelector('.nav-login-btn');
const logoutBtn = document.querySelector('.nav-logout-btn');
const dashboardBtn = document.querySelector('.dashboardBtn');
const profileBtn = document.querySelector('.profileBtn');
const navUsername = document.querySelector('.nav-username')
const myBlogsWrapper = document.querySelector('#my-blog-wrapper');
const myBlogsArr = [];
const currentUser = [];
const pfp = document.querySelector('#pfp');
const sideBar = document.querySelector('#sidebar')
const singleUser = JSON.parse(localStorage.getItem('singleUser'));



//                      rendering the sidebar

if (singleUser) {
    sideBar.innerHTML += `
    <h1 class="font-semibold text-end text-black text-xl">${singleUser.email}</h1>
    <h1 class="font-bold text-3xl text-end text-[#7749f8]">${singleUser.name}</h1>
    <div class="flex mt-4 justify-end">
        <img class="rounded-xl" width="200px" src=${singleUser.pfp} alt="">
    </div>
    `
}



//                      Checking user's current status

onAuthStateChanged(auth, async (user) => {
    if (user) {
        dashboardBtn.style.display = 'block'
        profileBtn.style.display = 'block'
        // getting current user data from firestore
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            currentUser.push({
                name: doc.data().name,
                uid: doc.data().uid,
                pfp: doc.data().pfp,
            })
        });
        pfp.src = currentUser[0].pfp;
        navUsername.innerHTML = `${currentUser[0].name}`
        logoutBtn.style.display = 'block';
    } else {
        loginBtn.style.display = 'block';
    }
});



//                      getting the selected user's blogs

async function getClickedUserBlogs() {
    const usersRef = collection(db, "blogs");
    const q = query(usersRef, where("uid", "==", singleUser.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        myBlogsArr.push({
            title: doc.data().title,
            description: doc.data().description,
            time: doc.data().time,
        })
    });
    renderMyBlogs()
}
getClickedUserBlogs();



//                      rendering data on the screen

function renderMyBlogs() {
    myBlogsWrapper.innerHTML = '';
    myBlogsArr.map((item, index) => {
        myBlogsWrapper.innerHTML += `
        <div class="p-[1.3rem] flex flex-col rounded-xl bg-white">
                <div class="flex justify-start gap-4">
                    <div>
                        <img class="rounded-xl" width="70px" src=${singleUser.pfp} alt="">
                    </div>
                    <div class="flex flex-col justify-end">
                        <div>
                            <h1 class="text-black font-semibold text-lg">${item.title}</h1>
                        </div>
                        <div class="text-[#6C757D] mb-[3px] font-medium flex gap-2 ">
                            <h1>${singleUser.name}<span> - ${item.time}</span></h1>
                        </div>
                    </div>
                </div>
                <div class="mt-4">
                    <p class="text-[#6C757D]">${item.description}</p>
                </div>
            </div>
        `
    })
}