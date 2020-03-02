/* Variable initiations; */
var selected_model = null;
var selected_extender = null;
var selected_main = null;

var selected_orig_batt = null;
var sell_battery_cost = null;
var manual_sell_orig_batt = null;
var manual_soh = null;

var car_value = null;
var selected_soh = null;
var selected_incl_car_value = null;
var manual_car_value = null;

var usable_capacity = null;
var range = null;
var fullspeed_estimate = null;

var soh_value = null;
var form_Configurator = id("build-form");

// Sstart building configurator interface
create_configurator();

// Handle form changes
form_Configurator.addEventListener("change",formChanged,false);

/**
 * Hangle form changes: update GUI, update stats, update picture
 */
function formChanged(e) {
    rebuildForm(e);
    readFormValues();
    calculate_stats();
    updateStats();
    updatePreviewPicture();
}

/**
 *  Load images of cars into our configurator
 */
function loadPictures(){
    target = document.getElementById("svgContainer");
    loadSVG(target,"gen1");
    loadSVG(target,"gen2");
    // (...)
}

/**
 * Creates all the DOM elements for the configurator tool based on the "configs" array
 */
function create_configurator(){
    // Iterate over the options array and add buttons for every option
    
    var n=0;
    
    for(var caption in configs){
        if( !configs.hasOwnProperty(caption)) continue;
        addRow(caption, configs[caption]);
        
        // Make 1 extra row for the battery extension:
        if (caption === "Car model") addRow("Extender battery", {} );
    }
    
    // Preselect some radio buttons:
    id("sell-original-battery-0").checked = true;
    id("original-battery-soh-0").checked = true;
    id("include-car-value-0").checked = true;
    id('original-battery-soh-manual').value = 77;
    id('sell-original-battery-manual').value = 5000;
    
    // Add extra 'type' class to car-model labels
    
}

/**
 * Fill the values for the Battery Extension
 */
function rebuildForm(e){
    var form;
    var selected_model;
    
    
    if (e.target.name === 'car-model') {
        
        form           = document.forms['build-form'];
        var selected_model = e.target.value;
        
        // Retrieve available options for model
        options = configs['Car model'][selected_model]['Extender battery'];
        
        // Clear all the options
        elem_options           = id("options-EXTENDER-BATTERY");
        elem_options.innerHTML = "";
        
        // Fill the form with the options for the selected car model
        var index = 0;
        for (var option in options) {
            if (!options.hasOwnProperty(option)) continue;
            addRadioLabel(elem_options, option, index++, 'extender-battery');
        }
        
        // Set choice for extender battery and main battery upgrade to "None"
        id('extender-battery-0').checked     = true;
        id('main-battery-upgrade-0').checked = true;
        
        // Update the manual value for the SOH
        id('original-battery-soh-manual').value = configs['Car model'][selected_model]['soh'] * 100;
        
        // Update the manual value for the price of the original battery
        id('sell-original-battery-manual').value =
            ~~(configs['Car model'][selected_model]['capacity'] * configs['Car model'][selected_model]['soh'] * 150);
    }
    
    if (e.target.name === "car-type"){
        // SHow only car models that match the car type ('car' or 'van')
        var car_type = e.target.value;
        id('options-CAR-MODEL').className = "configurator-options car-type-"+car_type;
        
        // Deselect the model
        document.getElementsByName("car-model").forEach(uncheck);
        
        // Remove elements in 'extender battery'
        id("options-EXTENDER-BATTERY").innerHTML = "";
        
        // Clear stats
        [id('stats_capacity'),id('stats_range'),id('stats_cost'),id('stats_chargingspeed')].forEach(clear)
    }
    
    if (e.target.name === "main-battery-upgrade"){
        // Make it impossible to select the largest battery extension together with the 62Kwh main battery
    
        form                = document.forms['build-form'];
        selected_type       = form['car-type'].value;
        selected_model      = form['car-model'].value;
        selected_main           = form['main-battery-upgrade'].value;
        
        id("extender-battery-2").disabled =  ( selected_type === "car" && selected_model !== "Gen. 5" && selected_main === "to 62kWh");

    }
    
    if (e.target.name === "extender-battery"){
        // Make it impossible to select the largest battery extension together with the 62Kwh main battery
    
        form                = document.forms['build-form'];
        selected_type       = form['car-type'].value;
        selected_model      = form['car-model'].value;
        selected_extender       = form['extender-battery'].value;
        
        id("main-battery-upgrade-3").disabled =  ( selected_type === "car" && selected_model !== "Gen. 5" && selected_extender === "17.6 kWh");
    }
}

