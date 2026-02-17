/* ============================
   Matrix background + UI scripts
   ============================ */

(() => {
  // ---- Responsive nav (mobile)
  const navToggle = document.getElementById("navToggle");
  const nav = document.querySelector(".nav");
  if (navToggle && nav){
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("nav--open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close menu on click
    nav.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        nav.classList.remove("nav--open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ---- Footer year
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // ---- Typewriter (terminal)
  const target = document.getElementById("typewriter");
  const lines = [
    "$ whoami",
    "eduardo.vargas",
    "",
    "$ role --current",
    "Cyber Security Analyst JR",
    "",
    "$ focus --areas",
    "Security Operations (SecOps), Vulnerability Management, System Hardening",
    "",
    "$ strengths",
    "- risk mindset",
    "- attention to detail",
    "- structured reporting",
    "- clear communication",
    "",
    "$ status",
    "Ready for junior SOC / cybersecurity opportunities."
  ];

  function typeLines(el, lines){
    if (!el) return;
    const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced){
      el.textContent = lines.join("\n");
      return;
    }
    let i = 0, j = 0;
    const speed = 14;

    const tick = () => {
      if (i >= lines.length) return;
      const line = lines[i];
      if (j <= line.length){
        const before = lines.slice(0, i).join("\n");
        const current = line.slice(0, j);
        el.textContent = (before ? before + "\n" : "") + current + "▌";
        j++;
        setTimeout(tick, speed);
      }else{
        // line done
        el.textContent = lines.slice(0, i + 1).join("\n") + "\n";
        i++;
        j = 0;
        setTimeout(tick, 170);
      }
    };
    tick();
  }
  typeLines(target, lines);

  // ---- Matrix rain canvas
  const canvas = document.getElementById("matrix");
  const ctx = canvas.getContext("2d", { alpha: true });

  // Characters: mix of binary + cyber terms
  const glyphs = [
    "0","1","0","1","0","1",
    "C","V","E","S","O","C","S","I","E","M","N","I","S","T","I","S","O",
    "H","T","T","P","D","N","S","T","C","P","I","P","V","P","N",
    "{","}","[","]","<",">","/","\\",";","$","=","#","*","@","+","-"
  ];

  function resize(){
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(dpr,0,0,dpr,0,0);

    setupColumns();
  }

  let fontSize = 16;
  let columns = [];
  function setupColumns(){
    fontSize = window.innerWidth < 520 ? 14 : 16;
    const colCount = Math.floor(window.innerWidth / fontSize);
    columns = new Array(colCount).fill(0).map(() => ({
      y: Math.random() * window.innerHeight,
      speed: 0.65 + Math.random() * 1.25
    }));
  }

  function draw(){
    // Transparent black background to create trailing effect
    ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = 0; i < columns.length; i++){
      const x = i * fontSize;
      const col = columns[i];

      // choose glyph
      const ch = glyphs[Math.floor(Math.random() * glyphs.length)];

      // glow head
      ctx.font = `${fontSize}px JetBrains Mono, ui-monospace, monospace`;
      ctx.fillStyle = "rgba(25, 230, 255, 0.95)";
      ctx.shadowColor = "rgba(25, 230, 255, 0.28)";
      ctx.shadowBlur = 12;

      ctx.fillText(ch, x, col.y);

      // dim trail
      ctx.shadowBlur = 0;

      col.y += fontSize * col.speed;

      // reset if off-screen
      if (col.y > window.innerHeight + 80 && Math.random() > 0.975){
        col.y = -Math.random() * 200;
        col.speed = 0.65 + Math.random() * 1.25;
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize, { passive: true });
  resize();
  draw();
})();
