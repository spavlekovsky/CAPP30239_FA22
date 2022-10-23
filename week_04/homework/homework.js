/* Line chart of Canada monthly interest rate. */

// need to change axis labels
// try to change first label from 2020 to January
// add tooltips
// can I add a vertical line from the line to the x axis on hover too?
// could I make an area which is color coded for increase/decrease?

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
      .call(d3.axisBottom(x).tickSizeOuter(0));
    
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickFormat(d => d + "%").tickSizeOuter(0).tickSize(-width));

    svg.append("text")
      .attr("class", "x-label")
      .attr("text-anchor", "end")
      .attr("x", width - margin.right)
      .attr("y", height)
      .attr("dx", "0.5em")
      .attr("dy", "-0.5em") 
      .text("Year");
    
    svg.append("text")
      .attr("class", "y-label")
      .attr("text-anchor", "end")
      .attr("x", -margin.top/2)
      .attr("dx", "-0.5em")
      .attr("y", 10)
      .attr("transform", "rotate(-90)")
      .text("Interest rate");

    let area = d3.area()
      .x(d => x(d.Month))
      .y0(y(0))
      .y1(d => y(d.Num)); // need to tell it where to start and where to end

    svg.append("path")
      .datum(data)
      .attr("d", area)
      .attr("fill", "steelblue")
      .attr("fill-opacity", "50%")
      .attr("stroke", 'none');

    // added line so that there would only be a line on the relevant data not all 4 sides of the area
    let line = d3.line()
      .x(d => x(d.Month))
      .y(d => y(d.Num));

    svg.append("path")
      .datum(data)
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", 'steelblue')
      .attr("stroke-width", "1.5px");
  });