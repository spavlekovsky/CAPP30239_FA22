d3.csv('../data/wb_join_small.csv').then((data) => {
    const height = 400,
        width = 600,
        margin = ({ top: 25, right: 15, bottom: 60, left: 40 }),
        padding = 1;

    const svg2 = d3.select("#refugees_wb")
        .append("svg")
        .attr("class", "svg2")
        .attr("viewBox", [0, 0, width, height]);

    for (let r of data) {
        r.Year = +r.Year
        r.Origin = +r.Origin
        r.Asylum = +r.Asylum
    }

    let x = d3.scaleLog()
        .domain(d3.extent(data, d => d.Origin)).nice()
        .range([margin.left, width - margin.right]);

    let y = d3.scaleLog()
        .domain(d3.extent(data, d => d.Asylum)).nice()
        .range([height - margin.bottom, margin.top]);

    svg2.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .attr("class", "x-axis")
        .call(d3.axisBottom(x).tickSize(0))

    svg2.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .attr("class", "y-axis")
        .call(d3.axisLeft(y).tickSize(0))

    let yr_color = d3.scaleSequential()
        .domain(d3.extent(data, d => d.Year))
        .interpolator(d3.interpolate("gold", "red"));

    svg2.append("g")
        .attr("class", "plot")
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("class", d => d.Country.replaceAll(' ', ''))
        .attr("cx", d => x(d.Origin))
        .attr("cy", d => y(d.Asylum))
        .attr("fill", d => co_color(d.Country))
        .attr("r", 3)
        .attr("opacity", 0.8);

    const tooltip = d3.select("body").append("div")
        .attr("class", "svg-tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden");

    d3.selectAll(".svg2 .plot circle")
        .on("mouseover", function(event, d) {
        d3.selectAll(".svg2 .plot circle").attr("fill", "gray").attr("opacity", .6);
        d3.selectAll(`.svg2 .${d.Country.replaceAll(' ','')}`).attr("fill", d => yr_color(d.Year)).attr("opacity", 1).attr("r", 4);
  
        tooltip
            .style("visibility", "visible")
            .html(`${d.Country} ${d.Year}<br />Origin: ${d.Origin}<br />Asylum: ${d.Asylum}`);
        })
        .on("mousemove", function(event) {
        tooltip
            .style("top", (event.pageY - 20) + "px")
            .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function(event, d) {
        d3.selectAll(".svg2 .plot circle").attr("fill", d => co_color(d.Country)).attr("opacity", .8).attr("r", 3);
        tooltip.style("visibility", "hidden");
        })


    svg2.append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "end")
        .attr("x", width - margin.right/2)
        .attr("y", height - margin.bottom + 5)
        .attr("dx", "0.5em")
        .attr("dy", "20") 
        .text("Refugees from Country")
        .style("font-size", "12");
      
    svg2.append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "end")
        .attr("x", -margin.top/2 + 10)
        .attr("dx", "-18")
        .attr("y", margin.left/2 - 10)
        .attr("transform", "rotate(-90)")
        .text("Asylees in Country")
        .style("font-size", "12");

    svg2.append("text")
        .attr("x", (width / 2))             
        .attr("y", margin.top - 10)
        .attr("text-anchor", "middle")  
        .style("font-size", "14px") 
        .style("text-decoration", "underline")  
        .text(`Refugees Stocks by Country of Origin and Asylum`);

    var legend = d3.legendColor()
        .shape('circle')
        .shapeRadius(6)
        .shapePadding(25)
        .orient('horizontal')
        .cellFilter(d => d.label !== "Other Arab Countries")
        .scale(co_color)
      
    svg2.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${margin.left},${height - margin.bottom/2 - 3})`)
        .call(legend)
        .style("font-size", "12px")
      
    d3.selectAll(".svg2 .legend text")
        .style("font-size", "10px")
        .attr("text-anchor", "middle")
        .attr("dx", 0)
        .attr("dy", d => names.indexOf(d)%2 == 0 ? -5 : 5)
});