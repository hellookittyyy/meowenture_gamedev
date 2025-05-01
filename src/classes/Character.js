class Character {
    constructor(id) {
        const characterInfo = this.loadCharacterInfo(id);
        this.name = characterInfo.name;
        this.avatar = characterInfo.avatar;
    }

    loadCharacterInfo(id) {
        // temp load from file
        const response = fetch(`./assets/characters/${id}.json`);
        const data = response.json();
        return data;
    }
}

export default Character;