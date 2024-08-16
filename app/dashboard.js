import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { auth, db } from "./config.js";
import { collection, getDocs, query, where, doc, setDoc, addDoc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
const loginBtn = document.querySelector('.nav-login-btn');
const logoutBtn = document.querySelector('.nav-logout-btn');
const navUsername = document.querySelector('.nav-username')
const blogTitle = document.querySelector('.blog-title');
const blogDescription = document.querySelector('.blog-description');
const currentUser = [];
const dashboardForm = document.querySelector('#dashboard-form');
const myBlogsWrapper = document.querySelector('#my-blog-wrapper');
const myBlogsArr = [];
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
        getMyBlogs();
    } else {
        window.location = 'login.html'
    }
});


dashboardForm.addEventListener('submit', async event => {
    event.preventDefault();
    const docRef = await addDoc(collection(db, "blogs"), {
        title: blogTitle.value,
        description: blogDescription.value,
        uid: currentUser[0].uid
    });
    console.log("Document written with ID: ", docRef.id);
    myBlogsArr.push({
        title: blogTitle.value,
        description: blogDescription.value,
    })
    renderMyBlogs()
})



async function getMyBlogs() {
    const usersRef = collection(db, "blogs");
    const q = query(usersRef, where("uid", "==", currentUser[0].uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        myBlogsArr.push({
            title : doc.data().title,
            description : doc.data().description
        })
    });
    console.log(myBlogsArr);
    renderMyBlogs()
}


function renderMyBlogs() {
    myBlogsWrapper.innerHTML = '';
    myBlogsArr.map((item,index)=>{
        myBlogsWrapper.innerHTML += `
        <div class="p-[1.3rem] flex flex-col rounded-xl bg-white">
                <div class="flex justify-start gap-4">
                    <div>
                        <img class="rounded-xl" width="80px" src="https://s3-alpha-sig.figma.com/img/2a70/0436/ad923e69a8ff7debe812a1b55f9e2cca?Expires=1724630400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=KlN5pQQv4jEdOCnTfLPpybYuSAwr5EAyZYGTk1FuZ6FfynS9DzD7Rg-Sf6~qlp~GsmtA~w-ztYAv1FwIpep0yOjsA9zDVPB84U5BvXTfpSdO5G5wplZNnSwKYrSrsH49hjY14aWtagDKDGyxd1U8xttNecHcUciduqJnu2J21DtF1-MMAw-u~Fee~N-Y09JCpiyv3SGkvxG-GfWf6OQJrLDZ-MFGGznqmW8bTMuZn6Tqb7k1hDDGTtLxqrDuuFUTPD8Ius2qPElCsCK7xgWH7cwy66lzowF-z3zyNvWgxPxs6uzuyiFkCUIQ1Rah2qbpp4INPXVoL5td4cqEeN-sUA__" alt="">
                    </div>
                    <div class="flex flex-col justify-end">
                        <div>
                            <h1 class="text-black font-semibold text-lg">${item.title}</h1>
                        </div>
                        <div class="text-[#6C757D] mb-[3px] font-medium flex gap-2 ">
                            <h1>Elon Musk<span> - August 17th 2024</span></h1>
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