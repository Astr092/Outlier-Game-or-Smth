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
    getDoc,
    collection,
    onSnapshot,
    getDocs

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

// ==========================
// Add Player To Lobby
// ==========================

async function addPlayerToLobby(){

    await setDoc(

        doc(
            db,
            "rooms",
            currentRoom,
            "players",
            currentUser.uid
        ),

        {

            name: playerName,

            uid: currentUser.uid

        }

    );

}


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

function openLobby(){

    roomCodeDisplay.innerText =
    currentRoom;


    homeScreen.classList.add(
        "hidden"
    );


    lobbyScreen.classList.remove(
        "hidden"
    );


    listenForPlayers();

}

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


    await setDoc(

        doc(
            db,
            "rooms",
            currentRoom
        ),

        {

            host:
            currentUser.uid,

            gameStarted:false

        }

    );


    await addPlayerToLobby();


    openLobby();

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
            "Lobby does not exist."
        );

        return;

    }


    await addPlayerToLobby();


    openLobby();

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
// Player List Listener
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


            list.innerHTML="";


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