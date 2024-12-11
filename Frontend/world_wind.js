import * as tools from './tools.js'; 


var shapeConfigurationCallback1 = function (geometry, properties) 
{
    var configuration = {};

    if (geometry.isPointType() || geometry.isMultiPointType()) {
        configuration.attributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);

        if (properties && (properties.name || properties.Name || properties.NAME)) {
            configuration.name = properties.name || properties.Name || properties.NAME;
        }
        if (properties && properties.POP_MAX) {
            var population = properties.POP_MAX;
            configuration.attributes.imageScale = 0.01 * Math.log(population);
        }
    }
    else if (geometry.isLineStringType() || geometry.isMultiLineStringType()) {
        configuration.attributes = new WorldWind.ShapeAttributes(null);
        configuration.attributes.drawOutline = true;
        configuration.attributes.outlineColor = new WorldWind.Color(
            0.1 * configuration.attributes.interiorColor.red,
            0.3 * configuration.attributes.interiorColor.green,
            0.7 * configuration.attributes.interiorColor.blue,
            1.0);
        configuration.attributes.outlineWidth = 2.0;
    }
    else if (geometry.isPolygonType() || geometry.isMultiPolygonType()) 
    {
        configuration.attributes = new WorldWind.ShapeAttributes(null);

        // Fill the polygon with a random pastel color.
        configuration.attributes.interiorColor = new WorldWind.Color(
            0.375 + 0.5 * Math.random(),
            0.375 + 0.5 * Math.random(),
            0.375 + 0.5 * Math.random(),
            0.5);
        // Paint the outline in a darker variant of the interior color.
        configuration.attributes.outlineColor = new WorldWind.Color(
            0.5 * configuration.attributes.interiorColor.red,
            0.5 * configuration.attributes.interiorColor.green,
            0.5 * configuration.attributes.interiorColor.blue,
            1.0);

        var highlightAttributes = new WorldWind.ShapeAttributes(configuration.attributes);
        highlightAttributes.interiorColor = new WorldWind.Color(1, 1, 1, 1);
        configuration.highlightAttributes = highlightAttributes;             
    }

    return configuration;
};



var shapeConfigurationCallback2 = function (attributes, record) 
{
var configuration = {};
configuration.name = attributes.values.name || attributes.values.Name || attributes.values.NAME;

if (record.isPointType()) { // Configure point-based features (cities, in this example)
    configuration.name = attributes.values.name || attributes.values.Name || attributes.values.NAME;

    configuration.attributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);

    if (attributes.values.pop_max) {
        var population = attributes.values.pop_max;
        configuration.attributes.imageScale = 0.01 * Math.log(population);
    }
} else if (record.isPolygonType()) { // Configure polygon-based features (countries, in this example).
    configuration.attributes = new WorldWind.ShapeAttributes(null);

    // Fill the polygon with a random pastel color.
    configuration.attributes.interiorColor = new WorldWind.Color(
        0.375 + 0.5 * Math.random(),
        0.375 + 0.5 * Math.random(),
        0.375 + 0.5 * Math.random(),
        1.0);

    // Paint the outline in a darker variant of the interior color.
    configuration.attributes.outlineColor = new WorldWind.Color(
        0.5 * configuration.attributes.interiorColor.red,
        0.5 * configuration.attributes.interiorColor.green,
        0.5 * configuration.attributes.interiorColor.blue,
        1.0);
}

return configuration;
};



function layer_countries_add(wwd) 
{
    var shapefileLibrary = "https://worldwind.arc.nasa.gov/web/examples/data/shapefiles/naturalearth";

    var worldLayer = new WorldWind.RenderableLayer("Countries");
    var worldShapefile = new WorldWind.Shapefile(shapefileLibrary + "/ne_110m_admin_0_countries/ne_110m_admin_0_countries.shp");
    worldShapefile.load(null, shapeConfigurationCallback2, worldLayer);
    wwd.addLayer(worldLayer);
}



/*
function layer_geojson_add(wwd, name, geojson_file)
{
    //https://raw.githubusercontent.com/test-earth-engine/gee1/main/Jsons/countries.geojson
    //var resourcesUrl = resourcesUrl = "https://worldwind.arc.nasa.gov/web/examples/data/geojson-data/";
    //var geojson_file = resourcesUrl + "PolygonTest.geojson";

    var polygonLayer = new WorldWind.RenderableLayer(name);
    var polygonGeoJSON = new WorldWind.GeoJSONParser(geojson_file);
    polygonGeoJSON.load(null, shapeConfigurationCallback1, polygonLayer);

    wwd.addLayer(polygonLayer);
}
*/

