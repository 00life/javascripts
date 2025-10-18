import * as PIXI from "pixi.js";
import * as PARTICLES from "pixi-particles";
import { rain } from "./emitter-configs.js";

export default class Weather {
  constructor({ app }) {
    this.app = app;
    this.lightningGap = { min: 9000, max: 29000 };
    this.createAudio();
    this.lighting = new PIXI.Sprite(PIXI.Texture.WHITE);
    this.lighting.width = this.lighting.height = app.screen.width;
    this.lighting.tint = 0xffffff;
    this.lighting.alpha = 0.8;
    this.flash();
    // rain
    const container = new PIXI.ParticleContainer();
    container.zIndex = 2;
    app.stage.addChild(container);
    const textureRain = PIXI.Loader.shared.resources["rain"].texture;
    const emitter = new PARTICLES.Emitter(container, [textureRain], rain);

    let elapse = Date.now();

    const update = () => {
      requestAnimationFrame(update);
      let now = Date.now();
      emitter.update((now - elapse) * 0.001);
      elapse = now;
    };

    emitter.emit = true;
    update();
  }

  createAudio() {
    this.thunder = new Audio("./assets/thunder.mp3");
    this.rain = new Audio("./assets/rain.mp3");
    // this.rain.loop = true;
    this.rain.addEventListener("timeupdate", () => {
      if (this.rain.currentTime > this.rain.duration - 0.2)
        this.rain.currentTime = 0;
    });
  }

  async flash() {
    await new Promise((res, rej) => {
      let timingDiff = this.lightningGap.max - this.lightningGap.min;
      setTimeout(res, this.lightningGap.min + timingDiff * Math.random());
    });

    this.app.stage.addChild(this.lighting);
    if (this.sound) this.thunder.play();
    await new Promise((res, rej) => setTimeout(res, 200));
    this.app.stage.removeChild(this.lighting);
    this.flash();
  }

  enableSound() {
    this.sound = true;
    this.rain.play();
  }
}
