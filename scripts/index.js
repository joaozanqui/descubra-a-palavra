function updateValue(value) {
    document.getElementById("selectedValue").textContent = value;
}

function hideHomePage() {
    const homePage = document.getElementById("homePage");
    homePage.style.display = "none";
    const gamePage = document.getElementById("gamePage");
    gamePage.style.display = "flex";
}

// WORD LENGTH 
var letters_quantity;
// POSSIBLE WORDS
var words = [];
// POSSIBLE LETTERS
var possible_letters_arr = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'];
// var possible_letters_arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
// restart options
var is_game_restarted = false;

// Game Level
var level = 1;
var isPlaying = false;
var isLevelChanged = false;
var level_boxes = document.querySelectorAll('.level-box');
var current_level_box = document.querySelector(".selected");
var incomplete_answers = level;

// ANSWER
var answer = [];
var answerTryCount;
/* ------------------------- CREATE GAME STRUCTURE -----------------------*/

var box_letters_arr = [];
var box_arr = [];
var letters_box_arr = [];


function gameCreate(createPossibleLetters = true) {
    hideHomePage();
    isPlaying = false;
    isLevelChanged = false;

    level_boxes.forEach(level_box => {
        level_box.addEventListener('click', function () {
            if (!this.classList.contains("selected")) {

                current_level_box = level_box;
                isLevelChanged = true;

                if (isPlaying) {
                    openPopup("Para mudar nível será necessário reiniciar a partida");
                    restart_btn[1].addEventListener("click", restartGame);
                    back_btn[1].textContent = "VOLTAR";
                    back_btn[1].removeEventListener("click", backToHomePage);
                    back_btn[1].addEventListener("click", closePopup);
                }
                else {
                    changeTheLevel();
                }
            }
        });
    });

    incomplete_answers = level;

    answer = [];
    answerTryCount = 0;

    const rangeInput = document.getElementById('rangeInput');
    letters_quantity = rangeInput.value;
    if (words.length == 0)
        wordsInValue();

    // answer = "FAROL"; 
    for (let i = 0; i < level; i++)
        answer[i] = randomWord();
    answerBoxByLevelCreate();
    answerBoxCreate();
    if (createPossibleLetters)
        possibleLettersCreate();
}

document.addEventListener("keydown", function (event) {
    closePopup();
    if (document.querySelector("#gamePage").style.display != "none") {
        if (event.key != "Backspace")
        backspacePressed = false;
    
    if ((event.keyCode >= 65 && event.keyCode <= 90)) {
            writeLetter(event.key);
        }
        else if (event.key === "ArrowRight") {
            movePosition();
        }
        else if (event.key === "ArrowLeft") {
            movePosition("left");
        }
        else if (event.key === "Backspace") {
            deleteLetter();
        }
        else if (event.key === "Enter") {
            event.preventDefault();
            enterWord();
        }
        else if (event.key == " ") {
            console.log(popup_message.style.top);
        }
        else if (event.key == "ArrowUp") {
            console.log(position);
        }
    }
});

function changeTheLevel() {
    level_boxes.forEach(other_level_box => {
        if (other_level_box !== this) {
            other_level_box.classList.remove("selected");
        }
    });

    current_level_box.classList.add("selected");
    level = current_level_box.querySelector("h3").id;
    isLevelChanged = false;
    restartGame();
}

function answerBoxByLevelCreate() {
    var answers_box = document.querySelector("#answersBox");

    for (let i = 0; i < level; i++) {
        let answer_box = document.createElement("div");
        answer_box.classList.add("answer-box");
        answer_box.setAttribute("id", "answerBox" + i);
        answers_box.appendChild(answer_box);
    }
}

