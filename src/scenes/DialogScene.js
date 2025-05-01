import Phaser from 'phaser';

class DialogScene extends Phaser.Scene {
    constructor() {
        super('DialogScene');
    }

    init(data) {
        console.log('Dialog data:', data);
        if (data == "s1_d1"){
            this.dialog = {
                text: 'Welcome to the game!',
                character_name: 'First character',
                avatar: 'assets/images/avatar.png',
                frame: 'assets/images/message-left.png',
                background: 'assets/images/mainMenuBg.png',
                next_dialog_code: 's1_d2',
                next_scene_name: 'MainMenuScene',
                next_scene_params: {},
                isNextDialog: true
            }
        }

        if (data == "s1_d2"){
            this.dialog = {
                text: 'Hiiiiiiii!',
                character_name: 'Second character',
                avatar: 'assets/images/avatar_2.png',
                frame: 'assets/images/message-right.png',
                background: 'assets/images/mainMenuBg.png',
                next_dialog_code: 'none',
                next_scene_name: 'MainMenuScene',
                next_scene_params: {},
                isNextDialog: false
            }
        }
    }

    preload() {
        console.log('Loading dialog:', this.dialog);
        this.textures.remove('background');
        this.textures.remove('frame');
        this.textures.remove('avatar');
        this.load.image('background', this.dialog.background);
        this.load.image('frame', this.dialog.frame);
        this.load.image('avatar', this.dialog.avatar);
    }

    create() {
        const background = this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            'background'
        );
        
        const scale = Math.max(
            this.cameras.main.width / background.width,
            this.cameras.main.height / background.height
        );
        
        background.setScale(scale);
        
        const bgWidth = background.width * scale;
        const bgHeight = background.height * scale;
        
        if (bgWidth < this.cameras.main.width) {
            background.setScale(this.cameras.main.width / background.width);
        } else if (bgHeight < this.cameras.main.height) {
            background.setScale(this.cameras.main.height / background.height);
        }

        const frame_x = this.cameras.main.width / 2;

        const frame = this.add.image(
            frame_x,
            this.cameras.main.height - 140,
            'frame'
        ).setScale(0.5);

        frame.setDepth(2);
        

        const avatar_x = this.dialog.frame == 'assets/images/message-left.png' ?
        this.cameras.main.width / 2 - frame.width/4 + 110 : this.cameras.main.width /2 + frame.width/4 - 120;


        const text_x = this.dialog.frame == 'assets/images/message-left.png' ?
        frame_x - 100 : frame_x - frame_x /2;

 
        const avatar = this.add.image(
            avatar_x+5,
            frame.y-10, 
            'avatar'
        ).setScale(0.45);
        
        avatar.setDepth(1);
          
        const nameText = this.add.text(
            avatar_x - 70,
            avatar.y + 75,
            this.dialog.character_name,
            {
                fontSize: '24px',
                color: '#ffffff',
                fontFamily: 'Arial'
            }
        );

        nameText.setDepth(3);

        const text = this.add.text(
            text_x,
            frame.y + 50,
            this.dialog.text,
            {
                fontSize: '20px',
                color: '#ffffff',
                fontFamily: 'Arial',
                wordWrap: { width: 400 },
                align: 'left'
            }
        );

        text.setDepth(3);

        this.input.on('pointerdown', () => {
            if (this.dialog.isNextDialog) {
                this.scene.start('DialogScene', this.dialog.next_dialog_code);
            } else {
                this.scene.start(this.dialog.next_scene_name, this.dialog.next_scene_params);
            }
        });
    }
}

export default DialogScene;