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

        const isLeftSide = this.dialog.isLeftSide;
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
            isLeftSide ? 'left-dialog-frame' : 'right-dialog-frame'
        ).setScale(0.5);
        dialogFrame.setDepth(2);

        const textX = dialogFrame.x - dialogFrame.displayWidth / 2 + 20;
        const textY = dialogFrame.y + 20;
        const nameX = characterFrame.x;
        const nameY = characterFrame.y;

        const nameText = this.add.text(
            nameX,
            nameY + 60,
            this.dialog.character.name,
            {
                fontSize: '16px',
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
            this.insertVariables(this.dialog.text),
            {
                fontSize: '18px',
                color: '#ffffff',
                fontFamily: 'Arial',
                wordWrap: { width: dialogFrame.displayWidth * 0.95 },
                align: 'left',
                lineSpacing: 4
            }
        );
        dialogText.setDepth(3);

        const avatar = this.add.image(
            characterFrame.x,
            characterFrame.y - 12,
            this.dialog.character.avatar
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
                this.scene.start('LevelScene', this.dialog.nextLevelId);
            }
        });
    }

    insertVariables(text) {
        const coinCount = this.registry.get('coin_count');
        const deathCount = this.registry.get('death_count');
        console.log("СС",coinCount, deathCount);
        return text.replace('{coinCount}', coinCount).replace('{deathCount}', deathCount);
    }
}

export default DialogScene;