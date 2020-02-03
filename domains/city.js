class City{
    constructor(property){
        this.name =  property.name;
        this.region = property.region;
        this.country = null;
        this.paths = {};
        this.slots = {
            "1":{
                cost: 10,
                player: null
            },
            "2":{
                cost: 15,
                player: null
            },
            "3":{
                cost: 20,
                player: null
            }
        }

        this.getPaths = this.getPaths.bind(this);
        this.build = this.build.bind(this);
    } 

    getPaths(){
        let result = [];
        for(let cityName in this.paths){
            result.push({
                name: cityName,
                cost: this.paths[cityName].cost
            });
        }
        return result;
    }

    build(player){
        let currentStep = this.country.step;
        let nearby = false;
        let available = false;
        let availableSlot = 0;
        for(let slot = currentStep; slot>0; slot--){
            if(!this.slots[slot].player){
                available = true;
                availableSlot = slot;
            }
        }
        let minPathCost = 999; 
        let playerCities = Object.keys(player.cities);

        //if first city for this user
        if(playerCities.length == 0){
            nearby = true;
            minPathCost = 0;
        }else{
            let paths = this.getPaths();
            paths.forEach((path)=>{
                if(playerCities.includes(path.name)){
                    nearby = true;
                    if(path.cost < minPathCost){
                        minPathCost = path.cost;
                    }
                }
            });
        }

        if(available && nearby){
            let totalCost = minPathCost + this.slots[availableSlot].cost;
            if(player.elektro >= totalCost){
                player.elektro -= totalCost;
                this.slots[availableSlot].player = player;
                player.cities[this.name] = this;
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }

    }
}

module.exports = City;