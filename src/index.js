import Phaser from 'phaser';
import MainMenuScene from './scenes/MainMenuScene';
import SettingsScene from './scenes/SettingsScene';
import KeyboardTipsScene from './scenes/KeyboardTipsScene';
import SkinsScene from './scenes/SkinsScene';
import CinematicScene from './scenes/CinematicScene';
import DialogScene from './scenes/DialogScene';
import LevelScene from './scenes/LevelScene';

const config = {
    type: Phaser.CANVAS,
    width: 1600,
    height: 900,
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: true
        }
    },
    backgroundColor: '#000000',
    scene: [MainMenuScene, SettingsScene, KeyboardTipsScene, SkinsScene, CinematicScene, DialogScene, LevelScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1600,
        height: 900,
        min: {
            width: 800,
            height: 450
        },
        max: {
            width: 1920,
            height: 1080
        }
    },
    render: {
        pixelArt: false,
        antialias: true,
        roundPixels: true,
        clearBeforeRender: true
    },
    antialiasGL: true
};


const fontLoader = new Promise((resolve) => {
    const testText = document.createElement('span');
    testText.style.fontFamily = 'Karantina';
    testText.style.position = 'absolute';
    testText.style.visibility = 'hidden';
    testText.textContent = 'Test Font Loading';
    document.body.appendChild(testText);

    const checkFont = () => {
        if (document.fonts.check('700 10px Karantina')) {
            document.body.removeChild(testText);
            resolve();
        } else {
            setTimeout(checkFont, 100);
        }
    };

    checkFont();
});

fontLoader.then(() => {
    const game = new Phaser.Game(config);
});
