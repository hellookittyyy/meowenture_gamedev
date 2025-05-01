import Phaser from 'phaser';

class KeyboardTipsScene extends Phaser.Scene {
    constructor() {
        super('KeyboardTipsScene');
        this.translations = {
            'English': {
                title: 'KEYBOARD',
                back: 'Back',
                tip1: '1: lorem ipsum',
                tip2: '2: lorem ipsum',
                tip3: '3: lorem ipsum',
                tip4: '4: lorem ipsum'
            },
            'Ukrainian': {
                title: 'КЛАВІАТУРА',
                back: 'Назад',
                tip1: '1: lorem ipsum',
                tip2: '2: lorem ipsum',
                tip3: '3: lorem ipsum',
                tip4: '4: lorem ipsum'
            }
        };
    }

    init(data) {
        this.language = data.language || 'English';
    }

    preload() {
        this.load.image('mainMenuBg', 'assets/images/mainMenuBg.png');
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
        backButton.fillStyle(0x0F3258, 1);
        backButton.fillCircle(60, 60, 20);
        
        backButton.lineStyle(3, 0x84D760, 1);
        backButton.strokeCircle(60, 60, 20);
        
        // Left arrow
        const arrowStyle = {
            fontFamily: 'Karantina',
            fontSize: '25px',
            color: '#84D760',
            fontWeight: '700',
            resolution: 2
        };
        
        const arrowText = this.add.text(60, 60, '➥', arrowStyle);
        arrowText.setOrigin(0.5, 0.5);
        arrowText.setAngle(180);
        
        backButton.setInteractive(new Phaser.Geom.Circle(60, 60, 20), Phaser.Geom.Circle.Contains);
        
        backButton.on('pointerover', () => {
            backButton.clear();
            backButton.fillStyle(0x84D760, 1);
            backButton.fillCircle(60, 60, 20);
            backButton.lineStyle(3, 0x0F3258, 1);
            backButton.strokeCircle(60, 60, 20);
            this.input.setDefaultCursor('pointer');

            
            arrowText.setStyle({
                fontFamily: 'Karantina',
                fontSize: '25px',
                color: '#0F3258',
                fontWeight: '700',
                resolution: 2
            });
        });
        
        backButton.on('pointerout', () => {
            backButton.clear();
            backButton.fillStyle(0x0F3258, 1);
            backButton.fillCircle(60, 60, 20);
            backButton.lineStyle(3, 0x84D760, 1);
            backButton.strokeCircle(60, 60, 20);
            this.input.setDefaultCursor('auto');
           
            arrowText.setStyle(arrowStyle);
        });
        
        backButton.on('pointerdown', () => {
            this.scene.start('SettingsScene', { language: this.language });
        });
        
        // Title with the same styling as other titles
        const titleSize = 150;
        const title = this.add.text(
            Math.round(width / 2), 
            Math.round(height * 0.25),
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
        
        // Create container with semi-transparent background (#84D7605C)
        const containerWidth = width * 0.6;
        const containerHeight = height * 0.48; 
        const container = this.add.graphics();
        
        // Convert hex color #84D7605C to rgba
        // #84D760 with 5C (36%) opacity
        container.fillStyle(0x84D760, 0.36);
        container.fillRoundedRect(
            width/2 - containerWidth/2, 
            height/2 - containerHeight/4, 
            containerWidth, 
            containerHeight,
            20
        );
        
        container.lineStyle(3, 0xFFFFFF, 1);
        container.strokeRoundedRect(
            width/2 - containerWidth/2, 
            height/2 - containerHeight/4, 
            containerWidth, 
            containerHeight,
            20
        );
        
        // Define styles
        const keyStyle = {
            fontFamily: 'Karantina',
            fontSize: '30px',
            color: '#84D760',
            fontWeight: '700',
            resolution: 2
        };
        
        const tipStyle = {
            fontFamily: 'Karantina',
            fontSize: '35px',
            color: '#0F3258',
            fontWeight: '700',
            resolution: 2
        };
        
        // Create the 4 arrow keys in the left part of the container
        const keySize = 80;
        const keySpacing = 10;
        
        // Calculate positions
        const containerLeft = width/2 - containerWidth/2;
        const containerRight = width/2 + containerWidth/2;
        const leftHalfCenter = containerLeft + containerWidth/4; // Center of left half of rectangle
        const startY = height/2 + containerHeight/3;
        
        this.createKey(leftHalfCenter, startY - keySize - keySpacing, keySize, '⬆', keyStyle);
        this.createKey(leftHalfCenter - keySize - keySpacing, startY, keySize, '⬅', keyStyle);
        this.createKey(leftHalfCenter, startY, keySize, '⬇', keyStyle);
        this.createKey(leftHalfCenter + keySize + keySpacing, startY, keySize, '➡', keyStyle);
        
        const rightHalfCenter = containerLeft + containerWidth * 2/3 - 30; 
        const tipY = height/2 + containerHeight/5;
        const tipSpacing = 50;
        
        // Tip 1
        const tip1 = this.add.text(
            rightHalfCenter,
            tipY - tipSpacing * 1.5,
            this.translations[this.language].tip1,
            tipStyle
        );
        tip1.setOrigin(0, 0.5);
        
        // Tip 2
        const tip2 = this.add.text(
            rightHalfCenter,
            tipY - tipSpacing * 0.5,
            this.translations[this.language].tip2,
            tipStyle
        );
        tip2.setOrigin(0, 0.5);
        
        // Tip 3
        const tip3 = this.add.text(
            rightHalfCenter,
            tipY + tipSpacing * 0.5,
            this.translations[this.language].tip3,
            tipStyle
        );
        tip3.setOrigin(0, 0.5);
        
        // Tip 4
        const tip4 = this.add.text(
            rightHalfCenter,
            tipY + tipSpacing * 1.5,
            this.translations[this.language].tip4,
            tipStyle
        );
        tip4.setOrigin(0, 0.5);
    }
    
    createKey(x, y, width, text, style, height = null, rotation = 0) {
        if (!height) height = width;
        
        const key = this.add.graphics();
        key.fillStyle(0x0F3258, 1);
        key.fillRoundedRect(x - width/2, y - height/2, width, height, 10);
        
        key.lineStyle(2, 0x84D760, 1);
        key.strokeRoundedRect(x - width/2, y - height/2, width, height, 10);
        
        const keyText = this.add.text(
            x, 
            y, 
            text, 
            style
        );
        keyText.setOrigin(0.5, 0.5);
        
        // Apply rotation if specified
        if (rotation !== 0) {
            keyText.setAngle(rotation);
        }
        
        return { key, keyText };
    }
}

export default KeyboardTipsScene;
