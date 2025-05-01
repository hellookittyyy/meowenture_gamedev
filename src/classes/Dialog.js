import Character from './Character.js';

class Dialog {
    constructor(id) {
        const dialogInfo = this.loadDialogInfo(id);
        this.character = new Character(dialogInfo.characterId);
        this.nextDialogId = dialogInfo.nextDialogId;
        this.nextLevelId = dialogInfo.nextLevelId;
        this.text = dialogInfo.text;
        this.isChoice = dialogInfo.isChoice;
        this.stageNum = dialogInfo.stageNum;
        this.background = dialogInfo.background;
    }

    loadDialogInfo(id) {
        // temp load from file
        const response = fetch(`./assets/dialogs/${id}.json`);
        const data = response.json();
        return data;
    }
}

export default Dialog;