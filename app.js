document.addEventListener('DOMContentLoaded', () => {

const grid = document.querySelector('.grid');
let width = 10;
let squares = [];
let flags = 0;
const bombAmount = 20;
let isGameOver = false;

/* Create Minesweeper Board/Grid */
function createBoard() {

/* Creating the shuffled gameboard with bombs */
// Creating the bombs into bombArray and an emptyArray
const bombArray = Array(bombAmount).fill('bomb');
const emptyArray = Array(width*width - bombAmount).fill('valid');
const gameArray = emptyArray.concat(bombArray);
// Shuffling the bombs randomly into the gameArray
const shuffleArray = gameArray.sort(() => Math.random() - 0.5);

 for(let i = 0; i < width*width; i++) {
   const square = document.createElement("div");
   square.setAttribute('id', i);
   // Add class names to bombs
   square.classList.add(shuffleArray[i]);
   grid.appendChild(square);
   squares.push(square);

   /* CLICKS */
   // Normal Click
   square.addEventListener('click', function(e) {
     click(square);
   });
   // Left click| CTRL Click
   square.oncontextmenu = function(e) {
     e.preventDefault();
     addFlag(square);
   };

 }

/* Adding numbers around bombs */
for (let i = 0; i < squares.length; i++) {
  let total = 0;
  const isLeftEdge = (i % width === 0);
  const isRightEdge = (i % width === width - 1);

  if (squares[i].classList.contains('valid')) {
    if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total ++;
    if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total ++;
    if (i > 10 && squares[i - width].classList.contains('bomb')) total ++;
    if (i > 11 && !isLeftEdge && squares[i -1 - width].classList.contains('bomb')) total ++;
    /* ↑Top half of board|| Bottom half of board↓ */
    if (i < 98 && !isRightEdge && squares[i + 1].classList.contains('bomb')) total ++;
    if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) total ++;
    if (i < 88 && !isRightEdge && squares[i +1 + width].classList.contains('bomb')) total ++;
    if (i < 89 && squares[i + width].classList.contains('bomb')) total ++;
    // Checks squares and gives totals to those surrounding bombs
    squares[i].setAttribute('data', total);
    //console.log(squares[i]);
  }

}




}
createBoard();

/* Add flag function */
function addFlag(square) {
  if (isGameOver) return;
  if (!square.classList.contains('checked') && (flags < bombAmount)) {
    if (!square.classList.contains('flag')) {
      square.classList.add('flag');
      square.innerHTML = '🚩';
      flags ++;
      checkForWin();
    } else {
      square.classList.remove('flag');
      square.innerHTML = '';
      flags --;
    }
  }
}

/* Click on Square actions */
function click(square) {
  let currentId = square.id;
  // 
  if (isGameOver) return;
  if (square.classList.contains('checked') || square.classList.contains('flag')) return;

  if (square.classList.contains('bomb')) {
    gameOver(square);
  } else {
    let total = square.getAttribute('data')
    if (total !=0) {
      square.classList.add('checked');
      square.innerHTML = total;
      return
    }
    checkSquare(square, currentId);
  }
  square.classList.add('checked');
}

/* Check neighbouring squares once square is clicked */
function checkSquare(square, currentId) {
  const isLeftEdge = (currentId % width === 0);
  const isRightEdge = (currentId % width === width -1);

  setTimeout(() => {
    if (currentId > 0 && !isLeftEdge) {
      const newId = squares[parseInt(currentId) -1].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (currentId > 9 && !isRightEdge) {
      const newId = squares[parseInt(currentId) +1 -width].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (currentId > 10) {
      const newId = squares[parseInt(currentId -width)].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (currentId > 11 && !isLeftEdge) {
      const newId = squares[parseInt(currentId) -1 -width].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (currentId < 98 && !isRightEdge) {
      const newId = squares[parseInt(currentId) +1].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (currentId < 90 && !isLeftEdge) {
      const newId = squares[parseInt(currentId) -1 +width].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (currentId < 88 && !isRightEdge) {
      const newId = squares[parseInt(currentId) +1 +width].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (currentId < 89) {
      const newId = squares[parseInt(currentId) +width].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
  }, 10);
}

/* Game Over Function */
function gameOver(square) {
  console.log("GAME OVER!");
  isGameOver = true;

  // Show all bomb locations
  squares.forEach(square => {
    if (square.classList.contains('bomb')) {
      square.innerHTML = '💣';
    };
  });
}

/* Check for Win! */
function checkForWin() {
  matches = 0;

  for (let i = 0; i < squares.length; i++) {
    if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
      matches ++;
    }
    if (matches === bombAmount ) {
      console.log("You win!");
      isGameOver = true;
    }
  }
}



});