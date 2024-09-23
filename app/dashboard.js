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
const pfp = document.querySelector('#pfp');
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
        getMyBlogs();
    } else {
        window.location = 'login.html'
    }
});


dashboardForm.addEventListener('submit', async event => {
    const current = new Date();
    const currentDate = current.getDate();
    const currentMonth = current.getMonth();
    const currentYear = current.getFullYear();
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const correctedDate = (currentDate === 1 ? currentDate + 'st' :
                            currentDate === 2 ? currentDate + 'nd' :
                            currentDate === 3 ? currentDate + 'rd' :
                            currentDate === 21 ? currentDate + 'st' :
                            currentDate === 22 ? currentDate + 'nd' :
                            currentDate === 23 ? currentDate + 'rd' :
                            currentDate + 'th');
    
    const formattedTime = `${months[currentMonth]} ${correctedDate}, ${currentYear}`;
    event.preventDefault();
    const docRef = await addDoc(collection(db, "blogs"), {
        title: blogTitle.value,
        description: blogDescription.value,
        uid: currentUser[0].uid,
        pfp: currentUser[0].pfp,
        name: currentUser[0].name,
        time: formattedTime,
        email: currentUser[0].email
    });
    console.log("Document written with ID: ", docRef.id);
    myBlogsArr.push({
        title: blogTitle.value,
        description: blogDescription.value,
        time: formattedTime
    })
    blogTitle.value = '';
    blogDescription.value = '';
    showSnackbar()
    renderMyBlogs()
})



async function getMyBlogs() {
    const usersRef = collection(db, "blogs");
    const q = query(usersRef, where("uid", "==", currentUser[0].uid));
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


function renderMyBlogs() {
    myBlogsWrapper.innerHTML = '';
    if (myBlogsArr) {
        myBlogsArr.map((item, index) => {
            myBlogsWrapper.innerHTML += `
            <div class="p-[1.3rem] flex flex-col rounded-xl bg-white">
                    <div class="flex justify-start gap-4">
                        <div>
                            <img class="rounded-xl" width="70px" src=${currentUser[0].pfp} alt="">
                        </div>
                        <div class="flex flex-col justify-end">
                            <div>
                                <h1 class="text-black font-semibold text-lg">${item.title}</h1>
                            </div>
                            <div class="text-[#6C757D] mb-[3px] font-medium flex gap-2 ">
                                <h1>${currentUser[0].name}<span> - ${item.time}</span></h1>
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
    }else{
        myBlogsWrapper.innerHTML = `
    <div class="h-[10rem] flex justify-center items-center">
        <h1 class="text-xl font-semibold text-black mb-[1.4rem]">No blogs Found...</h1>
    </div>`;
    }
    }


logoutBtn.addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location = 'login.html';
    }).catch((error) => {
        alert(error)
    });
})


function showSnackbar() {
    var snackbar = document.getElementById("snackbar");
    snackbar.className = "show";
    setTimeout(function () { snackbar.className = snackbar.className.replace("show", ""); }, 3000);
}