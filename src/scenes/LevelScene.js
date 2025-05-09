import Phaser from 'phaser';
import Level from '../classes/Level.js';

const MAX_HP = 3;
const LEVEL_HEIGHT = 900;

class LevelScene extends Phaser.Scene {
    constructor() {
        super('LevelScene');
        this.player = null;
        this.finishArea = null;        
    }

    init(levelId) {
        this.levelId = levelId;
        this.assetsLoaded = false;

        this.hp = MAX_HP;
        this.dead = false;
        this.isInvincible = false;

        if (!this.registry.has('death_count')) {
            this.registry.set('death_count', 0);
        }
        if (!this.registry.has('coin_count')) {
            this.registry.set('coin_count', 0);
        }

        this.cameras.main.fadeIn(500);
    }

    preload() {
        this.level = new Level(this.levelId);

        this.level.ready.then(() => {
            this.load.once('complete', () => {
                this.assetsLoaded = true;
                this.events.emit('create');
            });
            
            this.load.start();
        });
    }

    create() {
        if (!this.assetsLoaded) {
            this.events.once('create', this.create, this);
            return;
        }

        this.createLevel();
        this.createBottomBorder();

        this.createPlayer();

        this.setupInterface();

        this.buildLevel();
    }

    update() {       
        if (!this.assetsLoaded) {
            this.events.once('create', this.update, this);
            return;
        }

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
    
    buildLevel() {
        this.ground = this.physics.add.staticGroup();
        this.obstacles = this.physics.add.staticGroup();

        for (let i = 0; i < this.level.blocks.length; i++) {
            console.log(this.level.blocks[i]);
            this.buildBlock(this.level.blocks[i]);
        }

        this.physics.add.collider(this.player, this.ground);
        this.physics.add.overlap(this.player, this.obstacles, this.handleDamage, null, this);
    }
    
    buildBlock(block) {
        switch (block.type) {
            case 'ground':
                this.ground.create(block.coords.x, block.coords.y, block.image).setScale(block.scale).refreshBody();
                break;
            case 'obstacle':
                this.obstacles.create(block.coords.x, block.coords.y, block.image).setScale(block.scale).refreshBody();
                break;
            case 'coin':
                const coin = this.physics.add.sprite(block.coords.x, block.coords.y, block.image).setScale(block.scale).refreshBody();
                coin.body.setAllowGravity(false);
                this.physics.add.overlap(this.player, coin, () => {
                    let coinCount = this.registry.get('coin_count');
                    coinCount += 1;
                    this.registry.set('coin_count', coinCount);
                    coin.destroy();
                });
                break;
            case 'platform':
                const platform = this.physics.add.image(block.coords.x, block.coords.y, block.image).setScale(block.scale).setDirectControl().setImmovable();
                this.tweens.add({
                    targets: platform,
                    x: block.move.x == 0 ? block.coords.x : block.move.x,
                    y: block.move.y == 0 ? block.coords.y : block.move.y,
                    duration: block.move.duration,
                    yoyo: block.move.yoyo,
                    repeat: block.move.repeat
                });
                this.physics.add.collider(this.player, platform);
                break;
        }
    }

    createLevel() {
        this.physics.world.setBounds(0, 0, this.level.width, LEVEL_HEIGHT);
        this.cameras.main.setBounds(0, 0, this.level.width, LEVEL_HEIGHT);
        this.add.image(this.level.width / 2, LEVEL_HEIGHT / 2, this.level.background).setScale(0.5);
    }

    createBottomBorder() {
        const bottomBorder = this.physics.add.staticGroup();
        let x = 0;
        do
        {
            bottomBorder.create(x, LEVEL_HEIGHT, 'spike')
                .setScale(0.25)
                .refreshBody();
            x += 30;
        }
        while (x < this.level.width);
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

    createPlayer() {
        this.player = this.physics.add.sprite(this.level.start.x, this.level.start.y - 50, 'character')
            .setScale(0.5)
            .setCollideWorldBounds(true);

        this.anims.create({key: 'move', frames: this.anims.generateFrameNumbers('character', { start: 0, end: 5 }), frameRate: 10, repeat: -1});
        this.anims.create({key: 'idle', frames: this.anims.generateFrameNumbers('character', { start: 4, end: 5 }), frameRate: 5, repeat: -1});
        this.anims.create({key: 'jump', frames: this.anims.generateFrameNumbers('character', { start: 6, end: 7 }), frameRate: 5, repeat: 0});
        this.anims.create({key: 'falling', frames: this.anims.generateFrameNumbers('character', { start: 8, end: 8 }), frameRate: 5, repeat: 0});
        this.anims.create({key: 'die', frames: this.anims.generateFrameNumbers('character', { start: 9, end: 12 }), frameRate: 5, repeat: -1});
        this.player.body.setSize(this.player.width * 0.7, this.player.height * 0.9);
        this.player.body.setOffset(this.player.width * 0.15, this.player.height * 0.1);
        this.player.setDepth(4);
    }
    
    setupInterface() {
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

        this.physics.add.overlap(this.player, this.finishArea, () => {
            if (!this.dead) {
                this.scene.start('DialogScene', this.level.nextDialogId);
            }
        }, null, this);

        this.cameras.main.startFollow(this.player, false, 0.2, 0.2);
        this.cursors = this.input.keyboard.createCursorKeys();
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
            this.setupInterface();
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
