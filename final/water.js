const height = 400,
    width = 600,
    margin = ({ top: 25, right: 15, bottom: 50, left: 15 }),
    padding = 1;

const svg = d3.select("#conflicts_refugees")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);


Promise.all([
  d3.csv('../data/water_agg.csv'),
  d3.csv('../data/un_mena_water_agg.csv'),
]).then((data) => {
  let timeParse = d3.timeParse("%Y");

  const years = ['2010', '2011', '2012','2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022']

  for (let r of data[0]) {
    // if (r.Year === 'Total') {
    //   r.Year = null
    //   r.Total = true
    // } else {
    //   r.Year = timeParse(r.Year);
    //   r.Total = false
    // }
    if (r.Year != 'Total') {
      r.Year = +r.Year
    }
    r.Count = +r.Count;
  }
  for (let r of data[1]) {
    for (let y of years) {
      r[y] = +r[y]
    }
  }

  // console.log(data[0])
  // // console.log('hi')
  // console.log(data[1])


  function make_chart(country) {
      d3.selectAll("svg > g > *").remove()

      data_w = data[0].filter(d => d.Country === country && d.Year != 'Total')
      data_r = data[1].filter(d => d['Country of origin'] === country)

      console.log(data_w)

      const x = d3.scaleBand()
        .domain(data_w.map(d => d.Year))
        .range([margin.left, width - margin.right])
        .padding(.5);

      console.log(data_w.map(d => d.Year))

      // const x = d3.scaleTime()
      //     .range([margin.left, width - margin.right])
      //     .domain(d3.extent(data_w, d => d.Year));

      const y = d3.scaleLinear()
          .range([height/2, height - margin.bottom])
          .domain(d3.extent(data_w, d => d.Count)).nice();

      svg.append("g")
          .attr("transform", `translate(0,${height/2})`)
          .call(d3.axisBottom(x));

      svg.append("g")
          .attr("id", "y-ax")
          .attr("transform", `translate(${margin.left},0)`)
          .call(d3.axisLeft(y).tickSize(-innerWidth));

      // let line = d3.line()
      //   .x(d => x(d.Year))
      //   .y(d => y(d.Count));
      //   // line defaults to a curvy shape but you can change it to be more step-wise or such

      // svg.append("path")
      //     .datum(data_w) // only one path/line so we use datUM
      //     .attr("d", line)
      //     .attr("fill", "none")
      //     .attr("stroke", 'steelblue');

      // const binGroups = svg.append("g")
      //     .attr("class", "bin-group");

      // const bins = d3.bin()
      //     .thresholds(10)
      //     .value(d => d.average)(data[i]);

      // binGroups.selectAll("g")
      //     .data(bins, d => d.x0)
      // svg.append("path")

      let bar = svg.append("g")
        .attr("class", "bar")

      bar.selectAll("g")
        .data(data_w)
        .join(
          enter => {
          let g = enter.append("g")

          console.log('enter1')

          g.append("rect")
            .attr("fill", "steelblue")
            .attr("x", d => x(d.Year))
            .attr("width", x.bandwidth())
            .attr("y", y(0))
            .transition()
            .duration(750)
            .attr("y", d => y(0))
            .attr("height", d => y(d.Count) - y(0));

            console.log('enter2');
          },
          update => {
            console.log('update')
          update.select("rect")
              .transition()
              .duration(750)
              .attr("y", d => y(d.length))
              .attr("height", d => height - margin.bottom - y(d.length));
          },
          exit => {
            console.log('exit')
          exit.select("rect")
              .transition()
              .duration(750)
              .attr("height", 0)
              .attr("y", height/2);

          exit.select("")

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

      console.log(event.target.value)
      // const country = event.target.value;
      make_chart(event.target.value);
  });

});

// d3.json('../data/World-Water-Conflicts-2022.csv').then((data) => {

//   const x = d3.scaleLinear()
//     .domain(d3.extent(data, d => d.average)).nice()
//     .range([margin.left, width - margin.right]);
  
//   const y = d3.scaleLinear()
//     .range([height - margin.bottom, margin.top])
//     .domain([0,10]); // manually setting values
    
//   svg.append("g")
//     .attr("transform", `translate(0,${height - margin.bottom + 5})`)
//     .call(d3.axisBottom(x));

//   const binGroups = svg.append("g")
//     .attr("class", "bin-group");

//   const bins = d3.bin() // does it all for us
//     .thresholds(10)
//     .value(d => d.average)(data);

//   let g = binGroups.selectAll("g")
//     .data(bins) // uses the data we just created
//     .join("g");

//   // * normal *
//   // g.append("rect")
//   //   .attr("x", d => x(d.x0) + (padding / 2))
//   //   .attr("y", d => y(d.length))
//   //   .attr("width", d => x(d.x1) - x(d.x0) - padding)
//   //   .attr("height", d => height - margin.bottom - y(d.length))
//   //   .attr("fill", "steelblue");

//   // * with fancy animation *
//   g.append("rect")
//   .attr("x", d => x(d.x0) + (padding / 2))
//   .attr("width", d => x(d.x1) - x(d.x0) - padding)
//   .attr("y", height - margin.bottom)
//   .attr("height", 0)
//   .attr("fill", "steelblue")
//   .transition()
//   .duration(750) // how long to take
//   .attr("y", d => y(d.length))
//   .attr("height", d => height - margin.bottom - y(d.length))

//   g.append("text")
//     .text(d => d.length)
//     .attr("x", d => x(d.x0) + (x(d.x1) - x(d.x0)) / 2)
//     .attr("y", d => y(d.length) - 5)
//     .attr("text-anchor", "middle")
//     .attr("fill", "#333");

// });