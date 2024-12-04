// Recupera le parole salvate da LocalStorage all'avvio
const wordList = JSON.parse(localStorage.getItem("wordList")) || {};
// Elementi HTML per esportazione/importazione
const exportButton = document.getElementById("exportButton");
const importFileInput = document.getElementById("importFileInput");
const importButton = document.getElementById("importButton");

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
const exitQuizButton = document.getElementById("exitQuizButton");
const startReverseQuizButton = document.getElementById("startReverseQuizButton");
let isReverseQuiz = false;

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

// Funzione per uscire dal quiz
exitQuizButton.addEventListener("click", () => {
    quizSection.classList.add("hidden"); // Nasconde la sezione del quiz
    addWordsSection.classList.remove("hidden"); // Mostra la schermata principale
    resetQuiz(); // Reimposta il quiz
});

// Funzione per resettare il quiz
function resetQuiz() {
    currentWord = null;
    score = 0;
    attempts = 0;
    feedback.textContent = "";
    checkAnswerButton.disabled = false;
}

// Avvia il quiz inverso
startReverseQuizButton.addEventListener("click", () => {
    if (Object.keys(wordList).length === 0) {
        alert("Aggiungi almeno una parola per iniziare il quiz!");
        return;
    }

    isReverseQuiz = true;
    addWordsSection.classList.add("hidden");
    quizSection.classList.remove("hidden");
    loadNextWord();
});

// Modifica la funzione per caricare le parole in base alla modalità
function loadNextWord() {
    const words = Object.keys(wordList);
    currentWord = words[Math.floor(Math.random() * words.length)];

    if (isReverseQuiz) {
        quizWord.textContent = `Traduzione: ${wordList[currentWord]}`;
    } else {
        quizWord.textContent = `Traduci: ${currentWord}`;
    }

    answerInput.value = "";
    feedback.textContent = "";
}

// Modifica la funzione di verifica della risposta
checkAnswerButton.addEventListener("click", () => {
    const userAnswer = answerInput.value.trim();

    const correctAnswer = isReverseQuiz
        ? currentWord
        : wordList[currentWord];

    if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
        feedback.textContent = `Corretto! La risposta è "${correctAnswer}"`;
        feedback.style.color = "green";
        score++;
    } else {
        feedback.textContent = `Sbagliato! La risposta corretta è "${correctAnswer}"`;
        feedback.style.color = "red";
    }

    attempts++;
    if (attempts >= Object.keys(wordList).length) {
        feedback.textContent += `\nQuiz terminato! Punteggio: ${score}/${Object.keys(wordList).length}`;
        checkAnswerButton.disabled = true;
    } else {
        setTimeout(loadNextWord, 2000); // Carica la prossima parola dopo 2 secondi
    }
});

// Reimposta la modalità quiz quando si esce
exitQuizButton.addEventListener("click", () => {
    quizSection.classList.add("hidden");
    addWordsSection.classList.remove("hidden");
    resetQuiz();
    isReverseQuiz = false; // Torna alla modalità normale
});

// Salva le parole in LocalStorage
function saveToLocalStorage() {
    localStorage.setItem("wordList", JSON.stringify(wordList));
}

// Funzione per esportare le parole in un file JSON
exportButton.addEventListener("click", () => {
    const data = JSON.stringify(wordList, null, 2); // Converte l'oggetto wordList in JSON
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "wordList.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// Funzione per importare parole da un file JSON
importButton.addEventListener("click", () => {
    const file = importFileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                Object.assign(wordList, importedData); // Unisce i dati importati a quelli esistenti
                saveToLocalStorage();
                alert("Words successfully imported!");
            } catch (error) {
                alert("Error: invalid file(should be a json!).");
            }
        };
        reader.readAsText(file);
    } else {
        alert("Select a file.");
    }
});

// Funzione opzionale per reimpostare i dati (aggiungi un pulsante nel tuo HTML se serve)
function clearLocalStorage() {
    localStorage.clear();
    alert("All your words have been deleted!");
    location.reload(); // Ricarica la pagina
}