function answerBoxCreate() {
    updateHeaderInformations();
    box_arr = [];
    letters_box_arr = [];
    answerTryCount++;

    var answers_box = document.querySelector("#answersBox");
    var answer_box = answers_box.querySelectorAll(".answer-box");

    answers_box.addEventListener('DOMNodeInserted', () => {
        answers_box.scrollTop = answers_box.scrollHeight;
    });

    for (let i = 0; i < level; i++) {
        if (answer_box[i].classList.contains("correct-answer"))
            continue;
        let each_answer_box = document.createElement("div");
        each_answer_box.classList.add("each-answer-box");
        each_answer_box.setAttribute("id", "answer" + i + "-" + answerTryCount);

        for (let j = 0; j < letters_quantity; j++) {
            let each_box = document.createElement("div");
            each_box.classList.add("each-box");
            each_box.setAttribute("id", "box" + i + "-" + j);

            let letter = document.createElement("h1");
            letter.setAttribute("id", "letter-" + j);

            letters_box_arr.push(letter);
            box_arr.push(each_box);

            each_box.appendChild(letter);
            each_answer_box.appendChild(each_box);
        }

        answer_box[i].appendChild(each_answer_box);
    }

    position = 0;
    selectTheBox(position);

    box_arr.forEach((box) => {
        box.addEventListener("click", function (event) {
            backspacePressed = false;
            if (!box.classList.contains("green-letter-box") && !box.classList.contains("red-letter-box") && !box.classList.contains("yellow-letter-box")) {
                position = box_arr.indexOf(box);
                if (position >= letters_quantity) {
                    let answer_box_position = parseInt(box.parentNode.parentNode.id.replace("answerBox", "")) + 1 - (level - incomplete_answers);
                    position -= (((answer_box_position - 1) * letters_quantity));
                    console.log(position);
                }
                selectTheBox();
            }
        })
    })
}

function possibleLettersCreate() {
    var keyboard = document.querySelector("#keyboard");
    var possible_letters = document.querySelector("#possibleLetters");

    var lineName;
    for (let i = 0; i < 26; i++) {

        let each_letter_box = document.createElement("div");
        each_letter_box.classList.add("each-letter-box");
        each_letter_box.setAttribute("id", "box-" + possible_letters_arr[i]);

        let each_letter = document.createElement("h1");
        each_letter.classList.add("each-letter");
        each_letter.setAttribute("id", "letter-" + possible_letters_arr[i]);
        each_letter.textContent = possible_letters_arr[i];

        if (i == 0)
            lineName = "line-1";
        else if (i == 10)
            lineName = "line-2";
        else if (i == 19)
            lineName = "line-3";

        if (i == 0 || i == 10 || i == 19) {
            var letters_line = document.createElement("div");
            letters_line.classList.add("letters-line");
            letters_line.setAttribute("id", lineName);
        }

        each_letter_box.appendChild(each_letter);
        box_letters_arr.push(each_letter_box);
        letters_line.appendChild(each_letter_box);
        possible_letters.appendChild(letters_line);
    }

    if (!is_game_restarted) {

        var enter_btn = document.querySelector("#enter");
        var backspace_btn = document.querySelector("#backspace");

        enter_btn.addEventListener("click", function (event) {
            console.log("enter");
            enterWord();
        })

        backspace_btn.addEventListener("click", function (event) {
            console.log("clicou\n");
            deleteLetter();
        })

    }

    box_letters_arr.forEach((box) => {
        box.addEventListener("click", function (event) {
            console.log(box)
            let letter_pressed = box.querySelector("h1").textContent;
            writeLetter(letter_pressed);
        })
    })
}
/* ------------------------------ GAMEPLAY FUNCTIONS ----------------- */

var selectedBox = null;
var position = 0;
var backspacePressed = false;
var canMove = true;

function selectTheBox(pos = position) {
    let answer_box = document.querySelectorAll(".answer-box");

    for (i in box_arr) {
        box_arr[i].classList.remove("selectedBox");
    }
    if (pos == -1)
        return;

    if (pos < letters_quantity) {
        for (let i = 0, j = 0; i < incomplete_answers; i++, j += parseInt(letters_quantity)) {

            selectedBox = box_arr[pos + j];
            selectedBox.classList.add("selectedBox");
        }
    }
    else {
        selectedBox = box_arr[pos];
        selectedBox.classList.add("selectedBox");
    }

    //Define selectedBox as the selected in the first column  
    selectedBox = box_arr[pos];
}

function movePosition(direction = "right") {
    if (direction == "right") {
        position++;
        if (position > letters_quantity - 1) {
            position = 0;
        }
    }
    else if (direction == "left") {
        position--;
        if (position < 0) {
            position = letters_quantity - 1;
        }
    }

    selectTheBox();
}

function correctAnswer() {
    updateHeaderInformations();
    let pupup_text;
    if (level == 1)
        pupup_text = "Parabéns! Você acertou a palavra\n" + answer + "\n na tentativa " + answerTryCount + "!!!";
    else
        pupup_text = "Parabéns! Você acertou as palavras\n" + answer + "\n na tentativa " + answerTryCount + "!!!";
    openPopup(pupup_text);
    restart_btn[1].addEventListener("click", restartGame);
    back_btn[1].addEventListener("click", backToHomePage);
}

