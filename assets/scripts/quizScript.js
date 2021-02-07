//set maps for Quiz answers
let goalScorers = new Map();

goalScorers.set(
    '2018', {"Mohamed Salah" : 22,
            "Sergio Aguero" : 21,
            "Eden Hazard" : 16,
            "Richarlison" : 13,
            "Harry Kane" : 17,
            "Jamie Vardy" : 18,
            "Pierre-Emerick Aubameyang" : 22},
);

goalScorers.set(
    '2017', {"Mohammed Salah" : 32,
            "Sergio Aguero" : 21,
            "Eden Hazard" : 12,
            "Raheem Sterling" : 18,
            "Harry Kane" : 30,
            "Jamie Vardy" : 20,
            "Pierre-Emerick Aubameyang" : 10},
);

goalScorers.set(
    '2010', {"Dimitar Berbatov" : 20,
            "Carlos Tevez" : 20,
            "Chicarito" : 13,
            "Robin van Persie" : 18,
            "DJ Campbell" : 13,
            "Andy Carroll" : 13,
            "Darren Bent" : 17},
);

goalScorers.set(
    '2012', {"Christian Benteke" : 20,
            "Gareth Bale" : 21,
            "Luis Suárez" : 23,
            "Robin van Persie" : 26,
            "Michu" : 18,
            "Romelu Lukaku" : 17},
);

//console.log(goalScorers.get("2012"));

let goalAssists = new Map();

goalAssists.set(
    '2018',{"Mohammed Salah" : 10,
            "Eden Hazard" : 15,
            "Ryan Fraser" : 14,
            "Trent Alexander-Arnold" : 12
});

let premierLeagueAppearances = new Map();

premierLeagueAppearances.set(
    'alltime',{"Gareth Barry" : 653,
                "Ryan Giggs" : 632,
                "James Milner" : 552,
                "Emile Heskey" : 516,
                "John Terry" : 492
});

//generate a random integer between min and max values
//taken from - https://www.w3schools.com/js/js_random.asp
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

//set question functions

function mostPerSeason(inputMap,ValToCompare) {
    let questionString;
    let playerAScore,playerBScore,playerCScore;
    let playerAName,playerBName,playerCName;
    //function to choose 3 random players
    let chosenPlayersIterable = chooseThreePlayers(inputMap);
    //console.log(chosenPlayersIterable);
    let outputMap = new Map();
    //choose goals, assists or appearances based on ValToCompare
    

    if(ValToCompare == "goals") {
        //console.log("ValToCompre is true");
        let playerSeasonData = goalScorers.get(chosenPlayersIterable[0]);
        //console.log(playerSeasonData);
        
        playerAName = chosenPlayersIterable[1];
        playerBName = chosenPlayersIterable[2];
        playerCName = chosenPlayersIterable[3];

        console.log(playerAName);

        playerAScore = playerSeasonData[playerAName];
        playerBScore = playerSeasonData[playerBName];
        playerCScore = playerSeasonData[playerCName];

        let seasonString = chosenPlayersIterable[0] + "-" + (parseInt(chosenPlayersIterable[0],10) + 1);

        questionString = `Who scored more goals in the ${seasonString} season of the Premier League?`;

        //console.log(questionString);

        //assign values to outputMap
        outputMap.set("question",questionString);
        outputMap.set(playerAName,playerAScore);
        outputMap.set(playerBName,playerBScore);
        outputMap.set(playerCName,playerCScore);
    }

    
    return outputMap;
}

function chooseThreePlayers(inputMap) {
    let mapItemCount = inputMap.size;
    let chosenKeyNum = getRndInteger(0,mapItemCount);
    let mapKeys = inputMap.keys();
    let chosenMapKey;

    //console.log(chosenKeyNum);

    //iterate through keys until the key position in the map matches the random chosenKeyNum number
    let loopCounter = 0;
    for(key of mapKeys) {
        if(chosenKeyNum == loopCounter) {
            //if the random chosenKeyNum matches the current loop counter, assign the key to chosenMapKey and break, we now know what season we want to ask about
            chosenMapKey = key;
            break;
        }
        else {
            loopCounter++;
        }
    }

    
    
    //create return array, with player names, and the season chosen for this question
    let chosenPlayers = pickThree(inputMap.get(chosenMapKey));

    chosenPlayers.unshift(chosenMapKey);

    return chosenPlayers;

}

function pickThree(inputIterable) {
    let namesList = [];
    let chosenNameIndexes = [];
    let chosenNames = [];

    for(key in inputIterable) {
        //console.log(key);
        namesList.push(key);

    }



    while(chosenNameIndexes.length < 3) {
        let chosenIndex = getRndInteger(0,namesList.length);
        let alreadyPicked = chosenNameIndexes.includes(chosenIndex);

        if(alreadyPicked == false) {
            chosenNameIndexes.push(chosenIndex);
        }
    }

    //console.log(chosenNameIndexes);

    for(index in chosenNameIndexes){
        chosenNames.push(namesList[index]);
    }

    return chosenNames;

}

