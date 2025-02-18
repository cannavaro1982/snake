// 游戏配置
const config = {
    gridSize: 20,
    gameSpeed: 100,
    initialSnakeLength: 3
};

// 游戏状态
let snake = [];
let food = null;
let direction = 'right';
let nextDirection = 'right';
let score = 0;
let highScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;
let gameLoop = null;

// 获取Canvas上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridWidth = canvas.width / config.gridSize;
const gridHeight = canvas.height / config.gridSize;

// 初始化游戏
function initGame() {
    // 初始化蛇
    snake = [];
    for (let i = config.initialSnakeLength - 1; i >= 0; i--) {
        snake.push({x: i, y: 0});
    }
    
    // 生成第一个食物
    generateFood();
    
    // 重置分数
    score = 0;
    updateScore();
    
    // 重置方向
    direction = 'right';
    nextDirection = 'right';
    
    // 开始游戏循环
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(gameStep, config.gameSpeed);
}

// 生成食物
function generateFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * gridWidth),
            y: Math.floor(Math.random() * gridHeight)
        };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    food = newFood;
}

// 更新分数
function updateScore() {
    document.getElementById('scoreValue').textContent = score;
    document.getElementById('finalScore').textContent = score;
    document.getElementById('highScore').textContent = highScore;
    // 更新最高分
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        document.getElementById('highScore').textContent = highScore;
    }
}

// 游戏步骤
function gameStep() {
    direction = nextDirection;
    
    // 计算新的蛇头位置
    const head = {...snake[0]};
    switch(direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }
    
    // 检查碰撞
    if (isCollision(head)) {
        gameOver();
        return;
    }
    
    // 移动蛇
    snake.unshift(head);
    
    // 检查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        updateScore();
        generateFood();
    } else {
        snake.pop();
    }
    
    // 绘制游戏状态
    drawGame();
}

// 碰撞检测
function isCollision(head) {
    // 检查墙壁碰撞
    if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) {
        return true;
    }
    
    // 检查自身碰撞
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
}

