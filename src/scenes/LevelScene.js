import Phaser from 'phaser';

const MAX_HP = 3;

class LevelScene extends Phaser.Scene {
    constructor() {
        super('LevelScene');
        this.isInvincible = false;
    }

    init() {
        this.hp = MAX_HP;
        this.dead = false;
        this.isInvincible = false;
        if (!this.registry.has('death_count')) {
            this.registry.set('death_count', 0);
        }

        this.cameras.main.fadeIn(500);

        this.level = {
            start: {
                x: 200,
                y: 720
            },
            finish: {
                x: 1700,
                y: 370
            },
            nextDialogId: 20,
            levelNum: 1
        }
    }
    
    drawInterface() {
        const interface_scale = 2;
        
        for (let i = 0; i < this.hp; i++) {
            this.add.image(50 + i * 50, 50, 'heart').setScale(interface_scale).setScrollFactor(0);
        }

        for (let i = this.hp; i < MAX_HP; i++) {
            this.add.image(50 + i * 50, 50, 'heart-empty').setScale(interface_scale).setScrollFactor(0);
        }

        this.add.image(this.level.start.x, this.level.start.y, 'start').setScale(interface_scale/4);
        
        this.finishArea = this.physics.add.sprite(this.level.finish.x, this.level.finish.y, 'finish')
            .setScale(interface_scale/4)
            .setImmovable(true);
        this.finishArea.body.setAllowGravity(false);
    }

    create() {
        this.physics.world.setBounds(0, 0, 3200, 900);
        this.cameras.main.setBounds(0, 0, 3200, 900);
        this.add.image(1600, 450, 'level_background').setScale(0.5);

        this.drawInterface();

        const bottom = this.physics.add.staticGroup();

        let x = 0;
        let y = 900;
        do
        {
            bottom.create(x, y, 'spike')
                .setScale(0.25)
                .refreshBody();
            x += 30;
        }
        while (x < 3200);

        const scale = 3;

        const ground = this.physics.add.staticGroup();
        ground.create(300, 800, 'platform3')
            .setScale(scale)
            .refreshBody();
        ground.create(1150, 750, 'platform1')
            .setScale(scale)
            .refreshBody();
        ground.create(1700, 450, 'platform4')
            .setScale(scale)
            .refreshBody();

        const obsticles = this.physics.add.staticGroup();
        obsticles.create(1140, 720, 'spike')
            .setScale(0.1)
            .refreshBody();
        obsticles.create(1170, 720, 'spike')
            .setScale(0.1)
            .refreshBody();
            

        
        
        const platform1 = this.physics.add.image(600, 700, 'platform2').setScale(scale).setDirectControl().setImmovable();
        this.tweens.add({
            targets: platform1,
            x: 800,
            duration: 2000,
            yoyo: true,
            repeat: -1
        });

        const coin1 = this.physics.add.sprite(700, 600, 'coin').setScale(scale).setImmovable(true);
        coin1.body.setAllowGravity(false);


        const platform2 = this.physics.add.image(1400, 300, 'platform2').setScale(scale).setDirectControl().setImmovable();
        this.tweens.add({
            targets: platform2,
            y: 800,
            duration: 2000,
            yoyo: true,
            repeat: -1
        });

        this.player = this.physics.add.sprite(200, 700, 'character')
            .setScale(0.5)
            .setCollideWorldBounds(true);
        this.player.setDepth(4);

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

        this.anims.create({
            key: 'die',
            frames: this.anims.generateFrameNumbers('character', { start: 9, end: 12 }),
            frameRate: 5,
            repeat: -1
        })
        
        this.player.body.setSize(this.player.width * 0.7, this.player.height * 0.9);
        this.player.body.setOffset(this.player.width * 0.15, this.player.height * 0.1);

        this.cameras.main.startFollow(this.player, false, 0.2, 0.2);
        this.cursors = this.input.keyboard.createCursorKeys();

        this.physics.add.collider(this.player, ground);
        this.physics.add.collider(this.player, [ platform1, platform2 ]);
        
        this.physics.add.overlap(this.player, obsticles, this.handleDamage, null, this);
        this.physics.add.overlap(this.player, this.finishArea, () => {
            if (!this.dead) {
                this.scene.start('DialogScene', this.level.nextDialogId);
            }
        }, null, this);

        this.physics.add.overlap(this.player, coin1, () => {
            let coinCount = this.registry.get('coin_count');
            if (coinCount == null) {
                coinCount = 0;
            }
            coinCount += 1;
            this.registry.set('coin_count', coinCount);
            console.log("COIN COUNT: ",  this.registry.get('coin_count'));
            coin1.destroy();
        });
    }

    handleDamage() {
        if (this.isInvincible || this.dead) return;
        
        this.isInvincible = true;
        this.hp -= 1;
        this.checkHP();
        
        const flashInterval = 200; 
        const flashTween = this.tweens.add({
            targets: this.player,
            alpha: 0.3,
            duration: flashInterval,
            ease: 'Linear',
            yoyo: true,
            repeat: 9
        });
        
        this.time.delayedCall(2000, () => {
            this.isInvincible = false;
            flashTween.stop();
            this.player.alpha = 1;
        });
    }

    update() {        
        if (this.dead) {
            return;
        }
        
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
        
        if (this.player.getBottomLeft().y === 900) {
            this.hp -= 1;
            this.checkHP();
        }
    }

    checkHP() {
        if (this.hp <= 0) {
            this.dead = true;
            this.player.play('die', true);
            const deaths = this.registry.get('death_count') + 1;
            this.registry.set('death_count', deaths);

            if (deaths === 1) {
                this.showMessage('Your death will affect the ending of the game...');
            }
            else {
                this.showMessage('You have died ' + deaths + ' times...');
            }
        }else{
            if (this.isInvincible) return;
            this.drawInterface();
            this.player.setPosition(200, 700);
        }
    }

    showMessage(message) {
        this.physics.pause();

        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.7);
        overlay.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
        overlay.setScrollFactor(0);

        const text = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            message + '\n\nClick to restart',
            {
                fontSize: '32px',
                color: '#ffffff',
                align: 'center',
                fontFamily: 'Karantina'
            }
        )
        .setOrigin(0.5)
        .setScrollFactor(0);

        overlay.setInteractive();
        text.setInteractive();

        const restartLevel = () => {
            overlay.destroy();
            text.destroy();
                this.scene.restart();
            this.dead = false;
        };

        overlay.on('pointerdown', restartLevel);
        text.on('pointerdown', restartLevel);
    }
}

export default LevelScene;
