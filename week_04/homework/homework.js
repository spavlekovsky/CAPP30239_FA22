/* Line chart of Canada monthly interest rate. */

const height = 500,
    width = 800,
    margin = ({ top: 15, right: 30, bottom: 35, left: 40 });
    
const svg = d3.select("#chart")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

d3.csv('long-term-interest-canada.csv').then(data => {
  let timeParse = d3.timeParse("%Y-%m");
    
  for (let d of data) {
      d.Num = +d.Num;
      d.Month = timeParse(d.Month);
  }

  let x = d3.scaleTime()
    .domain(d3.extent(data, d => d.Month))
    .range([margin.left, width - margin.right]);
  
  let y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.Num)]).nice()
    .range([height - margin.bottom, margin.top]);
  
  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickSizeOuter(0).tickFormat(d3.timeFormat("%B")));
    // I had to change the tick format to enforce that January was displayed as January, instead of 2020
  
  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).tickFormat(d => d + "%").tickSizeOuter(0).tickSize(-width));

  svg.append("text")
    .attr("class", "x-label")
    .attr("text-anchor", "end")
    .attr("x", width - margin.right + 19)
    .attr("y", height)
    .attr("dx", "0.5em")
    .attr("dy", "-0.5em") 
    .text("2020"); // I deemed it unnecessary to clarify that the ticks are months, so labelled it with the year
  
  svg.append("text")
    .attr("class", "y-label")
    .attr("text-anchor", "end")
    .attr("x", -margin.top/2)
    .attr("dx", "-0.5em")
    .attr("y", 10)
    .attr("transform", "rotate(-90)")
    .text("Interest rate");

  let line = d3.line()
    .x(d => x(d.Month))
    .y(d => y(d.Num));

  svg.append("path")
    .datum(data)
    .attr("d", line)
    .attr("fill", "none")
    .attr("stroke", 'steelblue');

    /*
    I would have liked to add a color-coded area underneath, with red or green depending on whether the interest rate
    is increasing or decreasing (similar to the figure on lecture slide 142). But I was having too much trouble.
    */
});