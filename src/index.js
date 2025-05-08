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


document.fonts.ready.then(() => {
    const karantinaFont = new FontFace('Karantina', 'url(https://fonts.gstatic.com/s/karantina/v13/buExpo24ccnh31GVMABxXCgf-P5Oaiw.woff2)', {
        weight: '700'
    });
    
    karantinaFont.load().then(font => {
        document.fonts.add(font);
        console.log('Karantina font loaded successfully');
        const game = new Phaser.Game(config);

        console.log(game.scale);
    }).catch(error => {
        console.error('Font loading failed:', error);
        const game = new Phaser.Game(config);

    });
});
