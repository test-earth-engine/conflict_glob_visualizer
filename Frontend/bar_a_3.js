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


///////////////////////////////////////////////////////////////////////////////
export async function interaction_a(plot_in, data) 
{
    console.log("interaction_a...", plot_in); 
    plot_in.on('plotly_hover', plotly_hover); 
    plot_in.on('plotly_click', tools.plotly_click);  

    redraw_a(plot_in, data); 
    return true; 
}


///////////////////////////////////////////////////////////////////////////////
async function redraw_a(plot_in, data) 
{
    console.log("[redraw_a]:", data.length );

    plot_in.data[0].orientation = "h";
    plot_in.data[0].y = data.map(item => item["country"]); 
    plot_in.data[0].x = data.map(item => item["population"]); 

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
    };

    var plot = document.getElementById(graph_div);
    Plotly.newPlot(plot, data, layout, {responsive:true}); 
    return plot; 
}


///////////////////////////////////////////////////////////////////////////////
const scriptUrl = import.meta.url; // URL of the current module
const scriptName = scriptUrl.split('/').pop(); // Extract the file name
console.log(`- '${scriptName}' loaded!!`);