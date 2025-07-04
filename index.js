   function openLetter() {
      const letter = document.getElementById('letter');
      const game = document.getElementById('game');
      letter.classList.toggle('show');
      if (!game.style.display || game.style.display === "none") {
        setTimeout(() => {
          game.style.display = "block";
        }, 600);
      } else {
        game.style.display = "none";
        document.getElementById('response').textContent = '';
      }
    }

    function respondYes() {
      const response = document.getElementById('response');
      const letter = document.getElementById('letter');

      // Hide letter
      letter.classList.add('hide');

      // Launch fireworks
      setTimeout(() => {
        launchFireworks();
      }, 400);

      // Show thank-you text
      setTimeout(() => {
        response.textContent = "Thank you, Gungun!";
        response.classList.add('show');
      }, 800);

      // Hide thank-you text
      setTimeout(() => {
        response.classList.remove('show');
      }, 3800);
    }

    function moveNo() {
      const noBtn = document.getElementById('noBtn');
      const x = Math.random() * (window.innerWidth - 100);
      const y = Math.random() * (window.innerHeight - 100);
      noBtn.style.left = x + "px";
      noBtn.style.top = y + "px";
    }

    // Blossom Canvas
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Petal {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * -canvas.height;
        this.r = Math.random() * 4 + 2;
        this.opacity = Math.random() * 0.6 + 0.3;
        this.speedY = Math.random() * 0.7 + 0.3;
        this.swing = Math.random() * 1.5 + 0.5;
        this.angle = Math.random() * Math.PI * 2;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 0.5 - 0.25;
      }

      update() {
        this.y += this.speedY;
        this.x += Math.sin(this.angle) * this.swing;
        this.angle += 0.01;
        this.rotation += this.rotationSpeed;

        if (this.y > canvas.height + 10 || this.x < -50 || this.x > canvas.width + 50) {
          this.reset();
        }
      }

      draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.beginPath();
        ctx.ellipse(0, 0, this.r, this.r * 1.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 182, 193, ${this.opacity})`;
        ctx.fill();
        ctx.restore();
      }
    }

    let petals = [];
    for (let i = 0; i < 60; i++) petals.push(new Petal());

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      petals.forEach(p => {
        p.update();
        p.draw(ctx);
      });
      requestAnimationFrame(animate);
    }

    animate();

    // Fireworks
    const fireworksCanvas = document.getElementById('fireworksCanvas');
    const fctx = fireworksCanvas.getContext('2d');
    fireworksCanvas.width = window.innerWidth;
    fireworksCanvas.height = window.innerHeight;

    class Firework {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * fireworksCanvas.width;
        this.y = fireworksCanvas.height;
        this.targetY = Math.random() * fireworksCanvas.height / 2;
        this.radius = 2;
        this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
        this.exploded = false;
        this.particles = [];
      }

      explode() {
        for (let i = 0; i < 30; i++) {
          this.particles.push({
            x: this.x,
            y: this.y,
            radius: Math.random() * 2 + 1,
            dx: (Math.random() - 0.5) * 6,
            dy: (Math.random() - 0.5) * 6,
            life: 100
          });
        }
      }

      update() {
        if (!this.exploded) {
          this.y -= 4;
          if (this.y <= this.targetY) {
            this.exploded = true;
            this.explode();
          }
        } else {
          this.particles.forEach(p => {
            p.x += p.dx;
            p.y += p.dy;
            p.dy += 0.1;
            p.life -= 2;
          });
        }
      }

      draw(ctx) {
        if (!this.exploded) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();
        } else {
          this.particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = Math.max(p.life / 100, 0);
            ctx.fill();
            ctx.globalAlpha = 1;
          });
        }
      }
    }

    let fireworkList = [];

function launchFireworks() {
  fireworkList = [];

  const totalDuration = 60000; // 1 minute
  const interval = 1000; // 1 firework per second

  for (let i = 0; i < totalDuration / interval; i++) {
    setTimeout(() => {
      fireworkList.push(new Firework());
    }, i * interval);
  }

  let startTime = Date.now();

  function animateFireworks() {
    let now = Date.now();
    if (now - startTime > totalDuration + 2000) {
      fctx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
      return;
    }

    fctx.fillStyle = "rgba(0,0,0,0.2)";
    fctx.fillRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);

    fireworkList.forEach(fw => {
      fw.update();
      fw.draw(fctx);
    });

    requestAnimationFrame(animateFireworks);
  }

  animateFireworks();
}