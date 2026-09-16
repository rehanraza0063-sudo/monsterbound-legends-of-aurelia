import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import PreloadScene from './scenes/PreloadScene.js';
import TitleScene from './scenes/TitleScene.js';
import WorldScene from './scenes/WorldScene.js';
import BattleScene from './scenes/BattleScene.js';
import MenuScene from './scenes/MenuScene.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 640,
  height: 480,
  pixelArt: true,
  backgroundColor: '#0b0d17',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: { debug: false }
  },
  scene: [BootScene, PreloadScene, TitleScene, WorldScene, BattleScene, MenuScene]
};

const game = new Phaser.Game(config);

// simple playtime tracker
setInterval(() => {
  import('./systems/GameState.js').then(({ default: GameState }) => {
    GameState.playTimeSeconds += 1;
  });
}, 1000);

window.__MONSTERBOUND_GAME__ = game;
