import Phaser from 'phaser';

class CinematicScene extends Phaser.Scene {
    constructor() {
        super('CinematicScene');
    }

    init(data) {
        console.log("Scene init with data:", data);
        this.path = data.path;
        this.next_scene = data.next_scene;
    }

    preload() {
        const loadingText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            'Loading video...',
            {
                fontFamily: 'Karantina',
                fontSize: '32px',
                color: '#ffffff',
                align: 'center'
            }
        );
        loadingText.setOrigin(0.5);

        this.load.video('video', this.path, {
            type: 'video/mp4',
            mimeType: 'video/mp4'
        });
    }

    create() {
        const video = this.add.video(0, 0, 'video');
        
        video.setOrigin(0.5, 0.5);
        video.setPosition(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2
        );

        const videoWidth = video.width;
        const videoHeight = video.height;
        
        console.log('Video dimensions:', {
            width: videoWidth,
            height: videoHeight,
            screen: {
                width: this.cameras.main.width,
                height: this.cameras.main.height
            }
        });

        const scale = Math.min(
            (this.cameras.main.width * 0.8) / videoWidth,  
            (this.cameras.main.height * 0.8) / videoHeight 
        );

        video.setScale(scale);
        video.setVisible(true);

        video.play(false, 0, 1);

        video.on('complete', () => {
            this.scene.start('DialogScene', 1);
        });
        
        video.on('error', (error) => {
            console.error('Video error:', error);
            this.scene.start('DialogScene', 1);
        });
    }
}

export default CinematicScene;
