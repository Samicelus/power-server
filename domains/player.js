class Player{
    constructor(name){
        this.name = name;
        this.elektro = 50;
        this.cities = {};

        this.count = this.count.bind(this);
    }

    count(){
        return Object.keys(this.cities).length;
    }
}

module.exports = Player;