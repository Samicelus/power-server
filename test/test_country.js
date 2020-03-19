const Country = require('../domains/country.js');

let country = {
    name: "中国",
    cities: [
        {
            name: "成都",
            region: "西南",
            paths: [
                {
                    cityName: "重庆",
                    cost: 6
                },
                {
                    cityName: "西安",
                    cost: 14
                },
                {
                    cityName: "贵阳",
                    cost: 13
                },
                {
                    cityName: "昆明",
                    cost: 16
                },
                {
                    cityName: "兰州",
                    cost: 16
                },
                {
                    cityName: "西宁",
                    cost: 20
                }
            ]
        },
        {
            name: "西安",
            region: "西南",
            paths: [
                {
                    cityName: "重庆",
                    cost: 14
                },
                {
                    cityName: "成都",
                    cost: 14
                },
                {
                    cityName: "兰州",
                    cost: 15
                },
                {
                    cityName: "太原",
                    cost: 12
                },
                {
                    cityName: "郑州",
                    cost: 10
                },
                {
                    cityName: "武汉",
                    cost: 15
                }
            ]
        },
        {
            name: "重庆",
            region: "西南",
            paths: [
                {
                    cityName: "西安",
                    cost: 14
                },
                {
                    cityName: "成都",
                    cost: 6
                },
                {
                    cityName: "贵阳",
                    cost: 9
                },
                {
                    cityName: "武汉",
                    cost: 18
                },
                {
                    cityName: "长沙",
                    cost: 16
                }
            ]
        },
        {
            name: "贵阳",
            region: "西南",
            paths: [
                {
                    cityName: "重庆",
                    cost: 9
                },
                {
                    cityName: "成都",
                    cost: 13
                },
                {
                    cityName: "昆明",
                    cost: 12
                },
                {
                    cityName: "南宁",
                    cost: 12
                },
                {
                    cityName: "长沙",
                    cost: 15
                },
                {
                    cityName: "广州",
                    cost: 18
                }
            ]
        },
        {
            name: "昆明",
            region: "西南",
            paths: [
                {
                    cityName: "贵阳",
                    cost: 12
                },
                {
                    cityName: "成都",
                    cost: 16
                }
            ]
        },
        {
            name: "南宁",
            region: "西南",
            paths: [
                {
                    cityName: "贵阳",
                    cost: 12
                },
                {
                    cityName: "海口",
                    cost: 10
                },
                {
                    cityName: "广州",
                    cost: 11
                }
            ]
        },
        {
            name: "海口",
            region: "西南",
            paths: [
                {
                    cityName: "南宁",
                    cost: 10
                },
                {
                    cityName: "广州",
                    cost: 13
                }
            ]
        },
        {
            name: "广州",
            region: "华南",
            paths: [
                {
                    cityName: "长沙",
                    cost: 14
                },
                {
                    cityName: "南昌",
                    cost: 16
                },
                {
                    cityName: "潮州",
                    cost: 7
                },
                {
                    cityName: "香港",
                    cost: 4
                },
                {
                    cityName: "南宁",
                    cost: 11
                },
                {
                    cityName: "海口",
                    cost: 13
                },
                {
                    cityName: "贵阳",
                    cost: 18
                }
            ]
        },
        {
            name: "长沙",
            region: "华南",
            paths: [
                {
                    cityName: "武汉",
                    cost: 6
                },
                {
                    cityName: "南昌",
                    cost: 7
                },
                {
                    cityName: "广州",
                    cost: 14
                },
                {
                    cityName: "重庆",
                    cost: 16
                },
                {
                    cityName: "贵阳",
                    cost: 15
                }
            ]
        },
        {
            name: "武汉",
            region: "华南",
            paths: [
                {
                    cityName: "长沙",
                    cost: 6
                },
                {
                    cityName: "南昌",
                    cost: 6
                },
                {
                    cityName: "杭州",
                    cost: 13
                },
                {
                    cityName: "重庆",
                    cost: 18
                },
                {
                    cityName: "西安",
                    cost: 15
                },
                {
                    cityName: "郑州",
                    cost: 10
                },
                {
                    cityName: "南京",
                    cost: 10
                }
            ]
        },
        {
            name: "南昌",
            region: "华南",
            paths: [
                {
                    cityName: "长沙",
                    cost: 7
                },
                {
                    cityName: "武汉",
                    cost: 6
                },
                {
                    cityName: "广州",
                    cost: 16
                },
                {
                    cityName: "潮州",
                    cost: 14
                },
                {
                    cityName: "福州",
                    cost: 13
                },
                {
                    cityName: "杭州",
                    cost: 10
                }
            ]
        },
        {
            name: "福州",
            region: "华南",
            paths: [
                {
                    cityName: "南昌",
                    cost: 13
                },
                {
                    cityName: "潮州",
                    cost: 9
                },
                {
                    cityName: "杭州",
                    cost: 13
                }
            ]
        },
        {
            name: "潮州",
            region: "华南",
            paths: [
                {
                    cityName: "南昌",
                    cost: 14
                },
                {
                    cityName: "福州",
                    cost: 9
                },
                {
                    cityName: "香港",
                    cost: 7
                }
            ]
        },
        {
            name: "香港",
            region: "华南",
            paths: [
                {
                    cityName: "广州",
                    cost: 4
                },
                {
                    cityName: "潮州",
                    cost: 7
                }
            ]
        },
        {
            name: "杭州",
            region: "华中",
            paths: [
                {
                    cityName: "南京",
                    cost: 5
                },
                {
                    cityName: "上海",
                    cost: 4
                },
                {
                    cityName: "武汉",
                    cost: 13
                },
                {
                    cityName: "南昌",
                    cost: 10
                },
                {
                    cityName: "福州",
                    cost: 13
                }
            ]
        },
        {
            name: "上海",
            region: "华中",
            paths: [
                {
                    cityName: "南京",
                    cost: 6
                },
                {
                    cityName: "杭州",
                    cost: 4
                }
            ]
        },
        {
            name: "南京",
            region: "华中",
            paths: [
                {
                    cityName: "郑州",
                    cost: 12
                },
                {
                    cityName: "济南",
                    cost: 11
                },
                {
                    cityName: "青岛",
                    cost: 12
                },
                {
                    cityName: "上海",
                    cost: 6
                },
                {
                    cityName: "杭州",
                    cost: 5
                },
                {
                    cityName: "武汉",
                    cost: 10
                }
            ]
        },
        {
            name: "青岛",
            region: "华中",
            paths: [
                {
                    cityName: "济南",
                    cost: 6
                },
                {
                    cityName: "南京",
                    cost: 12
                }
            ]
        },
        {
            name: "济南",
            region: "华中",
            paths: [
                {
                    cityName: "青岛",
                    cost: 6
                },
                {
                    cityName: "南京",
                    cost: 11
                },
                {
                    cityName: "郑州",
                    cost: 7
                },
                {
                    cityName: "石家庄",
                    cost: 6
                },
                {
                    cityName: "天津",
                    cost: 6
                }
            ]
        },
        {
            name: "石家庄",
            region: "华中",
            paths: [
                {
                    cityName: "济南",
                    cost: 6
                },
                {
                    cityName: "郑州",
                    cost: 9
                },
                {
                    cityName: "太原",
                    cost: 5
                },
                {
                    cityName: "北京",
                    cost: 6
                },
                {
                    cityName: "天津",
                    cost: 5
                }
            ]
        },
        {
            name: "郑州",
            region: "华中",
            paths: [
                {
                    cityName: "南京",
                    cost: 12
                },
                {
                    cityName: "济南",
                    cost: 7
                },
                {
                    cityName: "石家庄",
                    cost: 9
                },
                {
                    cityName: "太原",
                    cost: 11
                },
                {
                    cityName: "西安",
                    cost: 10
                },
                {
                    cityName: "武汉",
                    cost: 10
                }
            ]
        }
    ],
    players: [
        {
            name: "player1"
        },
        {
            name: "player2"
        }
    ],
    supplies:{
        "中国":{
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
    },
    markets:{
        "current":[
            {
                price: 3,
                electricity: 1,
                costs: {
                    resources: ["oil"],
                    cost: 2
                }
            },
            {
                price: 4,
                electricity: 1,
                costs: {
                    resources: ["coal"],
                    cost: 2
                }
            },
            {
                price: 5,
                electricity: 1,
                costs: {
                    resources: ["oil","coal"],
                    cost: 2
                }
            },
            {
                price: 6,
                electricity: 1,
                costs: {
                    resources: ["garbage"],
                    cost: 1
                }
            }
        ],
        "future":[
            {
                price: 7,
                electricity: 2,
                costs: {
                    resources: ["oil"],
                    cost: 3
                }
            },
            {
                price: 8,
                electricity: 2,
                costs: {
                    resources: ["coal"],
                    cost: 3
                }
            },
            {
                price: 9,
                electricity: 1,
                costs: {
                    resources: ["oil"],
                    cost: 1
                }
            },
            {
                price: 10,
                electricity: 2,
                costs: {
                    resources: ["coal"],
                    cost: 2
                }
            }
        ]
    },
    plantStack:{
        plants: [
            {
                price: 11,
                electricity: 2,
                costs: {
                    resources: ["uranium"],
                    cost: 1
                }
            },
            {
                price: 12,
                electricity: 2,
                costs: {
                    resources: ["coal","oil"],
                    cost: 2
                }
            },
            {
                price: 14,
                electricity: 2,
                costs: {
                    resources: ["garbage"],
                    cost: 2
                }
            },
            {
                price: 15,
                electricity: 3,
                costs: {
                    resources: ["coal"],
                    cost: 2
                }
            },
            {
                price: 16,
                electricity: 3,
                costs: {
                    resources: ["oil"],
                    cost: 2
                }
            },
            {
                price: 17,
                electricity: 2,
                costs: {
                    resources: ["uranium"],
                    cost: 1
                }
            },
            {
                price: 18,
                electricity: 2,
                costs: {
                    resources: [],
                    cost: 0
                }
            },
            {
                price: 19,
                electricity: 3,
                costs: {
                    resources: ["garbage"],
                    cost: 2
                }
            },
            {
                price: 20,
                electricity: 5,
                costs: {
                    resources: ["coal"],
                    cost: 3
                }
            }
        ],
        prepend: [
            {
                price: 13,
                electricity: 1,
                costs: {
                    resources: [],
                    cost: 0
                }
            }
        ],
        append: []
    }
};


//init country...
let countryObj = new Country(country.name);
countryObj.setup(country);


countryObj.buildPlant("成都", "player1");
countryObj.buildPlant("重庆", "player1");

countryObj.buildPlant("广州", "player2");
countryObj.buildPlant("长沙", "player2");
countryObj.buildPlant("重庆", "player2");


console.log(countryObj.supplies.中国.garbage);

//console.log(countryObj.players);

//console.log(countryObj.currentMarket);
//console.log(countryObj.futureMarket);
//console.log(countryObj.plantStack);