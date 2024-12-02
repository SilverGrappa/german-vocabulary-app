// Recupera le parole salvate da LocalStorage all'avvio
const wordList = JSON.parse(localStorage.getItem("wordList")) || {};

// Elementi HTML
const addWordsSection = document.getElementById("addWordsSection");
const quizSection = document.getElementById("quizSection");
const wordInput = document.getElementById("wordInput");
const translationInput = document.getElementById("translationInput");
const addWordButton = document.getElementById("addWordButton");
const startQuizButton = document.getElementById("startQuizButton");
const quizWord = document.getElementById("quizWord");
const answerInput = document.getElementById("answerInput");
const checkAnswerButton = document.getElementById("checkAnswerButton");
const feedback = document.getElementById("feedback");

let currentWord = null;
let score = 0;
let attempts = 0;

// Aggiungi una parola e la sua traduzione
addWordButton.addEventListener("click", () => {
    const word = wordInput.value.trim();
    const translation = translationInput.value.trim();

    if (word && translation) {
        wordList[word] = translation;
        saveToLocalStorage();
        wordInput.value = "";
        translationInput.value = "";
        alert(`Word "${word}" added with translation "${translation}"!`);
    } else {
        alert("Please, add word and translation.");
    }
});

// Avvia il quiz
startQuizButton.addEventListener("click", () => {
    if (Object.keys(wordList).length === 0) {
        alert("Add words before the quiz!");
        return;
    }

    addWordsSection.classList.add("hidden");
    quizSection.classList.remove("hidden");
    loadNextWord();
});

// Carica una parola casuale per il quiz
function loadNextWord() {
    const words = Object.keys(wordList);
    currentWord = words[Math.floor(Math.random() * words.length)];
    quizWord.textContent = `Translate: ${currentWord}`;
    answerInput.value = "";
    feedback.textContent = "";
}

// Controlla la risposta dell'utente
checkAnswerButton.addEventListener("click", () => {
    const userAnswer = answerInput.value.trim();

    if (userAnswer.toLowerCase() === wordList[currentWord].toLowerCase()) {
        feedback.textContent = `Right! The translation is "${wordList[currentWord]}"`;
        feedback.style.color = "green";
        score++;
    } else {
        feedback.textContent = `Wrong! The translation is "${wordList[currentWord]}"`;
        feedback.style.color = "red";
    }

    attempts++;
    if (attempts >= Object.keys(wordList).length) {
        feedback.textContent += `\nQuiz ended! Score: ${score}/${Object.keys(wordList).length}`;
        checkAnswerButton.disabled = true;
    } else {
        setTimeout(loadNextWord, 2000); // Carica la prossima parola dopo 2 secondi
    }
});

// Salva le parole in LocalStorage
function saveToLocalStorage() {
    localStorage.setItem("wordList", JSON.stringify(wordList));
}

// Funzione opzionale per reimpostare i dati (aggiungi un pulsante nel tuo HTML se serve)
function clearLocalStorage() {
    localStorage.clear();
    alert("All your words have been deleted!");
    location.reload(); // Ricarica la pagina
}
