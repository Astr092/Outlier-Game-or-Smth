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
    onSnapshot,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";


// ==========================
// Debug
// ==========================

console.log("OUTLIER SCRIPT LOADED");


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


const homeScreen =
document.getElementById("homeScreen");

const lobbyScreen =
document.getElementById("lobbyScreen");

const gameScreen =
document.getElementById("gameScreen");


const roomCodeDisplay =
document.getElementById("roomCodeDisplay");

const statusText =
document.getElementById("statusText");


const playerList =
document.getElementById("playerList");

const playerCount =
document.getElementById("playerCount");


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
                Math.random() *
                characters.length
            )
        ];

    }


    return code;

}


// ==========================
// Authentication
// ==========================

onAuthStateChanged(

    auth,

    (user)=>{

        if(user){

            currentUser = user;

            authReady = true;


            console.log(
                "Authentication ready:",
                user.uid
            );

        }

    }

);



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


loginPlayer();



// ==========================
// Player Functions
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



// ==========================
// Lobby Functions
// ==========================

async function createLobby(){

    while(!authReady){

        await new Promise(

            resolve =>
            setTimeout(resolve,100)

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

                host:
                currentUser.uid,

                gameStarted:false

            }

        );


        await addPlayerToLobby();


        openLobby();


    }

    catch(error){

        console.error(
            "Create lobby failed:",
            error
        );

    }

}

async function joinLobby(){

    while(!authReady){

        await new Promise(

            resolve =>
            setTimeout(resolve,100)

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



    const roomSnapshot =
    await getDoc(

        doc(
            db,
            "rooms",
            currentRoom
        )

    );



    if(!roomSnapshot.exists()){

        alert(
            "Lobby not found."
        );

        return;

    }



    await addPlayerToLobby();


    openLobby();

}

// ==========================
// Lobby Display
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


    statusText.innerText =
    "Waiting for players...";


    if(isHost){

        startGameBtn.classList.remove(
            "hidden"
        );

    }

    else{

        startGameBtn.classList.add(
            "hidden"
        );

    }


    listenForPlayers();

    listenForGameStart();

}



// ==========================
// Player List Sync
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


            playerList.innerHTML = "";


            snapshot.forEach(

                (player)=>{


                    const data =
                    player.data();


                    const li =
                    document.createElement(
                        "li"
                    );


                    li.innerText =
                    data.name;


                    playerList.appendChild(li);


                }

            );


            playerCount.innerText =
            `${snapshot.size} Players`;


        }

    );

}



// ==========================
// Game Start Sync
// ==========================

function listenForGameStart(){

    const roomRef =
    doc(

        db,

        "rooms",

        currentRoom

    );


    onSnapshot(

        roomRef,

        (snapshot)=>{


            const data =
            snapshot.data();


            if(
                data &&
                data.gameStarted
            ){

                lobbyScreen.classList.add(
                    "hidden"
                );


                gameScreen.classList.remove(
                    "hidden"
                );


            }


        }

    );

}



// ==========================
// Start Game
// ==========================

async function startGame(){

    if(!isHost){

        alert(
            "Only the host can start the game."
        );

        return;

    }


    try{


        const playersSnapshot =
        await getDocs(

            collection(
                db,
                "rooms",
                currentRoom,
                "players"
            )

        );


        const players = [];


        playersSnapshot.forEach(

            (player)=>{

                players.push(
                    player.id
                );

            }

        );


        if(players.length < 3){

            alert(
                "You need at least 3 players."
            );

            return;

        }


        const outlierIndex =
        Math.floor(
            Math.random() *
            players.length
        );


        const outlier =
        players[outlierIndex];



        for(const playerID of players){


            await setDoc(

                doc(
                    db,
                    "rooms",
                    currentRoom,
                    "players",
                    playerID
                ),

                {

                    role:
                    playerID === outlier
                    ? "outlier"
                    : "player"

                },

                {

                    merge:true

                }

            );


        }



        await setDoc(

            doc(
                db,
                "rooms",
                currentRoom
            ),

            {

                gameStarted:true

            },

            {

                merge:true

            }

        );


    }


    catch(error){

        console.error(
            "Starting game failed:",
            error
        );

    }

}

// ==========================
// Game Placeholder
// ==========================

const revealRoleBtn =
document.getElementById("revealRoleBtn");


const roleCard =
document.getElementById("roleCard");


const roleTitle =
document.getElementById("roleTitle");


const roleDescription =
document.getElementById("roleDescription");


const playAgainBtn =
document.getElementById("playAgainBtn");



if(revealRoleBtn){

    revealRoleBtn.addEventListener(

        "click",

        async ()=>{


            const playerDoc =
            await getDoc(

                doc(
                    db,
                    "rooms",
                    currentRoom,
                    "players",
                    currentUser.uid
                )

            );


            const data =
            playerDoc.data();


            roleCard.classList.remove(
                "hidden"
            );


            if(data.role === "outlier"){


                roleTitle.innerText =
                "You are the Outlier";


                roleDescription.innerText =
                "Your role is different from everyone else's.";


            }

            else{


                roleTitle.innerText =
                "You are a Player";


                roleDescription.innerText =
                "Find the outlier among the group (innocent).";

            }


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



startGameBtn.addEventListener(

    "click",

    startGame

);



leaveLobbyBtn.addEventListener(

    "click",

    ()=>{


        location.reload();


    }

);



// ==========================
// Finished Loading
// ==========================

console.log(
    "OUTLIER READY"
);