import Phaser from 'phaser';

class MainMenuScene extends Phaser.Scene {
    constructor() {
        super('MainMenuScene');
        this.language = 'English';
        
        this.translations = {
            'English': {
                title: 'MEOWENTURE',
                play: 'Play',
                settings: 'Settings',
                exit: 'Exit',
                newGame: 'New Game',
                continue: 'Continue',
                skins: 'Skins'
            },
            'Ukrainian': {
                title: 'MEOWENTURE',
                play: 'Грати',
                settings: 'Налаштування',
                exit: 'Вихід',
                newGame: 'Нова гра',
                continue: 'Продовжити',
                skins: 'Скіни'
            }
        };
    }
    
    init(data) {
        if (data && data.language) {
            this.language = data.language;
        }
    }

    preload() {
        console.log('Loaded assets:', 
            this.textures ? this.textures.list : 'textures not available',
            this.cache.audio ? this.cache.audio.entries : 'audio not available'
        );
        this.load.image('mainMenuBg', 'assets/images/mainMenuBg.png');
        this.load.audio('bgMusic', 'assets/audio/Elysium.mp3');
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
        
        const fontTest = document.createElement('div');
        fontTest.style.fontFamily = 'Karantina';
        fontTest.style.fontSize = '0px';
        fontTest.style.fontWeight = '700';
        fontTest.style.visibility = 'hidden';
        fontTest.textContent = 'MEOWENTURE';
        document.body.appendChild(fontTest);
        
        const titleSize = 150;
        const title = this.add.text(
            width / 2, 
            height * 0.35,
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
        
        const buttonConfig = {
            fontFamily: 'Karantina',
            fontSize: '35px',
            color: '#0F3258',
            fontWeight: '700',
            resolution: 2,
            letterSpacing: 2
        };
        
        const buttonHoverStyle = {
            fontFamily: 'Karantina',
            fontSize: '35px',
            color: '#84D760',
            fontWeight: '700',
            resolution: 2,
            letterSpacing: 2
        };
        
        const buttonTexts = [this.translations[this.language].newGame, this.translations[this.language].continue, this.translations[this.language].skins, this.translations[this.language].settings];
        const buttonY = height * 0.5;
        
        buttonTexts.forEach((text, index) => {
            const buttonWidth = 300;
            const buttonHeight = 45;
            const buttonSpacing = buttonHeight * 1.5;
            
            const buttonX = Math.round(width / 2);
            const y = Math.round(buttonY + (index * buttonSpacing));
            
            const button = this.add.graphics();
            button.fillStyle(0x84D760, 1);
            button.fillRoundedRect(buttonX - buttonWidth/2, y - buttonHeight/2, buttonWidth, buttonHeight, 25);
            
            const borderSize = Math.min(9, buttonWidth * 0.02);
            button.lineStyle(borderSize, 0x0F3258, 1);
            button.strokeRoundedRect(buttonX - buttonWidth/2, y - buttonHeight/2, buttonWidth, buttonHeight, 25);
            
            const buttonText = this.add.text(buttonX, y, text, buttonConfig);
            buttonText.setOrigin(0.5, 0.5);
            
            const hitArea = new Phaser.Geom.Rectangle(buttonX - buttonWidth/2, y - buttonHeight/2, buttonWidth, buttonHeight);
            const hitAreaCallback = Phaser.Geom.Rectangle.Contains;
            
            button.setInteractive(hitArea, hitAreaCallback);
            
            button.on('pointerover', () => {
                button.clear();
                button.fillStyle(0x0F3258, 1);
                button.fillRoundedRect(buttonX - buttonWidth/2, y - buttonHeight/2, buttonWidth, buttonHeight, 25);
                button.lineStyle(borderSize, 0x84D760, 1);
                button.strokeRoundedRect(buttonX - buttonWidth/2, y - buttonHeight/2, buttonWidth, buttonHeight, 25);

                buttonText.setStyle(buttonHoverStyle);
                this.input.setDefaultCursor('pointer');
            });
            
            button.on('pointerout', () => {
                button.clear();
                button.fillStyle(0x84D760, 1);
                button.fillRoundedRect(buttonX - buttonWidth/2, y - buttonHeight/2, buttonWidth, buttonHeight, 25);
                button.lineStyle(borderSize, 0x0F3258, 1);
                button.strokeRoundedRect(buttonX - buttonWidth/2, y - buttonHeight/2, buttonWidth, buttonHeight, 25);
                this.input.setDefaultCursor('auto');
                
                buttonText.setStyle(buttonConfig);
            });
            
            button.on('pointerdown', () => {
                console.log(`Button ${text} clicked`);
 
                switch(text) {
                    case this.translations[this.language].newGame:
                        //this.scene.start('LevelScene');
                        this.scene.start('CinematicScene', { path: 'assets/videos/scene1.mp4', next_scene: 'MainMenuScene' });   
                        break;
                    case this.translations[this.language].continue:
                        break;
                    case this.translations[this.language].skins:
                        this.scene.start('SkinsScene', { language: this.language });
                        break;
                    case this.translations[this.language].settings:
                        this.scene.start('SettingsScene', { language: this.language });
                        break;
                }
            });
        });
        
        if (!this.sound.get('bgMusic')) {
            this.bgMusic = this.sound.add('bgMusic');
            this.bgMusic.play({
                loop: true,
                volume: 1.0
            });
        } else {
            this.bgMusic = this.sound.get('bgMusic');
        }

        this.sound.bgMusic = this.bgMusic;
    }
}

export default MainMenuScene;
