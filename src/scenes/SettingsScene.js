import Phaser from 'phaser';

class SettingsScene extends Phaser.Scene {
    constructor() {
        super('SettingsScene');
        this.volume = 75;
        this.language = 'English';
        this.languages = ['English', 'Ukrainian'];
        this.languageIndex = 0;
        
        this.translations = {
            'English': {
                settings: 'SETTINGS',
                language: 'Language',
                volume: 'Volume',
                keyboardBindings: 'Keyboard Bindings',
                showTips: 'Show Tips',
                restartCheckpoint: 'Restart Checkpoint',
                submit: 'Submit'
            },
            'Ukrainian': {
                settings: 'НАЛАШТУВАННЯ',
                language: 'Мова',
                volume: 'Гучність',
                keyboardBindings: 'Керування',
                showTips: 'Показати',
                restartCheckpoint: 'Перезапустити',
                submit: 'Підтвердити'
            }
        };
    }
    
    init(data) {
        if (data && data.language) {
            this.language = data.language;
            this.languageIndex = this.languages.indexOf(this.language);
            if (this.languageIndex === -1) this.languageIndex = 0;
        }
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
        
        const titleSize = 150;
        this.titleText = this.add.text(
            Math.round(width / 2), 
            Math.round(height * 0.25),
            this.translations[this.language].settings, 
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
        this.titleText.setOrigin(0.5, 0.5);
        
        // Reduced width for settings container
        const settingsBlockWidth = width * 0.6;
        const settingsBlockHeight = height * 0.48;
        const settingsBlock = this.add.graphics();
        settingsBlock.fillStyle(0x84D760, 1);
        settingsBlock.fillRoundedRect(
            width/2 - settingsBlockWidth/2, 
            height/2 - settingsBlockHeight/4, 
            settingsBlockWidth, 
            settingsBlockHeight,
            20
        );
        
        settingsBlock.lineStyle(3, 0xFFFFFF, 1);
        settingsBlock.strokeRoundedRect(
            width/2 - settingsBlockWidth/2, 
            height/2 - settingsBlockHeight/4, 
            settingsBlockWidth, 
            settingsBlockHeight,
            20
        );
        
        const settingContainerHeight = settingsBlockHeight / 4 - 20;
        const settingContainerWidth = settingsBlockWidth - 40;
        const settingLabelStyle = {
            fontFamily: 'Karantina',
            fontSize: '35px',
            color: '#0F3258',
            fontWeight: '700',
            resolution: 2
        };
        
        const settingValueStyle = {
            fontFamily: 'Karantina',
            fontSize: '35px',
            color: '#0F3258',
            fontWeight: '700',
            resolution: 2
        };
        
        const buttonStyle = {
            fontFamily: 'Karantina',
            fontSize: '30px',
            color: '#0F3258',
            fontWeight: '700',
            resolution: 2
        };
        
        const buttonHoverStyle = {
            fontFamily: 'Karantina',
            fontSize: '30px',
            color: '#FFFFFF',
            fontWeight: '700',
            resolution: 2
        };
        
        // Language Setting
        this.languageLabel = this.createLanguageSelector(
            width/2 - settingsBlockWidth/2 + 20,
            height/2 - settingsBlockHeight/4 + 20,
            settingContainerWidth,
            settingContainerHeight,
            this.translations[this.language].language,
            this.language,
            settingLabelStyle,
            settingValueStyle
        );
        
        // Volume Setting
        this.volumeLabel = this.createVolumeContainer(
            width/2 - settingsBlockWidth/2 + 20,
            height/2 - settingsBlockHeight/4 + 20 + settingContainerHeight + 10,
            settingContainerWidth,
            settingContainerHeight,
            this.translations[this.language].volume,
            this.volume,
            settingLabelStyle,
            settingValueStyle
        );
        
        // Keyboard Bindings
        this.keyboardLabel = this.createButtonContainer(
            width/2 - settingsBlockWidth/2 + 20,
            height/2 - settingsBlockHeight/4 + 20 + (settingContainerHeight + 10) * 2,
            settingContainerWidth,
            settingContainerHeight,
            this.translations[this.language].keyboardBindings,
            this.translations[this.language].showTips,
            settingLabelStyle,
            buttonStyle,
            buttonHoverStyle,
            () => {
                this.scene.start('KeyboardTipsScene', { language: this.language });
            }
        );
        
        // Restart Checkpoint
        this.restartLabel = this.createButtonContainer(
            width/2 - settingsBlockWidth/2 + 20,
            height/2 - settingsBlockHeight/4 + 20 + (settingContainerHeight + 10) * 3,
            settingContainerWidth,
            settingContainerHeight,
            this.translations[this.language].restartCheckpoint,
            this.translations[this.language].submit,
            settingLabelStyle,
            buttonStyle,
            buttonHoverStyle,
            () => {
                console.log('Restart checkpoint');
            }
        );
    }
    
    updateLanguage() {
        // Update all text elements with the new language
        this.titleText.setText(this.translations[this.language].settings);
        this.languageLabel.setText(this.translations[this.language].language);
        this.volumeLabel.setText(this.translations[this.language].volume);
        this.keyboardLabel.setText(this.translations[this.language].keyboardBindings);
        this.keyboardButton.setText(this.translations[this.language].showTips);
        this.restartLabel.setText(this.translations[this.language].restartCheckpoint);
        this.restartButton.setText(this.translations[this.language].submit);
        
        // Apply smaller font size for Ukrainian language text
        if (this.language === 'Ukrainian') {
            // Make all text elements 50% smaller for Ukrainian language
            const smallerStyle = { 
                fontSize: '17px', 
                letterSpacing: '0px',
                fontFamily: 'Karantina',
                color: '#0F3258',
                fontWeight: '700',
                resolution: 2
            };
            
            this.languageLabel.setStyle(smallerStyle);
            this.volumeLabel.setStyle(smallerStyle);
            this.keyboardLabel.setStyle(smallerStyle);
            this.restartLabel.setStyle(smallerStyle);
            
            // Make button text smaller too
            const smallerButtonStyle = { 
                fontSize: '15px', 
                letterSpacing: '0px',
                fontFamily: 'Karantina',
                color: '#0F3258',
                fontWeight: '700',
                resolution: 2
            };
            this.keyboardButton.setStyle(smallerButtonStyle);
            this.restartButton.setStyle(smallerButtonStyle);
            
            // Title needs to be proportionally smaller with no letter spacing
            this.titleText.setStyle({ 
                fontSize: '75px', 
                letterSpacing: '0px',
                fontFamily: 'Karantina',
                color: '#0F3258',
                fontWeight: '700',
                resolution: 2
            });
        } else {
            // Restore original styles for English
            const normalLabelStyle = {
                fontFamily: 'Karantina',
                fontSize: '35px',
                color: '#0F3258',
                fontWeight: '700',
                resolution: 2
            };
            
            this.languageLabel.setStyle(normalLabelStyle);
            this.volumeLabel.setStyle(normalLabelStyle);
            this.keyboardLabel.setStyle(normalLabelStyle);
            this.restartLabel.setStyle(normalLabelStyle);

            
            
            // Restore button style
            const normalButtonStyle = {
                fontFamily: 'Karantina',
                fontSize: '30px',
                color: '#0F3258',
                fontWeight: '700',
                resolution: 2
            };
            this.keyboardButton.setStyle(normalButtonStyle);
            this.restartButton.setStyle(normalButtonStyle);
            
            // Restore title style
            this.titleText.setStyle({ 
                fontFamily: 'Karantina', 
                fontSize: '150px', 
                color: '#0F3258',
                fontWeight: '700',
                letterSpacing: 10,
                resolution: 2
            });
        }
    }
    
    createLanguageSelector(x, y, width, height, label, value, labelStyle, valueStyle) {
        const container = this.add.graphics();
        container.fillStyle(0xFFFFFF, 0.36);
        container.fillRoundedRect(x, y, width, height, 15);
        
        container.lineStyle(2, 0xFFFFFF, 1);
        container.strokeRoundedRect(x, y, width, height, 15);
        
        const labelText = this.add.text(
            x + 20, 
            y + height/2, 
            label, 
            labelStyle
        );
        labelText.setOrigin(0, 0.5);
        
        // Left arrow - smaller size
        const arrowStyle = {
            fontFamily: 'Karantina',
            fontSize: '20px', 
            color: '#0F3258',
            fontWeight: '700',
            resolution: 2
        };
        
        // Left arrow
        const leftArrow = this.add.text(
            x + width - 140, 
            y + height/2, 
            'ᐸ', 
            arrowStyle
        );
        leftArrow.setOrigin(0.5, 0.5);
        leftArrow.setInteractive({ useHandCursor: true });
        
        // Language text
        const languageTextStyle = { ...valueStyle };
        
        this.languageText = this.add.text(
            x + width - 80, 
            y + height/2, 
            value, 
            languageTextStyle
        );
        this.languageText.setOrigin(0.5, 0.5);
        
        // Right arrow
        const rightArrow = this.add.text(
            x + width - 20, 
            y + height/2, 
            'ᐳ', 
            arrowStyle
        );
        rightArrow.setOrigin(0.5, 0.5);
        rightArrow.setInteractive({ useHandCursor: true });
        
        // Arrow interactions
        leftArrow.on('pointerdown', () => {
            this.languageIndex = (this.languageIndex - 1 + this.languages.length) % this.languages.length;
            this.language = this.languages[this.languageIndex];
            this.languageText.setText(this.language);
            this.updateLanguage();
        });
        
        rightArrow.on('pointerdown', () => {
            this.languageIndex = (this.languageIndex + 1) % this.languages.length;
            this.language = this.languages[this.languageIndex];
            this.languageText.setText(this.language);
            this.updateLanguage();
        });
        
        return labelText;
    }
    
    createVolumeContainer(x, y, width, height, label, value, labelStyle, valueStyle) {
        const container = this.add.graphics();
        container.fillStyle(0xFFFFFF, 0.36);
        container.fillRoundedRect(x, y, width, height, 15);
        
        container.lineStyle(2, 0xFFFFFF, 1);
        container.strokeRoundedRect(x, y, width, height, 15);
        
        const labelText = this.add.text(
            x + 20, 
            y + height/2, 
            label, 
            labelStyle
        );
        labelText.setOrigin(0, 0.5);
        
        const barWidth = width * 0.4;
        const barHeight = 20;
        const barX = x + width - barWidth - 80;
        const barY = y + height/2 - barHeight/2;
        
        // Background bar
        const barBg = this.add.graphics();
        barBg.fillStyle(0x0F3258, 0.3);
        barBg.fillRoundedRect(barX, barY, barWidth, barHeight, 10);
        
        // Value bar
        const valueBar = this.add.graphics();
        valueBar.fillStyle(0x0F3258, 1);
        const valueBarWidth = (value / 100) * barWidth;
        valueBar.fillRoundedRect(barX, barY, valueBarWidth, barHeight, 10);
        
        // Value text
        const valueText = this.add.text(
            x + width - 20, 
            y + height/2, 
            `${value}%`, 
            valueStyle
        );
        valueText.setOrigin(1, 0.5);
        
        // Store references
        this.volumeBar = valueBar;
        this.volumeText = valueText;
        this.volumeBarX = barX;
        this.volumeBarY = barY;
        this.volumeBarWidth = barWidth;
        this.volumeBarHeight = barHeight;
        
        // Make bar interactive
        const barHitArea = new Phaser.Geom.Rectangle(barX, barY, barWidth, barHeight);
        barBg.setInteractive(barHitArea, Phaser.Geom.Rectangle.Contains);
        
        barBg.on('pointerdown', (pointer) => {
            this.draggingVolume = true;
            this.updateVolume(pointer.x);
        });
        
        barBg.on('pointermove', (pointer) => {
            if (this.draggingVolume) {
                this.updateVolume(pointer.x);
            }
        });
        
        barBg.on('pointerup', () => {
            this.draggingVolume = false;
        });
        
        return labelText;
    }
    
    updateVolume(mouseX) {
        // Calculate relative position within bar
        const relativeX = Phaser.Math.Clamp(mouseX - this.volumeBarX, 0, this.volumeBarWidth);
        const percentage = Math.max(0, Math.min(100, Math.round((relativeX / this.volumeBarWidth) * 100)));
        
        // Update bar
        this.volumeBar.clear();
        this.volumeBar.fillStyle(0x0F3258, 1);
        const newWidth = (percentage / 100) * this.volumeBarWidth;
        this.volumeBar.fillRoundedRect(this.volumeBarX, this.volumeBarY, newWidth, this.volumeBarHeight, 10);
        
        // Update text
        this.volumeText.setText(`${percentage}%`);
        
        // Update music volume
        if (this.sound.get('bgMusic')) {
            this.sound.get('bgMusic').setVolume(percentage / 100);
        }
    }
    
    createButtonContainer(x, y, width, height, label, buttonText, labelStyle, buttonStyle, buttonHoverStyle, onClick) {
        const container = this.add.graphics();
        container.fillStyle(0xFFFFFF, 0.36);
        container.fillRoundedRect(x, y, width, height, 15);
        
        container.lineStyle(2, 0xFFFFFF, 1);
        container.strokeRoundedRect(x, y, width, height, 15);
        
        const labelText = this.add.text(
            x + 20, 
            y + height/2, 
            label, 
            labelStyle
        );
        labelText.setOrigin(0, 0.5);
        
        // Button
        const buttonWidth = 150;
        const buttonHeight = 40;
        const buttonX = x + width - buttonWidth - 20;
        const buttonY = y + height/2 - buttonHeight/2;
        
        const button = this.add.graphics();
        button.fillStyle(0x84D760, 1);
        button.fillRoundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 15);
        
        button.lineStyle(2, 0x0F3258, 1);
        button.strokeRoundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 15);
        
