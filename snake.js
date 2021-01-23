const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
const blockSize = 10;
const widthInBlocks = width / blockSize;
const heightInBlocks = height / blockSize;
var word = ["р", "и", "с", "о", "в", "а", "н", "и", "е"];
var eatenWord = "";
var colors = ["Red", "Orange", "Yellow", "Green", "Blue", "Purple", "Lime"];
let i = 0;
var PickColor = function (colors) {
  return colors[Math.floor(Math.random() * colors.length)];
};
var PickWord = function (word, i) {
  for (i; i < word.length; i++) {
    return word[i];
  }
};
const directions = {
  37: "left",
  38: "up",
  39: "right",
  40: "down",
};

let intervalId;

class Block {
  constructor(col = 0, row = 0) {
    this.col = col;
    this.row = row;
  }

  drawSquare(color) {
    let x = this.col * blockSize;
    let y = this.row * blockSize;
    context.fillStyle = color;
    context.fillRect(x, y, blockSize, blockSize);
  }

  drawCircle(color, letter) {
    let centerX = this.col * blockSize + blockSize / 2;
    let centerY = this.row * blockSize + blockSize / 2;
    context.fillStyle = color;
    this.circle(centerX, centerY, blockSize / 1.25, true);
    context.font = "12px Courier";
    context.fillStyle = "Black";
    context.fillText(
      letter,
      this.col * blockSize + blockSize / 7,
      this.row * blockSize + blockSize / 8
    );
  }

  circle(x, y, radius, fillCircle = true) {
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    if (fillCircle) {
      context.fill();
    } else {
      context.stroke();
    }
  }

  equal(otherBlock) {
    return this.col === otherBlock.col && this.row === otherBlock.row;
  }
}

class Apple {
  constructor() {
    this.block = new Block(10, 10);
    this.color = PickColor(colors);
    this.letter = PickWord(word, 0);
  }

  draw() {
    this.block.drawCircle(this.color, this.letter);
  }

  move() {
    const randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
    const randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
    this.block = new Block(randomCol, randomRow);
    this.color = PickColor(colors);
    this.letter = PickWord(word, 1);
  }
}

class Snake {
  constructor() {
    this.segments = [new Block(7, 5), new Block(6, 5), new Block(5, 5)];
    this.direction = "right";
    this.nextDirection = "right";
    this.color = PickColor(colors);
    this.letter = "";
  }
  draw = function () {
    for (var i = 0; i < this.segments.length; i++) {
      this.segments[i].drawSquare(this.color);
    }
  };
  move = function (apple, game) {
    let head = this.segments[0];
    let newHead;
    this.direction = this.nextDirection;

    if (this.direction === "right") {
      newHead = new Block(head.col + 1, head.row);
    } else if (this.direction === "down") {
      newHead = new Block(head.col, head.row + 1);
    } else if (this.direction === "left") {
      newHead = new Block(head.col - 1, head.row);
    } else if (this.direction === "up") {
      newHead = new Block(head.col, head.row - 1);
    }

    if (this.checkCollision(newHead)) {
      game.gameOver();
      return;
    }

    this.segments.unshift(newHead);

    if (newHead.equal(apple.block)) {
      game.score++;
      eatenWord += apple.letter;
      console.log(eatenWord);
      this.color = apple.color;
      this.letter = apple.letter;
      apple.move();
    } else {
      this.segments.pop();
    }
  };

  checkCollision = function (head) {
    let leftCollision = head.col === 0;
    let topCollision = head.row === 0;
    let rightCollision = head.col === widthInBlocks - 1;
    let bottomCollision = head.row === heightInBlocks - 1;
    let wallCollision =
      leftCollision || topCollision || rightCollision || bottomCollision;
    let selfCollision = false;
    for (let i = 0; i < this.segments.length; i++) {
      if (head.equal(this.segments[i])) {
        selfCollision = true;
      }
    }
    return wallCollision || selfCollision;
  };

  setDirection = function (newDirection) {
    if (this.direction === "up" && newDirection === "down") {
      return;
    } else if (this.direction === "right" && newDirection === "left") {
      return;
    } else if (this.direction === "down" && newDirection === "up") {
      return;
    } else if (this.direction === "left" && newDirection === "right") {
      return;
    }
    this.nextDirection = newDirection;
  };
}

class Game {
  intervalId;
  constructor() {
    this.score = 0;
    this.apple = new Apple();
    this.snake = new Snake();
  }

  drawBorder = function () {
    context.fillStyle = "Gray";
    context.fillRect(0, 0, width, blockSize);
    context.fillRect(0, height - blockSize, width, blockSize);
    context.fillRect(0, 0, blockSize, height);
    context.fillRect(width - blockSize, 0, blockSize, height);
  };

  drawScore = function () {
    context.font = "20px Courier";
    context.fillStyle = "Black";
    context.textAlign = "left";
    context.textBaseline = "top";
    context.fillText("Счет: " + this.score, blockSize, blockSize);
  };

  gameOver = function () {
    clearInterval(this.intervalId);
    context.font = "60px Courier";
    context.fillStyle = "Black";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("Game over!", width / 2, height / 2);
  };

  go = function () {
    context.clearRect(0, 0, canvas.width, canvas.height);
    this.drawScore();
    this.snake.move(this.apple, this);
    this.snake.draw();
    this.apple.draw();
    this.drawBorder();
  };

  start = function () {
    this.intervalId = setInterval(this.go.bind(this), 200);
    // Задаем обработчик события keydown
    addEventListener("keydown", (event) => {
      let newDirection = directions[event.keyCode];
      if (newDirection !== undefined) {
        this.snake.setDirection(newDirection);
      }
    });
  };
}

let game = new Game();
game.start();
// let sampleBlock = new Block(5, 5);
// sampleBlock.drawCircle();

// let apple = new Apple();
// apple.move();
// apple.draw();


