const Plant = require('./plant.js');

class Market{
    constructor(){
        this.slots = [];
        this.max = 4;

        this.setMax = this.setMax.bind(this);
        this.addPlant = this.addPlant.bind(this);
        this.getLow = this.getLow.bind(this);
        this.getHigh = this.getHigh.bind(this);
    }

    setMax(num){
        if(Object.keys(this.slots).length == 0){
            this.max = num;
        }
    }

    addPlant(plantProperty){
        let slotLen = this.slots.length;
        if(slotLen < this.max){
            let plant = new Plant(plantProperty);
            if(slotLen == 0){
                this.slots.push(plant);
            }else{
                let index = 1;
                let insert;
                while(!insert && this.slots[index - 1]){
                    if(plant.price < this.slots[index - 1].price){
                        insert = index;
                    }else{
                        index++;
                    }
                }
                if(!insert){
                    insert = index;
                }
                this.slots.splice(insert - 1, 0, plant);
            }
            return true;
        }else{
            return false;
        }
    }

    getLow(){
        return this.slots.shift();
    }

    getHigh(){
        return this.slots.pop();
    }
}

module.exports = Market;