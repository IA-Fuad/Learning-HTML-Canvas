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

function drawCircle(x, y, r, s, e, color) {
  c.beginPath();
  c.arc(x, y, r, s, e, true);
  c.strokeStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
  c.stroke();
}

//drawLine();
//drawRectange();
//drawCircle(200, 200, 40, 0, Math.PI * 2, [122, 35, 222]);

function Circle(x, y, dx, dy, radius, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = color;

    this.draw = function() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        c.strokeStyle = `rgb(${this.color[0]}, ${this.color[1]}, ${this.color[2]})`;
        c.stroke();
    }

    this.update = function() {
        if ((this.x + this.radius) > innerWidth || (this.x - radius) < 0) {
            this.dx = -this.dx;
        }
        if ((this.y + this.radius) > innerHeight || (this.y - this.radius) < 0) {
            this.dy = -this.dy;
        }
        this.x += this.dx;
        this.y += this.dy;

        this.draw();
    }
}

let circleArray = [];

for (let i = 0; i < 100; i++) {
    let radius = 40;
    let x = Math.floor(Math.random() * (innerWidth - radius * 2)) + radius;
    let y = Math.floor(Math.random() * (innerHeight - radius * 2)) + radius;
    let dx = (Math.random() - 0.5) * 15;
    let dy = (Math.random() - 0.5) * 15;
    let color = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
    circleArray.push(new Circle(x, y, dx, dy, radius, color));
}

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < circleArray.length; i++) {
        circleArray[i].update();
    }
}

animate();