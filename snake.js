const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
var score = 0;
const blockSize = 20;
const widthInBlocks = width / blockSize;
const heightInBlocks = height / blockSize;
var words = ["рисование", "воображение", "иллюстрация", "прокрастинация"];
var colors = ["Red", "Orange", "Yellow", "Green", "Blue", "Purple", "Lime"];
var PickRandom = function (colors) {
  return colors[Math.floor(Math.random() * colors.length)];
};
// var PickWord = function (words) {
//    let w = words[Math.floor(Math.random() * words.length)];
//    //let w_next  = w.split("");
//    return w;
//   // number++;
// };
var eatenWord = ""; 
var word = PickRandom(words);

drawBorder = function () {
    context.fillStyle = "Gray";
    context.fillRect(0, 0, width, blockSize);
    context.fillRect(0, height - blockSize, width, blockSize);
    context.fillRect(0, 0, blockSize, height);
    context.fillRect(width - blockSize, 0, blockSize, height);
  };

  var drawScore = function () {
    context.font = "20px Courier";
    context.fillStyle = "Black";
    context.textAlign = "left";
    context.textBaseline = "top";
    context.fillText("Счет: " + score, blockSize, blockSize);
    context.fillText(eatenWord, blockSize, 3 * blockSize);
  };

  var gameOver = function () {
    clearInterval(this.intervalId);
    context.font = "60px Courier";
    context.fillStyle = "Black";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("Game over!", width / 2, height / 2);
    drawScore();//
  };

  var circle = function(x, y, radius, fillCircle = true) {
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    if (fillCircle) {
      context.fill();
    } else {
      context.stroke();
    }
  };

  const directions = {
  37: "left",
  38: "up",
  39: "right",
  40: "down",
  }; 
      addEventListener("keydown", function (event) {
        var newDirection = directions[event.keyCode];
        if (newDirection !== undefined) {
          snake.setDirection(newDirection);
        }
      });  

class Block {
  constructor(col , row) {
    this.col = col;
    this.row = row;
  }

  drawSquare(color, letter) {
    let x = this.col * blockSize;
    let y = this.row * blockSize;
    context.fillStyle = color;
    context.fillRect(x, y, blockSize, blockSize);
    context.font = "12px Courier";
        context.fillStyle = "Black";
        context.fillText(
          letter,
          this.col * blockSize + blockSize / 3,
          this.row * blockSize + blockSize / 4
        );
  }

  drawCircle(color, letter) {
    let centerX = this.col * blockSize + blockSize / 2;
    let centerY = this.row * blockSize + blockSize / 2;
    context.fillStyle = color;
    circle(centerX, centerY, blockSize / 2, true);
    context.font = "12px Courier";
    context.fillStyle = "Black";
    context.fillText(
      letter,
      this.col * blockSize + blockSize / 3,
      this.row * blockSize + blockSize / 4
    );
  }

  equal(otherBlock) {
    return this.col === otherBlock.col && this.row === otherBlock.row;
  }
}

var sampleBlock = new Block(10, 5);

class Snake {
  constructor() {
    this.segments = [new Block(7, 5)];//, new Block(6, 5), new Block(5, 5)
    this.direction = "right";
    this.nextDirection = "right";
    this.color = PickRandom(colors);
    this.letters = ["!"];
  }
  draw = function () {
    for (var i = 0; i < this.segments.length; i++) {
       this.segments[i].drawSquare(this.color, this.letters[i]);
    }
  };
  move = function () {
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
      score++;
      eatenWord += apple.letter;
      this.color = apple.color;
      this.letters.push(apple.letter);
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

class Apple {
  constructor(word) {
    this.block = new Block(10, 10);
    this.color = PickRandom(colors);
    //this.letter = eatenWord; 
    this.word = word;
    this.counter = 0;
    this.letter = this.word[this.counter];
  }

  // Apple(eatenWord) {
  //   this.block = new Block(10, 10);
  //   this.color = PickColor(colors);
  //   this.letter = eatenWord; 
  //   this.eatenWord = eatenWord;
  //   this.counter = 0;
  //   this.letter = this.eatenWord[this.counter];
  // }


  draw() {
    this.block.drawCircle(this.color, this.letter);
  }

  move() {
    const randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
    const randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
    this.block = new Block(randomCol, randomRow);
    this.color = PickRandom(colors);
    this.letter = PickRandom(words);
    this.counter++;
    if (this.counter < this.word.length) {
        this.letter = this.word[this.counter];
    } else {
        gameOver();
    }
  }
}

var snake = new Snake();
var apple = new Apple(word);

var intervalId = setInterval(function () {
        context.clearRect(0, 0, width, height);
        drawScore();
        snake.move();
        snake.draw();
        apple.draw();
        drawBorder();
      }, 300);


