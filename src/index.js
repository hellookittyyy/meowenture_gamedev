import Phaser from 'phaser';
import MainMenuScene from './scenes/MainMenuScene';
import SettingsScene from './scenes/SettingsScene';
import KeyboardTipsScene from './scenes/KeyboardTipsScene';
import SkinsScene from './scenes/SkinsScene';
import CinematicScene from './scenes/CinematicScene';
import DialogScene from './scenes/DialogScene';
import LevelScene from './scenes/LevelScene';
import LoadingScene from './scenes/LoadingScene';
import Api from './api/Api';

const config = {
    type: Phaser.CANVAS,
    width: 1600,
    height: 900,
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: false
        }
    },
    backgroundColor: '#000000',
    scene: [LoadingScene, MainMenuScene, SettingsScene, KeyboardTipsScene, SkinsScene, CinematicScene, DialogScene, LevelScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1600,
        height: 900,
        min: {
            width: 800,
            height: 450
        },
        max: {
            width: 1920,
            height: 1080
        }
    },
    render: {
        pixelArt: false,
        antialias: true,
        roundPixels: true,
        clearBeforeRender: true
    },
    antialiasGL: true
};

const showAuthorizationMessage = () => {
    const gameContainer = document.getElementById('game');
    if (gameContainer) {
        gameContainer.innerHTML = '<div style="color: white; font-size: 24px; text-align: center; padding-top: 20px;">Please authorize first</div>';
    }
};

const fontLoader = new Promise((resolve) => {
    const testText = document.createElement('span');
    testText.style.fontFamily = 'Karantina';
    testText.style.position = 'absolute';
    testText.style.visibility = 'hidden';
    testText.textContent = 'Test Font Loading';
    document.body.appendChild(testText);

    const checkFont = () => {
        if (document.fonts.check('700 10px Karantina')) {
            document.body.removeChild(testText);
            resolve();
        } else {
            setTimeout(checkFont, 100);
        }
    };

    checkFont();
});

// Function to request token from parent window
const requestTokenFromParent = () => {
    return new Promise((resolve) => {
        // Request token from parent
        window.parent.postMessage({ type: 'REQUEST_TOKEN' }, '*');
        
        // Listen for response
        const messageHandler = (event) => {
            if (event.data && event.data.type === 'TOKEN_RESPONSE') {
                window.removeEventListener('message', messageHandler);
                resolve(event.data.token);
            }
        };
        
        window.addEventListener('message', messageHandler);
        
        // Timeout after 5 seconds
        setTimeout(() => {
            window.removeEventListener('message', messageHandler);
            resolve(null);
        }, 5000);
    });
};

const fetchUserData = async (game) => {
    try {
        const api = new Api(game);
        const userData = await api.getUserProfile();
        console.log('User data:', userData);
        
        // Store user data in registry
        game.registry.set('userData', userData);
        return true;
    } catch (error) {
        console.error('Failed to fetch user data:', error);
        return false;
    }
};

fontLoader.then(async () => {
    // Try to get token from parent window first
    const parentToken = await requestTokenFromParent();
    const localToken = localStorage.getItem('access_token');
    const accessToken = parentToken || localToken;
    
    console.log('Access Token:', accessToken);
    
    if (!accessToken) {
        showAuthorizationMessage();
    } else {
        const game = new Phaser.Game(config);
        game.registry.set('accessToken', accessToken);
        
        const userDataFetched = await fetchUserData(game);
        if (!userDataFetched) {
            console.log('Failed to fetch user data');
            // showAuthorizationMessage();
        }
    }
});
