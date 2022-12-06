const names = ['Algeria', 'Egypt', 'Iraq', 'Jordan', 'Lebanon', 'Libya', 'Morocco', 'Palestine', 'Saudi Arabia', 'Syria', 'Tunisia', 'Yemen', 'Other Arab Countries']

const co_color = d3.scaleOrdinal(names, ['#00a', '#0a0', '#0aa', '#a00', '#a0a', 'darkorange', '#dd2', '#444', '#55f', '#5f5', '#5ff', "#f55", '#f5f', '#ff5']);

d3.csv('../data/un_water_join.csv').then((full_data) => {
  const height = 400,
  width = 600,
  margin = ({ top: 25, right: 40, bottom: 25, left: 40 });

  const svg1 = d3.select("#conflicts_refugees")
    .attr("class", "svg1")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

  for (let r of full_data) {
    r.Year = +r.Year;
    r.Origin = +r.Origin;
    r.Asylum = +r.Asylum;
    r.Conflicts = +r.Conflicts;
  }

  function make_chart(country) {
      d3.selectAll(".svg1 g").remove()
      d3.selectAll(".svg1 path").remove()
      d3.selectAll(".svg1 text").remove()

      let data = full_data.filter(d => d.Country === country)

      const x = d3.scaleBand()
        .domain(data.map(d => d.Year))
        .range([margin.left, width - margin.right])
        .padding(.5);

      const y = d3.scaleLinear()
          .range([height * 2/3, height - margin.bottom])
          .domain([0, d3.max([10, d3.max(data, d => d.Conflicts)])]).nice();

      svg1.append("g")
          .attr("class", "x-ax")
          .attr("transform", `translate(0,${height * 2/3})`)
          .call(d3.axisBottom(x).tickSize(-(height * 2/3 - margin.top)).tickSizeOuter(0));

      svg1.selectAll(".x-ax .tick line")
          .attr("stroke", "#ccc");
        
      svg1.selectAll(".x-ax .tick text")
          .attr("dy", "-10");

      let y_or = d3.scaleLinear()
          .domain([0, d3.max(data, d => d.Origin)]).nice()
          .range([height * 2/3, margin.top]);

      let y_as = d3.scaleLinear()
          .domain([0, d3.max(data, d => d.Asylum)]).nice()
          .range([height * 2/3, margin.top]);    
          
      function format_ticks(d) {
        return (d >= 10**6 ? d/(10**6) + "m": (d >= 10**3 ? d/(10**3) + "k" : d))
      }

      let line_or = d3.line()
        .x(d => x(d.Year) + x.bandwidth()/2)
        .y(d => y_or(d.Origin));
      
      let line_as = d3.line()
        .x(d => x(d.Year) + x.bandwidth()/2)
        .y(d => y_as(d.Asylum));

      if (y_or.domain()[0] != y_or.domain()[1]) {
        svg1.append("g")
          .attr("class", "y-or")
          .attr("transform", `translate(${margin.left},0)`)
          .call(d3.axisLeft(y_or).tickFormat(d => format_ticks(d)));

        svg1.append("path")
            .datum(data)
            .attr("d", line_or)
            .attr("fill", "none")
            .attr("stroke", 'tomato');
      } else {
        svg1.append("g")
          .attr("class", "y-or")
          .attr("transform", `translate(${margin.left},0)`)
          .call(d3.axisLeft(y_or).tickSize(0).tickFormat(""));
      }

      if (y_as.domain()[0] != y_as.domain()[1]) {
        svg1.append("g")
          .attr("class", "y-as")
          .attr("transform", `translate(${width - margin.right},0)`)
          .call(d3.axisRight(y_as).tickFormat(d => format_ticks(d)));

        svg1.append("path")
            .datum(data)
            .attr("d", line_as)
            .attr("fill", "none")
            .attr("stroke", 'slateblue');
      } else {
        svg1.append("g")
        .attr("class", "y-as")
        .attr("transform", `translate(${width - margin.right},0)`)
        .call(d3.axisRight(y_as).tickSize(0).tickFormat(""));
      }


      svg1.selectAll(".y-or")
        .style("color", "tomato");
      svg1.selectAll(".y-as")
      .style("color", "slateblue");

      let bar = svg1.selectAll(".bar")
          .append("g")
          .data(data)
          .join("g")
          .attr("class", "bar");
  
      bar.append("rect")
          .attr("fill", "mediumaquamarine")
          .attr("x", d => x(d.Year))
          .attr("width", x.bandwidth())
          .attr("y", d => y(0))
          .attr("height", d => y(d.Conflicts) - y(0));
  
      bar.append("text")
          .text(d => (d.Conflicts != 0 ? d.Conflicts : ""))
          .attr("x", d => x(d.Year) + (x.bandwidth()/2))
          .attr("y", d => y(d.Conflicts) + 9)
          .attr("text-anchor", "middle")
          .style("fill", "#111")
          .style("font-size", "10");

      svg1.append("text")
          .attr("class", "x-label")
          .attr("text-anchor", "middle")
          .attr("x", width - margin.right)
          .attr("y", height * 2/3)
          .attr("dx", "0")
          .attr("dy", "20") 
          .text("Water Conflicts")
          .style("fill", "mediumaquamarine")
          .style("font-size", "12");
        
      svg1.append("text")
          .attr("class", "y-label")
          .attr("text-anchor", "end")
          .attr("x", -margin.top/2)
          .attr("dx", "-13")
          .attr("y", margin.left + 12)
          .attr("transform", "rotate(-90)")
          .text("Refugees from Country")
          .style("fill", "tomato")
          .style("font-size", "12");

      svg1.append("text")
          .attr("class", "y-label")
          .attr("text-anchor", "end")
          .attr("x", -margin.top/2)
          .attr("dx", "-13")
          .attr("y", width - margin.right - 5)
          .attr("transform", "rotate(-90)")
          .text("Asylees in Country")
          .style("fill", "slateblue")
          .style("font-size", "12");

      svg1.append("text")
          .attr("x", (width / 2))
          .attr("class", "title")            
          .attr("y", margin.top - 10)
          .attr("text-anchor", "middle")  
          .style("font-size", "14px") 
          .style("text-decoration", "underline")  
          .text(`Refugee Stocks and Water Conflicts in ${country}`);
  }

  make_chart('Algeria');

  d3.select("#selectwater")
      .on("change", function (event) {
      make_chart(event.target.value);
  });

});