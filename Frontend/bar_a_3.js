import * as tools from "./tools.js"


var plotly_hover = function(eventData) 
{
    console.log("[plotly_hover]", eventData); 

    var points = eventData.points; 
    if(points && points[0]) 
    {
        var pointEvent = points["0"]; 
        let country = pointEvent.label; 
        console.log(`[plotly_hover] country:'${country}' ` ); 
    }
}


function plotly_click(plot_in, eventData) 
{
    var points = eventData.points; 
    var pointEvent = points["0"]; 
    //console.log("[plotly_click]", pointEvent.label, pointEvent.pointIndex); 

    pointEvent.data.marker.color = colors.map(item => item);
    pointEvent.data.marker.color[pointEvent.pointIndex] = 'red'; 

    tools.event_sent('from_table_a_3', {country:pointEvent.label} );
    Plotly.redraw(plot_in);
}


function modify_color_by_name(event, plot_in) 
{
    let received = event.detail; // -> {country:'country'}
    let country = received?.["country"];
    country = country.trim();

    plot_in.data[0].marker.color = colors.map(item => item);

    plot_in.data[0].y.forEach((element,i) => {
        if(element == country)  
            plot_in.data[0].marker.color[i] = "blue"; 
    });

    console.log( country ); 
    console.log( plot_in.data[0] ); 

    Plotly.redraw(plot_in);
}


///////////////////////////////////////////////////////////////////////////////
export async function interaction_a(plot_in, data) 
{
    console.log("interaction_a...", plot_in); 
    plot_in.on('plotly_hover', plotly_hover); 
    plot_in.on('plotly_click', (e) => plotly_click(plot_in,e) );

    tools.event_received('from_table_a_3', 
        (e) => modify_color_by_name(e, plot_in)
    );

    redraw_a(plot_in, data); 
    return true; 
}


///////////////////////////////////////////////////////////////////////////////
async function redraw_a(plot_in, data) 
{
    console.log("[redraw_a]:", data.length );

    colors = data.map(item => 'rgb(55, 83, 109)');

    plot_in.data[0].y = data.map(item => item["country"]); 
    plot_in.data[0].x = data.map(item => item["population"]); 
    plot_in.data[0].marker.color = colors;  
    plot_in.data[0].orientation = "h";

    var layout = {}; 
    layout['title.text'] = "Population"; 
    layout['xaxis.type'] = "log"; 
    layout['yaxis.autorange'] = "reversed"; 
    layout['yaxis.automargin'] = true; 

    Plotly.redraw(plot_in); 
    Plotly.update(plot_in, {}, layout);    
}


///////////////////////////////////////////////////////////////////////////////
export async function graph_create(graph_div) 
{
    var data = [{
        x: [],
        y: [],
        type: 'bar',
        marker: {color: []},
        //orientation: 'h'
    }];

    var layout = 
    {
//width: "100%",
//height: "100%",
        plot_bgcolor: '#191A1A', // insite
        paper_bgcolor: '#191A1A', // outsite
        title: {text: '??'}, 
        font: {color: 'white'},  
        margin: {t:40,b:50, l:10, r:10}, 
        xaxis: {showgrid: true, dtick: 1 }, 
        barcornerradius: 15,
    };

    var plot = document.getElementById(graph_div);
    Plotly.newPlot(plot, data, layout, {responsive:true}); 
    return plot; 
}

let colors = null; 


///////////////////////////////////////////////////////////////////////////////
const scriptUrl = import.meta.url; // URL of the current module
const scriptName = scriptUrl.split('/').pop(); // Extract the file name
console.log(`- '${scriptName}' loaded!!`);
