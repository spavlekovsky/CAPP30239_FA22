const height = 400,
    width = 600,
    margin = ({ top: 25, right: 15, bottom: 50, left: 15 }),
    padding = 1;


d3.csv('../data/wb_join.csv').then((data) => {
    const height = 400,
        width = 600,
        margin = ({ top: 25, right: 30, bottom: 50, left: 30 }),
        padding = 1;

    const svg2 = d3.select("#refugees_wb")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]);

    let timeParse = d3.timeParse("%Y");
    let timeFormat = d3.timeFormat("%Y")

    for (let r of data) {
        r.Year = timeParse(r.Year);
        r.Origin = +r.Origin
        r.Asylum = +r.Asylum
    }

    console.log(data)

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

    svg2.append("g")
        .attr("fill", "black")
        .selectAll("circle")
        .data(data)
        .join("circle") // joining dta to each circle object
        .attr("cx", d => x(d.Origin)) // cx & cy position from *center* of x, y
        .attr("cy", d => y(d.Asylum))
        .attr("r", 2) // radius
        .attr("opacity", 0.75);

    const tooltip = d3.select("body").append("div")
        .attr("class", "svg-tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden");

    d3.selectAll("circle") // create an "event listener"
        .on("mouseover", function(event, d) { // wait until something happens then pass in the thing and the data
          d3.select(this).attr("fill", "red"); // select the thing you're on
          tooltip                              // do something with the previously defined tooltip
            .style("visibility", "visible")
            .html(`${d.Country} ${timeFormat(d.Year)}`);
        })
        .on("mousemove", function(event) { // this part makes the text follow the mouse/hover over the point
          tooltip
            .style("top", (event.pageY - 20) + "px")
            .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function() { // this part makes the point turn back to black so you don't keep all the tooltips
          d3.select(this).attr("fill", "black");
          tooltip.style("visibility", "hidden");
        })

});