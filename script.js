let ralphY;
let burgerSize;
let mouthOpenness = 0;
let burgers = [];
let score = 0;
let isGameOver = false;

function setup() {
  createCanvas(636, 600);
  ralphY = height / 2;
  burgerSize = 40;

  // Create exactly 5 initial burgers within the canvas
  for (let i = 0; i < 5; i++) {
    burgers.push(new Burger(random(width), random(75, height - 75), random(-2, -1)));
  }
}

function draw() {
  if (isGameOver) {
    gameOverScreen();
  } else {
    background(255);

    for (let i = burgers.length - 1; i >= 0; i--) {
      burgers[i].update();
      burgers[i].display();

      if (burgers[i].checkCollision(ralphY, mouthOpenness)) {
        if (burgers[i].direction < 0) {
          // Only eat burgers coming from the right
          burgers.splice(i, 1);
          score++;
          mouthOpenness = 60;
        }
      }
    }

    if (keyIsDown(UP_ARROW) && ralphY > 75) {
      ralphY -= 5;
    } else if (keyIsDown(DOWN_ARROW) && ralphY < height - 75) {
      ralphY += 5;
    }

    if (mouthOpenness > 0) {
      mouthOpenness -= 2;
    }

    drawRalph(ralphY);
    drawScore();
    spawnBurger();

    if (score < 0) {
      isGameOver = true;
    }
  }
}

function drawRalph(y) {
  let nearestBurger = findNearestBurger(y);

  // Calculate angle between the character's eye and the nearest burger
  let angle = atan2(nearestBurger.y - (y - 30), nearestBurger.x - 120);

  fill(240);
  rect(50, y - 50, 100, 100 + mouthOpenness, 0, 0, 20, 20);
  fill(255);
  ellipse(120, y - 30, 25, 25);

  // Calculate new eye position based on the angle
  let eyeRadius = 6;
  let eyeX = 120 + cos(angle) * eyeRadius;
  let eyeY = y - 30 + sin(angle) * eyeRadius;

  // Keep the pupil within the bounds of the eye
  let eyeCenterX = 120;
  let eyeCenterY = y - 30;
  let distance = dist(eyeX, eyeY, eyeCenterX, eyeCenterY);
  if (distance > eyeRadius) {
    let scaleFactor = eyeRadius / distance;
    eyeX = eyeCenterX + (eyeX - eyeCenterX) * scaleFactor;
    eyeY = eyeCenterY + (eyeY - eyeCenterY) * scaleFactor;
  }

  fill(0);
  ellipse(eyeX, eyeY, 10, 10);

  // Rest of the eye drawing code
  fill(0);
  rect(50, y - 70, 100, 20, 20, 20, 0, 0);
  stroke(0);
  strokeWeight(2);
  let mouthY = y + 25;
  if (mouthOpenness > 2) {
    stroke(0);
    fill(240);
    rect(50, mouthY, 100, mouthOpenness);
    noStroke();
    fill(240);
    rect(51, mouthY, 100, mouthOpenness);
  } else {
    stroke(0);
    noFill();
    rect(50, mouthY, 100, mouthOpenness);
  }
  stroke(0);
  strokeWeight(2);
  let noseBaseY = y;
  let noseWidth = 20;
  let noseHeight = 30;
  line(150, noseBaseY, 150 + noseWidth, noseBaseY);
  line(150, noseBaseY, 150, noseBaseY - noseHeight);
  line(150, noseBaseY - noseHeight, 150 + noseWidth, noseBaseY);
}




function findNearestBurger(y) {
  let nearestBurger;
  let closestDistance = Infinity;

  for (let i = 0; i < burgers.length; i++) {
    let distance = dist(120, y - 30, burgers[i].x, burgers[i].y);

    if (distance < closestDistance) {
      closestDistance = distance;
      nearestBurger = burgers[i];
    }
  }
  

  return nearestBurger;
}


    function drawScore() {
      fill(0);
      textSize(24);
      text(`Burger Eaten: ${score}`, 20, 30);
    }

    function spawnBurger() {
      if (burgers.length < 5 && frameCount % 60 === 0) {
        burgers.push(new Burger(width, random(75, height - 75)));
      }
    }
    

    function gameOverScreen() {
      background(255);
      fill(0);
      textSize(36);
      textAlign(CENTER, CENTER);
      text('Game Over!', width / 2, height / 2 - 50);
      textSize(24);
      text('Press ENTER to restart', width / 2, height / 2 + 50);

      if (keyIsDown(ENTER)) {
        restartGame();
      }
    }

    function restartGame() {
      isGameOver = false;
      score = 0;
      burgers = [];
    }

    class Burger {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 40;
        this.direction = -1; // Initial direction is to the left
      }

      update() {
        this.x += this.direction * 2; // Adjust speed of burgers

        // Change direction when the burger hits the canvas edge
        if (this.x < 0 || this.x > width) {
          this.direction *= -1;
        }
      }

      display() {
        fill(255);
        rect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size / 2, 0, 0, 20, 20);
        fill(0);
        rect(this.x - (this.size / 2 + 5), this.y - this.size / 2 - 5, this.size + 10, this.size / 4, 20, 20, 20, 20);
        fill(255);
        rect(this.x - this.size / 2, this.y - this.size / 2 - 25, this.size, this.size / 2, 20, 20, 0, 0);
      }

      checkCollision(ralphY, mouthOpenness) {
        let burgerCenterX = this.x;
        let burgerCenterY = this.y - this.size / 4; // Assuming the center is at the top of the burger
      
        let mouthTop = ralphY - 25;
        let mouthBottom = ralphY + 75 + mouthOpenness;
        let mouthLeft = 50;
        let mouthRight = 185;
      
        return (
          burgerCenterX > mouthLeft &&
          burgerCenterX < mouthRight &&
          burgerCenterY > mouthTop &&
          burgerCenterY < mouthBottom
        );
      }
      
    }