function writeLetter(letter_pressed) {
    let keyPressed = letter_pressed.toLocaleUpperCase();
    let answer_box = document.querySelectorAll(".answer-box");

    for (let i = 0, j = 0; i < incomplete_answers; i++, j += parseInt(letters_quantity)) {
        selectTheBox(position + j);
        var letter = selectedBox.querySelector("h1");
        letter.textContent = keyPressed;
    }


    let timesMoved = 0;
    do {
        if (canMove) {
            timesMoved++;
            movePosition();
        }
        else
            break;
        if (selectedBox.querySelector("h1").textContent == "") {
            break;
        }
    } while (timesMoved <= letters_quantity);

    if (timesMoved > letters_quantity) {
        if (position != letter.getAttribute("id"))
            movePosition("left");
        canMove = false;
    }

    selectTheBox();
}

function enterWord() {
    let isValid = true;
    let word = '';

    for (let i = 0; i < letters_quantity; i++) {
        if (letters_box_arr[i].textContent != "")
            word += letters_box_arr[i].textContent;
        else {
            isValid = false;
            openMessagePopup("Somente palavras com " + letters_quantity + " letras");
            break;
        }
    }
    if (isValid) {
        if (hasWord(word)) {
            isPlaying = true;
            wordCompare(word);
            selectTheBox(-1);
            canMove = true;
            if (incomplete_answers == 0)
                correctAnswer();
            else {
                answerBoxCreate();
            }
        }
        else {
            openMessagePopup("A palavra " + word + " não existe");
        }
    }
}

function deleteLetter() {
    let answer_box = document.querySelectorAll(".answer-box");
    for (let i = 0, j = 0; i < incomplete_answers; i++, j += parseInt(letters_quantity)) {
        selectTheBox(position + j);
        let letter = selectedBox.querySelector("h1");

        if ((backspacePressed || letter.textContent == "") && position != 0 && i == incomplete_answers - 1)
            movePosition("left");
        letter.textContent = "";
    }
    selectTheBox();
    backspacePressed = true;
    canMove = true;
}

/* -------------------------------- GAME LOGIC FUNCTIONS ------------------- */
function randomWord() {
    let randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
}

function removeAccents(word) {
    const withAccent = 'áàãâéêíóôõúüçÁÀÃÂÉÊÍÓÔÕÚÜÇ';
    const withoutAccent = 'aaaaeeiooouucAAAAEEIOOOUUC';

    const regex = new RegExp(`[${withAccent}]`, 'g');

    return word.replace(regex, match => withoutAccent.charAt(withAccent.indexOf(match)));
}

function wordsInValue() {
    readTextFile("words.txt");
    function readTextFile(file) {
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", file, false);
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                if (rawFile.status === 200 || rawFile.status == 0) {
                    var allWords = rawFile.responseText.split("\n");
                    for (let i = 0; i < allWords.length; i++) {
                        if (allWords[i].length == letters_quantity) {
                            words.push(removeAccents(allWords[i]).toUpperCase());
                        }
                    }
                }
            }
        }
        rawFile.send(null);
    }
}

function hasWord(word) {
    for (let i = 0; i < words.length; i++) {
        if (words[i] == word)
            return true;
    }


    return false;
}

/* ------------------ WORD COMPARE FUNCTIONS --------------------*/

function hasLetter(letter, savedAnswer) {
    for (let i = 0; i < letters_quantity; i++) {
        if (savedAnswer[i] == letter)
            return i;
    }

    return -1;
}

function cleanClassesInLetters(currentLetterInAllLetters) {
    classes = ["green-letter-box", "yellow-letter-box", "red-letter-box"];
    for (let i = 0; i < classes.length; i++)
        currentLetterInAllLetters.classList.remove(classes[i]);
}

