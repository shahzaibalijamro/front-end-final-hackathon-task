import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { auth, db } from "./config.js";
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
const loginBtn = document.querySelector('.nav-login-btn');
const logoutBtn = document.querySelector('.nav-logout-btn');
const dashboardBtn = document.querySelector('.dashboardBtn');
const profileBtn = document.querySelector('.profileBtn');
const navUsername = document.querySelector('.nav-username')
const currentUser = [];
const allBlogsWrapper = document.querySelector('#all-blogs-wrapper');
const allBlogsArr = [];
const pfp = document.querySelector('#pfp');
const inputSearch = document.querySelector(".input-search");
onAuthStateChanged(auth, async (user) => {
    if (user) {
        dashboardBtn.style.display = 'block'
        profileBtn.style.display = 'block'
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

getAllBlogs();

function renderAllBlogs() {
    allBlogsWrapper.innerHTML = '';
    allBlogsArr.map((item, index) => {
        console.log(item.pfp);
        console.log(item.name);
        
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
                    <p id="seeAll" class="text-[#7749f8] font-semibold"><a href="">see all from this user</a></p>
                </div>
            </div>
        `
    })
    const seeAllBtn = document.querySelectorAll('#seeAll');
    seeAllBtn.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            console.log(allBlogsArr[index]);
            localStorage.setItem('singleUser', JSON.stringify(allBlogsArr[index]));
            window.location = 'singleuser.html'
        })
    })
}




// search functionality

inputSearch.addEventListener('input', () => {
    const searchValue = inputSearch.value.toLowerCase();
    const filteredArr = allBlogsArr.filter(item => {
        return item.title.toLowerCase().includes(searchValue) ||
            item.description.toLowerCase().includes(searchValue);
    });
    console.log(filteredArr);
    renderFilteredData(filteredArr);
});



// render searched blogs

function renderFilteredData(filteredArr) {
    allBlogsWrapper.innerHTML = "";
    if (filteredArr.length > 0) {
        filteredArr.map((item, index) => {
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
                    <p id="seeAll" class="text-[#7749f8] font-semibold"><a href="">see all from this user</a></p>
                </div>
            </div>
        `
        })
        const seeAllBtn = document.querySelectorAll('#seeAll');
        seeAllBtn.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                console.log(allBlogsArr[index]);
                localStorage.setItem('singleUser', JSON.stringify(allBlogsArr[index]));
                window.location = 'singleuser.html'
            })
        })
    } else {
        allBlogsWrapper.innerHTML = `
    <div class="h-[10rem] flex justify-center items-center">
        <h1 class="text-xl font-semibold text-black mb-[1.4rem]">No blogs Found...</h1>
    </div>`;
    }
}