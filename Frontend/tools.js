
export
var plotly_hover = function(eventData) 
{
    console.log("[plotly_hover]", eventData); 

    var points = eventData.points; 
    if(points && points[0]) 
    {
        var pointEvent = points["0"]; 
        console.log("[plotly_hover]", pointEvent ); 
    }
}


export
var plotly_click = function(eventData) 
{
    console.log(`[plotly_click] eventData:`, eventData?.['points'] ); 

    if(!eventData) return; 

    var points = eventData.points; 
    if(points && points[0]) 
    {
        var pointEvent = points["0"]; 
        console.log("[plotly_click]", pointEvent.properties ); 
        //alert('You clicked this Plotly chart!');
    }
}


export 
async function loadJson(url) 
{
    try {
        const response = await fetch(url); // Fetch the JSON file
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json(); // Parse the JSON data
        return data; // Return the parsed JSON
    } catch (error) {
        console.error("Failed to load JSON:", error);
        throw error; // Propagate the error
    }
}


export 
async function sortedIndices(arr) 
{
    return arr.map((value, index) => ({ value, index })) 
    .sort((a, b) => b.value - a.value) 
    .map(({ index }) => index); 
}


export
function formatScientific(num, exponentShift, coefficientDecimals) 
{
    const exponent = Math.floor(Math.log10(num)) - exponentShift;
    const coefficient = (num / Math.pow(10, exponent)).toFixed(coefficientDecimals);
    return `${coefficient}e${exponent}`;
}

export
function showSpinner2() {
    document.getElementById('spinner_id').style.visibility = 'visible';
}

export
function hideSpinner2() {
    document.getElementById('spinner_id').style.visibility = 'hidden';
}

export
function showSpinner1() {
    document.getElementById('spinner_overlay_modulo').style.display = 'block';
    document.getElementById('spinner_container_modulo').style.display = 'block';
}

export
function hideSpinner1() {
    document.getElementById('spinner_overlay_modulo').style.display = 'none';
    document.getElementById('spinner_container_modulo').style.display = 'none';
}




export
async function event_sent(event_name, detail) 
{
    const customEvent = new CustomEvent(event_name, {detail:detail,});
    window.dispatchEvent(customEvent); 

    //var json = JSON.stringify(detail,null,2); 
    //console.log(`[event_sent] event_name:'${event_name}'`, json);
}


export 
async function event_received(event_name, event_func)
{
    //console.log(`[event_received] event_name:'${event_name}'`, event_func); 

    let result = null; 

    if (event_func)
    {
        window.addEventListener(event_name, event_func);
    }
    else 
    {
        window.addEventListener(event_name, (eventData) => {
            console.log(`[event_received] event_func:`, eventData.detail); 
            result = eventData.detail; 
        });
    }
    
    return result; 
}

//tools.event_sent('plot7_event1', {data:1} ); 
//tools.event_received('plot7_event1', ()=>{} ); 
