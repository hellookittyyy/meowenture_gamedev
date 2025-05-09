import Phaser from 'phaser';

class SkinsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SkinsScene' });
        this.translations = {
            'English': {
                title: 'SKINS'
            },
            'Ukrainian': {
                title: 'СКІНИ'
            }
        };
    }

    init(data) {
        this.language = data.language || 'English';
    }

    preload() {
        this.load.image('mainMenuBg', 'assets/images/mainMenuBg.png');
        this.load.image('skin1', 'assets/images/skin.png');
        this.load.image('skin2', 'assets/images/skin2.png');
        this.load.image('skin3', 'assets/images/skin3.png');
        this.load.image('skin4', 'assets/images/skin4.png');
    }

    create() {
        this.input.setDefaultCursor('auto');

        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const bg = this.add.image(width / 2, height / 2, 'mainMenuBg');
        
        const scaleX = width / bg.width;
        const scaleY = height / bg.height;
        const scale = Math.max(scaleX, scaleY);
        bg.setScale(scale);
        
        // Back button (left arrow in circle)
        const backButton = this.add.graphics();
        backButton.fillStyle(0x84D760, 1);
        backButton.fillCircle(60, 60, 20);
        
        backButton.lineStyle(3, 0x0F3258, 1);
        backButton.strokeCircle(60, 60, 20);
        
        // Left arrow
        const arrowStyle = {
            fontFamily: 'Karantina',
            fontSize: '25px',
            color: '#0F3258',
            fontWeight: '700',
            resolution: 2
        };
        
        const arrowText = this.add.text(60, 60, '➥', arrowStyle);
        arrowText.setOrigin(0.5, 0.5);
        arrowText.setAngle(180);

        backButton.setInteractive(new Phaser.Geom.Circle(60, 60, 20), Phaser.Geom.Circle.Contains);
                
                backButton.on('pointerover', () => {
                    backButton.clear();
                    backButton.fillStyle(0x0F3258, 1);
                    backButton.fillCircle(60, 60, 20);
                    backButton.lineStyle(3, 0x84D760, 1);
                    backButton.strokeCircle(60, 60, 20);
                    this.input.setDefaultCursor('pointer');

                    
                    arrowText.setStyle({
                        fontFamily: 'Karantina',
                        fontSize: '25px',
                        color: '#84D760',
                        fontWeight: '700',
                        resolution: 2
                    });
                });
                
                backButton.on('pointerout', () => {
                    backButton.clear();
                    backButton.fillStyle(0x84D760, 1);
                    backButton.fillCircle(60, 60, 20);
                    backButton.lineStyle(3, 0x0F3258, 1);
                    backButton.strokeCircle(60, 60, 20);
                    this.input.setDefaultCursor('auto');

                    arrowText.setStyle(arrowStyle);
                });
                
                backButton.on('pointerdown', () => {
                    this.scene.start('MainMenuScene', { language: this.language });
                });
        
        // Title
        const titleSize = 150;
        const title = this.add.text(
            width / 2, 
            height * 0.2,
            this.translations[this.language].title, 
            { 
                fontFamily: 'Karantina', 
                fontSize: `${titleSize}px`, 
                color: '#0F3258',
                fontWeight: '700',
                letterSpacing: 10,
                resolution: 2,
                stroke: '#ACE2FF',
                strokeThickness: 10
            }
        );
        title.setOrigin(0.5, 0.5);

        const containerCoords1 = {
            x: 150,
            y: 230
        };

        const containerCoords2 = {
            x: 420,
            y: 230
        };

        const containerCoords3 = {
            x: 680,
            y: 230
        };

        const containerCoords4 = {
            x: 950,
            y: 230
        };

        const containerCoords5 = {
            x: 150,
            y: 430
        };

        const containerCoords6 = {
            x: 420,
            y: 430
        }

        const containerCoords7 = {
            x: 680,
            y: 430
        }

        const containerCoords8 = {
            x: 950,
            y: 430
        }

        const skinCoords = {
            x: 240,
            y: 320
        };

        const skinCoords2 = {
            x: 510,
            y: 320
        };
        
        const skinCoords3 = {
            x: 770,
            y: 320
        };

        const skinCoords4 = {
            x: 1040,
            y: 320
        };

        const containerWidth = 180;
        const containerHeight = containerWidth; 

        const container = this.add.graphics();
        container.fillStyle(0x0F3258, 0.74);
        container.fillRoundedRect(containerCoords1.x, containerCoords1.y, containerWidth, containerHeight, 15);
        container.lineStyle(2, 0xFFFFFF, 1);
        container.strokeRoundedRect(containerCoords1.x, containerCoords1.y, containerWidth, containerHeight, 15);

        const container2 = this.add.graphics();
        container2.fillStyle(0x0F3258, 0.74);
        container2.fillRoundedRect(containerCoords2.x, containerCoords2.y, containerWidth, containerHeight, 15);
        container2.lineStyle(2, 0xFFFFFF, 1);
        container2.strokeRoundedRect(containerCoords2.x, containerCoords2.y, containerWidth, containerHeight, 15);

        const container3 = this.add.graphics();
        container3.fillStyle(0x0F3258, 0.74);
        container3.fillRoundedRect(containerCoords3.x, containerCoords3.y, containerWidth, containerHeight, 15);
        container3.lineStyle(2, 0xFFFFFF, 1);
        container3.strokeRoundedRect(containerCoords3.x, containerCoords3.y, containerWidth, containerHeight, 15);

        const container4 = this.add.graphics();
        container4.fillStyle(0x0F3258, 0.74);
        container4.fillRoundedRect(containerCoords4.x, containerCoords4.y, containerWidth, containerHeight, 15);
        container4.lineStyle(2, 0xFFFFFF, 1);
        container4.strokeRoundedRect(containerCoords4.x, containerCoords4.y, containerWidth, containerHeight, 15);

        const container5 = this.add.graphics();
        container5.fillStyle(0x0F3258, 0.74);
        container5.fillRoundedRect(containerCoords5.x, containerCoords5.y, containerWidth, containerHeight, 15);
        container5.lineStyle(2, 0xFFFFFF, 1);
        container5.strokeRoundedRect(containerCoords5.x, containerCoords5.y, containerWidth, containerHeight, 15);

        const container6 = this.add.graphics();
        container6.fillStyle(0x0F3258, 0.74);
        container6.fillRoundedRect(containerCoords6.x, containerCoords6.y, containerWidth, containerHeight, 15);
        container6.lineStyle(2, 0xFFFFFF, 1);
        container6.strokeRoundedRect(containerCoords6.x, containerCoords6.y, containerWidth, containerHeight, 15);

        const container7 = this.add.graphics();
        container7.fillStyle(0x0F3258, 0.74);
        container7.fillRoundedRect(containerCoords7.x, containerCoords7.y, containerWidth, containerHeight, 15);
        container7.lineStyle(2, 0xFFFFFF, 1);
        container7.strokeRoundedRect(containerCoords7.x, containerCoords7.y, containerWidth, containerHeight, 15);

        const container8 = this.add.graphics();
        container8.fillStyle(0x0F3258, 0.74);
        container8.fillRoundedRect(containerCoords8.x, containerCoords8.y, containerWidth, containerHeight, 15);
        container8.lineStyle(2, 0xFFFFFF, 1);
        container8.strokeRoundedRect(containerCoords8.x, containerCoords8.y, containerWidth, containerHeight, 15);

        const skin1 = this.add.image(skinCoords.x, skinCoords.y , 'cat-1');
        skin1.setDisplaySize(containerWidth-20, containerHeight-20);

        const skin2 = this.add.image(skinCoords2.x, skinCoords2.y , 'cat-2');
        skin2.setDisplaySize(containerWidth-20, containerHeight-20);

        const skin3 = this.add.image(skinCoords3.x, skinCoords3.y , 'skin3');
        skin3.setDisplaySize(containerWidth-20, containerHeight-20);

        const skin4 = this.add.image(skinCoords4.x, skinCoords4.y , 'skin4');
        skin4.setDisplaySize(containerWidth-20, containerHeight-20);
    }

}

export default SkinsScene;