function StarFieldLayer_create(date) 
{
    var StarFieldLayer = new WorldWind.StarFieldLayer();
    StarFieldLayer.time = date;

    return StarFieldLayer; 
}

function AtmosphereLayer_create(date) 
{
    var AtmosphereLayer = new WorldWind.AtmosphereLayer();
    AtmosphereLayer.time = date;

    return AtmosphereLayer; 
}


function layer_circle_create(wwd, displayName) 
{
    var attributes = new WorldWind.ShapeAttributes(null);
    attributes.outlineColor = WorldWind.Color.BLUE;
    attributes.interiorColor = new WorldWind.Color(0, 1, 1, 0.5);

    var highlightAttributes = new WorldWind.ShapeAttributes(attributes);
    highlightAttributes.interiorColor = new WorldWind.Color(1, 1, 1, 1);

    var circle = new WorldWind.SurfaceCircle(new WorldWind.Location(35, -120), 200e3, attributes);
    circle.highlightAttributes = highlightAttributes;

    var shapesLayer = new WorldWind.RenderableLayer(displayName);
    shapesLayer.addRenderable(circle);
    
//    var highlightController = new WorldWind.HighlightController(wwd);    
    wwd.addLayer(shapesLayer);
    wwd.redraw();
}

function generateTable(arr) 
{
    if (arr.length === 0) return "<table><tr><td>No data available</td></tr></table>";

    // Extract keys from the first object in the array
    const keys = Object.keys(arr[0]);

    // Generate table headers
    const tableHeaders = keys.map(key => `<th style="border: 1px solid #ccc; padding: 5px;">${key}</th>`).join("");

    // Generate table rows
    const tableRows = arr.map(item => `
        <tr>
            ${keys.map(key => `<td style="border: 1px solid #ccc; padding: 5px;">${item[key]}</td>`).join("")}
        </tr>
    `).join("");

    // Combine into a full table
    return `
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
                ${tableHeaders}
            </tr>
            ${tableRows}
        </table>
    `;
}


function createPopupTable(arr) 
{
    var popup = document.createElement("div");    
    popup.id = "popup_id"; 
    popup.style.border = "1px solid black";
    popup.style.padding = "10px";
    popup.style.backgroundColor = "white";

    let table = generateTable(arr); 
    popup.innerHTML = `
        <div style="border: 1px solid #ccc; padding: 10px; width: 300px; background-color: #f9f9f9; position: relative;">
            <button style="
                position: absolute; 
                top: 5px; 
                right: 5px; 
                background: none; 
                border: none; 
                font-size: 12px; 
                cursor: pointer; 
                color: #d9534f;" 
                onclick="document.getElementById('popup_id').remove()">&#10005;</button>
                ${table}
        </div>`;

    return popup; 
}


function popup_create(containerId, object, x, y, data, featuresByName, wwd) 
{
    var pickedObject = object.userObject;
    console.log("featuresByName:", featuresByName); 

    let country = pickedObject?.["layer"]?.["displayName"]; 
    let feature = feature_by_country_get(country, data, featuresByName); 
    let message = message_create(country, feature); 
    let [longitude,latitude] = centroid_calculate(feature); 
    lookAtCoordinates(wwd, latitude, longitude, 10e6, 5e3, null); 

    x = 0;
    y = 0; 
    let popup = createPopupTable([message]); 
    popup.style.top = y + "px";
    popup.style.left = x + "px";
    popup.style.zIndex = 1000;
    popup.style.position = "absolute";

    document.body.appendChild(popup);  
    //popup.addEventListener("click", () => document.body.removeChild(popup) );
    const canvas = document.getElementById(containerId);
}


function message_create(country, feature) 
{
    let message = {}; 
    message["country"] = country; 

    if(feature) 
    {
        let start_date = '2020-01-01'; 
        let populations = feature?.["properties"]?.["population"]; 
        let population = populations.filter(item => item["start_date"] == start_date); 
        let population_value = population.at(-1)["population_value"]; 
        message["population (Million)"] = (population_value / 1e6).toFixed(3);
    }
 
    console.log(message); 
    return message; 
}


function centroid_calculate(feature)
{
    //console.log("[centroid_calculate] ", feature); 

    const cleanedFeature = turf.cleanCoords(feature);
    console.log( cleanedFeature ); 

    const centroid = turf.centroid(cleanedFeature);

    const [longitude,latitude] = centroid.geometry.coordinates;
    console.log("[centroid_calculate] Centroid Coordinates:", [longitude,latitude] );

    return [longitude,latitude]; 
}


