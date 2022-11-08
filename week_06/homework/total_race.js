let height = 500,
    width = 810,
    margin = ({ top: 25, right: 30, bottom: 35, left: 35 })
    innerWidth = width - margin.left - margin.right;

const svg = d3.select("#total_race")
  .append("svg")
  .attr("viewBox", [0, 0, width, height]);

d3.json("a3cleanedonly2015.json").then(data => {
  let timeParse = d3.timeParse("%m/%d/%Y");
  let timeFormat = d3.timeFormat("%b")

  for (let d of data) {
    d.Date = timeParse(d.Date);
    d.Month = timeFormat(d.Date);
    if (d.Race === "") {
      d.Race = "Unknown"
    }
  }

  let agg_data = [
    { month: 'Jan', total: 0},
    { month: 'Feb', total: 0},
    { month: 'Mar', total: 0},
    { month: 'Apr', total: 0},
    { month: 'May', total: 0},
    { month: 'Jun', total: 0},
    { month: 'Jul', total: 0},
    { month: 'Aug', total: 0},
    { month: 'Sep', total: 0},
    { month: 'Oct', total: 0},
    { month: 'Nov', total: 0},
    { month: 'Dec', total: 0},
  ];

  for (let m of agg_data) {
    m.races = [
      { race: "Asian", count: 0 },
      { race: "Native", count: 0 },
      { race: "Hispanic", count: 0 },
      { race: "Black", count: 0 },
      { race: "White", count: 0 },
      { race: "Other", count: 0 },
      { race: "Unknown", count: 0 },
    ];
  }

  for(var d of data) {
    let m = agg_data.find(m => m.month == d.Month);
    m.total += 1;
    let r = m.races.find(r => r.race == d["Race"])
    r.count += 1;
    }

  let x_bar = d3.scaleBand()
    .domain(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'])
    .range([margin.left, width - margin.right])
    .padding(0.15)

  let x_line = d3.scalePoint()
    .domain(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'])
    .range([x_bar('Jan'), x_bar('Dec')]);

  let y = d3.scaleLinear()
    .domain([0, d3.max(agg_data, d => d.total)]).nice()
    .range([height - margin.bottom, margin.top]);

  let x_races = d3.scaleBand()
    .domain(["Asian", "Native", "Hispanic", "Black", "White", "Other", "Unknown"])
    .range([0, x_bar.bandwidth()])
    .padding([.05]);

  let race_colors = d3.scaleOrdinal()
    .domain(["Asian", "Native", "Hispanic", "Black", "White", "Other", "Unknown"])
    .range(['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f', '#b3b3b3']);
    // .range(d3.schemeSet2); // I wasn't sure if I could enforce using the same colors in both files so I manually set them to colors from the scheme

  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x_bar));

  svg.append("g")
    .attr("class", "y_ax")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).tickSize(-innerWidth));

  svg.selectAll(".y_ax .tick line")
    .attr("stroke", "lightgrey");

  let line = d3.line()
    .x(d => x_line(d.month) + x_bar.bandwidth()/2)
    .y(d => y(d.total));

  svg.append("path")
    .datum(agg_data)
    .attr("d", line)
    .attr("fill", "none")
    .attr("stroke", '#2A4D6B');

  let bar = svg.selectAll(".bar")
      .append("g")
      .data(agg_data)
      .join("g")
      .attr("class", "bar");

  bar.append("text")
      .text(d => d.total)
      .attr("x", d => x_line(d.month) + x_bar.bandwidth()/2 + 15)
      .attr("y", d => y(d.total) + 2)
      .attr("text-anchor", "middle")
      .style("fill", "black")
      .style("background", "white");

  for (let m of agg_data) {
    let bars = svg.append("g")
      .selectAll("rect")
      .data(m.races)
      .join("rect")
      .attr("class", "month_bar")
      .attr("x", d => x_bar(m.month) + x_races(d.race))
      .attr("y", d => y(d.count))
      .attr("width", x_races.bandwidth())
      .attr("height", d => y(0) - y(d.count))
      .attr("fill", d => race_colors(d.race));
  }

  svg.append("text")
    .attr("class", "x-label")
    .attr("text-anchor", "end")
    .attr("x", width - margin.right)
    .attr("y", height)
    .attr("dx", "0.5em")
    .attr("dy", "-0.5em") 
    .text("Month");

  svg.append("text")
    .attr("class", "y-label")
    .attr("text-anchor", "end")
    .attr("x", -margin.top/2)
    .attr("dx", "-0.5em")
    .attr("y", 10)
    .attr("transform", "rotate(-90)")
    .text("Shootings");

  // legend from here:
  // https://stackoverflow.com/questions/42009622/how-to-create-a-horizontal-legend
  const legend = d3.select('svg')
    .append('g')
    .attr('transform', 'translate(' + (margin.left + 10) + ',' + (margin.top - 20) + ')')
    .selectAll('g')
    .data(x_races.domain())
    .enter()
    .append('g');

  legend.append('rect')
      .attr('fill', (d, i) => race_colors(d))
      .attr('height', 15)
      .attr('width', 15);

  legend.append('text')
      .attr('x', 18)
      .attr('y', 10)
      .attr('dy', '.15em')
      .text((d, i) => d)
      .style('text-anchor', 'start')
      .style('font-size', 12);

  const padding = 10;
  legend.attr('transform', function (d, i) {
      return 'translate(' + (d3.sum(x_races.domain(), function (e, j) {
        if (j < i) { return legend.nodes()[j].getBBox().width; } else { return 0; }
      }) + padding * i) + ',0)';
    });

  const tooltip = d3.select("body").append("div")
    .attr("class", "svg-tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden");

  d3.selectAll(".month_bar")
    .on("mouseover", function(event, d) {
      d3.select(this).attr("fill", d => d3.rgb(race_colors(d.race)).darker());
      tooltip
        .style("visibility", "visible")
        .html(`${d.race}: ${d.count}`);
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


});