const Market = require('./market.js');

let plants = [
    {
        price: 37,
        electricity: 4,
        costs: {
            resources: [],
            cost: 0
        }
    },
    {
        price: 38,
        electricity: 7,
        costs: {
            resources: ["garbage"],
            cost: 3
        }
    },
    {
        price: 42,
        electricity: 6,
        costs: {
            resources: ["coal"],
            cost: 2
        }
    },
    {
        price: 11,
        electricity: 2,
        costs: {
            resources: ["uranium"],
            cost: 1
        }
    },
    {
        price: 3,
        electricity: 1,
        costs: {
            resources: ["oil"],
            cost: 2
        }
    }
]

let market = new Market();

plants.forEach(plant=>{
    market.addPlant(plant)
})

console.log(market.getHigh());

console.log(market);