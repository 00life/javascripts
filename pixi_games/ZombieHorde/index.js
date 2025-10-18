import * as PIXI from "pixi.js";
import Player from "./player.js";
import Zombie from "./zombie.js";
import Spawner from "./spawner.js";
import Weather from "./weather.js";
import GameState from "./game-state.js";

const canvasSize = 200;
const canvas = document.getElementById("mycanvas");
const app = new PIXI.Application({
  view: canvas,
  width: canvasSize,
  height: canvasSize,
  backgroundColor: 0x312a2b,
  resolution: 2,
});

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const music = new Audio("./assets/HordeZee.mp3"); //music background
music.addEventListener("timeupdate", () => {
  if (music.currentTime > music.duration - 0.2) music.currentTime = 0;
});

const horde = new Audio("./assets/horde.mp3"); //zombie sounds background
horde.volume = 0.7;
horde.ontimeupdate = () => {
  if (horde.currentTime > horde.duration - 0.2) horde.currentTime = 0;
};

initGame();

async function initGame() {
  app.gameState = GameState.PREINTRO;

  try {
    console.log("Loading...");
    await loadAssets();
    console.log("Loaded");

    app.weather = new Weather({ app });
    let player = new Player({ app });

    let zSpawner = new Spawner({
      app,
      create: () => new Zombie({ app, player }),
    });

    let gamePreIntroScene = createScene("Hordzee", "Click to Continue");
    let gameStartScene = createScene("Hordzee", "Click to Start");
    let gameOverScene = createScene("Hordzee", "Game Over");

    app.ticker.add((delta) => {
      if (player.dead) app.gameState = GameState.GAMEOVER;
      gamePreIntroScene.visible = app.gameState === GameState.PREINTRO;
      gameStartScene.visible = app.gameState === GameState.START;
      gameOverScene.visible = app.gameState === GameState.GAMEOVER;

      switch (app.gameState) {
        case GameState.PREINTRO:
          player.scale = 4;
          break;
        case GameState.INTRO:
          player.scale -= 0.01;
          if (player.scale <= 1) app.gameState = GameState.START;
          break;
        case GameState.RUNNING:
          player.update(delta);
          zSpawner.spawns.forEach((zombie) => zombie.update(delta));
          bulletHitTest({
            bullets: player.shooting.bullets,
            zombies: zSpawner.spawns,
            bulletRadius: 8,
            zombieRadius: 16,
          });
          break;
        default:
          break;
      }
    });
  } catch (err) {
    console.log(err.message);
    console.log("Load Failed");
  }
}

function bulletHitTest({ bullets, zombies, bulletRadius, zombieRadius }) {
  bullets.forEach((bullet) => {
    zombies.forEach((zombie, index) => {
      let dx = zombie.position.x - bullet.position.x;
      let dy = zombie.position.y - bullet.position.y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < zombieRadius + bulletRadius) {
        zombies.splice(index, 1);
        zombie.kill();
      }
    });
  });
}

function createScene(sceneText, sceneSubText) {
  const sceneContainer = new PIXI.Container();

  const textStyle = {
    fontFamily: "Arial",
    fontSize: 36,
    fontStyle: "normal",
    fontWeight: "bold",
    fill: ["#88A050", "#FF0000"],
    stroke: "#F0E8C8",
    strokeThickness: 2,
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 440,
    lineJoin: "round",
  };
  const text = new PIXI.Text(sceneText, new PIXI.TextStyle(textStyle));
  text.x = app.screen.width / 2;
  text.y = 0;
  text.anchor.set(0.5, 0);
  sceneContainer.addChild(text);

  const subTextStyle = {
    fontFamily: "Arial",
    fontSize: 22,
    fontStyle: "normal",
    fontWeight: "bold",
    fill: ["#88A050"],
    stroke: "#0",
    strokeThickness: 2,
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 440,
    lineJoin: "round",
  };
  const subText = new PIXI.Text(sceneSubText, new PIXI.TextStyle(subTextStyle));
  subText.x = app.screen.width / 2;
  subText.y = 50;
  subText.anchor.set(0.5, 0);
  sceneContainer.addChild(subText);

  sceneContainer.zIndex = 1;
  app.stage.addChild(sceneContainer);
  return sceneContainer;
}

// function startGame() {
//   app.gameStarted = true;
//   app.weather.enableSound();
// }

async function loadAssets() {
  const zombies = [
    "tankzee",
    "dogzee",
    "femalezee",
    "nursezee",
    "quickzee",
    "copzee",
  ];
  return new Promise((res, rej) => {
    zombies.forEach((z) => PIXI.Loader.shared.add(`assets/${z}.json`));
    PIXI.Loader.shared.add("assets/hero_male.json");
    PIXI.Loader.shared.add("bullet", "assets/bullet.png");
    PIXI.Loader.shared.add("rain", "assets/rain.png");
    PIXI.Loader.shared.onComplete.add(res);
    PIXI.Loader.shared.onError.add(rej);
    PIXI.Loader.shared.load();
  });
}

function clickHandler() {
  switch (app.gameState) {
    case GameState.PREINTRO:
      app.gameState = GameState.INTRO;
      music.play();
      app.weather.enableSound();
      break;
    case GameState.START:
      app.gameState = GameState.RUNNING;
      horde.play();
      break;
    default:
      break;
  }
}

document.addEventListener("click", clickHandler);
