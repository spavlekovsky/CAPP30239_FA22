d3.csv("../data/conflict_types.csv").then(data => {
    const height = 400,
        width = 600,
        margin = ({ top: 25, right: 45, bottom: 25, left: 40 });

    const svgb = d3.select("#water2")
        .attr("class", "svgb")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]);
        
        

    let x = d3.scaleBand(data.map(d => (d.Country)),[margin.left, width - margin.right])
    .padding([0.2]);

    let y = d3.scaleLinear([0,50],[height - margin.bottom, margin.top]);

    svgb.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .attr("class", "x-ax2")
        .call(d3.axisBottom(x).tickSizeOuter(0))

    d3.selectAll('.x-ax2 .tick text')
    .attr("text-anchor", "middle")
    .attr("dy", d => names.indexOf(d)%2 == 0 ? 4 : 14)
    
    svgb.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).tickSize(-width + margin.left + margin.right))
    
    const subgroups = ["Trigger", "Weapon", "Multiple", "Casualty"];

    const color = d3.scaleOrdinal(subgroups,['#e41a1c','#377eb8','#4daf4a', 'purple']);

    svgb.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).tickSize(-width + margin.left + margin.right))

    const stackedData = d3.stack()
    .keys(subgroups)(data);

    for (let outer of stackedData) {
        for (let inner of outer) {
            inner['Type'] = outer['key']
        }
    }

    svgb.append("g")
    .selectAll("g")
    .data(stackedData)
    .join("g")
    .attr("fill", d => color(d.key))
    .selectAll("rect")
    .data(d => d)
    .join("rect")
    .attr("class", "water_bar")
    .attr("x", d => x(d.data.Country))
    .attr("y", d => y(d[1]))
    .attr("height", d => y(d[0]) - y(d[1]))
    .attr("width",x.bandwidth())

    const tooltip = d3.select("body").append("div")
    .attr("class", "svg-tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden");

    d3.selectAll(".water_bar")
    .on("mouseover", function(event, d) {
        d3.select(this).attr("fill", d => d3.rgb(color(d.Type)).darker());
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
        d3.select(this).attr("fill", d => color(d.Type));
        tooltip.style("visibility", "hidden");
    })

    svgb.append("text")
    .attr("class", "y-label")
    .attr("text-anchor", "end")
    .attr("x", -margin.top/2)
    .attr("dx", "-10")
    .attr("y", margin.left/2)
    .attr("transform", "rotate(-90)")
    .text("Number of Conflicts")
    .style("font-size", "12");

    svgb.append("text")
    .attr("x", (width / 2))             
    .attr("y", margin.top - 10)
    .attr("text-anchor", "middle")  
    .style("font-size", "14px") 
    .style("text-decoration", "underline")  
    .text('Water Conflicts by Country and Type');

    var legend = d3.legendColor()
    .shapePadding(15)
    .scale(color)

    svgb.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${width - margin.right/2 - 7},10)`)
    .call(legend)
    .style("font-size", "12px")

    d3.selectAll(".svgb .legend text")
    .style("font-size", "10px")
    .attr("text-anchor", "middle")
    .attr("dx", -17)
    .attr("dy", 12)
});