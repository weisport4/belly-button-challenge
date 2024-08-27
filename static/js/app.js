// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let sampleinfo = metadata.filter(x => x.id == sample)[0]; // note the ==

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a for loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
    for (const [key, value] of Object.entries(sampleinfo)) {
      panel.append("h6").text(`${key}: ${value}`);
    }
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let sample_data = data.samples;

    // Filter the samples for the object with the desired sample number
    let sampleinfo = sample_data.filter(x => x.id === sample)[0];
    console.log(sampleinfo);

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = sampleinfo.otu_ids;
    let otu_labels = sampleinfo.otu_labels;
    let sample_values = sampleinfo.sample_values;

    // Build a Bubble Chart
    let bubble_trace = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      marker: {
        color: otu_ids,
        size: sample_values.map(value => value / 2), // make bubbles smaller
        colorscale: "Viridis"
      },
      text: otu_labels
      };

    let bubble_traces = [bubble_trace];

    // Render the Bubble Chart
    let bubble_layout = {
      title: 'Bacteria Cultures per Sample'
    };

    Plotly.newPlot('bubble', bubble_traces, bubble_layout);


    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let bar_y = otu_ids.map(x => `OTU: ${x}`);
    console.log(bar_y);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let trace1 = {
      x: sample_values.slice(0, 10).reverse(),
      y: bar_y.slice(0, 10).reverse(),
      type: 'bar',
      marker: {
        colorscale: "Viridis",
        color: sample_values.slice(0, 10).reverse()
      },
      text: otu_labels.slice(0, 10).reverse(),
      orientation: 'h'
    };


    // Render the Bar Chart
    let traces = [trace1];

     // Apply a title to the layout
    let layout = {
      title: "Top 10 Bacteria Cultures Found"
    };

    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("bar", traces, layout);

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    console.log(data);

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let i = 0; i < names.length; i++){
      let name = names[i];
      dropdown.append("option").text(name);
    }

    // Get the first sample from the list
    let default_name = names[0];
    console.log(default_name);

    // Build charts and metadata panel with the first sample
    buildCharts(default_name);
    buildMetadata(default_name);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
