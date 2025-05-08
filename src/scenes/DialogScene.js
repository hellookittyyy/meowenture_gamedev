import Phaser from 'phaser';
import Dialog from '../classes/Dialog.js';

class DialogScene extends Phaser.Scene {
    constructor() {
        super('DialogScene');
    }

    init(id) {
        this.dialogId = id;
        this.assetsLoaded = false;
    }

    preload() {
        this.dialog = new Dialog(this.dialogId);

        this.dialog.ready.then(() => {
            console.log('Dialog loaded:', this.dialog);

            this.textures.remove('dialog-frame');
            this.textures.remove('avatar');
            this.textures.remove('background');

            this.load.image('background', this.dialog.background);
            this.load.image('character-frame', 'assets/images/character-frame.png');
            this.load.image('dialog-frame', this.dialog.frame);
            this.load.image('avatar', this.dialog.character.avatar);

            this.load.once('complete', () => {
                this.assetsLoaded = true;
                this.events.emit('create');
            });
            
            this.load.start();
        });
    }

    create() {
        if (!this.dialog.ready || !this.assetsLoaded) {
            this.events.once('create', this.create, this);
            return;
        }

        const background = this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            'background'
        );

        if (background.width > this.cameras.main.width) {
            background.setScale(this.cameras.main.width / background.width);
        } else if (background.height > this.cameras.main.height) {
            background.setScale(this.cameras.main.height / background.height);
        }

        const isLeftSide = this.dialog.frame.includes('left');
        const frameY = this.cameras.main.height - 140;

        const characterFrame = this.add.image(
            isLeftSide ? this.cameras.main.width / 2 - 250 : this.cameras.main.width / 2 + 250,
            frameY,
            'character-frame'
        ).setScale(0.5);
        characterFrame.setDepth(1);

        const dialogFrame = this.add.image(
            isLeftSide ? characterFrame.x + 700 / 2  : characterFrame.x - 700 / 2,
            frameY,
            'dialog-frame'
        ).setScale(0.5);
        dialogFrame.setDepth(2);

        const textX = dialogFrame.x - dialogFrame.displayWidth / 2 + 20;
        const textY = dialogFrame.y + dialogFrame.displayHeight / 4 + 10;
        const nameX = characterFrame.x;
        const nameY = characterFrame.y;
        

        const nameText = this.add.text(
            nameX,
            nameY + 60,
            this.dialog.character.name,
            {
                fontSize: '18px',
                color: '#ffffff',
                fontFamily: 'Arial',
                fontWeight: 'bold'
            }
        );
        nameText.setX(nameText.x - nameText.displayWidth / 2);

        nameText.setDepth(3);

        const dialogText = this.add.text(
            textX,
            textY,
            this.dialog.text,
            {
                fontSize: '22px',
                color: '#ffffff',
                fontFamily: 'Arial',
                wordWrap: { width: dialogFrame.displayWidth * 0.6 },
                align: 'left',
                lineSpacing: 8
            }
        );
        dialogText.setDepth(3);

        // Avatar image
        const avatar = this.add.image(
            characterFrame.x,
            characterFrame.y - 12,
            'avatar'
        );
        avatar.setScale(0.5);
        avatar.setDepth(3);

        if (!isLeftSide){
            avatar.flipX = true;
        }

        this.input.on('pointerdown', () => {
            if (this.dialog.nextDialogId == -1){
                this.scene.start('MainMenuScene');
            }
            else if (this.dialog.nextDialogId) {
                this.scene.start('DialogScene', this.dialog.nextDialogId);
            } else if (this.dialog.nextLevelId) {
                this.scene.start('LevelScene', { levelId: this.dialog.nextLevelId });
            }
        });
    }
}

export default DialogScene;