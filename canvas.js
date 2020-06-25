let canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let c = canvas.getContext("2d");


function drawRectange() {
    c.fillStyle = "#dd543c99";
    c.fillRect(100, 100, 100, 100);
    c.fillStyle = "#a3d5a8";
    c.fillRect(400, 100, 100, 100);
}

function drawLine() {
    c.beginPath();
    c.moveTo(50, 300);
    c.lineTo(300, 100);
    c.lineTo(400, 600);
    c.lineTo(500, 600);
    c.strokeStyle = "#23af42";
    c.stroke();
}

function drawCircle(x, y, r, s, e, rgba) {
    c.beginPath();
    c.arc(x, y, r, s, e, true);
    c.strokeStyle = `rgb(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${rgba[3]})`;
    c.stroke();
}

//drawLine();
//drawRectange();
//drawCircle(200, 200, 40, 0, Math.PI * 2, [122, 35, 222]);


// Implementing Animation With Circle
let mouse = {
  x: undefined,
  y: undefined,
};

window.addEventListener("mousemove", function (event) {
  console.log(event);
  mouse.x = event.x;
  mouse.y = event.y;
});

document.querySelector("#playGround").addEventListener("mouseleave", function (event) {
    console.log(event);
    mouse.x = undefined;
    mouse.y = undefined;
  })

window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  init();
});

let maxRadius = 60;

function Circle(x, y, dx, dy, radius, rgba) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;
  this.rgba = rgba;
  this.minRadius = radius;

  this.draw = function () {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    c.fillStyle = `rgb(${this.rgba[0]}, ${this.rgba[1]}, ${this.rgba[2]}, ${this.rgba[3]})`;
    c.fill();
  };

  this.update = function () {
    if (this.x + this.radius > innerWidth || this.x - radius < 0) {
      this.dx = -this.dx;
    }
    if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }
    this.x += this.dx;
    this.y += this.dy;

    // Interactivity
    if (
      mouse.x - this.x < 50 &&
      mouse.x - this.x > -50 &&
      mouse.y - this.y < 50 &&
      mouse.y - this.y > -50
    ) {
      if (this.radius < maxRadius) {
        this.radius += 1;
      }
    } else if (this.radius > this.minRadius) {
      this.radius -= 1;
    }

    this.draw();
  };
}

let circleArray = [];

function init() {
  circleArray = [];

  for (let i = 0; i < 1000; i++) {
    let radius = Math.random() * 6 + 1;
    let x = Math.floor(Math.random() * (innerWidth - radius * 2)) + radius;
    let y = Math.floor(Math.random() * (innerHeight - radius * 2)) + radius;
    let dx = (Math.random() - 0.5) * 4;
    let dy = (Math.random() - 0.5) * 4;
    let rgba = [
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.random(),
    ];
    circleArray.push(new Circle(x, y, dx, dy, radius, rgba));
  }
}

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, innerWidth, innerHeight);

  for (let i = 0; i < circleArray.length; i++) {
    circleArray[i].update();
  }
}

init();
animate();
