// ==========================
// Firebase Imports
// ==========================

import { db, auth } from "./firebase.js";

import {
    signInAnonymously,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";


import {
    doc,
    setDoc,
    getDoc,
    collection,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";


// ==========================
// Global Variables
// ==========================

let currentUser = null;
let currentRoom = null;
let playerName = null;
let isHost = false;
let authReady = false;


// ==========================
// HTML Elements
// ==========================

const nameInput = document.getElementById("nameInput");
const roomInput = document.getElementById("roomInput");

const createLobbyBtn = document.getElementById("createLobbyBtn");
const joinLobbyBtn = document.getElementById("joinLobbyBtn");

const copyCodeBtn = document.getElementById("copyCodeBtn");
const leaveLobbyBtn = document.getElementById("leaveLobbyBtn");

const homeScreen = document.getElementById("homeScreen");
const lobbyScreen = document.getElementById("lobbyScreen");

const roomCodeDisplay =
document.getElementById("roomCodeDisplay");

const statusText =
document.getElementById("statusText");


// ==========================
// Authentication Debug
// ==========================

onAuthStateChanged(
    auth,
    (user)=>{

        console.log(
            "Auth state changed:",
            user
        );


        if(user){

            currentUser = user;

            authReady = true;

            console.log(
                "Authentication successful:",
                user.uid
            );

        }

        else{

            console.log(
                "No user signed in yet"
            );

        }

    }
);


async function loginPlayer(){

    console.log(
        "Attempting anonymous login..."
    );


    try{

        const result =
        await signInAnonymously(auth);


        console.log(
            "Login complete:",
            result.user.uid
        );

    }


    catch(error){

        console.error(
            "LOGIN ERROR:",
            error
        );

    }

}


loginPlayer();


// ==========================
// Lobby Functions
// ==========================

async function createLobby(){

    while(!authReady){

        await new Promise(
            resolve => setTimeout(resolve,100)
        );

    }


    playerName =
    nameInput.value.trim();


    if(!playerName){

        alert(
            "Enter your name."
        );

        return;

    }


    currentRoom =
    generateRoomCode();


    isHost = true;


    try{

        await setDoc(

            doc(
                db,
                "rooms",
                currentRoom
            ),

            {

                host: currentUser.uid,

                gameStarted:false

            }

        );


        await addPlayerToLobby();


        openLobby();

    }

    catch(error){

        console.error(
            "Creating lobby failed:",
            error
        );

    }

}



async function joinLobby(){

    while(!authReady){

        await new Promise(
            resolve => setTimeout(resolve,100)
        );

    }


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


    const room =
    await getDoc(

        doc(
            db,
            "rooms",
            currentRoom
        )

    );


    if(!room.exists()){

        alert(
            "Lobby not found."
        );

        return;

    }


    await addPlayerToLobby();


    openLobby();

}



function openLobby(){

    roomCodeDisplay.innerText =
    currentRoom;


    homeScreen.classList.add(
        "hidden"
    );


    lobbyScreen.classList.remove(
        "hidden"
    );


    statusText.innerText =
    "Waiting for players...";


    listenForPlayers();

}


// ==========================
// Player List
// ==========================

function listenForPlayers(){

    const playersRef =
    collection(
        db,
        "rooms",
        currentRoom,
        "players"
    );


    onSnapshot(

        playersRef,

        (snapshot)=>{

            const list =
            document.getElementById(
                "playerList"
            );


            list.innerHTML = "";


            snapshot.forEach(
                (player)=>{

                    const li =
                    document.createElement(
                        "li"
                    );


                    li.innerText =
                    player.data().name;


                    list.appendChild(li);

                }
            );


            document.getElementById(
                "playerCount"
            ).innerText =
            `${snapshot.size} Players`;

        }

    );

}


// ==========================
// Buttons
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


leaveLobbyBtn.addEventListener(
    "click",
    ()=>{

        location.reload();

    }
);