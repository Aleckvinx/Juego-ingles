const sentences = [
    "My brother is __ than me.",
    "She is __ than her friends.",
    "This game is __ than the last one.",
    "I am __ than him at math.",
    "He is __ than anyone I know.",
    "My sister is __ than me."
];
const adjectives = ["taller", "shorter", "better", "worse", "smarter", "weaker"];
let cards, flippedCards, matchedPairs, timer, timeLeft;
const timerDisplay = document.getElementById("timer");
const messageDisplay = document.getElementById("message");

function startGame() {
    timeLeft = 180; // 3 minutes in seconds
    flippedCards = [];
    matchedPairs = 0;
    messageDisplay.textContent = "";
    generateCards();
    startTimer();
}

function generateCards() {
    const cardGrid = document.querySelector(".card-grid");
    cardGrid.innerHTML = "";
    const cardContent = [...sentences, ...adjectives].sort(() => Math.random() - 0.5);
    cardContent.forEach((content, index) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.content = content;
        card.innerHTML = `<span class="card-text">${content}</span>`;
        card.addEventListener("click", () => flipCard(card));
        cardGrid.appendChild(card);
    });
    cards = document.querySelectorAll(".card");
}

function flipCard(card) {
    if (flippedCards.length === 2 || card.classList.contains("flipped")) return;
    card.classList.add("flipped");
    flippedCards.push(card);
    if (flippedCards.length === 2) checkMatch();
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const isSentence = sentences.includes(card1.dataset.content);
    const isAdjective = adjectives.includes(card2.dataset.content);

    if ((isSentence && isAdjective || isAdjective && isSentence) &&
        matches(card1.dataset.content, card2.dataset.content)) {
        matchedPairs++;
        flippedCards = [];
        if (matchedPairs === sentences.length) endGame(true);
    } else {
        setTimeout(() => {
            card1.classList.remove("flipped");
            card2.classList.remove("flipped");
            flippedCards = [];
        }, 1000);
    }
}

function matches(sentence, adjective) {
    const index = sentences.indexOf(sentence);
    return adjectives[index] === adjective;
}

function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `Time Left: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
        if (timeLeft === 0) endGame(false);
    }, 1000);
}

function endGame(win) {
    clearInterval(timer);
    messageDisplay.textContent = win ? "You won! Great job!" : "Time's up! You lost.";
    cards.forEach(card => card.classList.add("flipped"));
}

startGame();
function generateCards() {
    const cardGrid = document.querySelector(".card-grid");
    cardGrid.innerHTML = ""; // Limpia el contenido anterior, si lo hay

    // Mezcla el contenido de las tarjetas y verifica la mezcla
    const cardContent = [...sentences, ...adjectives].sort(() => Math.random() - 0.5);
    console.log("Card content:", cardContent); // Verifica que se está generando el contenido

    // Genera y muestra las tarjetas
    cardContent.forEach((content, index) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.content = content;
        card.innerHTML = `<span class="card-text">${content}</span>`;
        card.addEventListener("click", () => flipCard(card));
        cardGrid.appendChild(card);
    });

    cards = document.querySelectorAll(".card");
    console.log("Cards generated:", cards); // Verifica que se están generando las tarjetas
}

// Llama a la función de inicio del juego al cargar la página
document.addEventListener("DOMContentLoaded", startGame);