// 绘制游戏
function drawGame() {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制蛇
    snake.forEach((segment, index) => {
        // 计算彩虹色
        const hue = (index * 25) % 360;
        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
        
        // 绘制圆形蛇身
        const x = segment.x * config.gridSize + config.gridSize/2;
        const y = segment.y * config.gridSize + config.gridSize/2;
        const radius = (config.gridSize - 2) / 2;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // 添加高光效果
        const gradient = ctx.createRadialGradient(x - radius/3, y - radius/3, 0, x, y, radius);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
        gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // 绘制蛇头的眼睛
        if (index === 0) {
            ctx.fillStyle = '#000';
            const eyeSize = config.gridSize / 8;
            const eyeOffset = config.gridSize / 4;
            
            // 根据方向绘制眼睛
            let eyeX1, eyeY1, eyeX2, eyeY2;
            switch(direction) {
                case 'right':
                    eyeX1 = eyeX2 = segment.x * config.gridSize + config.gridSize * 3/4;
                    eyeY1 = segment.y * config.gridSize + eyeOffset;
                    eyeY2 = segment.y * config.gridSize + config.gridSize - eyeOffset;
                    break;
                case 'left':
                    eyeX1 = eyeX2 = segment.x * config.gridSize + config.gridSize/4;
                    eyeY1 = segment.y * config.gridSize + eyeOffset;
                    eyeY2 = segment.y * config.gridSize + config.gridSize - eyeOffset;
                    break;
                case 'up':
                    eyeY1 = eyeY2 = segment.y * config.gridSize + config.gridSize/4;
                    eyeX1 = segment.x * config.gridSize + eyeOffset;
                    eyeX2 = segment.x * config.gridSize + config.gridSize - eyeOffset;
                    break;
                case 'down':
                    eyeY1 = eyeY2 = segment.y * config.gridSize + config.gridSize * 3/4;
                    eyeX1 = segment.x * config.gridSize + eyeOffset;
                    eyeX2 = segment.x * config.gridSize + config.gridSize - eyeOffset;
                    break;
            }
            
            ctx.beginPath();
            ctx.arc(eyeX1, eyeY1, eyeSize, 0, Math.PI * 2);
            ctx.arc(eyeX2, eyeY2, eyeSize, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#4CAF50';
        }
        
        // 绘制蛇头的眼睛
        if (index === 0) {
            ctx.fillStyle = '#000';
            const eyeSize = config.gridSize / 8;
            const eyeOffset = config.gridSize / 4;
            
            // 根据方向绘制眼睛
            let eyeX1, eyeY1, eyeX2, eyeY2;
            switch(direction) {
                case 'right':
                    eyeX1 = eyeX2 = segment.x * config.gridSize + config.gridSize * 3/4;
                    eyeY1 = segment.y * config.gridSize + eyeOffset;
                    eyeY2 = segment.y * config.gridSize + config.gridSize - eyeOffset;
                    break;
                case 'left':
                    eyeX1 = eyeX2 = segment.x * config.gridSize + config.gridSize/4;
                    eyeY1 = segment.y * config.gridSize + eyeOffset;
                    eyeY2 = segment.y * config.gridSize + config.gridSize - eyeOffset;
                    break;
                case 'up':
                    eyeY1 = eyeY2 = segment.y * config.gridSize + config.gridSize/4;
                    eyeX1 = segment.x * config.gridSize + eyeOffset;
                    eyeX2 = segment.x * config.gridSize + config.gridSize - eyeOffset;
                    break;
                case 'down':
                    eyeY1 = eyeY2 = segment.y * config.gridSize + config.gridSize * 3/4;
                    eyeX1 = segment.x * config.gridSize + eyeOffset;
                    eyeX2 = segment.x * config.gridSize + config.gridSize - eyeOffset;
                    break;
            }
            
            ctx.beginPath();
            ctx.arc(eyeX1, eyeY1, eyeSize, 0, Math.PI * 2);
            ctx.arc(eyeX2, eyeY2, eyeSize, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#4CAF50';
        }
        
        // 绘制蛇头的眼睛
        if (index === 0) {
            ctx.fillStyle = '#000';
            const eyeSize = config.gridSize / 8;
            const eyeOffset = config.gridSize / 4;
            
            // 根据方向绘制眼睛
            let eyeX1, eyeY1, eyeX2, eyeY2;
            switch(direction) {
                case 'right':
                    eyeX1 = eyeX2 = segment.x * config.gridSize + config.gridSize * 3/4;
                    eyeY1 = segment.y * config.gridSize + eyeOffset;
                    eyeY2 = segment.y * config.gridSize + config.gridSize - eyeOffset;
                    break;
                case 'left':
                    eyeX1 = eyeX2 = segment.x * config.gridSize + config.gridSize/4;
                    eyeY1 = segment.y * config.gridSize + eyeOffset;
                    eyeY2 = segment.y * config.gridSize + config.gridSize - eyeOffset;
                    break;
                case 'up':
                    eyeY1 = eyeY2 = segment.y * config.gridSize + config.gridSize/4;
                    eyeX1 = segment.x * config.gridSize + eyeOffset;
                    eyeX2 = segment.x * config.gridSize + config.gridSize - eyeOffset;
                    break;
                case 'down':
                    eyeY1 = eyeY2 = segment.y * config.gridSize + config.gridSize * 3/4;
                    eyeX1 = segment.x * config.gridSize + eyeOffset;
                    eyeX2 = segment.x * config.gridSize + config.gridSize - eyeOffset;
                    break;
            }
            
            ctx.beginPath();
            ctx.arc(eyeX1, eyeY1, eyeSize, 0, Math.PI * 2);
            ctx.arc(eyeX2, eyeY2, eyeSize, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#4CAF50';
        }
    });
    
    // 绘制食物
    const foodX = food.x * config.gridSize + config.gridSize/2;
    const foodY = food.y * config.gridSize + config.gridSize/2;
    const foodRadius = config.gridSize/2 - 1;
    
    // 创建食物的渐变色，使用下一个蛇身的颜色
    const nextHue = (snake.length * 25) % 360;
    const foodGradient = ctx.createRadialGradient(
        foodX, foodY, 0,
        foodX, foodY, foodRadius
    );
    foodGradient.addColorStop(0, `hsl(${nextHue}, 100%, 60%)`);
    foodGradient.addColorStop(1, `hsl(${nextHue}, 100%, 45%)`);
    
    // 绘制食物主体
    ctx.fillStyle = foodGradient;
    ctx.beginPath();
    ctx.arc(foodX, foodY, foodRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // 添加高光效果
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(foodX - foodRadius/3, foodY - foodRadius/3, foodRadius/4, 0, Math.PI * 2);
    ctx.fill();
}

// 游戏结束
function gameOver() {
    clearInterval(gameLoop);
    document.getElementById('gameOver').style.display = 'block';
}

// 重新开始游戏
function restartGame() {
    document.getElementById('gameOver').style.display = 'none';
    initGame();
}

// 键盘控制
document.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'ArrowUp':
            if (direction !== 'down') nextDirection = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') nextDirection = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') nextDirection = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') nextDirection = 'right';
            break;
        case ' ':
        case 'Enter':
            if (document.getElementById('gameOver').style.display === 'block') {
                restartGame();
            }
            break;
    }
});

// 开始游戏
initGame();