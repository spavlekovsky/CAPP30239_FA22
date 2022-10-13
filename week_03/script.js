/* Bar chart of COVID cases by country.
   Descriptive headers might be appreciated in this class.
*/

// "promise": do first thing then second thing, control flow of things happening
d3.csv("covid.csv").then(data => {
    // assumes everything is string, need to change to integer
    for (let d of data) {
        d.cases = +d.cases
    }

    // console.log(data)
    
    // margin is an object
    const height = 400,
          width = 600,
          margin = ({top: 25, right: 30, bottom: 35, left: 50});

    // target div id in html to know where to put it (with #)
    // viewbox allows you to resize image based on different screen sizes
    let svg = d3.select("#chart")
                .append("svg")
                .attr("viewbox", [0, 0, width, height]);
    
    // many different scales, scaleBand specifically meant for bar charts
    // give it domain (number values, categories, etc) and range (how much space on the page)
    const x = d3.scaleBand()
                .domain(data.map(d => d.country))
                .range([margin.left, width - margin.right])
                .padding(0.1);

    // .nice more or less rounds to end domain at a "nice" even value or smth
    const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.cases)]).nice()
                .range([height - margin.bottom, margin.top])

    const xAxis = g => g // xAxis actually a function
        .attr("transform", `translate(0,${height - margin.bottom + 5})`)
        // backticks for string literal
        .call(d3.axisBottom(x))
        // .call(d3.axisBottom(x).tickSizeOuter(0).tickSizeInner(0))
        // .call(g => g.select(".domain").remove())
    
    const yAxis = g => g
        .attr("transform", `translate(0${margin.left - 5})`)
        .call(d3.axisLeft(y))

    // acually put thing on page. g is a group element
    svg.append("g")
        .call(xAxis);
    svg.append("g")
        .call(yAxis);

    // create bar group
    let bar = svg.selectAll(".bar")
        .append("g")
        .data(data)
        .join("g")
        .attr("class", "bar");

    bar.append("rect")
        .attr("fill", "steelblue") // color words or hex
        .attr("x", d => x(d.country)) // scaleBand from above
        .attr("width", x.bandwidth())
        .attr("y", d => y(d.cases)) // scaleLinear from above
        .attr("height", d => y(0) - y(d.cases));
        // everything built from top down so you need to reverse it

    bar.append("text")
        .text(d => d.cases)
        .attr("x", d => x(d.country) + (x.bandwidth()/2))
        .attr("y", d => y(d.cases) + 15)
        .attr("text-anchor", "middle") //start, middle, end
        .style("fill", "white");
});