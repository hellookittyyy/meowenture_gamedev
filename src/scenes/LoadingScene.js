import Phaser from 'phaser';

class LoadingScene extends Phaser.Scene {
    constructor() {
        super('LoadingScene');
        this.loadingText = null;
        this.progressBar = null;
        this.progressBox = null;
        this.loadingCat = null;
    }

    preload() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        this.load.spritesheet('loading-cat', 'assets/images/character/moving.png', { 
            frameWidth: 200, 
            frameHeight: 200 
        }); 
        this.progressBox = this.add.graphics();
        this.progressBox.fillStyle(0x222222, 0.8);
        this.progressBox.fillRoundedRect(width / 2 - 160, height / 2 + 50, 320, 50, 10);

        this.progressBar = this.add.graphics();

        this.loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5);

        
        this.load.image('mainMenuBg', 'assets/images/mainMenuBg.png');
        this.load.image('mainMenuBg_extended', 'assets/images/mainMenuBg_extended.png');
        this.load.image('ground', 'assets/images/platforms/1.png');
        this.load.image('down', 'assets/images/platforms/down.png');
        this.load.audio('bgMusic', 'assets/audio/Elysium.mp3');

        this.load.on('progress', this.updateProgress, this);
        this.load.on('complete', this.loadComplete, this);
    }

    create() {
        this.loadingCat = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2 - 100, 'loading-cat');
        this.loadingCat.setScale(0.5);

        this.anims.create({
            key: 'loading-move',
            frames: this.anims.generateFrameNumbers('loading-cat', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        this.loadingCat.play('loading-move');
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