/**
 * Read values from the form and assing them to 'global' values
 */
function readFormValues() {
    var form = document.forms['build-form'];
    
    selected_model          = form['car-model'].value;
    selected_model_id       = selected_model.toLowerCase().replace(/[^a-z0-9]{1}/g,""); // Used for DOM-finding.
    
    selected_extender       = form['extender-battery'].value;
    selected_main           = form['main-battery-upgrade'].value;
    
    selected_orig_batt      = form['sell-original-battery'].value;
    manual_sell_orig_batt   = form['sell-original-battery-manual'].value;
    
    selected_soh            = form['original-battery-soh'].value;
    manual_soh              = form['original-battery-soh-manual'].value / 100;
    
    selected_incl_car_value = form['include-car-value'].value;
    manual_car_value        = form['include-car-value-manual'].value*1;
}

/**
 * MAIN FUNCTION: Calculate the stats: costs, range, capacity
 */
function calculate_stats(){
    // Create some references to the configs object
    var model =  configs['Car model'][selected_model];
    var main = configs['Main battery upgrade'][selected_main];
    var extender = model['Extender battery'][selected_extender];
    
    // determine SOH (Status of Health)
    if (selected_soh === "Automatic") soh_value = model.soh;
    if (selected_soh === "Manual input") soh_value = manual_soh;
    
    // estimate of --- USABLE CAPACITY ---
    usable_capacity = extender.capacity;
    
    if(selected_main === "None") {
        // ... add the original battery capacity
        usable_capacity += model.capacity*soh_value;
    } else {
        // ... add the capacity of the new main battery
        usable_capacity += main.capacity*main.soh;
    }
    
    // estimate of --- RANGE ---
    range = usable_capacity * 1000 / model.consumption;
    
    // estimate of ---  UPGRADE COSTS ---
    // ... sell original battery
    switch(selected_orig_batt){
        case "No":
            sell_battery_cost = 0;
            break;
        
        case "Automatic":
            sell_battery_cost = model.capacity*soh_value * 150;
            sell_battery_cost = Math.round(sell_battery_cost);
            break;
        
        case "Manual input":
            sell_battery_cost = manual_sell_orig_batt ;
            break;
    }
    
    // ... include value of purchasing the car?
    switch(selected_incl_car_value){
        case "No":
            car_value = 0;
            break;
        case "Automatic":
            car_value = model.price[1];
            break;
        case "Manual input":
            car_value = manual_car_value;
            break;
    }
    
    // ... summation
    cost =
        extender.price
        + main.price
        - sell_battery_cost
        + car_value;
    
    // estimate of --- FULL-SPEED CHARGING ---
    impact_of_extender = extender.capacity / (usable_capacity);
    
    if (selected_main === "None") {
        if (selected_model !== "Gen. 1" && selected_model !== "Gen. 2") {
            impact_of_extender *= 2;
        }
        fullspeed_estimate = (100 - model.fullspeed ) * impact_of_extender + model.fullspeed;
        
    } else {
        fullspeed_estimate = (100 - main.fullspeed)*impact_of_extender + main.fullspeed;
    }
}

/**
 * Update the content of the DOM-elements that contain the stats (results) of the selected options
 */
function updateStats(){
    document.getElementById('stats_cost').innerHTML             = "&euro;" + cost.toFixed(0);
    document.getElementById('stats_capacity').innerText         = usable_capacity.toFixed(1) + "kWh";
    document.getElementById('stats_range').innerText            = range.toFixed(0) + "km";
    document.getElementById('stats_chargingspeed').innerHTML    = "0-" + fullspeed_estimate.toFixed(0) + "% (" + (fullspeed_estimate * usable_capacity / 100).toFixed(1) + " kWh)";
}

/**
 * Update the picture of the car by showing and hiding different SVG's and different layers
 */
