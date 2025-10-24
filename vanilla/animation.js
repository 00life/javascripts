const canvas = window.document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = (canvas.width = 400);
const CANVAS_HEIGHT = (canvas.height = 400);
const CAN = [CANVAS_WIDTH, CANVAS_HEIGHT];
const sx = 575;
const sy = 523;
let gameFrame = 0;
let stagF = 5;
let spriteAnim = [];
let animationStates = [{ name: "idle", frames: 7 }];

animationStates.forEach((state, index) => {
  let frames = { loc: [] };

  for (let i = 0; i < state.frames; i++) {
    let posX = i * sx;
    let posY = index * sy;
    frames.loc.push({ x: posX, y: posY });
  }

  spriteAnim[state.name] = frames;
});

const playerImage = new Image();
playerImage.src = "public/shadow_dog.png";

function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  let position = Math.floor(gameFrame / stagF) % spriteAnim["idle"].loc.length;
  // ctx.fillRect(100, 50, 100, 100);

  let fx = sx * position;
  let fy = spriteAnim["idle"].loc[position].y;

  ctx.drawImage(playerImage, fx, fy * sy, sx, sy, 0, 0, ...CAN);

  gameFrame++;
  requestAnimationFrame(animate);
}

animate();
