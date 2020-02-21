var LeafExtBatt =     {
    'None': {price: 0, capacity: 0},
    '8.8 kWh': {price: 3990, capacity: 8.8},
    '17.6 kWh': {price: 5990, capacity: 17.6}
};

var configs = {
    'Car model': {
        'Gen. 1': {
            price: [7250, 10500],
            capacity: 21.3,
            consumption: 175,
            fullspeed: 25,
            soh: 0.75,
            'Extender battery' : LeafExtBatt
        },
        'Gen. 2': {
            price: [9900, 14500],
            capacity: 21.3,
            consumption: 169,
            fullspeed: 25,
            soh: 0.87,
            'Extender battery' : LeafExtBatt
        },
        'Gen. 3': {
            price: [14900, 18000],
            capacity: 28.3,
            consumption: 169,
            fullspeed: 90,
            soh: 0.88,
            'Extender battery' : LeafExtBatt
        },
        'Gen. 4': {
            price: [28500, 33250],
            capacity: 38,
            consumption: 164,
            fullspeed: 65,
            soh: 0.96,
            'Extender battery' : LeafExtBatt
        },
        'Gen. 5': {
            price: [49000, 49000],
            capacity: 55,
            consumption: 170,
            fullspeed: 45,
            soh: 1,
            'Extender battery' : LeafExtBatt
        }

    },
    'Main battery upgrade': {
        'None': {price: 0, capacity: 0},
        'to 30kWh': {price: 6750, capacity: 28.3, fullspeed: 90, soh: 0.82},
        'to 40kWh': {price: 8790, capacity: 38, fullspeed: 65, soh: 0.92},
        'to 62kWh': {price: 12390, capacity: 55, fullspeed: 45, soh: 1}
    },
    'Sell original battery': {
        'No': null,
        'Automatic': null,
        'Manual input': {unit: '€', min: 0, max: 10000, step: 50}
    },
    'Original battery SOH': {
        'Automatic': null,
        'Manual input': {unit: '%', value: 0.75, min: 0, max: 100, step: 0.5}
    },
    'Include car value': {
        'No': null,
        'Automatic': null,
        'Manual input': {unit: '€', min: 0, max: 10000, step: 50}
    }
};