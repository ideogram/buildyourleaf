var LeafExtBatt = {
    'None': {price: 0, capacity: 0},
    '8.8 kWh': {price: 3990, capacity: 8.8},
    '17.6 kWh': {price: 5990, capacity: 17.6}
};

var VanExtBat             = {
    'None': {price: 0, capacity: 0},
    '26 kWh': {price: 9680, capacity: 26},
    '35 kWh': {price: 12100, capacity: 35},
    '44 kWh': {price: 14520, capacity: 44},
    '53 kWh': {price: 16940, capacity: 53}
};
var EvaliaExtBat                = {
    'None': {price: 0, capacity: 0},
    '26 kWh': {price: 9680, capacity: 26}
};

var configs = {
    'Car Type': {'car':'car', 'van':'van'},
    'Car model': {
        'Gen. 1': {
            price: [7250, 10500],
            capacity: 21.3,
            consumption: 175,
            fullspeed: 25,
            soh: 0.75,
            type: 'car',
            'Extender battery': LeafExtBatt
        },
        'Gen. 2': {
            price: [9900, 14500],
            capacity: 21.3,
            consumption: 169,
            fullspeed: 25,
            soh: 0.87,
            type: 'car',
            'Extender battery': LeafExtBatt
        },
        'Gen. 3': {
            price: [14900, 18000],
            capacity: 28.3,
            consumption: 169,
            fullspeed: 90,
            soh: 0.88,
            type: 'car',
            'Extender battery': LeafExtBatt
        },
        'Gen. 4': {
            price: [28500, 33250],
            capacity: 38,
            consumption: 164,
            fullspeed: 65,
            soh: 0.96,
            type: 'car',
            'Extender battery': LeafExtBatt
        },
        'Gen. 5': {
            price: [49000, 49000],
            capacity: 55,
            consumption: 170,
            fullspeed: 45,
            soh: 1,
            type: 'car',
            'Extender battery': LeafExtBatt
        },
        'e-NV200 VAN 24kWh': {
            price: [16500, 22000],
            capacity: 22,
            consumption: 190,
            fullspeed: 45,
            soh: 0.95,
            type: 'van',
            'Extender battery': VanExtBat
        },
        'e-NV200 VAN 40kWh': {
            price: [28500, 36000],
            capacity: 38,
            consumption: 205,
            fullspeed: 45,
            soh: 1,
            type: 'van',
            'Extender battery': VanExtBat
        },
        'e-NV200 EVALIA 24kWh': {
            price: [23500, 30000],
            capacity: 22,
            consumption: 190,
            fullspeed: 45,
            soh: 0.95,
            type: 'van',
            'Extender battery': EvaliaExtBat
        },
        'e-NV200 EVALIA 40kWh': {
            price: [38000, 38000],
            capacity: 38,
            consumption: 205,
            fullspeed: 45,
            soh: 1,
            type: 'van',
            'Extender battery': EvaliaExtBat
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

