import Block from './Block.js';

class Level {
    constructor(id) {
        this.id = id;
        this.blocks = [];
        this.nextDialogId = 0;
        this.levelNum = 0;
        this.background = '';
        this.width = 0;
        this.start = { x: 0, y: 0 };
        this.finish = { x: 0, y: 0 };
        this.ready = this.initialize(this.id).then(() => this);
    }
    
    async initialize(id) {
        const levelInfo = await this.loadLevelInfo(id);
        this.nextDialogId = levelInfo.nextDialogId;
        this.levelNum = levelInfo.levelNum;
        this.width = levelInfo.width;
        this.background = levelInfo.background;
        this.start = levelInfo.start;
        this.finish = levelInfo.finish;
        
        this.blocks = await this.loadBlocks(id);
        await Promise.all(this.blocks.map(block => block.ready));
        
        return this;
    }

    loadLevelInfo(id) {
        return fetch(`../assets/levels/${id}.json`).then(response => response.json());
    }

    async loadBlocks(id) {
        const data = await fetch(`../assets/levels/blocks_levels.json`).then(response => response.json());
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
