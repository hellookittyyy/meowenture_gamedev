import Character from './Character.js';

class Dialog {
    constructor(id) {
        this.id = id;
        this.character = null;
        this.nextDialogId = null;
        this.nextLevelId = null;
        this.text = '';
        this.isChoice = false;
        this.stageNum = 0;
        this.background = '';
        this.isLeftSide = false;
        this.ready = this.initialize(id).then(() => this);
    }

    initialize(id) {
        return this.loadDialogInfo(id).then(dialogInfo => {
            this.character = new Character(dialogInfo.characterId);
            this.nextDialogId = dialogInfo.nextDialogId;
            this.nextLevelId = dialogInfo.nextLevelId;
            this.text = dialogInfo.text;
            this.isChoice = dialogInfo.isChoice;
            this.stageNum = dialogInfo.stageNum;
            this.background = dialogInfo.background;
            this.isLeftSide = dialogInfo.characterId == 1;
            return this.character.ready.then(() => this);
        });
    }

    loadDialogInfo(id) {
        return fetch(`../assets/dialogs/${id}.json`).then(response => response.json());
    }
}

export default Dialog;