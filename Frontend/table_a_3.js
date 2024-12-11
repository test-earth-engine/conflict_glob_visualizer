import * as tools from "./tools.js"


///////////////////////////////////////////////////////////////////////////////
async function on_click_selected_cell_get(event) 
{
    const cell = event.target.closest('g');
    if (cell) 
    {
        const textElement = cell.querySelector('text');
        //console.log(`innerHTML:'${textElement.innerHTML}'`); 
        if (textElement) 
        {
            let selected = null; 
            const tspans = textElement.querySelectorAll('tspan');
            //console.log( tspans.length ); 
            if(tspans.length > 0) 
            {
                selected = Array.from(tspans).map(tspan => tspan.textContent).join(' ');
                //console.log(`tspans: '${selected}'`);    
            }
            else 
            {
                selected = textElement.textContent; 
                //console.log(`selected:'${selected}'`); 
            }

            return selected; 
        }
    }
}


export 
async function interaction_a(plot_in, data) 
{
    plot_in.addEventListener('click', async (e) => 
    {
        let result = await on_click_selected_cell_get(e);
        console.log(`[on_click_selected_cell_get] result:'${result}'` ); 

        tools.event_sent('from_table_a_3', {country:result} );         
    });

    plot_in.addEventListener('mouseover', highlight_cell); 
    plot_in.addEventListener('mouseout', reset_cell);

    redraw_a(plot_in, data); 
    return true; 
}


///////////////////////////////////////////////////////////////////////////////
function highlight_cell(event) 
{
    const cell = event.target.closest('g'); 
    if (cell) {
        const rect = cell.querySelector('rect'); 
        if (rect) {
            original_style = rect.style.fill;
            rect.style.fill = 'lightyellow'; 
        }
    }
}

function reset_cell(event) 
{
    const cell = event.target.closest('g'); // Identify the cell group
    if (cell) {
        const rect = cell.querySelector('rect'); // Get the cell background (rect)
        if (rect) {
            rect.style.fill = original_style; // Revert to original style
        }
    }
}


///////////////////////////////////////////////////////////////////////////////
async function redraw_a(plot_in, data) 
{
    //console.log("[redraw_a]:", data.length);

    const keys = Object.keys(data[0]);
    //console.log(keys); 
    
    keys.forEach((key,i) => 
    {
        plot_in.data[0].header.values[i+1] = `<b>${key}</b>`; 
        plot_in.data[0].cells.values[i+1] = data.map(it => it[key]); 
    })

    plot_in.data[0].header.values[0] = `<b> </b>`; 
    plot_in.data[0].cells.values[0] = data.map((it,i) => i+1); 

    Plotly.redraw(plot_in); 

    Plotly.update(plot_in, {}, {'title.text':"Population [Million]"});    
}


///////////////////////////////////////////////////////////////////////////////
export 
async function graph_create(graph_div) 
{
    var traces = [{
        type: 'table',
        header: {
                values: [], 
                align : ['left','center'],
                line: {width: 1, color: 'black'},
                fill: {color: "lightgrey"},
                font: {family: "Arial", size: 12, color: "black"}
        },
        cells: {
            values: [],
            align: ['left','center'],
            line: {color: "black", width: 1},
            fill: {color: ["white", "lightblue"]},
            font: {family: "Arial", size: 11, color: ["black"]}, 
            height: 30,
        }
    }];

    var layout = 
    {
//width: "100%",
//height: "100%",
        plot_bgcolor: '#191A1A', // insite
        paper_bgcolor: '#191A1A', // outsite
        title: {text: '??'}, 
        font: {color: 'white'},  
        margin: {t:40,b:10, l:10, r:10}, 
    };

    var plot6 = document.getElementById(graph_div);
    Plotly.newPlot(plot6, traces, layout, {responsive:true}); 

    return plot6; 
}

let original_style = ""; 

///////////////////////////////////////////////////////////////////////////////
const scriptUrl = import.meta.url; // URL of the current module
const scriptName = scriptUrl.split('/').pop(); // Extract the file name
console.log(`- '${scriptName}' loaded!!`);
