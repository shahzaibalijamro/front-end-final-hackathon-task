import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { auth, db } from "./config.js";
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
const loginBtn = document.querySelector('.nav-login-btn');
const logoutBtn = document.querySelector('.nav-logout-btn');
const dashboardBtn = document.querySelector('.dashboardBtn');
const navUsername = document.querySelector('.nav-username')
const currentUser = [];
const allBlogsWrapper = document.querySelector('#all-blogs-wrapper');
const allBlogsArr = [];
const pfp = document.querySelector('#pfp');
onAuthStateChanged(auth, async (user) => {
    if (user) {
        dashboardBtn.style.display = 'block'
        console.log(user.uid);
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



logoutBtn.addEventListener('click', () => {
    signOut(auth).then(() => {
        loginBtn.style.display = 'none';
        window.location = 'login.html';
    }).catch((error) => {
        alert(error)
    });
})


async function getAllBlogs() {
    const querySnapshot = await getDocs(collection(db, "blogs"));
    querySnapshot.forEach((doc) => {
        allBlogsArr.push(doc.data());
    });
    renderAllBlogs()
}
console.log(allBlogsArr);

getAllBlogs();

function renderAllBlogs() {
    allBlogsWrapper.innerHTML = '';
    allBlogsArr.map((item, index) => {
        allBlogsWrapper.innerHTML += `
        <div class="p-[1.3rem] flex flex-col rounded-xl bg-white">
                <div class="flex justify-start gap-4">
                    <div>
                        <img class="rounded-xl" width="70px" src=${item.pfp} alt="">
                    </div>
                    <div class="flex flex-col justify-end">
                        <div>
                            <h1 class="text-black font-semibold text-lg">${item.title}</h1>
                        </div>
                        <div class="text-[#6C757D] mb-[3px] font-medium flex gap-2 ">
                            <h1>${item.name}<span> - ${item.time}</span></h1>
                        </div>
                    </div>
                </div>
                <div class="mt-4">
                    <p class="text-[#6C757D]">${item.description}</p>
                </div>
                <div class="mt-3">
                    <p class="text-[#7749f8] font-semibold"><a href="">see all from this user</a></p>
                </div>
            </div>
        `
    })
}