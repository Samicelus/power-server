const SupplyLink = require('./supplyLink.js');

const defaultSupply = {
    "coal": 1,
    "oil": 3,
    "garbage": 7,
    "uranium": 14
}

class Supply{
    constructor(){
    }

    setup(supplyProperty){
        for(let resource in supplyProperty){
            this[resource] = new SupplyLink(resource);
            supplyProperty[resource].forEach((slotProperty)=>{
                this[resource].addSlot(slotProperty);
            });
            this[resource].fillTo(defaultSupply[resource]);
        }
    }
}

module.exports = Supply;
