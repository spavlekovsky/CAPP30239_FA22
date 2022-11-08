const padding = 1;

// I got lazy and annoyed with javascript so I made the spreadsheet in excel much more simply
const svg_h = d3.select("#states")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

d3.csv("state_totals.csv").then((data) => {
  for (let d of data) {
    d.Count = +d.Count;
  };
  
  console.log(data)
  const x = d3.scaleLinear()
    .domain([0, 280])
    .range([margin.left, width - margin.right]);
  
  const y = d3.scaleLinear()
    .range([height - margin.bottom, margin.top])
    .domain([0, 14]);
    
  svg_h.append("g")
    .attr("transform", `translate(0,${height - margin.bottom + 5})`)
    .call(d3.axisBottom(x));

  const binGroups = svg_h.append("g")
    .attr("class", "bin-group");

  const bins = d3.bin() // is there a way to manually change the bounds, so that the bins would be 0-9, 10-19, etc instead of 1-10, 11-20?
    .thresholds(28)
    .value(d => d.Count)(data);

  let g = binGroups.selectAll("g")
    .data(bins)
    .join("g");

  g.append("rect")
    .attr("x", d => x(d.x0) + (padding / 2))
    .attr("y", d => y(d.length))
    .attr("width", d => x(d.x1) - x(d.x0) - padding)
    .attr("height", d => height - margin.bottom - y(d.length))
    .attr("fill", "#3A6A92");

  g.append("text")
    .text(d => (d.length > 0) ? d.length : "")
    .attr("x", d => x(d.x0) + (x(d.x1) - x(d.x0)) / 2)
    .attr("y", d => y(d.length) - 5)
    .attr("text-anchor", "middle")
    .attr("fill", "#333");
});