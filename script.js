const app = document.getElementById("app");
let boardSize = 4;
let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let playerTurn = 1;
let score = { 1: 0, 2: 0 };
let moves = 0;

const imagePaths = [
    'obr1.jpg', 'obr2.jpg', 'obr3.jpg', 'obr4.jpg',
    'obr5.jpg', 'obr6.jpg', 'obr7.jpg', 'obr8.jpg'
];


function initGame() {
    app.innerHTML = "";  

    const board = document.createElement("div");
    board.classList.add("board");
    board.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
    app.appendChild(board);

    const images = [...imagePaths.slice(0, boardSize * boardSize / 2), ...imagePaths.slice(0, boardSize * boardSize / 2)]
                    .sort(() => 0.5 - Math.random());

    cards = images.map(src => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `<img src="${src}" style="display: none;">`;  // Vytvoří obrázek přímo přes innerHTML
        card.addEventListener("click", flipCard);
        board.appendChild(card);
        return card;
    });

    updateScore();
}



function flipCard() {
    if (lockBoard || this === firstCard || this.classList.contains("matched")) return;
    const img = this.querySelector("img");
    img.style.display = "block";
    this.classList.add("flipped");

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;
    moves++;

    match();
}


function match() {
    const firstImg = firstCard.querySelector("img");
    const secondImg = secondCard.querySelector("img");

    if (firstImg.src === secondImg.src) {
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");
        score[playerTurn]++;
        updateScore(); 
        resetBoard();  
        if (GameOver()) {
            setTimeout(() => {
                alert(`Hra skončila! Skóre:\nHráč 1: ${score[1]}, Hráč 2: ${score[2]}`);
            }, 300);
        }
    } else {
        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            firstImg.style.display = "none";
            secondImg.style.display = "none";
            
            resetBoard(); 
            
            playerTurn = playerTurn === 1 ? 2 : 1;
        }, 1000);
    }
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}


function GameOver() {
    return cards.every(card => card.classList.contains("matched"));
}


function updateScore() {
    document.getElementById("score")?.remove();
    const scoreBoard = document.createElement("div");
    scoreBoard.id = "score";
    scoreBoard.innerHTML = `<p>Hráč 1: ${score[1]} | Hráč 2: ${score[2]} | Tahy: ${moves}</p>`;
    app.prepend(scoreBoard);
}


function RestartButton() {
    const restartButton = document.createElement("button");
    restartButton.textContent = "Restartovat";
    restartButton.addEventListener("click", () => {
        score = { 1: 0, 2: 0 };
        moves = 0;
        playerTurn = 1;
        initGame();
    });
    app.appendChild(restartButton);
}
function velikostPole() {
    const sizeSelector = document.createElement("select");
    sizeSelector.id = "sizeSelector";

    [2, 4, 6].forEach(size => {
        const option = document.createElement("option");
        option.value = size;
        option.textContent = `${size} x ${size}`;
        if (size === boardSize) option.selected = true;
        sizeSelector.appendChild(option);
    });

    sizeSelector.addEventListener("change", (e) => {
        boardSize = parseInt(e.target.value);
        score = { 1: 0, 2: 0 };
        moves = 0;
        playerTurn = 1;
        initGame();
    });

    app.prepend(sizeSelector);
}

initGame();
RestartButton();
velikostPole();
