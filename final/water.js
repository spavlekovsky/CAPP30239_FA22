const height = 400,
    width = 600,
    margin = ({ top: 25, right: 15, bottom: 50, left: 30 }),
    padding = 1;

const svg1 = d3.select("#conflicts_refugees")
    .attr("class", "svg1")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);


Promise.all([
  d3.csv('../data/water_agg.csv'),
  d3.csv('../data/un_mena_water_agg.csv'),
]).then((data) => {
  let timeParse = d3.timeParse("%Y");

  for (let r of data[0]) {
    if (r.Year != 'Total') {
      r.Year = +r.Year
    }
    r.Count = +r.Count;
  }
  for (let r of data[1]) {
    r.Year = +r.Year
    r.Total = +r.Total
  }

  // console.log(data[0])
  // console.log(data[1])


  function make_chart(country) {
      d3.selectAll(".svg1 g").remove()
      d3.selectAll(".svg1 path").remove()

      data_w = data[0].filter(d => d.Country === country && d.Year != 'Total')
      data_r = data[1].filter(d => d['Country of origin'] === country)

      // console.log(data_w)
      // console.log(data_r)

      const x = d3.scaleBand()
        .domain(data_w.map(d => d.Year))
        .range([margin.left, width - margin.right])
        .padding(.5);

      const y = d3.scaleLinear()
          .range([height/2, height - margin.bottom])
          .domain([0, d3.max([10, d3.max(data_w, d => d.Count)])]).nice();

      svg1.append("g")
          .attr("transform", `translate(0,${height/2})`)
          .call(d3.axisBottom(x));

      svg1.append("g")
          .attr("class", "y-ax")
          .attr("transform", `translate(${margin.left},0)`)
          .call(d3.axisLeft(y).tickSize(-innerWidth));


      let yup = d3.scaleLinear()
          .domain([0, d3.max(data_r, d => d.Total)]).nice()
          .range([height/2, margin.top]);
    
      svg1.append("g")
        .attr("class", "y-ax")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(yup).tickSize(-innerWidth));    

      svg1.selectAll(".y-ax .tick line")
        .attr("stroke", "#ccc");

      let line = d3.line()
        .x(d => x(d.Year))
        .y(d => yup(d.Total));

      svg1.append("path")
          .datum(data_r)
          .attr("d", line)
          .attr("fill", "none")
          .attr("stroke", 'steelblue');

      let bar = svg1.append("g")
        .attr("class", "bar")

      bar.selectAll("g")
        .data(data_w)
        .join(
          enter => {
          let g = enter.append("g")

          // console.log('enter1')

          g.append("rect")
            .attr("fill", "steelblue")
            .attr("x", d => x(d.Year))
            .attr("width", x.bandwidth())
            .attr("y", y(0))
            .transition()
            .duration(750)
            .attr("y", d => y(0))
            .attr("height", d => y(d.Count) - y(0));

            // console.log('enter2');
          },
          update => {
            // console.log('update')
          update.select("rect")
              .transition()
              .duration(750)
              .attr("y", d => y(d.length))
              .attr("height", d => height - margin.bottom - y(d.length));
          },
          exit => {
            // console.log('exit')
          exit.select("rect")
              .transition()
              .duration(750)
              .attr("height", 0)
              .attr("y", height/2);

          exit.select("text")
              .text("");

          exit.transition()
              .duration(750)
              .remove();
          }
        );
  }

  make_chart('Algeria');

  d3.select("#selectwater")
      .on("change", function (event) {
      // console.log(event.target.value)
      make_chart(event.target.value);
  });

});