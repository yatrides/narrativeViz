async function init(){
    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 100, bottom: 30, left: 30},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
    var crange = ['blue','pink'];

    // append the svg object to the body of the page
    var svg = d3.select("#chart")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    const data= await d3.csv("data/regional-averages-of-the-composite-gender-equality-index.csv");
    console.log(data);  
    
    //list of groups 
    var allGroup =["Entity","Year"] 
    // add the options to the button
    d3.select("#groupButton")
      .selectAll('myOptions')
     	.data(allGroup)
      .enter()
    	.append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button

    // A color scale: one color for each group
    var myColor = d3.scaleOrdinal()
      .domain(allGroup)
      .range(crange);

    // Add X axis --> it is a date format
    var x = d3.scaleLinear()
      .domain([1950,2000])
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
    // Add Y axis
    var y = d3.scaleLinear()
      .domain( [50,80])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Initialize line with group a
    var line = svg
      .append('g')
      .append("path")
        .datum(data)
        .attr("d", d3.line()
          .x(function(d) { return x(+d.Year) })
          .y(function(d) { return y(+d.Equality_index) })
        )
        .attr("stroke", function(d){ return myColor() })
        .style("stroke-width", 4)
        .style("fill", "none")

    // A function that update the chart
    function update(selectedGroup) {

      // Create new data with the selection?
      var dataFilter = data.map(function(d){return {time: d.Year, value:d[selectedGroup]} })

      // Give these new data to update line
          .datum(dataFilter)
          .transition()
          .duration(1000)
          .attr("d", d3.line()
            .x(function(d) { return x(+d.Year) })
            .y(function(d) { return y(+d.value) })
          )
          .attr("stroke", function(d){ return myColor(selectedGroup) })
    }

    // When the button is changed, run the updateChart function
    d3.select("#selectButton").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update(selectedOption)
    })
}