//function to determine what player was selected and if it was the correct answer
function playerButtonClicked(divID,chosenPlayerName,otherPlayerA,otherPlayerB,questionPlayerMap) {
    //console.log("divID",divID);
    //console.log("chosenPlayerName",chosenPlayerName);
    let isCorrect;
    let chosenPlayerScore = questionPlayerMap.get(chosenPlayerName);
    let otherPlayerAScore = questionPlayerMap.get(otherPlayerA);
    let otherPlayerBScore = questionPlayerMap.get(otherPlayerB);


    if(chosenPlayerScore >= otherPlayerAScore && chosenPlayerScore >= otherPlayerBScore) {
        isCorrect = true;
        answerTrue = true;
        $(divID).addClass("btn-success");

        $("#questionInput").html(`Correct!<br>${chosenPlayerName}: ${chosenPlayerScore}`)

        currentScore++;
        $("#currentScore").html(currentScore);

        enableButton("#nextQuestion");
        
        $("#nextQuestion").click(function() {
            loadNextQuestion();
        });
    } else if(chosenPlayerScore < otherPlayerAScore || chosenPlayerScore < otherPlayerBScore){
        isCorrect = false;
        $(divID).addClass("btn-danger");
        
        //show correct answer (maybe use green border)
        if(otherPlayerAScore == otherPlayerBScore) {
            //if both others were high scores
            $(`button:contains('${otherPlayerA}')`).removeClass("btn-secondary").removeClass("btn-warning").addClass("btn-outline-success");
            $(`button:contains('${otherPlayerB}')`).removeClass("btn-secondary").removeClass("btn-warning").addClass("btn-outline-success");

            $("#questionInput").html(`Incorrect!<br>${otherPlayerA}: ${otherPlayerAScore}<br>${otherPlayerB}: ${otherPlayerBScore}`);


        }else if(otherPlayerAScore > otherPlayerBScore) {
            //if otherPlayerA is top score
            $(`button:contains('${otherPlayerA}')`).removeClass("btn-secondary").removeClass("btn-warning").addClass("btn-outline-success");

            $("#questionInput").html(`Incorrect!<br>${otherPlayerA}: ${otherPlayerAScore}`);

            

        } else {
            //if otherPlayerB is top score
            $(`button:contains('${otherPlayerB}')`).removeClass("btn-secondary").removeClass("btn-warning").addClass("btn-outline-success");

            $("#questionInput").html(`Incorrect!<br>${otherPlayerB}: ${otherPlayerBScore}`);


        }
        answerTrue == false;
        
        
        loadNextQuestion();
    }

}

function loadNextQuestion() {
    if(answerTrue === true){
        questionLoop();
        
    } else {
        //console.log("answerTrue === false",answerTrue);
        
        //save score
        
        $("#nextQuestion").html("Try Again");
        enableButton("#nextQuestion");



        //reload quiz
        $("#nextQuestion").click(function() {
            location.reload();
        });
    }
}

function disableButton(divID) {
    $(divID).attr("disabled","disabled");
}

function enableButton(divID) {
    $(divID).removeAttr("disabled");
}

function saveScore(name,score) {
    //may have to do a unique key to allow given name to occur multiple times, or only overwrite if new score is higher than old score
    localStorage.setItem(name,score);
    $("#highscores").append(`<div class="col p-1">${name} : ${score}</div><div class="w-100"></div>`)
}


let currentScore = 0;
let answerTrue = false;


$( document ).ready(function() {
    console.log( "file loaded!" );
    saveScore("Conor","5");
    questionLoop();

});

function questionLoop(){
    console.log("questionloop called");

    //reset all player buttons
    $("#playerA").removeClass("btn-success btn-warning btn-outline-success");
    $("#playerB").removeClass("btn-success btn-warning btn-outline-success");
    $("#playerC").removeClass("btn-success btn-warning btn-outline-success");

    enableButton("#playerA");
    enableButton("#playerB");
    enableButton("#playerC");

    let questionArray = mostPerSeason(goalScorers,"goals");

    //console.log("mostPerSeason",questionArray);
    let questionString = questionArray.get("question");
    questionArray.delete("question");
    
    let playerNames = questionArray.keys();
    //console.log(playerNames);

    $("#questionInput").html(questionString);
    $("#playerA").html(playerNames.next().value);
    $("#playerB").html(playerNames.next().value);
    $("#playerC").html(playerNames.next().value);

    //call function for each answer when clicked, then disable buttons
    $("#playerA").click(function(){
        playerButtonClicked("#playerA",$("#playerA").html(),$("#playerB").html(),$("#playerC").html(),questionArray);
        disableButton("#playerA");
        disableButton("#playerB");
        disableButton("#playerC");
    });

    $("#playerB").click(function(){
        playerButtonClicked("#playerB",$("#playerB").html(),$("#playerA").html(),$("#playerC").html(),questionArray);
        disableButton("#playerA");
        disableButton("#playerB");
        disableButton("#playerC");
    });
    
    $("#playerC").click(function(){
        playerButtonClicked("#playerC",$("#playerC").html(),$("#playerB").html(),$("#playerA").html(),questionArray);
        disableButton("#playerA");
        disableButton("#playerB");
        disableButton("#playerC");
    });

    //log current score
    $("#currentScore").html(currentScore);
}

