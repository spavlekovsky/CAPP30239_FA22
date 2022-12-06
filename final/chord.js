// const height = 400,
//     width = 600,
//     margin = ({ top: 25, right: 15, bottom: 50, left: 15 }),
//     padding = 1;

const innerRadius = (Math.min(width, height) / 2) - margin,
  outerRadius = innerRadius + 6;

const svg3 = d3.select("#chord")
  .append("svg")
  .attr("class", "svg3")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [-width / 2, -height / 2, width, height])
  .attr("transform", "rotate(-90)")
  .attr("style", "max-width: 100%; height: auto;");

d3.json("../data/un_mena_chord.json").then((data) => {

    for (let d of data) {
        d.Year = +d.Year;
    }

    function updateChord(i) {
        d3.selectAll(".svg3 g").remove()

        console.log(i)
        const matrix = data.filter(d => d.Year === i)[0].Data
        console.log(matrix)

        let matrix2 = [
            [0,10,0,0,0,0,6,0,0,0,30,22,0,0],
            [0,0,0,0,219,46,5,0,0,0,51,19,25,8],
            [20,7438,0,0,451465,9230,3251,160,0,87,750892,305,4116,2174],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,5,0,0,0,32,0,0,0,0,60,6,14,13],
            [0,0,0,0,10,0,0,0,0,0,27,0,0,0],
            [23,18,0,0,33,0,0,12,0,0,15,1049,0,0],
            [0,0,0,0,0,0,0,0,0,0,13,10,0,0],
            [4037,70049,11549,0,0,29,2710,33,0,25,57,37,529,47],
            [0,5,7,0,0,0,0,0,0,0,11,0,0,0],
            [5,94,1714,0,2811,5332,0,5,0,26,0,11,66,88],
            [0,5,0,0,18,8,0,0,0,6,11,0,0,0],
            [0,255,5,0,139,5,0,0,0,0,181,0,0,14],
            [90000,0,0,0,0,0,0,0,0,0,61,0,0,0]
        ]

        console.log(matrix2)
        console.log(matrix == matrix2)
        

        const arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        // const ribbon = d3.ribbonArrow()
        const ribbon = d3.ribbon()
            .radius(innerRadius - 0.5)
            .padAngle(1 / innerRadius);

        const chords = d3.chordDirected()
            .padAngle(12 / innerRadius)
            .sortSubgroups(d3.descending)
            .sortChords(d3.descending)(matrix2);

        console.log(chords)
        // console.log(matrix)

        // const color = d3.scaleOrdinal(names, [d3.schemeTableau10[4], d3.schemeTableau10[6], "#333", "#333", "#333", "#333"]);

        svg3.append("path")
            .attr("id", "text-id")
            .attr("fill", "none")
            .attr("d", d3.arc()({ outerRadius, startAngle: 0, endAngle: 2 * Math.PI }));

        svg3.append("g")
            .selectAll("g")
            .data(chords)
            .join("path")
            .attr("d", ribbon)
            // .attr("fill", d => color(names[d.source.index]))
            .attr("fill-opacity", 0.75)
            .style("mix-blend-mode", "multiply")
            // .on("mouseover", function() {
            // d3.select(this)
            //     .attr("fill-opacity", 1);
            // })
            // .on("mouseout", function() {
            // d3.select(this)
            //     .attr("fill-opacity", 0.75);
            // })
            // .on("click", function(e, d) {
            // let str = `${names[d.source.index]} earned 
            //     ${d.source.value.toLocaleString()} ${names[d.target.index]} Degrees`;
            // d3.select("h2")
            //     .html(str);
            // })
            // .append("title")
            // .text(d => `${names[d.source.index]} earned ${d.source.value.toLocaleString()} ${names[d.target.index]} Degrees`);

        svg3.append("g")
            .selectAll("g")
            .data(chords.groups)
            .join("g")
            .call(g => g.append("path")
            .attr("d", arc)
            // .attr("fill", d => color(names[d.index]))
            .attr("stroke", "#fff"))
            // .call(g => g.append("text")
            // .attr("dy", -3)
            // .append("textPath")
            // .attr("href", "#text-id")
            // .attr("startOffset", d => d.startAngle * outerRadius)
            // // .text(d => names[d.index]))
            // .text('Country')
            // .attr("fill", d => color(names[d.index]) != "#ccc" ? color(names[d.index]) : "#666");

    }

    updateChord(2010);

    d3.select("#selectchord")
        .on("change", function (event) {
        const i = parseInt(event.target.value);
        updateChord(i);
    });
});


      // .call(g => g.append("text")
      //   .attr("text-anchor", d => d.index == 0 ? "start" : "middle")
      //   .attr("dy", d => d.index%3 == 0 ? -3: (d.index%3 == 1 ? -13: -24))
      //   .append("textPath")
      //   .attr("href", "#text-id")
      //   // .attr("startOffset", d => d.startAngle * outerRadius)
      //   .attr("startOffset", d => (d.startAngle + d.endAngle)/2 * outerRadius)
      //   .text(d => names[d.index])
      //   // .text(d => d.value)
      //   .style("font-size", "12")
      //   )



    //   var legend = d3.legendColor()
    //     .shape('circle')
    //     .shapeRadius(5)
    //     .shapePadding(25)
    //     .orient('horizontal')
    //     .scale(co_color)
      
    // svg4.append("g")
    //     .attr("class", "legend")
    //     .attr("x", -100)
    //     .attr("y", -290)
    //     .attr("transform", "rotate(90)")
    //     .call(legend)
    //     .style("font-size", "12px")
      
    // d3.selectAll(".svg4 .legend text")
    //     .style("font-size", "10px")
    //     .attr("text-anchor", "middle")
    //     .attr("dx", 0)
    //     .attr("dy", d => names.indexOf(d)%2 == 0 ? -5 : 5)