import Phaser from 'phaser';

class LevelScene extends Phaser.Scene {
    constructor() {
        super('LevelScene');
    }

    preload() {
        this.load.image('background', 'assets/images/mainMenuBg_extended.png');
        this.load.spritesheet('character', 'assets/images/character/moving.png', { frameWidth: 200, frameHeight: 200 });
        this.load.image('ground', 'assets/images/platforms/1.png');
        this.load.image('down', 'assets/images/platforms/down.png');
    }

    

    create() {
        this.physics.world.setBounds(0, 0, 3200, 900);
        this.cameras.main.setBounds(0, 0, 3200, 900);
        this.add.image(1600, 450, 'background').setScale(0.5);

        const bottom = this.physics.add.staticGroup();

        let x = 0;
        let y = 900;
        do
        {
            bottom.create(x, y, 'down')
                .setScale(0.25)
                .refreshBody();
            x += 30;
        }
        while (x < 3200);

        const ground = this.physics.add.staticGroup();
        ground.create(300, 800, 'ground')
            .setScale(0.1)
            .refreshBody();
        ground.create(600, 700, 'ground')
            .setScale(0.1)
            .refreshBody();
        ground.create(1000, 750, 'ground')
            .setScale(0.1)
            .refreshBody();

        this.player = this.physics.add.sprite(200, 750, 'character')
            .setScale(0.25)
            .setCollideWorldBounds(true);

        this.anims.create({
            key: 'move',
            frames: this.anims.generateFrameNumbers('character', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('character', { start: 4, end: 5 }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('character', { start: 6, end: 7 }),
            frameRate: 5,
            repeat: 0
        });

        this.anims.create({
            key: 'falling',
            frames: this.anims.generateFrameNumbers('character', { start: 8, end: 8 }),
            frameRate: 5,
            repeat: 0
        });
        
        this.player.body.setSize(this.player.width * 0.7, this.player.height * 0.9);
        this.player.body.setOffset(this.player.width * 0.15, this.player.height * 0.1);

        this.physics.add.collider(this.player, ground);

        this.cameras.main.startFollow(this.player, false, 0.2, 0.2);
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {        
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            if (this.player.body.touching.down) {
                this.player.play('move', true);
            }
            this.player.flipX = true;
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            if (this.player.body.touching.down) {
                this.player.play('move', true);
            }
            this.player.flipX = false;
        } else {
            this.player.setVelocityX(0);
            if (this.player.body.touching.down) {
                this.player.play('idle', true);
            }
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-500);
            this.player.play('jump', true);
        }

        if (!this.player.body.touching.down && this.player.body.velocity.y > 50) {
            this.player.play('falling', true);
        }
        
        // Debug
        if(this.cursors.space.isDown) {
           console.log(this.player.getBottomLeft());
        }

        if (this.player.getBottomLeft().y === 900) {            
            this.player.setPosition(500, 600);
        }
    }
}

export default LevelScene;