function updatePreviewPicture(a) {
    return;
    
    //  Hide all cars
    document.querySelectorAll("svg").forEach(function (elem) { elem.style.opacity = 0  });
    
    // Show selected car
    document.getElementById("svg-" + selected_model_id).style.opacity = 1;
    
    // Hide all battery extensions
    document.querySelectorAll("[id*='upgrade']").forEach(function (elem) { elem.style.opacity = 0  });
    
    // Show selected extension
    if (selected_extender !== "None"){
        if (selected_extender === "8.8 kWh") document.getElementById(selected_model_id + "-upgrade-" +  "8-8").style.opacity = 1;
        if (selected_extender === "17.6 kWh") document.getElementById(selected_model_id + "-upgrade-" +  "17-6").style.opacity = 1;
    }
}

/* Utility functions to help manipulate the DOM*/
/**
 *  Add an element specified by 'tag' to the 'target', possible with attributes
 */
function addElement(target, tag, attrs){
    var newElement = document.createElement(tag);
    
    for(var attr in attrs){
        if(attrs.hasOwnProperty(attr)) newElement.setAttribute(attr, attrs[attr]);
    }
    
    target.appendChild(newElement);
    
    return newElement;
}

/**
 * Add a row to the options list
 */
function addRow(caption, options){
    // Add row to configurator
    var elem_row = addElement(form_Configurator,"div",{class: 'configurator-row'});
    
    // add caption
    var elem_categoryName = addElement(elem_row,"span",{'class': "caption"});
    setText(elem_categoryName, caption);
    
    // Create container for all options
    var elem_options = addElement(elem_row,"div",{'class':"configurator-options", id: "options-"+strToAttribute(caption).toUpperCase()});
    
    // Radio-buttons and labels
    var index = 0;
    for(var option in options){
        if( !options.hasOwnProperty(option)) continue;
        
        l = addRadioLabel(elem_options,option,index++,strToAttribute(caption));
        
        if ( caption === 'Car model'){
            l[1].className = configs['Car model'][option].type;
        }
        
        if(option === "Manual input"){
            var attributes = options[option];
            addTextfield(elem_options,strToAttribute(caption) + "-manual",attributes);
        }
    }
}

/**
 * Add a radio button and a label to an options-row
 */
function addRadioLabel(target,value,index,name){
    var elem_radio = addElement(target,"input",{
        name: name,
        type: "radio",
        value: value,
        id: name + "-" + index,
    });
    
    var label = addElement(target, "label",{
        'for': name + "-" +index
    });
    
    setText(label,value);
    return([elem_radio,label])
}

/**
 * Add a text field to an options-row
 */
function addTextfield(target,name,attrs){
    var elem_radio = addElement(target,"input",{
        'name':     name,
        'type':     "number",
        'value':    "0",
        'id':       name,
        'class':    "number"
    });
    
    for(var attr in attrs){
        if (attrs.hasOwnProperty(attr)) elem_radio.setAttribute(attr, attrs[attr]);
    }
    
    setText(addElement(target,"span",{"class": 'suffix'}),attrs['unit']);
}

/*
 * Shorter way to retrieve an element by id
 */
function id(id){
    return document.getElementById(id);
}

/**
 * set text of an options-row
 */
function setText(target, text){
    var newContent = document.createTextNode(text);
    target.appendChild(newContent);
    return target;
}

/**
 * Removes inner HTML of target
 * @param target
 */
function clear(target){
    target.innerHTML=""
}


/**
 * Unchecl the selected target (must be radio or checkbox).
 * @param target
 */
function uncheck(target){
    target.checked = false;
}

/**
 * Create a valid id from an arbitrary string
 */
function strToAttribute(text){
    return text.replace(/\W/g, '-').toLowerCase();
}

/**
 * Loads a SVG file from the 'assets' folder inline into a target DOM-object
 * @param target DOM-object where the SVG will be appended to
 * @param filename
 */
function loadSVG(target, filename){
    xhr = new XMLHttpRequest();
    xhr.open("GET","./assets/" + filename + ".svg",false);
    
    xhr.overrideMimeType("image/svg+xml");
    xhr.send("");
    target.appendChild(xhr.responseXML.documentElement);
}

/**
 * Retrieve text from a server.
 *
 * @param {string} url
 * @param {function} callback
 * @param {object} options
 */
function get( url, callback, options ){
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    
    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            callback( request.responseText, options );
        } else {
            console.warn("Server responded with an error on a get-request.")
            console.warn("URL." + url );
            
        }
    };
    
    request.onerror = function() {
        console.warn("Error while performing get-request.")
    };
    
    request.send();
}

