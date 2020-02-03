const Plant = require('./plant.js');

class PlantStack{
    constructor(){
        this.stack = [];

        this.addPlant = this.addPlant.bind(this);
        this.shuffle = this.shuffle.bind(this);
        this.draw = this.draw.bind(this);
        this.append = this.append.bind(this);
        this.prepend = this.prepend.bind(this);
    }

    addPlant(plantProperty){
        this.stack.push(new Plant(plantProperty));
    }

    shuffle(){
        let temp = [];
        let len = this.stack.length;
        for(let i = len; i > 0; i--){
            let k = getRandom(i);
            temp.push(this.stack[k]);
            this.stack.splice(k, 1);
        }
        this.stack = temp;
    }

    draw(){
        return this.stack.shift();
    }

    append(plant){
        this.stack.push(plant);
    }

    prepend(plant){
        this.stack.unshift(plant);
    }
}

function getRandom (len) {
    return Math.floor(Math.random() * len)
}

module.exports = PlantStack;
