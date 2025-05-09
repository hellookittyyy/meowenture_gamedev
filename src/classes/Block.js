class Block {
    constructor(id){
        this.id = id;
        this.type = '';
        this.coords = { x: 0, y: 0 };
        this.scale = 0;
        this.image = '';
        this.move = false;
        this.ready = this.initialize(id);
    }
    
    initialize(id) {
        return this.loadBlockInfo(id).then(blockInfo => {
            this.type = blockInfo.type;
            this.coords = blockInfo.coords;
            this.scale = blockInfo.scale;
            this.image = blockInfo.image;
            this.move = blockInfo.move;
            return this;
        });
    }
    
    loadBlockInfo(id) {
        return fetch(`./assets/blocks/${id}.json`).then(response => response.json());
    }
}

export default Block;