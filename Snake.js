// Initialize Game Variables and State
const canvasSize = 400;
const snakeSize = 20;
let snake = [{ x: 160, y: 200 }, { x: 140, y: 200 }, { x: 120, y: 200 }];
let food = { x: 300, y: 200 };
let score = 0;
let dx = snakeSize; // horizontal velocity
let dy = 0; // vertical velocity
let isPaused = true; // Game starts paused

// Create Game Canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Draw Snake and Food
function drawSnakePart(snakePart) {
    ctx.fillStyle = 'lightgreen';
    ctx.strokeStyle = 'blue';
    ctx.fillRect(snakePart.x, snakePart.y, snakeSize, snakeSize);
    ctx.strokeRect(snakePart.x, snakePart.y, snakeSize, snakeSize);
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, snakeSize, snakeSize);
}

// Update Game State
function update() {
    // Move the snake
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    // Check if the snake has eaten food
    if (snake[0].x === food.x && snake[0].y === food.y) {
        score += 10;
        // Generate new food location
        food.x = Math.floor(Math.random() * (canvasSize / snakeSize)) * snakeSize;
        food.y = Math.floor(Math.random() * (canvasSize / snakeSize)) * snakeSize;
    } else {
        snake.pop();
    }
}

// Handle Boundary Collision
function checkCollision() {
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > canvasSize - snakeSize;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > canvasSize - snakeSize;

    if (hitLeftWall || hitRightWall || hitTopWall || hitBottomWall) {
        // Reset the game
        alert("Game Over!");
        onGameOver(prompt("Enter your name:"), score);
        snake = [{ x: 160, y: 200 }, { x: 140, y: 200 }, { x: 120, y: 200 }];
        score = 0;
        dx = snakeSize;
        dy = 0;
        isPaused = true; // Pause the game
    }
}

// Game Loop
function gameLoop() {
    if (!isPaused) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawFood();
        update();
        drawSnake();
        checkCollision();
    }
    setTimeout(gameLoop, 100); // Call gameLoop again
}
gameLoop(); // Start the game loop but paused

// Handle Keyboard Input
function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    const SPACE_KEY = 32;

    const keyPressed = event.keyCode;
    const goingUp = dy === -snakeSize;
    const goingDown = dy === snakeSize;
    const goingRight = dx === snakeSize;
    const goingLeft = dx === -snakeSize;

    if (keyPressed === SPACE_KEY) {
        isPaused = !isPaused; // Toggle pause/play
    }

    if (!isPaused) {
        if (keyPressed === LEFT_KEY && !goingRight) {
            dx = -snakeSize;
            dy = 0;
        }
        if (keyPressed === UP_KEY && !goingDown) {
            dx = 0;
            dy = -snakeSize;
        }
        if (keyPressed === RIGHT_KEY && !goingLeft) {
            dx = snakeSize;
            dy = 0;
        }
        if (keyPressed === DOWN_KEY && !goingUp) {
            dx = 0;
            dy = snakeSize;
        }
    }
}
document.addEventListener("keydown", changeDirection);

// Implement Leaderboard with Local Storage
if (!localStorage.getItem('leaderboard')) {
    localStorage.setItem('leaderboard', JSON.stringify([]));
}
let leaderboard = JSON.parse(localStorage.getItem('leaderboard'));

function updateLeaderboard(playerName, score) {
    leaderboard.push({ name: playerName, score: score });
    leaderboard.sort((a, b) => b.score - a.score);
    if (leaderboard.length > 10) { // Assuming top 10 scores are stored
        leaderboard.pop();
    }
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

function displayLeaderboard() {
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard'));
    let leaderboardElement = document.getElementById('leaderboard');
    leaderboardElement.innerHTML = ''; // Clear previous entries
    leaderboard.forEach(entry => {
        let entryElement = document.createElement('div');
        entryElement.textContent = `${entry.name}: ${entry.score}`;
        leaderboardElement.appendChild(entryElement);
    });
}

// Assuming game over logic is in place
function onGameOver(playerName, score) {
    updateLeaderboard(playerName, score);
    displayLeaderboard();
}
displayLeaderboard(); // Display leaderboard on game load
