function getTop5(orderType,ds){
  if(orderType){
    return ds.slice(0, 5);
  }
  else{
    return ds.slice(ds.length-5, ds.length);
  }
}

async function init(orderType){

 // set the dimensions and margins of the graph
 var margin = {top: 10, right: 100, bottom: 30, left: 60},
 width = 800 - margin.left - margin.right,
 height = 500 - margin.top - margin.bottom;
 var crange = ['purple','pink','salmon','magenta','plum'];


 const data= await d3.csv("data/women_dataset.csv");
 data.forEach(d=>{
   d.Proportion_of_Women_Labor_Force=+d.Proportion_of_Women_Labor_Force; 
   d.Avg_Weekly_Hours_Worked_by_Woman=+d.Avg_Weekly_Hours_Worked_by_Woman;
   d.Public_Spending_on_Family_Benefits=+d.Public_Spending_on_Family_Benefits;
});
 const dataNotZero=data.filter(function(d) { return  d.Proportion_of_Women_Labor_Force>0 && d.Avg_Weekly_Hours_Worked_by_Woman>0 && d.Public_Spending_on_Family_Benefits>0 }) 
 const data2013=dataNotZero.filter(function(d){ return d.Year=="2013"})
 const sortLabor=data2013.sort(function(b,a) { return +a.Avg_Weekly_Hours_Worked_by_Woman - +b.Avg_Weekly_Hours_Worked_by_Woman })
 

 // append the svg object to the body of the page
 /*
 var svg = d3.select("#chart")
   .append("svg")
     .attr("width", width + margin.left + margin.right)
     .attr("height", height + margin.top + margin.bottom)
   .append("g")
     .attr("transform",
           "translate(" + margin.left + "," + margin.top + ")");
  */
 var svg = d3.select("#lineChart");
 var group=svg.selectAll("g")
 var ann=d3.selectAll("#lineChart")
 var groupAnn=ann.selectAll("circle")
 group.remove();
 groupAnn.remove();

 var svg = d3.select("#lineChart")
 //.append("svg")
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
 //minYear=d3.min(allDataByTop5, function(d) { return new Date (d.Year) }) 
 //maxYear=d3.max(allDataByTop5, function(d) { return new Date (d.Year) }); 

 var x = d3.scaleTime()
     //.domain([minYear,maxYear])
     .range([ 0, width ])

 //var xAxis = d3.axisBottom(x)
 //  .tickFormat(d3.timeFormat("%Y"));

 var xAxis = svg.append("g")
   //.attr("transform", "translate("+margin.left+"," + height + ")")
   .attr("transform", "translate(0," + height + ")")
   .attr("class","myXaxis")
   //.call(xAxis);

 // Add Y axis
 //minValue=d3.min(allDataByTop5, function(d) { return d.Proportion_of_Women_Labor_Force}) 
 //maxValue=d3.max(allDataByTop5, function(d) { return d.Proportion_of_Women_Labor_Force }); 
 // create the Y axis

 var y = d3.scaleLinear()
  //.domain( [minValue,maxValue ])
   .range([ height, 0 ]);

 var yAxis= svg.append("g")
    //.attr("transform", "translate("+margin.left+", 0)")
    .attr("class","myYaxis")
    //d3.axisLeft().scale(y);
    //.call(yAxis);

  /*
   var groupByEntity = d3.nest() // nest function allows to group the calculation per level of a factor
   .key(function(d) { return d.Entity;})
   .entries(allDataByTop5);

   var colorByCountry = groupByEntity.map(function(d){ return d.key }) 
   var scaleColorCountry = d3.scaleOrdinal()
       .domain(colorByCountry)
       .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00'])
  */



 // A function that update the chart
 function update() {
   const top5Labor=getTop5(orderType,sortLabor)
   const countryList=  d3.map(top5Labor, function(d){return(d.Entity)}).keys()
   const allDataByTop5= dataNotZero.filter(function(d,i){ return countryList.indexOf(d.Entity)>=0 })


   // Create new data with the selection?
   //var dataFilter = allDataByTop5.map(function(d){return { Year: new Date(d.Year), value:d[selectedGroup]} })

   // Create different axis with selection
   // Create the X axis:
   minYear=d3.min(allDataByTop5, function(d) { return new Date (d.Year) }) 
   maxYear=d3.max(allDataByTop5, function(d) { return new Date (d.Year) }); 
   //minYear=new Date ('2006')
   //maxYear=new Date ('2016')
   x.domain([minYear,maxYear ]);
   svg.selectAll(".myXaxis")
    .transition()
    .duration(3000)
    .call(d3.axisBottom()
      .scale(x)
      .tickFormat(
        d3.timeFormat("%Y")
      )
    );

    svg.selectAll(".myXaxis")
    .append("g")
    .append("text")
    //.attr("transform", "rotate(-90)")
    .attr("y", 4) 
    .attr("x", width+10)
    //.style("text-anchor", "end")
    .style("fill","black")
    .text("Year");

  minValue=d3.min(allDataByTop5, function(d) { return d.Avg_Weekly_Hours_Worked_by_Woman }) 
  maxValue=d3.max(allDataByTop5, function(d) { return d.Avg_Weekly_Hours_Worked_by_Woman }); 
  //minValue=25
  //maxValue=45
   // create the Y axis
   y.domain([minValue, maxValue]);

   svg.selectAll(".myYaxis")
     .transition()
     .duration(1000)
     .call(d3.axisLeft().scale(y));
  
     svg.selectAll(".myYaxis")
     .append("g")
     .append("text")
     .attr("transform", "rotate(-90)")
     .attr("y", -40) 
     .attr("x", 0)
     //.style("text-anchor", "end")
     .style("fill","black")
     .text("Avg weekly hours worked");

     var groupByEntity = d3.nest() // nest function allows to group the calculation per level of a factor
     .key(function(d) { return d.Entity;})
     .entries(allDataByTop5);
 
     var colorByCountry = groupByEntity.map(function(d){ return d.key }) 
     var scaleColorCountry = d3.scaleOrdinal()
         .domain(colorByCountry)
         .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00'])

         var country = svg.selectAll(".country")
         .data(groupByEntity)
         .enter().append("g")
         .attr("class", "country");
        
       country
       .append("path")
      // .merge(country)
        .transition()
        .duration(5000)
         .attr("class", "pline")
          .attr("fill", "none")
           .attr("stroke", function(d){ return scaleColorCountry(d.key) })
           .attr("stroke-width", 2)
           .attr("d", function(d){
             return d3.line()
               .x(function(d) { return x( new Date(d.Year)) })
               .y(function(d) { return y(+d.Avg_Weekly_Hours_Worked_by_Woman) })
               (d.values)            

           })

    //var totalLength = d3.select(".pline").node().getTotalLength();
    //console.log("totalLength:" + totalLength)
      //d3.selectAll(".pline")
      //.attr("stroke-dasharray", totalLength + " " + totalLength)
      //.attr("stroke-dashoffset", totalLength)
      //.transition()
        //.delay(function(d, i) { return i * 1000; })
        //.duration(10000)
       // .ease(d3.easeLinear)
       // .attr("stroke-dashoffset", 0)
        
        country
        .append("g")
        .append("text")
         .datum(function(d) {
           return {
             name: d.key,
             values: d.values[d.values.length-1]
           };
         })
         .attr("class", "label")
         .attr("transform", function(d) {
           return "translate(" +
             x(new Date (d.values.Year)) + "," + y(d.values.Avg_Weekly_Hours_Worked_by_Woman) + ")";
         })
         .attr("x", 10)
         .attr("dy", ".35em")
         .text(function(d) {
           return d.name;
         });
        
        country.select(".label")
          .transition()
          .duration(5000)
          .attr("transform", function(d) {
            var last = d.values[d.values.length-1];
            return "translate(" + x(new Date (last.Year)) + "," + y(last.Avg_Weekly_Hours_Worked_by_Woman) + ")";
          })

          if(orderType){

            ann
              .append("g")
              .append('circle')
              .transition()
              .duration(7000)
              .attr('cx', '102.7523' ) 
              .attr('cy', '81.1365' )
              .attr('r', '7' )
              .attr('fill','red')
              .attr('stroke-width', '1');

            ann
              .append("g")
              .append('line')
              .transition()
              .duration(7000)
              .style('opacity', 0.8)
              .style("stroke-dasharray", ("5, 5"))
              .attr("fill", "none")
              .attr('x1', '102.7523' )
              .attr('y1', '81.1365' )
              .attr('x2', '102.7523' )
              .attr('y2', '20' )
              .attr('stroke','red')
              .attr('stroke-width', '2');

            ann
              .append("g")
              .append('text')
              .transition()
              .duration(7000)
              .style('opacity', 0.8)
              .attr('font-size', 16)
              .attr('fill', 'red')
              .attr('x', '103.7523' )
              .attr('y', '21' )
              .text("Chile's Labor Code was of");

            ann
              .append("g")
              .append('text')
              .transition()
              .duration(7000)
              .style('opacity', 0.8)
              .attr('font-size', 16)
              .attr('fill', 'red')
              .attr('x', '103.7523' )
              .attr('y', '34' )
              .text("45 hour workweek before 2017");
          }
        }
 update()
}
