let height = 400,
    width = 600,
    margin = ({ top: 25, right: 30, bottom: 35, left: 40 });
  
const svg = d3.select("#chart")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

d3.csv('penguins.csv').then(data => {
  
  let x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.body_mass_g)).nice() // extent returns both max and min
    .range([margin.left, width - margin.right]);

  let y = d3.scaleLinear()
    .domain(d3.extent(data, d => d.flipper_length_mm)).nice()
    .range([height - margin.bottom, margin.top]);

  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .attr("class", "x-axis")
    .call(d3.axisBottom(x).tickFormat(d => (d/1000) + "kg").tickSize(-height + margin.top + margin.bottom))
    // tick size is giving us a grid across the whole graph

  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .attr("class", "y-axis")
    .call(d3.axisLeft(y).tickSize(-width + margin.left + margin.right))

  svg.append("g")
    .attr("fill", "black")
    .selectAll("circle")
    .data(data)
    .join("circle") // joining dta to each circle object
    .attr("cx", d => x(d.body_mass_g)) // cx & cy position from *center* of x, y
    .attr("cy", d => y(d.flipper_length_mm))
    .attr("r", 2) // radius
    .attr("opacity", 0.75);

  // setting up for a tooltip
  // go to body in html and append a new div with a certain class and styles
  // haven't actually enabled it until the next section though
  const tooltip = d3.select("body").append("div")
    .attr("class", "svg-tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden");

  d3.selectAll("circle") // create an "event listener"
    .on("mouseover", function(event, d) { // wait until something happens then pass in the thing and the data
      d3.select(this).attr("fill", "red"); // select the thing you're on
      tooltip                              // do something with the previously defined tooltip
        .style("visibility", "visible")
        .html(`Species: ${d.species}<br />Island: ${d.island}<br />Weight: ${d.body_mass_g/1000}kg`);
    })
    .on("mousemove", function(event) { // this part makes the text follow the mouse/hover over the point
      tooltip
        .style("top", (event.pageY - 10) + "px")
        .style("left", (event.pageX + 10) + "px");
    })
    .on("mouseout", function() { // this part makes the point turn back to black so you don't keep all the tooltips
      d3.select(this).attr("fill", "black");
      tooltip.style("visibility", "hidden");
    })

    // we can change the tooltip appearance more in styles.css
    
    // currently you have to mouse exactly over the point for the tooltip to show up
    // another way to do it is using voronoi diagrams so each point has an associated area where its tooltip will appear
    // more about this in a reading for next week

});