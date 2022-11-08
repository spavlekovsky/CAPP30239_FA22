function build_chart(index, city, raw_data) {
    let height = 243,
        width = 205,
        margin = ({ top: 18, right: 5, bottom: 45, left: 20 })
        innerWidth = width - margin.left - margin.right;

    let data = [
        { race: "Asian", count: 0 },
        { race: "Native", count: 0 },
        { race: "Hispanic", count: 0 },
        { race: "Black", count: 0 },
        { race: "White", count: 0 },
        { race: "Other", count: 0 },
        { race: "Unknown", count: 0 },
    ];

    for(var d of raw_data) {
         let r = data.find(r => r.race == d[1]);
         r.count = d[2];
         r.city = city[0];
    }

    const svg = d3.select(`#grid_${index}`)
        .append("svg")
        .attr("viewBox", [0, 0, width, height]);

    let x = d3.scaleBand()
        .domain(["Asian", "Native", "Hispanic", "Black", "White", "Other", "Unknown"])
        .range([margin.left, width - margin.right])
        .padding(0.1)

    let y = d3.scaleLinear()
        .domain([0, 12])
        .range([height - margin.bottom, margin.top]);

    let race_colors = d3.scaleOrdinal()
        .domain(["Asian", "Native", "Hispanic", "Black", "White", "Other", "Unknown"])
        .range(['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f', '#b3b3b3']);

    let bar = svg.selectAll(".bar")
        .append("g")
        .data(data)
        .join("g")
        .attr("class", "bar");

    bar.append("rect")
        .attr("class", "city_bar")
        .attr("fill", d => race_colors(d))
        .attr("x", d => x(d.race))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d.count))
        .attr("height", d => y(0) - y(d.count));

    svg.append("text")
        .attr("class", "city_name")
        .attr("text-anchor", "beginning")
        .attr("x", margin.left + 5)
        .attr("y", margin.top + 2)
        .attr("dx", "0.1em")
        .attr("dy", "-0.5em") 
        .text(city[0]);

    svg.append("text")
        .attr("class", "city_total")
        .attr("text-anchor", "end")
        .attr("x", width - margin.right)
        .attr("y", margin.top + 2)
        .attr("dy", "-0.5em") 
        .text(`Total: ${city[1]}`);

    svg.append("g")
        .attr("class", "x-ax")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickSize(0).tickSizeOuter(0));

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(6).tickSize(0));

    svg.selectAll(".x-ax .tick text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-40)");

    const tooltip = d3.select("body").append("div")
        .attr("class", "svg-tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden");
    
    d3.selectAll(".city_bar")
        .on("mouseover", function(event, d) {
          d3.select(this).attr("fill", d => d3.rgb(race_colors(d.race)).darker());
          tooltip
            .style("visibility", "visible")
            .html(`${d.city}<br />${d.race}: ${d.count}`);
        })
        .on("mousemove", function(event) {
          tooltip
            .style("top", (event.pageY - 35) + "px")
            .style("left", (event.pageX) + "px");
        })
        .on("mouseout", function() {
          d3.select(this).attr("fill", d => race_colors(d.race));
          tooltip.style("visibility", "hidden");
        })
}

d3.json("a3cleanedonly2015.json").then(data => {
    for (let d of data) {
        if (d.Race === "") {
          d.Race = "Unknown"
        }
      }

    grouped_data = d3.flatRollup(data, v => v.length, d => d.City, d => d.Race)

    top_cities = d3.flatRollup(data, v => v.length, d => d.City).sort((a, b) => d3.descending(a[1], b[1])).slice(0, 25)
    
    top_cities.forEach((c, i) => {
        let city_data = grouped_data.filter(d => d[0] === c[0])
        build_chart(i, c, city_data)
    })
});