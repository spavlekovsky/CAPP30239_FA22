d3.csv('../data/un_water_join.csv').then((data) => {
    for (let r of data) {
      r.Year = +r.Year;
      r.Origin = +r.Origin;
      r.Asylum = +r.Asylum;
      r.Conflicts = +r.Conflicts;
    }

    const height = 400,
        width = 600,
        margin = ({ top: 25, right: 15, bottom: 70, left: 50 }),
        padding = 1;

    const svga = d3.select("#scatter2")
        .append("svg")
        .attr("class", "svga")
        .attr("viewBox", [0, 0, width, height]);

    let x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.Conflicts)).nice()
        .range([margin.left, width - margin.right]);

    let y = d3.scaleLinear()
        .domain(d3.extent(data, d => d.Origin)).nice()
        .range([height - margin.bottom, margin.top]);

    svga.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .attr("class", "x-axis")
        .call(d3.axisBottom(x))

    svga.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .attr("class", "y-axis")
        .call(d3.axisLeft(y).tickFormat(d => (d > 0 ? d/(10**3) + "k" : d)));

    let yr_color = d3.scaleSequential()
        .domain(d3.extent(data, d => d.Year))
        .interpolator(d3.interpolate("gold", "red"));

    svga.append("g")
        .attr("class", "plot")
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("class", d => d.Country.replaceAll(' ', ''))
        .attr("cx", d => x(d.Conflicts))
        .attr("cy", d => y(d.Origin))
        .attr("fill", d => co_color(d.Country))
        .attr("r", 3)
        .attr("opacity", 0.8);

    const tooltip = d3.select("body").append("div")
        .attr("class", "svg-tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden");

    d3.selectAll(".svga .plot circle")
        .on("mouseover", function(event, d) {
        d3.selectAll(".svga .plot circle").attr("fill", "gray").attr("opacity", .6);
        d3.selectAll(`.svga .${d.Country.replaceAll(' ','')}`).attr("fill", d => yr_color(d.Year)).attr("opacity", 1).attr("r", 4);

        tooltip
            .style("visibility", "visible")
            .html(`${d.Country} ${d.Year}`);
        })
        .on("mousemove", function(event) {
        tooltip
            .style("top", (event.pageY - 20) + "px")
            .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function(event, d) {
        d3.selectAll(".svga .plot circle").attr("fill", d => co_color(d.Country)).attr("opacity", .8).attr("r", 3);
        tooltip.style("visibility", "hidden");
        })


    svga.append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "end")
        .attr("x", width - margin.right)
        .attr("y", height - margin.bottom + 8)
        .attr("dx", "0.5em")
        .attr("dy", "20") 
        .text("Water Conflicts")
        .style("font-size", "12");
      
    svga.append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "end")
        .attr("x", -margin.top/2 - 10)
        .attr("dx", "-10")
        .attr("y", margin.left/2 - 16)
        .attr("transform", "rotate(-90)")
        .text("Refugees from Country")
        .style("font-size", "12");

    svga.append("text")
        .attr("x", (width / 2))             
        .attr("y", margin.top - 10)
        .attr("text-anchor", "middle")  
        .style("font-size", "14px") 
        .style("text-decoration", "underline")  
        .text(`Refugees vs. Water Conflicts`);

    var legend = d3.legendColor()
        .shape('circle')
        .shapeRadius(6)
        .shapePadding(25)
        .orient('horizontal')
        .cellFilter(d => d.label !== "Other Arab Countries")
        .scale(co_color)
      
    svga.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${margin.left},${height - margin.bottom/2 - 3})`)
        .call(legend)
        .style("font-size", "12px")
      
    d3.selectAll(".svga .legend text")
        .style("font-size", "10px")
        .attr("text-anchor", "middle")
        .attr("dx", 0)
        .attr("dy", d => names.indexOf(d)%2 == 0 ? -5 : 5)

});