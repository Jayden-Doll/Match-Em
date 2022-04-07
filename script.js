const gridContainer = document.querySelector(".grid-container");
const attemptCount = document.querySelector("#attempts");
const subtitle = document.querySelector("#subtitle");
const startScreen = document.querySelector("#menu");
const startButton = document.querySelector("#btn-start");
const popup = document.querySelector("#popup-container");
const overlay = document.querySelector("#overlay");
const message = document.querySelector("#popup-message");
const restartButton = document.querySelectorAll("#btn-restart");
const toMenuButton = document.querySelectorAll("#btn-to-menu");
const buttonOptions = document.querySelectorAll(".btn-option");
const buttonOption12 = document.querySelector("#btn-12");
const buttonOption24 = document.querySelector("#btn-24");
const buttonOption36 = document.querySelector("#btn-36");
let smBoard = 12;
let mdBoard = 24;
let lgBoard = 36;

//Amount of cards to be created

function runGame(cardCount) {
  startButton.addEventListener("click", () => {
    resetGame();
    startScreen.classList.remove("menu-show");
    startScreen.classList.add("menu-hide");
  });

  //Array of possible id numbers for matching the cards
  let numArray = [];

  //Generates 2 sets of matching numbers depending on the cardCount
  function generateNumArray(cardCount) {
    cardCount /= 2;
    for (i = 1; i < cardCount + 1; i++) {
      numArray.push(i);
      numArray.push(i);
    }
  }

  generateNumArray(cardCount);

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * i);
      let k = array[i];
      array[i] = array[j];
      array[j] = k;
    }
  }

  shuffleArray(numArray);

  function createCard(cardCount) {
    const gridContainer = document.createElement("div");
    for (let i = 0; i < cardCount; i++) {
      const cardBody = document.createElement("div");
      const innerCard = document.createElement("div");
      const cardFront = document.createElement("div");
      const cardBack = document.createElement("div");
      const cardImage = document.createElement("img");

      document.body
        .appendChild(gridContainer)
        .classList.add("grid-container", "grid");
      cardCount === smBoard ? gridContainer.classList.add("grid-12") : false;
      cardCount === mdBoard ? gridContainer.classList.add("grid-24") : false;
      cardCount === lgBoard ? gridContainer.classList.add("grid-36") : false;
      gridContainer.appendChild(cardBody).classList.add("grid-card");
      cardBody.appendChild(innerCard).classList.add("card-inner");
      innerCard.appendChild(cardFront).classList.add("card-front");
      innerCard.appendChild(cardBack).classList.add("card-back");
      cardBack.appendChild(cardImage);

      const randNum = numArray.pop();

      innerCard.id = randNum;
      cardImage.src = `./imgs/${randNum}.png`;
    }
  }

  createCard(cardCount);

  const cardGrid = document.querySelectorAll(".card-inner");

  //Card ID and selected cards arrays
  let cardID = [];
  let selectedCards = [];

  let attempts;
  cardCount === smBoard ? (attempts = 5) : false;
  cardCount === mdBoard ? (attempts = 16) : false;
  cardCount === lgBoard ? (attempts = 30) : false;
  attemptCount.innerText = attempts;
  let matches = 0;

  function removeCards() {
    while (gridContainer.firstChild) {
      gridContainer.removeChild(gridContainer.firstChild);
    }
  }

  function resetGame() {
    popup.classList.add("popup-hidden");
    overlay.classList.add("overlay-hidden");
    matches = 0;

    setTimeout(() => {
      const newCardGrid = document.querySelectorAll(".card-inner");
      if (newCardGrid) {
        selectedCards = [];
        newCardGrid.forEach((card) => {
          selectedCards = [];
          card.classList.remove("rotate", "active", "matched", "disabled");
          card.classList.add("noclick");
        });
      }

      cardGrid.forEach((card) => {
        card.classList.remove("rotate", "active", "matched", "disabled");
        card.classList.add("noclick");
      });
    }, 400);

    setTimeout(() => {
      document.querySelector(".grid-container").remove();
      cardCount === smBoard ? (attempts = 5) : false;
      cardCount === mdBoard ? (attempts = 16) : false;
      cardCount === lgBoard ? (attempts = 30) : false;
      attemptCount.innerText = attempts;

      removeCards();

      generateNumArray(cardCount);
      shuffleArray(numArray);

      createCard(cardCount);

      const newCardGrid = document.querySelectorAll(".card-inner");

      runGameLogic(newCardGrid);
    }, 700);
  }

  restartButton.forEach((button) => {
    button.addEventListener("click", () => {
      resetGame();
    });
  });

  toMenuButton.forEach((button) => {
    button.addEventListener("click", () => {
      resetGame();
      startScreen.classList.remove("menu-hide");
      startScreen.classList.add("menu-show");
      buttonOptions.forEach((option) => {
        option.classList.remove("option-selected");
      });
    });
  });

  //Pushes selected card object and it's id into the arrays

  function runGameLogic(grid) {
    function selectCard(card) {
      cardID.push(card.id);
      selectedCards.push(card);
      console.log(selectedCards);

      card.classList.add("active");
      card.classList.add("rotate");
    }

    grid.forEach((card) => {
      card.addEventListener("click", () => {
        selectCard(card);

        //If 2 cards are selected
        if (cardID.length === 2) {
          console.log(selectedCards);
          //If both card's ids match
          if (cardID[0] === cardID[1]) {
            matches++;

            if (matches === cardCount / 2) {
              message.innerText = "You Win!";
              message.style.color = "rgb(52, 193, 63)";
              popup.classList.remove("popup-hidden");
              overlay.classList.remove("overlay-hidden");
            }

            for (const cards of selectedCards) {
              cards.classList.add("matched");
              cards.classList.remove("active");

              //Empty both arrays
              cardID = [];
              selectedCards = [];
            }
          } else {
            attempts--;
            attemptCount.innerText = `${attempts}`;

            if (attempts === 0) {
              message.innerText = "You Lose.";
              message.style.color = "rgb(193, 52, 52)";
              popup.classList.remove("popup-hidden");
              overlay.classList.remove("overlay-hidden");

              //Show every card and disable them
              grid.forEach((poop) => {
                poop.classList.add("disabled", "rotate");
                setTimeout(() => {
                  poop.classList.add("disabled", "rotate");
                }, 1001);
              });
            }

            //Add disabled class, and rotate cards back after a second
            for (const cards of selectedCards) {
              cards.classList.remove("active");
              cards.classList.add("disabled");

              setTimeout(() => {
                cards.classList.remove("rotate");
                cards.classList.remove("disabled");
              }, 1000);

              //Empty both arrays
              cardID = [];
              selectedCards = [];
            }
          }
        }
      });
    });
  }

  runGameLogic(cardGrid);
}

let cardCount;
buttonOption12.addEventListener("click", () => {
  const gridContainer = document.querySelector(".grid");
  if (gridContainer) {
    gridContainer.remove();
  }
  buttonOptions.forEach((button) => {
    button.classList.remove("option-selected");
  });
  buttonOption12.classList.add("option-selected");
  let cardCount = smBoard;
  runGame(cardCount);
});
buttonOption24.addEventListener("click", () => {
  const gridContainer = document.querySelector(".grid");
  if (gridContainer) {
    gridContainer.remove();
  }
  buttonOptions.forEach((button) => {
    button.classList.remove("option-selected");
  });
  buttonOption24.classList.add("option-selected");
  let cardCount = mdBoard;
  runGame(cardCount);
});
buttonOption36.addEventListener("click", () => {
  const gridContainer = document.querySelector(".grid");
  if (gridContainer) {
    gridContainer.remove();
  }
  buttonOptions.forEach((button) => {
    button.classList.remove("option-selected");
  });
  buttonOption36.classList.add("option-selected");
  let cardCount = lgBoard;
  runGame(cardCount);
});