function lookAtCoordinates(wwd, latitude, longitude, hight, travelTime, func) 
{
    //console.log("[lookAtCoordinates]", [longitude,latitude] ); 
    let position = new WorldWind.Position(latitude, longitude, 0); 

    var lookAtLocation = new WorldWind.Position(latitude, longitude, hight);

    let animator = new WorldWind.GoToAnimator(wwd); 
    animator.travelTime = travelTime;
    animator.goTo(lookAtLocation, func);

    wwd.navigator.roll = 0; 
    wwd.navigator.tilt = 0; 
    wwd.navigator.heading = 0; 

    //console.log("[lookAtCoordinates]", wwd.navigator ); 
}


export 
function feature_by_country_get(country, data, featuresByName) 
{
    let feature_id = featuresByName[country]; 
    //console.log("[message_create] ", country, feature_id); 

    let features = data["features"];  
    let feature = features[feature_id]; 
    //console.log("[feature_by_country_get] ", feature); 

    return feature; 
} 


function popup_add(containerId, wwd, data, featuresByName) 
{
/*    
    var surfacePolygon = new WorldWind.SurfacePolygon([
        new WorldWind.Location(40, -100),
        new WorldWind.Location(45, -100),
        new WorldWind.Location(45, -95),
        new WorldWind.Location(40, -95)
    ]);
    displayName = "popup_add"; 
    userProperties = {x:"x", y:"y"}; 

    var layer = new WorldWind.RenderableLayer();
    layer.addRenderable(surfacePolygon);
    wwd.addLayer(layer);
*/
    let func = (pickedObject,x,y) => popup_create(containerId, pickedObject, x, y, data, featuresByName, wwd); 

    wwd.addEventListener("click", (e) => 
        on_click_show_popup(e, wwd, func) );
}


function on_click_show_popup(event, wwd, func) 
{
    var x = event.clientX;
    var y = event.clientY;
    var canvasCoords = wwd.canvasCoordinates(x,y);

    var pickList = wwd.pick(canvasCoords);
    console.log("objects:", pickList.objects ); 

    for (var i = 0; i < pickList.objects.length; i++) 
    {
        var pickedObject = pickList.objects[i].userObject;

        if (pickedObject instanceof WorldWind.SurfacePolygon) 
        {
//            var position = pickList.objects[0].position;
//            wwd.goTo(new WorldWind.Location(position.latitude, position.longitude));

            func(pickList.objects[i], x, y);
            break;
        }
    }
}



function initializeWorldWind(canvasId) 
{
    var wwd = new WorldWind.WorldWindow(canvasId);
    let coordinatesDisplayLayer = new WorldWind.CoordinatesDisplayLayer(wwd); 

    var date = new Date();
    let starFieldLayer = StarFieldLayer_create(date); 
    let atmosphereLayer = AtmosphereLayer_create(date); 

    var layers = [
        {layer: new WorldWind.BMNGLayer(), enabled: true},
        {layer: atmosphereLayer, enabled: true},
        {layer: starFieldLayer, enabled: true},
        //{layer: new WorldWind.CompassLayer(), enabled: true},
        {layer: coordinatesDisplayLayer, enabled: true},
        //{layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
    ];

    for (var l = 0; l < layers.length; l++) {
        layers[l].layer.enabled = layers[l].enabled;
        wwd.addLayer(layers[l].layer);
    }

    var handleClick = function (recognizer) 
    {
        var x = recognizer.clientX,
            y = recognizer.clientY;

        var pickList = wwd.pick(wwd.canvasCoordinates(x, y));

        for (var i = 0; i < pickList.objects.length; i++) 
        {
/*            
            console.log("---------------------------------");
            console.log(i, pickList.objects[i] ); 
            console.log("---------------------------------");
            if (pickList.objects[i].userObject instanceof WorldWind.SurfacePolygon) 
            {
            }
*/
        }

        if (pickList.objects.length === 1 && pickList.objects[0].isTerrain) {
            var position = pickList.objects[0].position;
            wwd.goTo(new WorldWind.Location(position.latitude, position.longitude));
        }
    };

    var clickRecognizer = new WorldWind.ClickRecognizer(wwd, handleClick);
    var tapRecognizer = new WorldWind.TapRecognizer(wwd, handleClick);
    return wwd; 
}


function setGlobeNavigation(wwd, kms) 
{
    //var kms = 20000; 
    var lookAtLocation = new WorldWind.Position(0.0, 0.0,  kms * 1e3);
    wwd.goTo(lookAtLocation);
}


