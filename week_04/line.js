/* D3 Line Chart */

// making the svg does not require the data so this is a little performance boost
const height = 500,
    width = 800,
    margin = ({ top: 15, right: 30, bottom: 35, left: 40 });
    
const svg = d3.select("#chart")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

d3.csv('long-term-interest-monthly.csv').then(data => {
    
    // create something to understand the dates
    let timeParse = d3.timeParse("%Y-%m")

    for (let d of data) {
        d.Value = +d.Value;
        d.Date = timeParse(d.Date);
    }

    console.log(data);

    let x = d3.scaleTime()
        // recall domain is the bounds and range is how much space it takes up on the page
        .domain(d3.extent(data, d => d.Date)) // built-in to get first and last
        .range([margin.left, width - margin.right]); // domain and range take arrays (d3.extent returns array)

    let y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Value)])
        .range([height - margin.bottom, margin.top]);
    
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0)); // tickSizeOuter gets rid of little overhang at end of axis
    
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y)
        .tickSizeOuter(0)
        .tickFormat(d => d + "%")
        .tickSize(-width) // draws ticks all the way across the chart
      );

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

    let line = d3.line()
        .x(d => x(d.Date))
        .y(d => y(d.Value));
        // line defaults to a curvy shape but you can change it to be more step-wise or such

    svg.append("path")
        .datum(data) // only one path/line so we use datUM
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", 'steelblue');
  });