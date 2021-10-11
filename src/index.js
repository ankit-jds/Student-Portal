// Import the functions you need from the SDKs you need
'use strict';

import { initializeApp } from "firebase/app";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "firebase/auth";
import { getDatabase, ref, set, get, child } from "firebase/database";

import { getAnalytics } from "firebase/analytics";
import { getFirebaseConfig } from './firebase-config.js';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const app = initializeApp(getFirebaseConfig());

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
    if (user) {
        logoutbutton.classList.remove("hidden");
        readData(user);
        tablesection.classList.remove('hidden');

        loginbutton.classList.add("hidden");
        signinbutton.classList.add("hidden");
    } else {
        logoutbutton.classList.add('hidden');
        tablesection.classList.add('hidden');

        hero.classList.remove('hidden');
        loginbutton.classList.remove("hidden");
        signinbutton.classList.remove("hidden");
    }
});
const db = getDatabase(app);

function writeData(formdata) {
    set(ref(db, 'users/' + formdata.uid), formdata);
}

function readData(user) {

    get(child(ref(db), 'users/' + user.uid)).then((snapshot) => {
        if (snapshot.exists()) {
            let code = `<table>
              <caption>Your Details</caption>
              <tr>
                  <th>Name</th>
                  <td>${snapshot.val().name}</td>
              </tr>
              <tr>
                  <th>Age</th>
                  <td>${snapshot.val().age}</td>
              </tr>
              <tr>
                  <th>City</th>
                  <td>${snapshot.val().city}</td>
              </tr>
              <tr>
                  <th>Contact number</th>
                  <td>${snapshot.val().number}</td>
              </tr>
              <tr>
                  <th>Email ID</th>
                  <td>${snapshot.val().email}</td>
              </tr>
              <tr>
                  <th>Password</th>
                  <td>${snapshot.val().password}</td>
              </tr>
              <tr>
                  <th>Gender</th>
                  <td>${snapshot.val().gender}</td>
              </tr>
              <tr>
                  <th>Class 10</th>
                  <td>${snapshot.val().class10}</td>
              </tr>
              <tr>
                  <th>Class 12</th>
                  <td>${snapshot.val().class12}</td>
              </tr>
              <tr>
                  <th>Grad score</th>
                  <td>${snapshot.val().grad_score}</td>
              </tr>
              <tr>
                  <th>Favourite</th>
                  <td>${snapshot.val().favourite}</td>
              </tr>
              <tr>
                  <th>Current State</th>
                  <td>${snapshot.val().current_state}</td>
              </tr>
            </table>`;
            document.getElementById("table").innerHTML = code;
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.log("error", error);
    });
}
// Get elements
const loginbutton = document.getElementById("login-btn");
const logoutbutton = document.getElementById("logout-btn");
const signinbutton = document.getElementById("signin-btn");

const hero = document.getElementById("hero");
const signinsection = document.getElementById('signin-section');
const loginsection = document.getElementById('login_section');
const tablesection = document.getElementsByClassName('table')[0];

function resetUI() {
    loginbutton.classList.add('hidden');
}

const onregisterform = document.getElementById("register-form");


signinbutton.addEventListener('click', () => {
    hero.classList.add('hidden');
    loginsection.classList.add('hidden');
    signinsection.classList.remove('hidden');

    onregisterform.addEventListener('submit', formSubmit);

});
loginbutton.addEventListener('click', loginUser);
logoutbutton.addEventListener('click', logoutUser);

function loginUser(e) {
    hero.classList.add('hidden');
    signinsection.classList.add('hidden');

    loginsection.classList.remove('hidden');

    const login_form = document.getElementById("login-form");
    login_form.addEventListener('submit', () => {
        const login_email = document.getElementById("login_email").value;
        const login_pass = document.getElementById("login_password").value;
        signInWithEmailAndPassword(auth, login_email, login_pass).then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            loginsection.classList.add('hidden');
            tablesection.classList.remove('hidden');
            return user;
            // ...
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            return 0;
        });
    })
}

function logoutUser(e) {
    signOut(auth);
    hero.classList.remove('hidden');
    alert("You are succesfully logged out...")
}

function formSubmit(e) {
    e.preventDefault();
    // GET all the fields...
    let name = document.getElementById("name").value;
    let city = document.getElementById("city").value;
    let gender = document.getElementById("gender").value;
    let number = document.getElementById("number").value;
    let age = document.getElementById("age").value;
    let class10 = document.getElementById("class10").value;
    let class12 = document.getElementById("class12").value;
    let grad_score = document.getElementById("grad_score").value;
    let favourite = document.getElementById("favourite").value;
    let current_state = document.querySelector('input[name="current_state"]:checked').value;

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let cpassword = document.getElementById("cpassword").value;
    if (password != cpassword) {
        alert("Confirm Password is not same as Password");
    } else {
        createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
            // Signed in 
            alert('You are being registered...');
            const user = userCredential.user;
            return user
                // ...
        }).then((user) => {
            const formdata = {
                uid: user.uid,
                name: name,
                city: city,
                gender: gender,
                number: number,
                age: age,
                class10: class10,
                class12: class12,
                grad_score: grad_score,
                favourite: favourite,
                current_state: current_state,
                email: email,
                password: password,
            }
            writeData(formdata);
            signinsection.classList.add('hidden');
            readData(user);
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const user = 0;
            console.log('user not created', errorCode, errorMessage, user);
            // ..
        });


    }
}


console.log("working script.js");




// Initialize Firebase
const analytics = getAnalytics(app);