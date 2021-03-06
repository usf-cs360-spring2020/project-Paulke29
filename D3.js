const urls = {
  basemap: "https://data.sfgov.org/resource/xfcw-9evu.geojson",
  streets: "https://data.sfgov.org/resource/3psu-pn9h.geojson?$limit=20000",
};
var margin = {top: 30, right: 30, bottom: 30, left: 30},
  width = 1100
  height =600;


const svg = d3.select("body").select("svg#vis");
const Legend = d3.select("body").select("div#legend").append("svg")
  .attr("width", width)
  .attr("height", 75)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

const g = {
  basemap: svg.select("g#basemap"),
  streets: svg.select("g#streets"),
  outline: svg.select("g#outline"),
  tooltip: svg.select("g#tooltip"),
  details: svg.select("g#details")
};
let scale = {};
scale.color = d3.scaleLinear()
    .range(["white", "red"])
    .domain([1,700])

// setup tooltip (shows neighborhood name)
const tip = g.tooltip.append("text").attr("id", "tooltip");
tip.attr("text-anchor", "end");
tip.attr("dx", -5);
tip.attr("dy", -5);
tip.style("visibility", "hidden");



// append the svg object to the body of the page
var svg2 = d3.select("#my_dataviz")
.append("svg")
  .attr("width", width )
  .attr("height", height)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

var chart2 = d3.select("body").select("svg#vis")
  .append("svg")
  .attr("id","chart2")
  .attr("width", width )
  .attr("height", height)
  .append("g")
  .attr("transform","translate(" + margin.left + "," + margin.top + ")");


// Labels of row and columns
var myGroups = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
var myVars = ["Assault", "Fraud", "Robbery", "Stolen Property", "Suspicious"].reverse()

// Build X scales and axis:
var x = d3.scaleBand()
  .range([ 0, width/1.5])
  .domain(myGroups)
  .padding(0.01);
svg2.append("g")
  .attr("id","axiX")
  .attr("transform", "translate("+10+"0)")
  .call(d3.axisTop(x))

// Build X scales and axis:
var y = d3.scaleBand()
  .range([ height/4, 0 ])
  .domain(myVars)
  .padding(0.01);
svg2.append("g")
  .attr("id","axiY")
  .attr("transform", "translate("+10+"0)")
  .call(d3.axisLeft(y));

  // Build color scale
var myColor = d3.scaleLinear()
    .range(["white", "red"])
    .domain([1,900])
var myColor2 = d3.scaleLinear()
    .range(["white", "red"])
    .domain([1,100])
let csv = "FinalData.csv";
function DefaultChart(data){
  const result = [];
  var events;
  var category;
  var day;
  for(var i = 0; i < data.length; i++){
    category = data[i].IncidentCategory;
    day = data[i].IncidentDay;
    // console.log("category: "+ category);
    // console.log("day: "+ day);
    if(result.find(post => post.group === day && post.variable == category)){
      objIndex = result.findIndex(post => post.group === day && post.variable == category);
      var values = result[objIndex].value
      result[objIndex].value = values +1;
      // console.log(")))")

    }
    else{
      events = new Object();
      events.group = day;
      events.variable = category;
      events.value =1;
      result.push(events);
    }
  }
  return result;
}
function Ncharts(data,name,newGroup){
  const result = [];
  var events;
  var category;
  var day;
  var community;
  for(var i = 0; i < data.length; i++){
    category = data[i].IncidentCategory;
    day = data[i].IncidentDay;
    community = data[i].Neighborhood;
    // console.log("category: "+ category);
    // console.log("day: "+ day);
    if(community == name){
      if(result.find(post => post.group === day && post.variable == category)){
        objIndex = result.findIndex(post => post.group === day && post.variable == category);
        var values = result[objIndex].value
        result[objIndex].value = values +1;
        // console.log(")))")

      }
      else{
        events = new Object();
        events.group = day;
        events.variable = category;
        events.value =1;
        result.push(events);
        newGroup.push(category)
      }
    }
  }
  return result;
}
d3.csv(csv).then(drawHeatMap).then(drawColorLegend)
function drawHeatMap(data) {
    const groupData = DefaultChart(data);
    console.log("Goup: "+JSON.stringify(groupData))
    svg2.selectAll()
        .data(groupData, function(d) {return d.group+':'+d.variable;})
        .enter()
        .append("rect")
        .attr("x", function(d) { return x(d.group) })
        .attr("y", function(d) { return y(d.variable) })
        .attr("transform", "translate("+10+"0)")
        .attr("width", x.bandwidth() )
        .attr("height", y.bandwidth() )
        .style("fill", function(d) { return scale.color(d.value)} )

 }
 function drawColorLegend() {
        const legendWidth = 200;
        const legendHeight = 20;

        // place legend in its own group
        const group = Legend.append("g");
        group.attr('id', 'color-legend');

        // shift legend to appropriate position
        group.attr('transform', "translate("+85+"0)");

        const title = group.append('text')
          .attr('class', 'axis-title')
          .text('Average Daily Count of Incidents');
          title.attr('dx', -39);
          title.attr('dy', 12);

        const legendLabelMin = group.append('text')
          .text('0')
          .attr('dx', -45)
          .attr('dy', 35);
      const text = group.append('text')
            .text('The number of incidents happened on each weekdays in 2018')
            .attr('dx', -600)
            .attr('dy', 35);

        const legendLabelMax = group.append('text')
          .text('900')
          .attr('dx', 185)
          .attr('dy', 35);

        // lets draw the rectangle, but it won't have a fill just yet
        const colorbox = group.append('rect')
          .attr('x', -17)
          .attr('y', 12 + 6)
          .attr('width', legendWidth)
          .attr('height', legendHeight);

        // get the domain first (we do not want the middle value from the diverging scale)
        // .range(["white", "red"])
        // .domain([1,700])
        const colorDomain = [d3.min(scale.color.domain()), d3.max(scale.color.domain())];

        // add a new scale to go from color tick to percent
        scale.percent = d3.scaleLinear()
          .range([0, 100])
          .domain(colorDomain);

        // we have to first add gradients
        const defs = Legend.append('defs');

        // add a color stop per data tick
        // input  (ticks)   : [0.2, ..., 100, ..., 200.3]
        // output (percents): [  0, ..., 50, ..., 100]
        defs.append('linearGradient')
          .attr('id', 'gradient')
          .selectAll('stop')
          .data(scale.color.ticks())
          .enter()
          .append('stop')
          .attr('offset', d => scale.percent(d) + '%')
          .attr('stop-color', d => scale.color(d));

        // draw the color rectangle with the gradient
        colorbox.attr('fill', 'url(#gradient)');


      }
 function drawNchart(data,Name){
   const groupData = Ncharts(data,Name);
   console.log("Goup2: "+JSON.stringify(groupData))
   chart2.selectAll()
       .data(groupData, function(d) {return d.group+':'+d.variable;})
       .enter()
       .append("rect")
       .attr("x", function(d) { return x(d.group) })
       .attr("y", function(d) { return y(d.variable) })
       .attr("transform", "translate("+10+"0)")
       .attr("width", x.bandwidth() )
       .attr("height", y.bandwidth() )
       .style("fill", function(d) { return myColor(d.value)} )
 }

