// ==========================
// Firebase Imports
// ==========================

import { db, auth } from "./firebase.js";

import {
    signInAnonymously,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";


// ==========================
// Firestore Imports
// ==========================

import {

    doc,
    setDoc,
    getDoc

} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";


// ==========================
// Global Variables
// ==========================

let currentUser = null;

let currentRoom = null;

let playerName = null;

let isHost = false;


// ==========================
// HTML Elements
// ==========================

const nameInput =
document.getElementById("nameInput");

const roomInput =
document.getElementById("roomInput");


const createLobbyBtn =
document.getElementById("createLobbyBtn");


const joinLobbyBtn =
document.getElementById("joinLobbyBtn");


const copyCodeBtn =
document.getElementById("copyCodeBtn");


const startGameBtn =
document.getElementById("startGameBtn");


const leaveLobbyBtn =
document.getElementById("leaveLobbyBtn");


const revealRoleBtn =
document.getElementById("revealRoleBtn");


// Screens

const homeScreen =
document.getElementById("homeScreen");

const lobbyScreen =
document.getElementById("lobbyScreen");

const gameScreen =
document.getElementById("gameScreen");


// Text Displays

const roomCodeDisplay =
document.getElementById("roomCodeDisplay");

const statusText =
document.getElementById("statusText");


// ==========================
// Authentication
// ==========================

async function loginPlayer(){

    try{

        await signInAnonymously(auth);

    }

    catch(error){

        console.error(
            "Authentication failed:",
            error
        );

    }

}


onAuthStateChanged(
    auth,
    (user)=>{

        if(user){

            currentUser = user;

            console.log(
                "Player ID:",
                user.uid
            );

        }

    }
);


// Start authentication

loginPlayer();


// ==========================
// Utility Functions
// ==========================

function generateRoomCode(){

    const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let code = "";


    for(let i = 0; i < 5; i++){

        code += characters[
            Math.floor(
                Math.random()
                *
                characters.length
            )
        ];

    }


    return code;

}


// ==========================
// Lobby Functions
// ==========================

async function createLobby(){

    console.log(
        "Creating lobby..."
    );


    playerName =
    nameInput.value.trim();


    if(!playerName){

        alert(
            "Please enter your name."
        );

        return;

    }


    currentRoom =
    generateRoomCode();


    isHost = true;


    console.log(
        "Lobby:",
        currentRoom
    );


    roomCodeDisplay.innerText =
    currentRoom;


    homeScreen.classList.add(
        "hidden"
    );


    lobbyScreen.classList.remove(
        "hidden"
    );


    statusText.innerText =
    "Lobby created. Waiting for players...";

}



async function joinLobby(){

    console.log(
        "Joining lobby..."
    );


    playerName =
    nameInput.value.trim();


    currentRoom =
    roomInput.value
    .trim()
    .toUpperCase();


    if(!playerName || !currentRoom){

        alert(
            "Enter your name and lobby code."
        );

        return;

    }


    console.log(
        "Joining:",
        currentRoom
    );


    roomCodeDisplay.innerText =
    currentRoom;


    homeScreen.classList.add(
        "hidden"
    );


    lobbyScreen.classList.remove(
        "hidden"
    );


}


// ==========================
// Button Connections
// ==========================

createLobbyBtn.addEventListener(
    "click",
    createLobby
);


joinLobbyBtn.addEventListener(
    "click",
    joinLobby
);


copyCodeBtn.addEventListener(
    "click",
    ()=>{

        navigator.clipboard.writeText(
            currentRoom
        );

        alert(
            "Lobby code copied!"
        );

    }
);


// ==========================
// Temporary Placeholders
// ==========================

startGameBtn.addEventListener(
    "click",
    ()=>{

        console.log(
            "Start game clicked"
        );

    }
);


leaveLobbyBtn.addEventListener(
    "click",
    ()=>{

        location.reload();

    }
);


revealRoleBtn.addEventListener(
    "click",
    ()=>{

        console.log(
            "Reveal role clicked"
        );

    }
);