import Block from './Block.js';

class Level {
    constructor(id) {
        const levelInfo = this.loadLevelInfo(id);
        this.blocks = this.loadBlocks(id);
        this.nextDialogId = levelInfo.nextDialogId;
        this.levelNum = levelInfo.levelNum;
        this.background = levelInfo.background;
    }
    
    loadLevelInfo(id) {
        // temp load from file
        const response = fetch(`./assets/levels/${id}.json`);
        const data = response.json();
        return data;
    }

    loadBlocks(id) {
        const response = fetch(`./assets/levels/blocks_levels.json`);
        const data = response.json();
        const blockIds = data.filter(block => block.level_id === id);
        
        const blocks = [];

        for (i of blockIds) {
            const block = new Block(blockIds[i].block_id);
            blocks.push(block);
        }

        return blocks;
    }
}

export default Level;
