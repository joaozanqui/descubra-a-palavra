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
var is_playing = false;
var is_level_changed = false;
var level_boxes = document.querySelectorAll('.level-box');
var current_level_box = document.querySelector(".selected");
var incomplete_answers = level;

// ANSWER
var answer = [];
var answer_try_count;
/* ------------------------- CREATE GAME STRUCTURE -----------------------*/

var box_letters_arr = [];
var box_arr = [];
var letters_box_arr = [];


function gameCreate(createPossibleLetters = true) {
    can_move = true;
    hideHomePage();
    is_playing = false;
    is_level_changed = false;

    level_boxes.forEach(level_box => {
        level_box.addEventListener('click', function () {
            closePopup();

            if (!this.classList.contains("selected")) {

                current_level_box = level_box;
                is_level_changed = true;

                // debugger;   
                if (is_playing) {
                    openPopup("Para mudar nível será necessário reiniciar a partida");
                    restart_btn[0].addEventListener("click", restartGame);
                    back_btn[0].textContent = "VOLTAR";
                    back_btn[0].removeEventListener("click", backToHomePage);
                    back_btn[0].addEventListener("click", closePopup);
                }
                else {
                    changeTheLevel();
                }
            }
        });
    });

    incomplete_answers = level;

    answer = [];
    answer_try_count = 0;

    const rangeInput = document.getElementById('rangeInput');
    letters_quantity = rangeInput.value;
    if (words.length == 0)
        wordsInValue();

    // answer = "FAROL"; 
    for (let current_level = 0; current_level < level; current_level++)
        answer[current_level] = randomWord();
    answerBoxByLevelCreate();
    answerBoxCreate();
    if (createPossibleLetters)
        possibleLettersCreate();
}

