async function init(){
    d3.select("#chart").append("svg").attr("height",500).attr("width",1200);
    const data= await d3.csv("data/regional-averages-of-the-composite-gender-equality-index.csv");
    console.log(data);  
}