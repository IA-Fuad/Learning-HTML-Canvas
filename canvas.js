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
 // console.log(event);
  mouse.x = event.x;
  mouse.y = event.y;
});

document.querySelector("#playGround").addEventListener("mouseleave", function (event) {
    //console.log(event);
    mouse.x = undefined;
    mouse.y = undefined;
  });

window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});

function getDistance(x1, y1, x2, y2) {
  let disX = x1 - x2;
  let disY = y1 - y2;
  return Math.hypot(disX, disY);
}

function rotate(velocity, angle) {
  const rotatedVelocities = {
    x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
    y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle),
  };

  return rotatedVelocities;
}

function resolveCollision(particle, otherParticle) {
  const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
  const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

  const xDist = otherParticle.x - particle.x;
  const yDist = otherParticle.y - particle.y;

  // Prevent accidental overlap of particles
  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
    // Grab angle between the two colliding particles
    const angle = -Math.atan2(
      otherParticle.y - particle.y,
      otherParticle.x - particle.x
    );

    // Store mass in var for better readability in collision equation
    const m1 = particle.mass;
    const m2 = otherParticle.mass;

    // Velocity before equation
    const u1 = rotate(particle.velocity, angle);
    const u2 = rotate(otherParticle.velocity, angle);

    // Velocity after 1d collision equation
    const v1 = {
      x: (u1.x * (m1 - m2)) / (m1 + m2) + (u2.x * 2 * m2) / (m1 + m2),
      y: u1.y,
    };
    const v2 = {
      x: (u2.x * (m1 - m2)) / (m1 + m2) + (u1.x * 2 * m2) / (m1 + m2),
      y: u2.y,
    };

    // Final velocity after rotating axis back to original location
    const vFinal1 = rotate(v1, -angle);
    const vFinal2 = rotate(v2, -angle);

    // Swap particle velocities for realistic bounce effect
    particle.velocity.x = vFinal1.x;
    particle.velocity.y = vFinal1.y;

    otherParticle.velocity.x = vFinal2.x;
    otherParticle.velocity.y = vFinal2.y;
  }
}

let maxRadius = 30;

function Circle(x, y, dx, dy, radius, rgba) {
  this.x = x;
  this.y = y;
  this.velocity = {
    x: dx,
    y: dy,
  };
  this.radius = radius;
  this.mass = 1;
  this.color = `rgb(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${rgba[3]})`;
  this.minRadius = radius;
  this.c = c;
  this.opacity = 0;

  this.draw = function () {
    this.c.beginPath();
    this.c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    // "save to restore" changes value between them. so the fill opacity is only changed while stroke opacity value remains original
    this.c.save();
    this.c.globalAlpha = this.opacity;
    this.c.fillStyle = this.color;
    this.c.fill();
    this.c.restore();
    this.c.strokeStyle = this.color;
    this.c.stroke();
    this.c.closePath();
  };

  this.update = function (particles) {
    this.particles = particles;

    if (this.x + this.radius > innerWidth || this.x - radius < 0) {
      this.velocity.x = -this.velocity.x;
    }
    if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
      this.velocity.y = -this.velocity.y;
    }
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    // Changing Circle Radius and Opacity when mouse pointer comes close
    if (getDistance(mouse.x, mouse.y, this.x, this.y) < 120) {
      if (this.radius < maxRadius) {
        this.radius += 1;
        this.opacity += 0.02;
      }
    } else if (this.radius > this.minRadius) {
      this.radius -= 1;
      this.opacity = Math.max(0, this.opacity - 0.02);
      //console.log(this.opacity);
    }

    // Checking particle collision with each other. Have to check every other particle position for each particle when updating.
    for (let j = 0; j < this.particles.length; j++) {
      if (particles[j] == this) {
        continue;
      }
      if (getDistance(this.x, this.y, particles[j].x, particles[j].y) -
          (this.radius + particles[j].radius) <= 0) {
        resolveCollision(this, particles[j]);
      }
    }

    this.draw();
  };
}

function calculateParticleNumber() {
    let minValue = Math.min(window.innerWidth, window.innerHeight);
    let maxValue = Math.max(window.innerWidth, window.innerHeight);
    let particleNumbers = (minValue / maxValue) * maxValue - 300;
    particleNumbers = Math.max(10, particleNumbers);
    return particleNumbers;
}

let particles = [];

function init() {
  let particleNumbers = calculateParticleNumber();
  particles = [];
  console.log(particleNumbers);

  for (let i = 0; i < particleNumbers; i++) {
    let radius = Math.floor(Math.random() * 12) + 1;
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

    // preventing circle to overlap when spawning
    if (i != 0) {
      for (let j = 0; j < particles.length; j++) {
        if (getDistance(x, y, particles[j].x, particles[j].y) -
            (radius + particles[j].radius) < 0) {
          x = Math.floor(Math.random() * (innerWidth - radius * 2)) + radius;
          y = Math.floor(Math.random() * (innerHeight - radius * 2)) + radius;
          j = -1;
        }
      }
    }
    particles.push(new Circle(x, y, dx, dy, radius, rgba));
  }
}

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, innerWidth, innerHeight);

  for (let i = 0; i < particles.length; i++) {
    particles[i].update(particles);
  }
}

init();
animate();