function feature_operations_2(wwd, feature) 
{
    console.log("[feature_operations] feature[0]:", feature); 

    const cleanedFeature = turf.cleanCoords(feature);
    console.log( cleanedFeature ); 

    const centroid = turf.centroid(cleanedFeature);
    //console.log("Centroid:", centroid);

    const [longitude,latitude] = centroid.geometry.coordinates;
    console.log("Centroid Coordinates:", [longitude,latitude] );

    createSurfacePolygonFromGeoJSON(wwd, cleanedFeature); 
}


function createSurfacePolygonFromGeoJSON(wwd, geojsonFeature) 
{
    // works, but geometry is not correct. 
    const coords = turf.coordAll(geojsonFeature); 
    console.log("coords:", coords ); 

    let coordinates = coords.map(coord => new WorldWind.Location(coord[1], coord[0]));
    console.log("coordinates:", coordinates.at(0) ); 
    const surfacePolygon = new WorldWind.SurfacePolygon(coordinates);

    surfacePolygon.attributes = new WorldWind.ShapeAttributes(null);
    surfacePolygon.attributes.interiorColor = new WorldWind.Color(0, 0, 1, 0.5); 
    surfacePolygon.attributes.outlineColor = new WorldWind.Color(1, 1, 1, 1); 

    const layer = new WorldWind.RenderableLayer("GeoJSON Polygon");
    layer.addRenderable(surfacePolygon);
    console.log( layer);

    wwd.addLayer(layer);
    wwd.redraw();
}


async function layer_population_add_1(wwd, name, population_data)
{
    let features = population_data["features"]
    //console.log("[layer_population_add] features:", features.length ); 

    features.forEach(feature => {
        let polygonLayer = layer_feature_add(feature); 
        wwd.addLayer(polygonLayer);  
    });
}


function layer_feature_add(feature) 
{
    let layer_name = feature["properties"]["country"]; 
    //console.log( feature ); 
    //console.log( layer_name ); 

    var polygonLayer = new WorldWind.RenderableLayer(layer_name);
    var polygonGeoJSON = new WorldWind.GeoJSONParser(feature);
    //console.log(polygonGeoJSON); // userProperties

    polygonGeoJSON.load(null, shapeConfigurationCallback1, polygonLayer);
    //wwd.addLayer(polygonLayer);  
    return polygonLayer;   
}

export 
async function world_wind_create(canvas_id, population_data, featuresByName, func) 
{
    world_wind = initializeWorldWind(canvas_id); 

    const canvas = document.getElementById(canvas_id);
    canvas.addEventListener("click", (event) => 
    {
        console.log("[main] Click detected on canvas");
    });

    //layer_countries_add(world_wind); 

    layer_population_add_1(world_wind, "ucdp_v241_y2020_gpw_population", population_data); //layer_name, feature); 

    var geojson_file2 = "https://raw.githubusercontent.com/test-earth-engine/gee1/main/Jsons/countries.geojson"
    //layer_geojson_add(world_wind, "countries", geojson_file2); 

    var geojson_file3 = "https://raw.githubusercontent.com/test-earth-engine/gee1/main/Jsons/conflict.geojson"
    //layer_geojson_add(world_wind, "conflict", geojson_file3); 

    let displayName = "layer_circle_create";
    layer_circle_create(world_wind, displayName); 
    popup_add(canvas_id, world_wind, population_data, featuresByName);    

    world_wind.navigator.range = 100e6; 
    //console.log( world_wind.navigator ); 

    let time = 10 * 1000; // segs 
    lookAtCoordinates(world_wind, 0.0, 0.0, 20e6, time, func); 
    new WorldWind.HighlightController(world_wind);  
    
    //return world_wind; 
}

export 
async function world_wind_interaction(country, data, featuresByName) 
{
    let feature = feature_by_country_get(country, data, featuresByName); 
    let [longitude, latitude] = centroid_calculate(feature); 
    lookAtCoordinates(world_wind, latitude, longitude, 10e6, 5e3, null);     

    highlight_by_displayName(country);     
}


async function highlight_by_displayName(displayName) 
{
    for (var i = 0; i < world_wind.layers.length; i++) 
    {
        let layer = world_wind.layers[i]; 
        let renderables = layer.renderables; 
        if(renderables) renderables.forEach(item => item.highlighted = false); 

        if(layer.displayName === displayName)
        {
            renderables.forEach(item => item.highlighted = true); 
        }
    }        
}


let world_wind = null; 

/*
    https://zglueck.github.io/workshop-demo/
    https://worldwind.arc.nasa.gov/autodocs/WebWorldWind/SurfacePolygon.html
    https://undp-population.projects.earthengine.app/view/test1
*/ 
