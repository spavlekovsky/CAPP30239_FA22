const height = 400,
    width = 600,
    margin = ({ top: 25, right: 10, bottom: 50, left: 10 }),
    padding = 1;

const svg = d3.select("#conflicts_by_country")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);


Promise.all([
  d3.csv('../data/water_agg.csv'),
  d3.csv('../data/un_mena_water_agg.csv'),
]).then((data) => {
  console.log(data)

})


// d3.json('../data/World-Water-Conflicts-2022.csv').then((data) => {

//   const x = d3.scaleLinear()
//     .domain(d3.extent(data, d => d.average)).nice()
//     .range([margin.left, width - margin.right]);
  
//   const y = d3.scaleLinear()
//     .range([height - margin.bottom, margin.top])
//     .domain([0,10]); // manually setting values
    
//   svg.append("g")
//     .attr("transform", `translate(0,${height - margin.bottom + 5})`)
//     .call(d3.axisBottom(x));

//   const binGroups = svg.append("g")
//     .attr("class", "bin-group");

//   const bins = d3.bin() // does it all for us
//     .thresholds(10)
//     .value(d => d.average)(data);

//   let g = binGroups.selectAll("g")
//     .data(bins) // uses the data we just created
//     .join("g");

//   // * normal *
//   // g.append("rect")
//   //   .attr("x", d => x(d.x0) + (padding / 2))
//   //   .attr("y", d => y(d.length))
//   //   .attr("width", d => x(d.x1) - x(d.x0) - padding)
//   //   .attr("height", d => height - margin.bottom - y(d.length))
//   //   .attr("fill", "steelblue");

//   // * with fancy animation *
//   g.append("rect")
//   .attr("x", d => x(d.x0) + (padding / 2))
//   .attr("width", d => x(d.x1) - x(d.x0) - padding)
//   .attr("y", height - margin.bottom)
//   .attr("height", 0)
//   .attr("fill", "steelblue")
//   .transition()
//   .duration(750) // how long to take
//   .attr("y", d => y(d.length))
//   .attr("height", d => height - margin.bottom - y(d.length))

//   g.append("text")
//     .text(d => d.length)
//     .attr("x", d => x(d.x0) + (x(d.x1) - x(d.x0)) / 2)
//     .attr("y", d => y(d.length) - 5)
//     .attr("text-anchor", "middle")
//     .attr("fill", "#333");

// });