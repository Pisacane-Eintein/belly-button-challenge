// API url that contains the data
const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'

//Pull the metadata from the JSON for the id
function CompileMetaData(id) {
    
    // Fetch the JSON data
    d3.json(url).then(function (data) {
        let subjectData = data;
        let metadata = subjectData.metadata;
        
        // Filter the data to allow the suBject id with the dropdown id 
        let identifier = metadata.filter(sample =>
            sample.id.toString() === id)[0];
        
        // Display the key value pairs of the initial ID demographic data from metadata
        let SelectDropdown = d3.select('#sample-metadata');
        
        // Clear the html from the side panel
        SelectDropdown.html('');

        // Display the key value pairs of the selected id
        Object.entries(identifier).forEach(([key, value]) => {
            SelectDropdown.append('h6').text(`${key}: ${value}`);
        })
    })
};

// Make charts from the dataset of the specified id 
function MakeCharts(id) {
    d3.json(url).then(function (data) {
        let subjectData = data;
        let samples = subjectData.samples;
        let identifier = samples.filter(sample => sample.id === id);
        let filterData = identifier[0];
        let OTUvalues = filterData.sample_values.slice(0, 10).reverse();
        let OTUids = filterData.otu_ids.slice(0, 10).reverse();
        let labels = filterData.otu_labels.slice(0, 10).reverse();
        
        //Plot with a Bar chart
        let barTrace = {
            x: OTUvalues,
            y: OTUids.map(object => 'OTU ' + object),
            name: labels,
            type: 'bar',
            orientation: 'h'
        };
        let barLayout = {
            title: `Top 10 OTUs for Subject${id}`,
            xaxis: { title: 'Sample values' },
            yaxis: { title: 'OTU ids' }
        };
        let barData = [barTrace];
      
        Plotly.newPlot('bar', barData, barLayout);
    
        //Plot with a BuBBle chart
        let bubbleTrace = {
            x: filterData.otu_ids,
            y: filterData.sample_values,
            mode: 'markers',
            marker: {
                size: filterData.sample_values,
                color: filterData.otu_ids,
                colorscale: 'Portland'
            },
            text: filterData.otu_labels,
        };
        let bubbleData = [bubbleTrace];
        let bubbleLayout = {
            title: `OTUs for Subject${id}`,
            xaxis: { title: 'OTU ids' },
            yaxis: { title: 'Sample values' }
        };
        Plotly.newPlot('bubble', bubbleData, bubbleLayout);
    })
};

//This function allows the data update to occur onchange in the html (line 25) 
//The panel and plots update Based on the selected id
function optionChanged(id) {
    MakeCharts(id);
    CompileMetaData(id);
};

// Initialize the page with default data using the first id in the JSON
function init() {
    
    // Use the D3 to select the dropdown menu
    let dropDown = d3.select('#selDataset');

    // Assign the value of the dropdown menu to a variaBle
    let id = dropDown.property('value');
    
    // Fetch the initial data from first id in the JSON from the url
    d3.json(url).then(function (data) {
        subjectData = data;
        let names = subjectData.names;
        let samples = subjectData.samples;
        Object.values(names).forEach(value => {
            dropDown.append('option').text(value);
        })
        // Update data in the panel and the plots from the first id dataset
        CompileMetaData(names[0]);
        MakeCharts(names[0])
    })
};

init(); 