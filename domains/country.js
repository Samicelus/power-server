const City = require('./city.js');
const Player = require('./player.js');
const Supply = require('./supply.js');
const Market = require('./market.js');
const PlantStack = require('./plantStack.js');
const Plant = require('./plant.js');

class Country {
    constructor(name){
        this.name = name;
        this.cities = {};
        this.players = {};
        this.supplies = {};
        this.currentMarket = {};
        this.futureMarket = {};
        this.plantStack = {};
        this.step = 1;
        this.phase = 1;

        this.setup = this.setup.bind(this);
        this.initCities = this.initCities.bind(this);
        this.initPlayers = this.initPlayers.bind(this);
        this.initSupplies = this.initSupplies.bind(this);
        this.initMarkets = this.initMarkets.bind(this);
        this.initPlantStack = this.initPlantStack.bind(this);

        this.addPlayer = this.addPlayer.bind(this);
        this.addCity = this.addCity.bind(this);
        this.getCityPaths = this.getCityPaths.bind(this);
        this.buildPlant = this.buildPlant.bind(this);
    }

    setup(countryProperty){
        this.initCities(countryProperty.cities);
        this.initPlayers(countryProperty.players);
        this.initSupplies(countryProperty.supplies);
        this.initMarkets(countryProperty.markets);
        this.initPlantStack(countryProperty.plantStack);
    }

    initCities(cities){
        let addedCities = 0;
        while(cities.length > addedCities){
            cities.forEach((city)=>{
                if(!city.result){
                    city.result = this.addCity(city, city.paths);
                    if(city.result){
                        addedCities += 1;
                    }
                }
            })
        }
    }

    initPlayers(players){
        players.forEach((player)=>{
            this.addPlayer(player)
        });
    }
    
    initSupplies(supplies){
        for(let supplyName in supplies){
            this.supplies[supplyName] = new Supply(supplyName);
            this.supplies[supplyName].setup(supplies[supplyName]);
        }
    }

    initMarkets(markets){
        this.currentMarket = new Market();
        markets["current"].forEach(plant=>{
            this.currentMarket.addPlant(plant);
        });
        this.futureMarket = new Market();
        markets["future"].forEach(plant=>{
            this.futureMarket.addPlant(plant);
        });
    }

    initPlantStack(plantStack){
        this.plantStack = new PlantStack();
        plantStack.plants.forEach(plant=>{
            this.plantStack.addPlant(plant);
        });
        this.plantStack.shuffle();
        plantStack.prepend.forEach(plant=>{
            let plantObj = new Plant(plant);
            this.plantStack.prepend(plantObj);
        });
        plantStack.append.forEach(plant=>{
            let plantObj = new Plant(plant);
            this.plantStack.append(plantObj);
        })
    }

    addPlayer(player){
        this.players[player.name] = new Player(player.name);
    }

    addCity(cityProperty, paths){
        let city = new City(cityProperty);
        city.country = this;
        //if is the first city in the country
        if(Object.keys(this.cities).length == 0){
            this.cities[city.name] = city;
            return true;
        }else{
            let linked = false;
            paths.forEach((path) => {
                //if target city already in the country
                if(this.cities[path.cityName]){
                    //target city
                    this.cities[path.cityName].paths[city.name] = {
                        cost: path.cost,
                        to: city
                    }
                    //this city
                    city.paths[path.cityName] = {
                        cost: path.cost,
                        to: this.cities[path.cityName]
                    }
                    linked = true;
                }
            });
            if(linked){
                this.cities[city.name] = city;
                return true;
            }else{
                return false;
            }
        }
    }

    getCityPaths(cityName){
        return this.cities[cityName].getPaths();
    }

    buildPlant(cityName, playerName){
        if(this.players[playerName] && this.cities[cityName]){
            return this.cities[cityName].build(this.players[playerName]);
        }else{
            return false;
        }
    }
}

module.exports = Country;