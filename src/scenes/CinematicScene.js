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
        console.log('Loading video:', this.path);
        
        // Create loading text
        const loadingText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            'Loading video...',
            {
                fontSize: '32px',
                color: '#ffffff',
                align: 'center'
            }
        );
        loadingText.setOrigin(0.5);

        // Load the video
        this.load.video('video', this.path, {
            type: 'video/mp4',
            mimeType: 'video/mp4'
        });
    }

    create() {
        // Create video element
        const video = this.add.video(0, 0, 'video');
        
        // Center the video
        video.setOrigin(0.5, 0.5);
        video.setPosition(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2
        );

        // Get video dimensions
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

        // Calculate scale to fit screen while maintaining aspect ratio
        const scale = Math.min(
            (this.cameras.main.width * 0.8) / videoWidth,  // 80% of screen width
            (this.cameras.main.height * 0.8) / videoHeight // 80% of screen height
        );

        console.log('Calculated scale:', scale);

        // Scale the video
        video.setScale(scale);
        video.setVisible(true);

        // Play the video
        video.play();

        video.on('complete', () => {
            this.scene.start('DialogScene', 's1_d1');
        });
        
        video.on('error', (error) => {
            console.error('Video error:', error);
            this.scene.start('DialogScene', 's1_d1');
        });
    }
}

export default CinematicScene;
