class Block {
    constructor(id){
        const blockInfo = this.loadBlockInfo(id);
        this.type = blockInfo.type;
        this.coords = blockInfo.coords;
        this.size = blockInfo.size;
        this.image = blockInfo.image;
        this.isStart = blockInfo.isStart;
        this.isFinish = blockInfo.isFinish;
    }
    
    loadBlockInfo(id) {
        const response = fetch(`./assets/blocks/${id}.json`);
        const data = response.json();
        return data;
    }
}

export default Block;