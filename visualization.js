async function init(){
    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 100, bottom: 30, left: 30},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
    var crange = ['purple','pink','salmon','magenta','plum'];

    const data= await d3.csv("data/women_dataset.csv");
    const data2017=data.filter(function(d){ return d.Year=="1997"})
    const sortLabor=data2017.sort(function(a,b) { return +a.Proportion_of_Women_Labor_Force - +b.Proportion_of_Women_Labor_Force })
    const sortHrs=data2017.sort(function(a,b) { return +a.Avg_Weekly_Hours_Worked_by_Woman - +b.Avg_Weekly_Hours_Worked_by_Woman })
    const sortBen=data2017.sort(function(a,b) { return +a.Public_Spending_on_Family_Benefits - +b.Public_Spending_on_Family_Benefits })
    
    const top5Labor=sortLabor.filter(function(d,i){ return i<5 })
    const top5Hrs=sortHrs.filter(function(d,i){ return i<5 })
    const top5Ben=sortBen.filter(function(d,i){ return i<5 })

   
    // const countryList=  d3.map(data, function(d){return(d.Entity)}).keys()
   //var dataNotZero=dataByCountry.filter(function(d) { return d.Proportion_of_Women_Labor_Force>0 })   
   //var dataByCountry = dataNotZero.map(function(d){return { Year: new Date(d.Year), value:d[selectedGroup]} })

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
    minYear=d3.min(top5Labor, function(d) { return new Date (d.Year) }) 
    maxYear=d3.max(top5Labor, function(d) { return new Date (d.Year) }); 

    var x = d3.scaleTime()
        .domain([minYear,maxYear])
        .range([ 0, width ])

    var xAxis = d3.axisBottom(x)
      .tickFormat(d3.timeFormat("%Y"));

    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("class","myXaxis")
      .call(xAxis);

    // Add Y axis
   

    minValue=d3.min(top5Labor, function(d) { return d.Proportion_of_Women_Labor_Force}) 
    maxValue=d3.max(top5Labor, function(d) { return d.Proportion_of_Women_Labor_Force }); 
    // create the Y axis
   
    var y = d3.scaleLinear()
      .domain( [minValue,maxValue ])
      .range([ height, 0 ]);
    var yAxis= d3.axisLeft().scale(y);
    svg.append("g")
       .attr("class","myYaxis")
      .call(yAxis);

    // Initialize line with group a
    var line = svg
      .append('g')
      .data(top5Labor)
      .enter()
      .append("path")
        //.attr("d", d=> d3.line(
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
      var dataNotZero2=dataByCountry.filter(function(d) { return d[selectedGroup]>0 }) 
      var dataFilter = dataNotZero2.map(function(d){return { Year: new Date(d.Year), value:d[selectedGroup]} })

      // Create different axis with selection
      // Create the X axis:
      minYear=d3.min(dataFilter, function(d) { return new Date (d.Year) }) 
      maxYear=d3.max(dataFilter, function(d) { return new Date (d.Year) }); 
      x.domain([minYear,maxYear ]);
      svg.selectAll(".myXaxis").transition()
        .duration(3000)
        .call(xAxis);

        minValue=d3.min(dataFilter, function(d) { return d.value }) 
        maxValue=d3.max(dataFilter, function(d) { return d.value }); 
      // create the Y axis
      y.domain([minValue, maxValue]);
      svg.selectAll(".myYaxis")
        .transition()
        .duration(3000)
        .call(yAxis);

        
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