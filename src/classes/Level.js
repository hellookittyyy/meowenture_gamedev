import Block from './Block.js';

class Level {
    constructor(id) {
        this.id = id;
        this.blocks = [];
        this.nextDialogId = 0;
        this.levelNum = 0;
        this.background = '';
        this.start = { x: 0, y: 0 };
        this.finish = { x: 0, y: 0 };
        this.ready = this.initialize(id).then(() => this);
    }
    
    initialize(id) {
        return this.loadLevelInfo(id).then(levelInfo => {
            this.blocks = this.loadBlocks(id);
            this.nextDialogId = levelInfo.nextDialogId;
            this.levelNum = levelInfo.levelNum;
            this.background = levelInfo.background;
            this.start = levelInfo.start;
            this.finish = levelInfo.finish;
            return this.blocks.ready.then(() => this);
        });
    }

    loadLevelInfo(id) {
        return fetch(`./assets/levels/${id}.json`).then(response => response.json());
    }

    async loadBlocks(id) {
        const data = await fetch(`./assets/levels/blocks_levels.json`).then(response => response.json());
        const blockIds = data.blocks.filter(block => block.level_id === id);
        
        const blocks = [];

        for (let i = 0; i < blockIds.length; i++) {
            const block = new Block(blockIds[i].block_id);
            blocks.push(block);
        }

        return blocks;
    }
}

export default Level;
