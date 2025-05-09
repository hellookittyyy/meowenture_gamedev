import Phaser from 'phaser';

class LoadingScene extends Phaser.Scene {
    constructor() {
        super('LoadingScene');
        this.loadingText = null;
        this.progressBar = null;
        this.progressBox = null;
    }

    preload() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.progressBox = this.add.graphics();
        this.progressBox.fillStyle(0x222222, 0.8);
        this.progressBox.fillRoundedRect(width / 2 - 160, height / 2 + 50, 320, 50, 10);

        this.progressBar = this.add.graphics();

        this.loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
            fontSize: '32px',
            color: '#ffffff',
            fontFamily: 'Karantina',
            fontWeight: '700',
            resolution: 2,
            letterSpacing: 2
        }).setOrigin(0.5);

        const platformsAssets = ['platform1', 'platform2', 'platform3', 'platform4', 'platform5', 'platform6', 'platform7', 'spike'];

        platformsAssets.forEach(platform => {
            this.load.image(platform, `assets/images/platforms/${platform}.png`);
        });

        const interfaceAssets = ['coin', 'heart', 'heart-empty', 'start', 'finish'];

        interfaceAssets.forEach(asset => {
            this.load.image(asset, `assets/images/interface/${asset}.png`);
        });

        this.load.audio('bgMusic', 'assets/audio/Elysium.mp3');

        this.load.image('level_background', 'assets/images/mainMenuBg_extended.png');
        this.load.image('mainMenuBg', 'assets/images/mainMenuBg.png');
        this.load.image('background', 'assets/images/mainMenuBg.png');

        this.load.image('character-frame', 'assets/images/dialogs/character-frame.png');
        this.load.image('left-dialog-frame', 'assets/images/dialogs/dialog-left-frame.png');
        this.load.image('right-dialog-frame', 'assets/images/dialogs/dialog-right-frame.png');

        this.load.spritesheet('character', 'assets/images/character/moving_sprite.png', { frameWidth: 200, frameHeight: 200 });
        this.load.image('cat-1', 'assets/images/character/skin.png');
        this.load.image('cat-2', 'assets/images/character/skin2.png');

        this.load.on('progress', this.updateProgress, this);
        this.load.on('complete', this.loadComplete, this);
    }

    updateProgress(value) {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.progressBar.clear();
        this.progressBar.fillStyle(0x84D760, 1);
        this.progressBar.fillRoundedRect(width / 2 - 150, height / 2 + 60, 300 * value, 30, 5);

        const percent = Math.round(value * 100);
        this.loadingText.setText(`Loading... ${percent}%`);
    }

    loadComplete() {
        this.cameras.main.fadeOut(500);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('MainMenuScene');
        });
    }
}

export default LoadingScene;