document.addEventListener("keydown", function (event) {
    closePopup();
    if (document.querySelector("#gamePage").style.display != "none") {
        if (event.key != "Backspace")
            backspace_pressed = false;

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
            console.log(answer);
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
    is_level_changed = false;
    restartGame();
}

function answerBoxByLevelCreate() {
    var answers_box = document.querySelector("#answersBox");

    for (let current_level = 0; current_level < level; current_level++) {
        let answer_box = document.createElement("div");
        answer_box.classList.add("answer-box");
        answer_box.setAttribute("id", "answerBox" + current_level);
        answers_box.appendChild(answer_box);
    }
}

function answerBoxCreate() {
    updateHeaderInformations();
    box_arr = [];
    letters_box_arr = [];
    answer_try_count++;

    var answers_box = document.querySelector("#answersBox");
    var answer_box = answers_box.querySelectorAll(".answer-box");

    for (let current_level = 0; current_level < level; current_level++) {
        if (answer_box[current_level].classList.contains("correct-answer"))
            continue;
        let each_answer_box = document.createElement("div");
        each_answer_box.classList.add("each-answer-box");
        each_answer_box.setAttribute("id", "answer" + current_level + "-" + answer_try_count);

        for (let i = 0; i < letters_quantity; i++) {
            let each_box = document.createElement("div");
            each_box.classList.add("each-box");
            each_box.classList.add("mobile-level-" + level);
            each_box.setAttribute("id", "box" + current_level + "-" + i);
            if(letters_quantity >= 6) {
                let current_width = each_box.style.width;
                each_box.style.width = (50 - level)/level + "px";
                console.log(each_box);
                console.log(current_width);
            }

            let letter = document.createElement("h1");
            letter.setAttribute("id", "letter-" + i);

            letters_box_arr.push(letter);
            box_arr.push(each_box);

            each_box.appendChild(letter);
            each_answer_box.appendChild(each_box);
        }

        answer_box[current_level].appendChild(each_answer_box);

        
        answers_box.scrollTop = answers_box.scrollHeight;
    }

    position = 0;
    selectTheBox(position);

    box_arr.forEach((box) => {
        box.addEventListener("click", function (event) {
            backspace_pressed = false;
            closePopup();
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

    let line_name;
    for (let i = 0; i < 26; i++) {

        let each_letter_box = document.createElement("div");
        each_letter_box.classList.add("each-letter-box");
        each_letter_box.setAttribute("id", "box-" + possible_letters_arr[i]);

        let each_letter = document.createElement("h1");
        each_letter.classList.add("each-letter");
        each_letter.setAttribute("id", "letter-" + possible_letters_arr[i]);
        each_letter.textContent = possible_letters_arr[i];

        if (i == 0)
            line_name = "line-1";
        else if (i == 10)
            line_name = "line-2";
        else if (i == 19)
            line_name = "line-3";

        if (i == 0 || i == 10 || i == 19) {
            var letters_line = document.createElement("div");
            letters_line.classList.add("letters-line");
            letters_line.setAttribute("id", line_name);
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
            closePopup();
            console.log(box)
            let letter_pressed = box.querySelector("h1").textContent;
            writeLetter(letter_pressed);
        })
    })
}
/* ------------------------------ GAMEPLAY FUNCTIONS ----------------- */

var selected_box = null;
var position = 0;
var backspace_pressed = false;
var can_move = true;

function selectTheBox(pos = position) {
    let answer_box = document.querySelectorAll(".answer-box");

    for (i in box_arr) {
        box_arr[i].classList.remove("selectedBox");
    }
    if (pos == -1)
        return;

    if (pos < letters_quantity) {
        for (let i = 0, j = 0; i < incomplete_answers; i++, j += parseInt(letters_quantity)) {

            selected_box = box_arr[pos + j];
            selected_box.classList.add("selectedBox");
        }
    }
    else {
        selected_box = box_arr[pos];
        selected_box.classList.add("selectedBox");
    }

    //Define selectedBox as the selected in the first column  
    selected_box = box_arr[pos];
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
        pupup_text = "Parabéns! Você acertou a palavra\n" + answer + "\n na tentativa " + answer_try_count + "!!!";
    else
        pupup_text = "Parabéns! Você acertou as palavras\n" + answer + "\n na tentativa " + answer_try_count + "!!!";
    openPopup(pupup_text);
    restart_btn[0].addEventListener("click", restartGame);
    back_btn[0].addEventListener("click", backToHomePage);
}

function writeLetter(letter_pressed) {
    let key_pressed = letter_pressed.toLocaleUpperCase();
    let answer_box = document.querySelectorAll(".answer-box");

    for (let i = 0, j = 0; i < incomplete_answers; i++, j += parseInt(letters_quantity)) {
        selectTheBox(position + j);
        var letter = selected_box.querySelector("h1");
        letter.textContent = key_pressed;
    }


    let times_moved = 0;
    do {
        if (can_move) {
            times_moved++;
            movePosition();
        }
        else
            break;
        if (selected_box.querySelector("h1").textContent == "") {
            break;
        }
    } while (times_moved <= letters_quantity);

    if (times_moved > letters_quantity) {
        if (position != letter.getAttribute("id"))
            movePosition("left");
        can_move = false;
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
            is_playing = true;
            wordCompare(word);
            selectTheBox(-1);
            can_move = true;
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
        let letter = selected_box.querySelector("h1");

        if ((backspace_pressed || letter.textContent == "") && position != 0 && i == incomplete_answers - 1)
            movePosition("left");
        letter.textContent = "";
    }
    selectTheBox();
    backspace_pressed = true;
    can_move = true;
}

/* -------------------------------- GAME LOGIC FUNCTIONS ------------------- */
function randomWord() {
    let random_index = Math.floor(Math.random() * words.length);
    return words[random_index];
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
                    var all_words = rawFile.responseText.split("\n");
                    for (let i = 0; i < all_words.length; i++) {
                        if (all_words[i].length == letters_quantity) {
                            words.push(removeAccents(all_words[i]).toUpperCase());
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

function hasLetter(letter, saved_answer) {
    for (let i = 0; i < letters_quantity; i++) {
        if (saved_answer[i] == letter)
            return i;
    }

    return -1;
}

function cleanClassesInLetters(current_letter_in_all_letters) {
    classes = ["green-letter-box", "yellow-letter-box", "red-letter-box"];
    for (let i = 0; i < classes.length; i++)
        current_letter_in_all_letters.classList.remove(classes[i]);
}

function paintingKeyboard(color, box, levelToPaint) {
    let each_color_size = 100 / level;
    let create = false;
    let colors = box.querySelectorAll("div");

    if (colors.length <= levelToPaint)
        create = true;

    let current_color;
    if (create) {
        current_color = document.createElement("div");
        current_color.setAttribute("id", "box-color-" + levelToPaint);
    }
    else {
        current_color = box.querySelector("#box-color-" + levelToPaint);
    }

    current_color.style.left = (each_color_size * levelToPaint) + "%";
    current_color.style.width = (each_color_size) + "%";

    if (color == "green") {
        if (current_color.classList.contains("yellow-letter-box"))
            current_color.classList.remove("yellow-letter-box");
        current_color.classList.add("green-letter-box");
    }
    else if (color == "yellow") {
        if (!current_color.classList.contains("green-letter-box"))
            current_color.classList.add("yellow-letter-box");
    }
    else if (color == "red") {
        if (!current_color.classList.contains("green-letter-box") && !current_color.classList.contains("yellow-letter-box"))
            current_color.classList.add("red-letter-box");
    }

    if (create) {
        current_color.classList.add("each-color");
        box.appendChild(current_color);
    }
}

function wordCompare(word) {
    let saved_answer = answer.slice();
    let answer_box = document.querySelectorAll(".answer-box");

    for (let current_level = 0; current_level < level; current_level++) {
        if (answer_box[current_level].classList.contains("correct-answer")) {
            for (let i = 0; i < letters_quantity; i++) {
                let current_letter_in_all_letters = document.getElementById("box-" + word[i]);
                paintingKeyboard("red", current_letter_in_all_letters, current_level);
            }

            continue;
        }

        for (let i = 0; i < letters_quantity; i++) {
            if (word[i] == saved_answer[current_level][i]) {
                let current_answer = document.getElementById("answer" + current_level + "-" + answer_try_count);
                let current_letter = current_answer.querySelector("#box" + current_level + "-" + i);
                let current_letter_in_all_letters = document.getElementById("box-" + word[i]);

                current_letter.classList.add("green-letter-box");
                paintingKeyboard("green", current_letter_in_all_letters, current_level);

                saved_answer[current_level] = saved_answer[current_level].split('');
                saved_answer[current_level][i] = "#";
                saved_answer[current_level] = saved_answer[current_level].join('');
            }
        }

        for (let i = 0; i < letters_quantity; i++) {
            let position_letter = hasLetter(word[i], saved_answer[current_level]);
            saved_answer[current_level][i] = ".";

            let current_answer = document.getElementById("answer" + current_level + "-" + answer_try_count);
            let current_letter = current_answer.querySelector("#box" + current_level + "-" + i);
            let current_letter_in_all_letters = document.getElementById("box-" + word[i]);

            if (saved_answer[current_level][i] != "#") {
                if (position_letter != -1) {
                    current_letter.classList.add("yellow-letter-box");
                    paintingKeyboard("yellow", current_letter_in_all_letters, current_level);

                    saved_answer[current_level] = saved_answer[current_level].split('');
                    saved_answer[current_level][position_letter] = "@";
                    saved_answer[current_level] = saved_answer[current_level].join('');
                }
                else {
                    current_letter.classList.add("red-letter-box");
                    paintingKeyboard("red", current_letter_in_all_letters, current_level);
                }
            }
        }

        if (word == answer[current_level]) {
            let current_answer_box = document.querySelector("#answerBox" + current_level);
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
back_btn[1].addEventListener("click", backToHomePage);


function restartGame() {
    console.log("restarted");
    is_game_restarted = true;

    if (is_level_changed) {
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
restart_btn[1].addEventListener("click", restartGame);

function surrenderGame() {
    console.log("surrender");
    openPopup("A resposta era: " + answer);
    restart_btn[0].addEventListener("click", restartGame);
    back_btn[0].textContent = "MENU PRINCIPAL";
    back_btn[0].addEventListener("click", backToHomePage);
    back_btn[0].removeEventListener("click", closePopup);
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

    let popup_text = document.getElementById("popupText");
    popup_text.textContent = text;
}

/* -------------------------- HEADER INSTRUCTIONS --------------------------- */

function updateHeaderInformations() {
    let num_words = document.querySelector(".num-words");
    let num_letters = document.querySelector(".num-letters");
    let num_tries = document.querySelector(".num-tries");

    num_words.textContent = words.length;
    num_letters.textContent = letters_quantity;
    num_tries.textContent = answer_try_count;
}