function wordCompare(word) {
    let savedAnswer = answer.slice();
    let answer_box = document.querySelectorAll(".answer-box");

    for (let j = 0; j < level; j++) {
        if (answer_box[j].classList.contains("correct-answer"))
            continue;

        for (let i = 0; i < letters_quantity; i++) {
            if (word[i] == savedAnswer[j][i]) {
                let currentAnswer = document.getElementById("answer" + j + "-" + answerTryCount);
                let currentLetter = currentAnswer.querySelector("#box" + j + "-" + i);
                let currentLetterInAllLetters = document.getElementById("box-" + word[i]);

                currentLetter.classList.add("green-letter-box");
                if (currentLetterInAllLetters.classList.contains("yellow-letter-box"))
                    currentLetterInAllLetters.classList.remove("yellow-letter-box");
                currentLetterInAllLetters.classList.add("green-letter-box");
                savedAnswer[j] = savedAnswer[j].split('');
                savedAnswer[j][i] = "#";
                savedAnswer[j] = savedAnswer[j].join('');
            }
        }

        for (let i = 0; i < letters_quantity; i++) {
            let positionLetter = hasLetter(word[i], savedAnswer[j]);
            savedAnswer[j][i] = ".";

            let currentAnswer = document.getElementById("answer" + j + "-" + answerTryCount);
            let currentLetter = currentAnswer.querySelector("#box" + j + "-" + i);
            let currentLetterInAllLetters = document.getElementById("box-" + word[i]);

            if (savedAnswer[j][i] != "#") {
                if (positionLetter != -1) {
                    currentLetter.classList.add("yellow-letter-box");
                    if (!currentLetterInAllLetters.classList.contains("green-letter-box"))
                        currentLetterInAllLetters.classList.add("yellow-letter-box");

                    savedAnswer[j] = savedAnswer[j].split('');
                    savedAnswer[j][positionLetter] = "@";
                    savedAnswer[j] = savedAnswer[j].join('');
                }
                else {
                    currentLetter.classList.add("red-letter-box");
                    if (!currentLetterInAllLetters.classList.contains("green-letter-box") && !currentLetterInAllLetters.classList.contains("yellow-letter-box"))
                        currentLetterInAllLetters.classList.add("red-letter-box");
                }
            }
        }

        if (word == answer[j]) {
            let current_answer_box = document.querySelector("#answerBox" + j);
            current_answer_box.classList.add("correct-answer");
            incomplete_answers--;
        }

    }
}

/* ------------------------- BUTTONS FUNCTIONS ----------------------------------- */

var back_btn = document.querySelectorAll(".back-btn");
var restart_btn = document.querySelectorAll(".restart-btn");
var surrender_btn = document.querySelector(".surrender-btn");

function backToHomePage() {
    window.location.reload();
}
back_btn[0].addEventListener("click", backToHomePage);


function restartGame() {
    console.log("restarted");
    is_game_restarted = true;

    if (isLevelChanged) {
        changeTheLevel();
        return;
    }

    let each_answer_box = document.querySelectorAll(".each-answer-box");
    for (let i = 0; i < each_answer_box.length; i++) {
        each_answer_box[i].remove();
    }

    let answer_box = document.querySelectorAll(".answer-box");
    for (let i = 0; i < answer_box.length; i++) {
        answer_box[i].remove();
    }

    let letters_to_remove = document.querySelectorAll(".letters-line");
    letters_to_remove.forEach(line_to_remove => {
        line_to_remove.remove();
    });

    closePopup();
    gameCreate();
}
restart_btn[0].addEventListener("click", restartGame);

function surrenderGame() {
    console.log("surrender");
    openPopup("A resposta era: " + answer);
    restart_btn[1].addEventListener("click", restartGame);
    back_btn[1].textContent = "MENU PRINCIPAL";
    back_btn[1].addEventListener("click", backToHomePage);
    back_btn[1].removeEventListener("click", closePopup);
}
surrender_btn.addEventListener("click", surrenderGame);

/* -------------------------- POP UPs FUNCTIONS --------------------------- */

var popup_surrender = document.getElementById("popupSurrender");
var popup_message = document.getElementById("popupMessage");

function openPopup(text) {
    popup_surrender.style.display = "block";

    let popup_surrender_text = document.querySelector(".popup-surrender-text");
    popup_surrender_text.textContent = text;
}

function closePopup() {
    popup_surrender.style.display = "none";
    popup_message.style.top = "-100px";
}

function openMessagePopup(text) {
    popup_message.style.top = "0";

    let popup_text = document.getElementById("popup-text");
    popup_text.textContent = text;
}

/* -------------------------- HEADER INSTRUCTIONS --------------------------- */

function updateHeaderInformations() {
    let num_words = document.querySelector(".num-words");
    let num_letters = document.querySelector(".num-letters");
    let num_tries = document.querySelector(".num-tries");

    num_words.textContent = words.length;
    num_letters.textContent = letters_quantity;
    num_tries.textContent = answerTryCount;
}
