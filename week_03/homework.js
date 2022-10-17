/* Bar chart of number of visit to Chicago public library locations. */

d3.csv("library_visits_jan22.csv").then(data => {
    for (let d of data) {
        d.num = +d.num
    }

    // console.log(data)
    
    const height = 400,
          width = 600,
          margin = ({top: 25, right: 30, bottom: 35, left: 60});

    let svg = d3.select("#chart")
                .append("svg")
                .attr("viewbox", [0, 0, width, height]);
    
    const x = d3.scaleBand()
                .domain(data.map(d => d.branch))
                .range([margin.left, width - margin.right])
                .padding(0.1);

    const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.num)]).nice()
                .range([height - margin.bottom, margin.top])

    const xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom + 5})`)
        .call(d3.axisBottom(x))

    // I was trying to rotate the axis labels so they fit, but I could not figure out how to
    // *only* select the x-axis ticks so I had to just make all the texst small

    // xAxis.selectAll(".tick text")
    //     .attr("text-anchor", "end")
    //     .attr("rotate","-40");
    
    const yAxis = g => g
        .attr("transform", `translate(0${margin.left - 5})`)
        .call(d3.axisLeft(y))

    svg.append("g")
        .call(xAxis);
    svg.append("g")
        .call(yAxis);

    // g.selectAll(".xAxis>.tick>text)
    //     .attr("rotate","-40")

    let bar = svg.selectAll(".bar")
        .append("g")
        .data(data)
        .join("g")
        .attr("class", "bar");

    bar.append("rect")
        .attr("fill", "steelblue")
        .attr("x", d => x(d.branch))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d.num))
        .attr("height", d => y(0) - y(d.num));

    bar.append("text")
        .text(d => d.num)
        .attr("x", d => x(d.branch) + (x.bandwidth()/2))
        .attr("y", d => y(d.num) + 15)
        .attr("text-anchor", "middle")
        .style("fill", "white");

});