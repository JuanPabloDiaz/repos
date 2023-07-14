const canvas = document.getElementById("lienzo");
const ctx = canvas.getContext("2d");

canvas.width = document.body.offsetWidth;
canvas.height = document.body.offsetHeight;

/* full page canvas
  Rresize the canvas to occupy the full page,
   by getting the widow width and height and setting it to canvas*/

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//Done! Enjoy full page canvas!
//---
const w = canvas.width;
const h = canvas.height;

ctx.fillStyle = "#000";
ctx.fillRect(0, 0, w, h);

const cols = Math.floor(w / 20) + 1;
const position_y = Array(cols).fill(0);

function matrix() {
  ctx.fillStyle = "#0001";
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "#0f0";
  ctx.font = "15pt monospace";

  position_y.forEach((y, ind) => {
    const text = String.fromCharCode(Math.random() * 128);
    const x = ind * 20;
    ctx.fillText(text, x, y);
    if (y > 100 + Math.random() * 10000) {
      position_y[ind] = 0;
    } else position_y[ind] = y + 20;
  });
}
setInterval(matrix, 50);
