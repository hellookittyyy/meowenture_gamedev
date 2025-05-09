class Character {
    constructor(id) {
        this.id = id;
        this.name = '';
        this.avatar = '';
        this.ready = this.initialize(id);
    }

    initialize(id) {
        return this.loadCharacterInfo(id).then(characterInfo => {
            this.name = characterInfo.name;
            this.avatar = characterInfo.avatar;
            return this;
        });
    }

    loadCharacterInfo(id) {
        return fetch(`../assets/characters/${id}.json`).then(response => response.json());
    }
}

export default Character;