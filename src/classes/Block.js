class Block {
    constructor(id){
        this.loadBlockInfo(id).then(blockInfo => {
            this.type = blockInfo.type;
            this.coords = blockInfo.coords;
            this.scale = blockInfo.scale;
            this.image = blockInfo.image;
            this.move = blockInfo.move;
        });
    }
    
    loadBlockInfo(id) {
        return fetch(`./assets/blocks/${id}.json`).then(response => response.json());
    }
}

export default Block;