const Supply = require('./supply.js');

let supplyProperty = {
    "coal":[
        {
            cost: 8,
            slots: 3
        },
        {
            cost: 7,
            slots: 3
        },
        {
            cost: 6,
            slots: 3
        },
        {
            cost: 5,
            slots: 3
        },{
            cost: 4,
            slots: 3
        },
        {
            cost: 3,
            slots: 3
        },{
            cost: 2,
            slots: 3
        },
        {
            cost: 1,
            slots: 3
        }
    ],
    "oil":[
        {
            cost: 8,
            slots: 3
        },
        {
            cost: 7,
            slots: 3
        },
        {
            cost: 6,
            slots: 3
        },
        {
            cost: 5,
            slots: 3
        },{
            cost: 4,
            slots: 3
        },
        {
            cost: 3,
            slots: 3
        },{
            cost: 2,
            slots: 3
        },
        {
            cost: 1,
            slots: 3
        }
    ],
    "garbage":[
        {
            cost: 8,
            slots: 3
        },
        {
            cost: 7,
            slots: 3
        },
        {
            cost: 6,
            slots: 3
        },
        {
            cost: 5,
            slots: 3
        },{
            cost: 4,
            slots: 3
        },
        {
            cost: 3,
            slots: 3
        },{
            cost: 2,
            slots: 3
        },
        {
            cost: 1,
            slots: 3
        }
    ],
    "uranium":[
        {
            cost: 16,
            slots: 1
        },
        {
            cost: 14,
            slots: 1
        },
        {
            cost: 12,
            slots: 1
        },
        {
            cost: 10,
            slots: 1
        },
        {
            cost: 8,
            slots: 1
        },
        {
            cost: 7,
            slots: 1
        },{
            cost: 6,
            slots: 1
        },
        {
            cost: 5,
            slots: 1
        },
        {
            cost: 4,
            slots: 1
        },
        {
            cost: 3,
            slots: 1
        },{
            cost: 2,
            slots: 1
        },
        {
            cost: 1,
            slots: 1
        }
    ]
}


//init supply...
let supplyObj = new Supply();
supplyObj.setup(supplyProperty);

supplyObj.coal.fillTo(3);

console.log(supplyObj.coal.count());
console.log(supplyObj.coal.current);

supplyObj.coal.fill(7);
console.log(supplyObj.coal.count());
console.log(supplyObj.coal.current);
