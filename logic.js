var width = 1200;
var height = 600; 
var projection = d3.geoMercator().translate([-700, 700]).scale(1000);
var path = d3.geoPath().projection(projection);
var svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height);
var colorDomain = [66, 74, 82]
var extendedDomain = [50, 66, 74, 82]
var legendLabels = ["OTH","MGB","UPA","NDA"]
var color = d3.scaleThreshold()
                .domain(colorDomain)
                .range(['#ffffb2','#fecc5c','#fd8d3c','#e31a1c']);

var div = d3.select("body").append("div")
            .attr("class", "tooltip")
d3.csv("data/2014.csv").then(function(data) {
    d3.json("data/2014_merged.json").then(function(json) 
    {
        var parliamentaryConstituencies = topojson.feature(json, json.objects.india_pc_map_2014_merged).features;
        // console.log(parliamentaryConstituencies);
        for (var i = 0; i < data.length; i++) 
        {
            var dataState = data[i].state;
            var dataPCNo = data[i].pcNo;
            var dataPCName = data[i].pcName;
            var dataValue = parseFloat(data[i].voterTurnout);
            for (var j = 0; j < parliamentaryConstituencies.length; j++) 
            {
				var jsonState = parliamentaryConstituencies[j].properties.state;
                var jsonPCNo = parliamentaryConstituencies[j].properties.pc;
				if (dataState == jsonState && dataPCNo == jsonPCNo) 
                {
                    parliamentaryConstituencies[j].properties.voterTurnout = dataValue;
                    break;
				}
            }		
        }
        svg.selectAll(".pcs")
            .data(parliamentaryConstituencies)
            .enter()
            .append("path")
            .attr("class", "pcs")
            .attr("d", path)
            .style("fill", function(d) {
                var value = d.properties.voterTurnout;
                if (value) {return color(value); } else {return "#ccc"; }
            })
            .style("opacity", 0.7)
            .on("mouseover", function(d) {
                d3.select(this).style("opacity", 1);
                div.html(d.properties.pc_name + ": " + d.properties.voterTurnout + "%" + "<br>" + d.properties.state)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY -30) + "px");
            })
            .on("mouseout", function(d) {
                d3.select(this).style("opacity", 0.7);
            });
                
    });
});
var legend = svg.selectAll ("g.legend")
                .data(extendedDomain)
                .enter()
                .append("g")
                .attr("class", "legend");
var legendSquare = 20;
legend.append("rect")
    .attr("x", width - 100)
    .attr("y", function(d, i) {return height - (i*legendSquare) - 2*legendSquare; })
    .attr("width", legendSquare)
    .attr("height", legendSquare)
    .style("fill", function(d) {return color(d); })
    .style("opacity", 0.7);
legend.append("text")
    .attr("x", width - 70)
    .attr("y", function(d, i) {return height - (i*legendSquare) - legendSquare - 4; })
    .text(function(d, i) {return legendLabels[i]; });