// setup projection
// https://github.com/d3/d3-geo#geoConicEqualArea
const projection = d3.geoConicEqualArea();
projection.parallels([37.692514, 37.840699]);
projection.rotate([122, 0]);

// setup path generator (note it is a GEO path, not a normal path)
const path = d3.geoPath().projection(projection);

d3.json(urls.basemap).then(function(json) {
  // makes sure to adjust projection to fit all of our regions
  projection.fitSize([960, 600], json);

  // draw the land and neighborhood outlines
  drawBasemap(json);

  // now that projection has been set trigger loading the other files
  // note that the actual order these files are loaded may differ
  // d3.json(urls.streets).then(drawStreets);
  // d3.json(urls.arrests).then(drawArrests);
});

function drawBasemap(json) {
  console.log("basemap", json);

  const basemap = g.basemap.selectAll("path.land")
    .data(json.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("class", "land");

  const outline = g.outline.selectAll("path.neighborhood")
      .data(json.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("class", "neighborhood")
      .each(function(d) {
        // save selection in data for interactivity
        // saves search time finding the right outline later
        d.properties.outline = this;
      });

  // add highlight
  basemap.on("mouseover.highlight", function(d) {
    d3.select(d.properties.outline).raise();
    d3.select(d.properties.outline).classed("active", true);
  })
  .on("mouseout.highlight", function(d) {
    d3.select(d.properties.outline).classed("active", false);
    d3.select("#chart2").selectAll("#axiY").remove();
    d3.select("#chart2").selectAll("#axiX").remove();
    d3.select("#chart2").selectAll("#map").remove();

  });

  // add tooltip
  basemap.on("mouseover.tooltip", function(d) {
    tip.text(d.properties.nhood);
    tip.style("visibility", "visible");
    const name = d.properties.nhood;
    console.log("Name: "+name);
    d3.csv(csv).then(function(data){
      var newGroup =[];
      const groupData = Ncharts(data,name,newGroup);
      console.log("Goup2: "+JSON.stringify(groupData))
    var x2 = d3.scaleBand()
      .range([ 0, 300])
      .domain(myGroups)
      .padding(0.01);
    chart2.append("g")
      .attr("transform", "translate("+75+"0)")
      .attr("id","axiX")
      .call(d3.axisTop(x2))
      .transition()
            .delay(function (d) {return Math.random()*1000;})
            .duration(1000)

    // Build X scales and axis:
    var y2 = d3.scaleBand()
      .range([ 200, 0 ])
      .domain(newGroup)
      .padding(0.01);
    chart2.append("g")
      .attr("transform", "translate("+75+"0)")
      .attr("id","axiY")
      .call(d3.axisLeft(y2))
      .transition()
      .delay(function (d) {return Math.random()*1000;})
      .duration(1000)
    chart2.selectAll()
          .data(groupData, function(d) {return d.group+':'+d.variable;})
          .enter()
          .append("rect")
          .attr("x", function(d) { return x2(d.group) })
          .attr("y", function(d) { return y2(d.variable) })
          .attr("transform", "translate("+75+"0)")
          .attr("width", x2.bandwidth())
          .attr("height", y2.bandwidth() )
          .attr("id","map")
          .style("fill", function(d) { return myColor2(d.value)} )
          .transition()
            .delay(function (d) {return Math.random()*1000;})
            .duration(1000)
    });

  })
  .on("mousemove.tooltip", function(d) {
    const coords = d3.mouse(g.basemap.node());
    tip.attr("x", coords[0]);
    tip.attr("y", coords[1]);
  })
  .on("mouseout.tooltip", function(d) {
    tip.style("visibility", "hidden");
  });
}
