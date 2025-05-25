document.addEventListener("DOMContentLoaded", function () {
  const aboutLink = document.querySelector('.nav-links a:nth-child(3)');
  const gameRuleDiv = document.querySelector('.game-rule');

  if (aboutLink && gameRuleDiv) {
    aboutLink.addEventListener('click', function (e) {
      e.preventDefault();
      gameRuleDiv.scrollIntoView({ behavior: "smooth" });
    });
  }

  const images = document.querySelectorAll('.hero-image img');
  const startButton = document.querySelector(".game-btn");

  // Modal and score elements
  const modal = document.getElementById("result-modal");
  const resultTitle = document.getElementById("result-title");
  const resultMessage = document.getElementById("result-message");
  const nextRoundBtn = document.getElementById("next-round-btn");
  const blastEffect = document.getElementById("blast-effect");
  const userScoreSpan = document.getElementById("user-score");
  const computerScoreSpan = document.getElementById("computer-score");

  let userChoice = null;
  let round = 1;
  let userScore = 0;
  let computerScore = 0;

  // User selection: click on any image
  images.forEach((img, idx) => {
    img.addEventListener('click', function () {
      images.forEach(i => i.style.boxShadow = "");
      img.style.boxShadow = "0 0 32px 8px #39ff14, 0 0 16px #00f0ff";
      userChoice = idx; // 0: rock, 1: paper, 2: scissors
    });
  });

  function showModal(title, message, blast = false) {
    resultTitle.textContent = title;
    resultMessage.innerHTML = message;
    modal.style.display = "flex";
    if (blast) {
      blastEffect.innerHTML = '<div class="blast"></div>';
      setTimeout(() => { blastEffect.innerHTML = ""; }, 700);
    }
  }

  function hideModal() {
    modal.style.display = "none";
  }

  function updateScore() {
    userScoreSpan.textContent = userScore;
    computerScoreSpan.textContent = computerScore;
  }

  if (startButton && images.length === 3) {
    startButton.addEventListener('click', function () {
      if (userChoice === null) {
        showModal("Select!", "Please select Rock, Paper, or Scissors first!");
        return;
      }

      // Computer random selection
      const computerChoice = Math.floor(Math.random() * images.length);
      images.forEach(i => i.style.outline = "");
      images[computerChoice].style.outline = "4px solid #ff0055";

      // Decide winner
      let result = "";
      let blast = false;
      if (userChoice === computerChoice) {
        result = "Draw!";
      } else if (
        (userChoice === 0 && computerChoice === 2) ||
        (userChoice === 1 && computerChoice === 0) ||
        (userChoice === 2 && computerChoice === 1)
      ) {
        result = "Congratulations! You Win!";
        userScore++;
        blast = true;
      } else {
        result = "Computer Wins!";
        computerScore++;
      }
      updateScore();

      // Show message in modal
      let msg = `
        <b>Round:</b> ${round} / 5<br>
        <b>You selected:</b> ${["Rock", "Paper", "Scissors"][userChoice]}<br>
        <b>Computer selected:</b> ${["Rock", "Paper", "Scissors"][computerChoice]}<br>
        <b>Result:</b> ${result}<br>
        <b>Score:</b> You ${userScore} : ${computerScore} Computer
      `;
      showModal(result, msg, blast);

      // Next round logic
      nextRoundBtn.onclick = function () {
        hideModal();
        images.forEach(i => {
          i.style.boxShadow = "";
          i.style.outline = "";
        });
        userChoice = null;
        round++;
        if (round > 5) {
          let finalMsg = `<b>Game Over!</b><br><b>Final Score:</b> You ${userScore} : ${computerScore} Computer<br>`;
          if (userScore > computerScore) finalMsg += "<b style='color:#39ff14'>You are the Winner! 🎉</b>";
          else if (userScore < computerScore) finalMsg += "<b style='color:#ff0055'>Computer Wins! 😢</b>";
          else finalMsg += "<b>It's a Draw!</b>";
          showModal("Game Over", finalMsg);
          nextRoundBtn.textContent = "Play Again";
          nextRoundBtn.onclick = function () {
            // Reset game
            userScore = 0;
            computerScore = 0;
            round = 1;
            updateScore();
            hideModal();
            nextRoundBtn.textContent = "Next Round";
          };
        }
      };
    });
  }

  document.getElementById('show-login').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('signupForm').style.display = 'none';
  });

  document.getElementById('show-signup').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('signupForm').style.display = 'block';
    document.getElementById('loginForm').style.display = 'none';
  });
});

