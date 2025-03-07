const cells = document.querySelectorAll('.cell');
let currentPlayer = 'x';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let isGameActive = true;

function checkWin() {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            setTimeout(() => alert(`${gameBoard[a].toUpperCase()} wins!`), 100);
            return true;
        }
    }

    return gameBoard.includes('') === false;
}

function aiMove() {
    const availableSpots = gameBoard.reduce((acc, val, idx) => {
        if (val === '') acc.push(idx);
        return acc;
    }, []);
    
    const randomMove = availableSpots[Math.floor(Math.random() * availableSpots.length)];
    gameBoard[randomMove] = 'o';
    cells[randomMove].classList.add('o');
    cells[randomMove].textContent = 'O';
    if (checkWin()) return;
    currentPlayer = 'x';
}

function handleCellClick(e) {
    const index = e.target.dataset.index;
    if (gameBoard[index] || !isGameActive) return;

    gameBoard[index] = currentPlayer;
    e.target.classList.add(currentPlayer);
    e.target.textContent = currentPlayer === 'x' ? 'X' : 'O';

    if (checkWin()) {
        isGameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
    if (currentPlayer === 'o' && document.body.classList.contains('AI')) {
        aiMove();
    }
}

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

document.getElementById('reset').addEventListener('click', () => {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    isGameActive = true;
    currentPlayer = 'x';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
    document.getElementById('result').classList.add('hidden');
});
