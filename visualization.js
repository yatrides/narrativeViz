async function init(){
    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 100, bottom: 30, left: 30},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
    var crange = ['purple','pink','salmon'];

    const data= await d3.csv("data/women_dataset.csv");
    const dataByCountry=data.filter(function(d) { return d.Entity =='Mexico' }) 

    // append the svg object to the body of the page
    var svg = d3.select("#chart")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    

    //list of groups
    var allGroup =["Proportion_of_Women_Labor_Force","Avg_Weekly_Hours_Worked_by_Woman","Public_Spending_on_Family_Benefits"] 
  
    
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

    var x = d3.scaleTime()
        .domain([new Date("1990"),new Date("2017")])
        .range([ 0, width ])

    var xAxis = d3.axisBottom(x)
      .tickFormat(d3.timeFormat("%Y"));

    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    // Add Y axis
    var y = d3.scaleLinear()
      .domain( [0,80])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Initialize line with group a
    var line = svg
      .append('g')
      .append("path")
        .datum(dataByCountry)
        .attr("d", d3.line()
          .x(function(d) { return x( new Date(d.Year)) })
          .y(function(d) { return y(+d.Proportion_of_Women_Labor_Force) })
        )
        .attr("stroke", function(d) { return myColor() })
        .style("stroke-width", 4)
        .style("fill", "none")

    // A function that update the chart
    function update(selectedGroup) {

      // Create new data with the selection?
  
      var dataFilter = dataByCountry.map(function(d){return { Year: new Date(d.Year), value:d[selectedGroup]} })

      // Give these new data to update line
        line
          .datum(dataFilter)
          .transition()
          .duration(1000)
          .attr("d", d3.line()
            .x(function(d) { return x( new Date(d.Year)) })
            .y(function(d) { return y(+d.value) })
          )
          .attr("stroke", function(d){ return myColor(selectedGroup) })
    }

    // When the button is changed, run the updateChart function
    d3.select("#groupButton").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update(selectedOption)
    })
}