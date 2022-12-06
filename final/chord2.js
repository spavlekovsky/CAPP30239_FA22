const height2 = 600,
width2 = 600,
margin_chord = 40,
innerRadius = (Math.min(width2, height2) / 2) - margin_chord,
outerRadius = innerRadius + 6;
const svg4 = d3.select("#chord")
.append("svg")
.attr("class", "svg4")
.attr("width", width2)
.attr("height", height2)
.attr("viewBox", [-width2 / 2, -height2 / 2, width2, height2])
.attr("transform", "rotate(-90)")
.attr("style", "max-width: 100%; height: auto;");

function chord(i) {

    d3.selectAll(".svg4 g").remove()
    d3.selectAll(".svg4 path").remove()

  d3.json("../data/chord_changes.json").then((data) => {
    
  const matrix2 = data.filter(d => d.Year === i)[0].Data

    const arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    const ribbon = d3.ribbonArrow()
      .radius(innerRadius - 0.5)
      .padAngle(1 / innerRadius);

    const chords = d3.chordDirected()
      .padAngle(".01")
      .sortSubgroups(d3.descending)
      .sortChords(d3.descending)(matrix2);

    svg4.append("path")
      .attr("id", "text-id")
      .attr("fill", "none")
      .attr("d", d3.arc()({ outerRadius, startAngle: 0, endAngle: 2 * Math.PI }));

    const tooltip = d3.select("body").append("div")
      .attr("class", "svg-tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden");
    
    d3.selectAll(".water_bar")
      .on("mouseover", function(event, d) {
        d3.select(this).attr("fill", d => d3.rgb(co_color(d.Type)).darker());
        tooltip
          .style("visibility", "visible")
          .html(`${d.data.Country}<br />${d.Type}: ${d[1] - d[0]}`)
          .attr("text-anchor", "middle");
      })
      .on("mousemove", function(event) {
        tooltip
          .style("top", (event.pageY - 35) + "px")
          .style("left", (event.pageX + 20) + "px");
      })
      .on("mouseout", function() {
        d3.select(this).attr("fill", d => co_color(d.Type));
        tooltip.style("visibility", "hidden");
      })

    svg4.append("g")
      .selectAll("g")
      .data(chords)
      .join("path")
      .attr("d", ribbon)
      .attr("fill", d => co_color(names[d.source.index]))
      .attr("fill-opacity", 0.75)
      .style("mix-blend-mode", "multiply")
      .attr("class", "ribbons")

    d3.selectAll(".ribbons")
      .on("mouseover", function(event, d) {
        d3.select(this)
          .attr("fill-opacity", 1);
        tooltip
          .style("visibility", "visible")
          .text(`${names[d.source.index]} to ${names[d.target.index]}: ${d.source.value.toLocaleString()} refugees`)
          .attr("text-anchor", "middle");
      })
      .on("mousemove", function(event) {
        tooltip
          .style("top", (event.pageY - 35) + "px")
          .style("left", (event.pageX + 20) + "px");
      })
      .on("mouseout", function() {
        d3.select(this)
          .attr("fill-opacity", 0.75);
          tooltip.style("visibility", "hidden");
      })

    let outside = svg4.append("g")
      .selectAll("g")
      .data(chords.groups)
      .join("g")
      .call(g => g.append("path")
        .attr("d", arc)
        .attr("fill", d => co_color(names[d.index]))
        .attr("stroke", "#fff"))
        .attr("fill", d => co_color(names[d.index]) != "#ccc" ? co_color(names[d.index]) : "#666");

      svg4.append("text")
        .attr("x", 0)             
        .attr("y", -285)
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(90)")
        .style("font-size", "14px") 
        .style("text-decoration", "underline")  
        .text('Refugee Flows: New Refugees to Countries');

  });
}

chord(2011);

d3.select("#chord")
.on("change", function (event) {
  const i = parseInt(event.target.value);
  chord(i);
});