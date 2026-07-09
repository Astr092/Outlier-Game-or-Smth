let isHost = false;

import { firebaseConfig } from "./firebase.js";

import {
initializeApp
} from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
getFirestore,
doc,
setDoc,
getDoc,
collection,
getDocs,
updateDoc
}
from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


let playerID =
localStorage.getItem("playerID");

if(!playerID){
    playerID =
    crypto.randomUUID();

    localStorage.setItem(
        "playerID",
        playerID
    );
}


let roomCode;
let playerName;


async function joinGame(){

    playerName =
    document.getElementById("name").value;

    roomCode =
    document.getElementById("room").value;


    await setDoc(
        doc(
            db,
            "rooms",
            roomCode,
            "players",
            playerID
        ),
        {
            name: playerName,
            role:null
        }
    );


    document.getElementById("join").hidden=true;
    document.getElementById("game").hidden=false;

    document.getElementById(
        "roomDisplay"
    ).innerText=roomCode;


    loadPlayers();

}



async function loadPlayers(){

    let list =
    document.getElementById("players");

    list.innerHTML="";


    let snapshot =
    await getDocs(
        collection(
            db,
            "rooms",
            roomCode,
            "players"
        )
    );


    snapshot.forEach(p=>{

        let li =
        document.createElement("li");

        li.innerText =
        p.data().name;

        list.appendChild(li);

    });

}



async function startGame(){

    let players =
    await getDocs(
        collection(
            db,
            "rooms",
            roomCode,
            "players"
        )
    );

let roomCode;
let playerName;
let isHost = false;

    let ids=[];

    players.forEach(
        p=>ids.push(p.id)
    );


    let chosen =
    ids[
        Math.floor(
            Math.random()*ids.length
        )
    ];


    for(let id of ids){

        await updateDoc(
            doc(
                db,
                "rooms",
                roomCode,
                "players",
                id
            ),
            {
                role:
                id===chosen
                ?
                "outlier"
                :
                "normal"
            }
        );

    }


    alert("Game started!");

}



async function revealRole(){

    let player =
    await getDoc(
        doc(
            db,
            "rooms",
            roomCode,
            "players",
            playerID
        )
    );


    document.getElementById(
        "result"
    ).innerText =
    player.data().role==="outlier"
    ?
    "You are the OUTLIER!"
    :
    "You are NOT the outlier.";

}

function copyLink(){

    navigator.clipboard.writeText(
        window.location.href
    );

    alert("Game link copied!");

}

function generateRoomCode(){

    const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let code = "";

    for(let i = 0; i < 5; i++){

        code += characters[
            Math.floor(
                Math.random() * characters.length
            )
        ];

    }

    return code;

}

async function createLobby(){

    roomCode = generateRoomCode();

    isHost = true;

    document.getElementById("room").value =
    roomCode;


    await joinGame();


    alert(
        "Lobby created!\n\nYour lobby code is: "
        + roomCode
    );

}

function copyLobbyCode(){

    navigator.clipboard.writeText(
        roomCode
    );

    alert(
        "Lobby code copied!"
    );

}