        const buttonTextObj = this.add.text(
            buttonX + buttonWidth/2, 
            buttonY + buttonHeight/2, 
            buttonText, 
            buttonStyle
        );
        buttonTextObj.setOrigin(0.5, 0.5);
        
        const buttonHitArea = new Phaser.Geom.Rectangle(buttonX, buttonY, buttonWidth, buttonHeight);
        button.setInteractive(buttonHitArea, Phaser.Geom.Rectangle.Contains);
        
        button.on('pointerover', () => {
            button.clear();
            button.fillStyle(0x0F3258, 1);
            button.fillRoundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 15);
            button.lineStyle(2, 0x84D760, 1);
            button.strokeRoundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 15);
            this.input.setDefaultCursor('pointer');

            buttonTextObj.setStyle(buttonHoverStyle);
        });
        
        button.on('pointerout', () => {
            button.clear();
            button.fillStyle(0x84D760, 1);
            button.fillRoundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 15);
            button.lineStyle(2, 0x0F3258, 1);
            button.strokeRoundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 15);
            this.input.setDefaultCursor('auto');
            
            buttonTextObj.setStyle(buttonStyle);
        });
        
        button.on('pointerdown', onClick);
        
        // Store button text for language updates
        if (label === this.translations[this.language].keyboardBindings) {
            this.keyboardButton = buttonTextObj;
        } else if (label === this.translations[this.language].restartCheckpoint) {
            this.restartButton = buttonTextObj;
        }
        
        return labelText;
    }

    
}

export default SettingsScene;
