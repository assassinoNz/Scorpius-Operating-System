//Add a selfEventListener to invoke recognizeCharacter after the activeCellIdsArray is sent from the mainThread
self.addEventListener("message", function(eventDetails) {
    recognizeCharacter(eventDetails.data);
});

function recognizeCharacter(activeCellIDsArray) {
    //Declare and initialize characterDatabase for each character
    const characterDatabaseMultiArray = [
        //A
        [["3", "4", "9", "10", "14", "15", "16", "17", "20", "21", "22", "23", "25", "26", "29", "30", "31", "32", "35", "36", "37", "42"], "A", "Latin Script"],
        //B
        [["1", "2", "3", "4", "7", "10", "13", "14", "15", "16", "17", "19", "23", "24", "25", "30", "31", "35", "36", "37", "38", "39", "40", "41"], "B", "Latin Script"],
        //C
        [["2", "3", "4", "5", "6", "7", "8", "12", "13", "19", "25", "31", "32", "36", "38", "39", "40", "41", "42"], "C", "Latin Script"],
        //D
        [["1", "2", "3", "4", "5", "7", "11", "13", "17", "18", "19", "24", "25", "29", "30", "31", "34", "35", "37", "38", "39", "40"], "D", "Latin Script"],
        //E
        [["1", "2", "3", "4", "5", "6", "7", "13", "19", "20", "21", "22", "25", "31", "37", "38", "39", "40", "41", "42"], "E", "Latin Script"],
        //F
        [["1", "2", "3", "4", "5", "6", "7", "13", "19", "20", "21", "22", "25", "31", "37"], "F", "Latin Script"],
        //G
        [["2", "3", "4", "5", "6", "7", "8", "12", "13", "19", "21", "22", "23", "24", "25", "30", "31", "32", "35", "36", "38", "39", "40", "41", "42"], "G", "Latin Script"],
        //H
        [["1", "6", "7", "12", "13", "18", "19", "20", "21", "22", "23", "24", "25", "30", "31", "36", "37", "42"], "H", "Latin Script"],
        //I
        [["1", "2", "3", "4", "5", "6", "9", "10", "15", "16", "21", "22", "27", "28", "33", "34", "37", "38", "39", "40", "41", "42"], "I", "Latin Script"],
        //J
        [["1", "2", "3", "4", "5", "6", "10", "16", "22", "25", "28", "31", "34", "37", "38", "39", "40"], "J", "Latin Script"],
        //K
        [["1", "5", "6", "7", "9", "10", "11", "13", "14", "15", "19", "20", "25", "26", "27", "31", "33", "34", "35", "37", "41", "42"], "K", "Latin Script"],
        //L
        [["1", "7", "13", "19", "25", "31", "37", "38", "39", "40", "41", "42"], "L", "Latin Script"],
        //M
        [["1", "6", "7", "8", "11", "12", "13", "14", "17", "18", "19", "20", "21", "22", "23", "24", "25", "27", "28", "30", "31", "33", "34", "36", "37", "39", "40", "42"], "M", "Latin Script"],
        //N
        [["1", "2", "6", "7", "8", "12", "13", "15", "18", "19", "21", "22", "24", "25", "28", "29", "30", "31", "35", "36", "37", "42"], "N", "Latin Script"],
        //O
        [["2", "3", "4", "5", "7", "8", "11", "12", "13", "18", "19", "24", "25", "30", "31", "32", "35", "36", "38", "39", "40", "41"], "O", "Latin Script"],
        //P
        [["1", "2", "3", "4", "5", "7", "11", "12", "13", "18", "19", "21", "22", "23", "24", "25", "26", "27", "31", "37"], "P", "Latin Script"],
        //Q
        [["2", "3", "4", "5", "7", "8", "11", "12", "13", "18", "19", "24", "25", "28", "29", "30", "31", "32", "35", "36", "38", "39", "40", "41", "42"], "Q", "Latin Script"],
        //R
        [["1", "2", "3", "4", "5", "7", "11", "12", "13", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "31", "33", "34", "35", "37", "41", "42"], "R", "Latin Script"],
        //S
        [["2", "3", "4", "5", "6", "7", "8", "12", "13", "14", "20", "21", "22", "23", "24", "30", "31", "36", "37", "38", "39", "40", "41", "42"], "S", "Latin Script"],
        //T
        [["1", "2", "3", "4", "5", "6", "9", "10", "15", "16", "21", "22", "27", "28", "33", "34", "39", "40"], "T", "Latin Script"],
        //U
        [["1", "6", "7", "12", "13", "18", "19", "24", "25", "30", "31", "32", "36", "38", "39", "40", "41", "42"], "U", "Latin Script"],
        //V
        [["1", "6", "7", "8", "11", "12", "14", "17", "20", "21", "23", "27", "28", "29", "33", "34", "39", "40"], "V", "Latin Script"],
        //W
        [["1", "3", "4", "6", "7", "9", "10", "12", "13", "14", "15", "16", "18", "20", "21", "22", "23", "24", "26", "27", "29", "30", "32", "33", "35", "38", "41"], "W", "Latin Script"],
        //X
        [["1", "6", "7", "8", "11", "12", "14", "15", "16", "17", "21", "22", "26", "27", "28", "29", "31", "32", "35", "37", "41", "42"], "X", "Latin Script"],
        //Y
        [["1", "2", "5", "6", "8", "11", "14", "15", "16", "17", "21", "22", "28", "34", "40"], "Y", "Latin Script"],
        //Z
        [["1", "2", "3", "4", "5", "6", "10", "11", "16", "21", "22", "26", "27", "31", "32", "37", "38", "39", "40", "41", "42"], "Z", "Latin Script"],
        //1
        [["2", "3", "4", "7", "8", "10", "16", "22", "28", "34", "37", "38", "39", "40", "41", "42"], "1", "Hindu-Arabic Numeral System"],
        //2
        [["2", "3", "4", "5", "7", "8", "11", "12", "18", "23", "24", "27", "28", "29", "32", "33", "37", "38", "39", "40", "41", "42"], "2", "Hindu-Arabic Numeral System"],
        //3
        [["1", "2", "3", "4", "5", "7", "11", "12", "17", "18", "22", "23", "24", "30", "31", "36", "37", "38", "39", "40", "41", "42"], "3", "Hindu-Arabic Numeral System"],
        //4
        [["4", "5", "9", "10", "11", "14", "15", "17", "19", "20", "23", "25", "26", "27", "28", "29", "30", "35", "41"], "4", "Hindu-Arabic Numeral System"],
        //5
        [["1", "2", "3", "4", "5", "6", "7", "13", "14", "15", "16", "17", "23", "24", "30", "31", "35", "36", "37", "38", "39", "40", "41"], "5", "Hindu-Arabic Numeral System"],
        //6
        [["2", "3", "4", "5", "6", "7", "8", "13", "14", "15", "16", "17", "19", "20", "23", "24", "25", "30", "31", "32", "35", "36", "38", "39", "40", "41"], "6", "Hindu-Arabic Numeral System"],
        //7
        [["1", "2", "3", "4", "5", "6", "11", "12", "16", "17", "21", "22", "26", "27", "31", "32", "37"], "7", "Hindu-Arabic Numeral System"],
        //8
        [["2", "3", "4", "5", "8", "11", "14", "15", "16", "17", "19", "20", "23", "24", "25", "30", "31", "35", "36", "37", "38", "39", "40", "41"], "8", "Hindu-Arabic Numeral System"],
        //9
        [["2", "3", "4", "5", "7", "8", "11", "12", "13", "17", "19", "20", "22", "23", "26", "27", "28", "33", "34", "39"], "9", "Hindu-Arabic Numeral System"],
        //0
        [["1", "2", "3", "4", "5", "7", "8", "9", "11", "12", "13", "15", "18", "19", "21", "22", "24", "25", "28", "30", "31", "32", "34", "35", "36", "38", "39", "40", "41", "42"], "0", "Hindu-Arabic Numeral System"]
    ];
    //Declare and initialize variables
    let script = "Within database";
    let character = "(None)";
    let matchScore = 0;
    //Compare each character in the database with the drawn character
    //WARNING: FOLLOWING FOR LOOP ASSIGNS A HEAVY WORKLOAD TO THE CPU
    for (let i = 0; i < characterDatabaseMultiArray.length; i++) {
        //Declare intersectionArray
        const intersectionArray = [];
        //Get the intersection Array
        for (let j = 0; j < activeCellIDsArray.length; j++) {
            //Check for common IDs of both activeCellIDsArray and characterDatabaseIDsArray
            if (characterDatabaseMultiArray[i][0].includes(activeCellIDsArray[j]) == true) {
                intersectionArray.push(activeCellIDsArray[j]);
            }
        }
        //Runs the algorithm on the drawnCharacter and determines the score compared to the databaseCharacter
        const score = (intersectionArray.length / characterDatabaseMultiArray[i][0].length) + (intersectionArray.length / activeCellIDsArray.length);
        //Updates the recognizedCharacter to newCharacter only if newCharacterScore >= oldCharacterScore
        if (score >= matchScore) {
            matchScore = score;
            character = characterDatabaseMultiArray[i][1];
            script = characterDatabaseMultiArray[i][2];
        }
    }
    //Send resultsArray to the mainThread
    postMessage([character, script, (matchScore / 2 * 100) + "%"]);
}
