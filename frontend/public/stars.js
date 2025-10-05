<script>
  const canvas = document.getElementById("stars");
  const ctx = canvas.getContext("2d");

  let stars = [];
  const numStars = 150;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createStars() {
    stars = [];
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        speed: Math.random() * 0.3 + 0.05,
      });
    }
  }

  function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    stars.forEach((star) => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();

      star.y += star.speed;
      if (star.y > canvas.height) star.y = 0;
    });
    requestAnimationFrame(animateStars);
  }

  resizeCanvas();
  createStars();
  animateStars();
  window.onresize = () => {
    resizeCanvas();
    createStars();
  };
</script>
