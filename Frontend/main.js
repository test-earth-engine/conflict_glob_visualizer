import * as wwd from "./world_wind.js"
import * as tools from './tools.js'; 
import * as bar_a_3 from './bar_a_3.js'; 
import * as table_a_3 from './table_a_3.js'; 

main(); 


async function main() 
{
    let population_data = await population_data_get(); 
    let featuresByName = await features_by_name_get(population_data); 

    //wwd.world_wind_create("canvas1_id", population_data, featuresByName, null); 
    //plotly_create(population_data); 

    wwd.world_wind_create("canvas1_id", 
        population_data, 
        featuresByName, 
        () => {
            plotly_create(population_data); 
        }
    ); 
    interactions(population_data, featuresByName); 
}


async function plotly_create(population_data) 
{
    tools.showSpinner2(); 

    let data = await population_data_preprocessing(population_data); 

    let graphs = {}; 
    graphs["bar_a_3"] = bar_a_3;
    graphs["table_a_3"] = table_a_3; 

    const promises = Object.entries(graphs).map(async ([key,value]) => 
    {
        const graph = await value.graph_create(key);
        return value.interaction_a(graph, data);
    });


    Promise.all(promises).then(results => {
        console.log('All promises resolved', results);
        tools.hideSpinner2(); 
    }); 
}

async function population_data_preprocessing(population_data) 
{
    let countries = await features_by_name_get(population_data); 

    let start_date = '2020-01-01'; 
    let features = population_data?.["features"];
    let arr = Object.entries(countries).map( ([country,id]) => {
        let feature = features[id]; 
        let populations = feature?.["properties"]?.["population"]; 
        let population = populations.filter(item => item["start_date"] == start_date); 
        let population_value = population.at(-1)["population_value"]; 
        //population_value = Math.floor(population_value); 
        population_value = (population_value / 1e6).toFixed(5); 
        //population_value = tools.formatScientific(population_value, 2, 2); 
        //if(population_value > 1e6)  population_value = (population_value / 1e6).toFixed(3);
        return ({country, population:population_value});
        //return [id, {country, population:population_value, date:start_date}]; // -> obj
    }); 

    //let obj = Object.fromEntries(arr); 
    let indices = await tools.sortedIndices(arr.map(item => item["population"])); 
    arr = indices.map(i => arr[i]); 
    return arr; 
}


async function features_by_name_get(population_data) 
{
    let features = population_data["features"]
    let featuresByName = features.reduce((obj, item, i) => {
        let country = item["properties"]["country"];
        obj[country] = i;
        return obj;
    }, {});

    return featuresByName; 
}


async function population_data_get() 
{
    var population_file = "https://raw.githubusercontent.com/test-earth-engine/gee1/main/Notebooks/ucdp_v241_y2020_gpw_population_2.geojson"
    
    let population_data = await tools.loadJson(population_file); 
    console.log("population_data:", population_data ); 
    return population_data;     
}


async function interactions(data, featuresByName) 
{
    tools.event_received('from_table_a_3', 
        (e) => hightlight_by_country(e, data, featuresByName)
    );

}


function hightlight_by_country(event, data, featuresByName)
{
    let received = event.detail; // -> {country:'country'}
    let country = received?.["country"];
    document.getElementById("message_container").innerHTML = `Selected : '${country}'`;

    if(featuresByName.hasOwnProperty(country))
    {
        let feature_id = featuresByName[country]; 
        console.log(`[interactions] country:'${country}' (${feature_id}) `); 
        wwd.world_wind_interaction(country, data, featuresByName); 
    }

}
