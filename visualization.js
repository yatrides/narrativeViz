async function init(){
    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 100, bottom: 30, left: 30},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
    var crange = ['purple','pink','salmon','magenta','plum'];

    const data= await d3.csv("data/women_dataset.csv");
    data.forEach(d=>{
      d.Proportion_of_Women_Labor_Force=+d.Proportion_of_Women_Labor_Force; 
      d.Avg_Weekly_Hours_Worked_by_Woman=+d.Avg_Weekly_Hours_Worked_by_Woman;
      d.Public_Spending_on_Family_Benefits=+d.Public_Spending_on_Family_Benefits;
  });
    const data2013=data.filter(function(d){ return d.Year=="2013"})
    var dataNotZero=data2013.filter(function(d) { return  d.Proportion_of_Women_Labor_Force>0 && d.Avg_Weekly_Hours_Worked_by_Woman>0 && d.Public_Spending_on_Family_Benefits>0 }) 
    const sortLabor=dataNotZero.sort(function(a,b) { return +a.Proportion_of_Women_Labor_Force - +b.Proportion_of_Women_Labor_Force })
    const top5Labor=sortLabor.filter(function(d,i){ return i>20 })
    const countryList=  d3.map(top5Labor, function(d){return(d.Entity)}).keys()
    const allDataByTop5= data.filter(function(d,i){ return countryList.indexOf(d.Entity)>=0 })

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
    minYear=d3.min(allDataByTop5, function(d) { return new Date (d.Year) }) 
    maxYear=d3.max(allDataByTop5, function(d) { return new Date (d.Year) }); 

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
   

    minValue=d3.min(allDataByTop5, function(d) { return d.Proportion_of_Women_Labor_Force}) 
    maxValue=d3.max(allDataByTop5, function(d) { return d.Proportion_of_Women_Labor_Force }); 
    // create the Y axis
   
    var y = d3.scaleLinear()
      .domain( [minValue,maxValue ])
      .range([ height, 0 ]);
    var yAxis= d3.axisLeft().scale(y);
    svg.append("g")
       .attr("class","myYaxis")
      .call(yAxis);

      var groupByEntity = d3.nest() // nest function allows to group the calculation per level of a factor
      .key(function(d) { return d.Entity;})
      .entries(allDataByTop5);

      var colorByCountry = groupByEntity.map(function(d){ return d.key }) 
      var scaleColorCountry = d3.scaleOrdinal()
          .domain(colorByCountry)
          .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00'])


    // Initialize line with group a
    var line = svg.selectAll(".line")
    .append('g')
    .data(groupByEntity)
    .enter()
    .append("path")
      .attr("fill", "none")
      .attr("stroke", function(d){ return scaleColorCountry(d.key) })
      .attr("stroke-width", 4)
      .attr("d", function(d){
        return d3.line()
          .x(function(d) { return x( new Date(d.Year)) })
          .y(function(d) { return y(+d.Proportion_of_Women_Labor_Force) })
          (d.values)
      })
      

    // A function that update the chart
    function update(selectedGroup) {

      // Create new data with the selection?
      var dataFilter = allDataByTop5.map(function(d){return { Year: new Date(d.Year), value:d[selectedGroup]} })

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

          var groupByEntity = d3.nest() // nest function allows to group the calculation per level of a factor
          .key(function(d) { return d.Entity;})
          .entries(allDataByTop5);
    
          var colorByCountry = groupByEntity.map(function(d){ return d.key }) 
          var scaleColorCountry = d3.scaleOrdinal()
              .domain(colorByCountry)
              .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00'])
    

          svg.selectAll("path")
            .append('g')
            .data(groupByEntity)
            .transition()
            .duration(1000)
            .attr("stroke", function(d){ return scaleColorCountry(d.key) })       
            .attr("d", function(d){
              return d3.line()
                .x(function(d) { return x( new Date(d.Year)) })
                .y(function(d) { return y(+d[selectedGroup]) })
                (d.values)
      })
    }

    // When the button is changed, run the updateChart function
    d3.select("#groupButton").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update(selectedOption)
    })
}