const margin = { top: 50, right: 30, bottom: 35, left: 80 },
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

const svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


let top10 = [];

// Add Header
svg.append("text")
  .attr("x", (width / 2))
  .attr("y", 10 - (margin.top / 2))
  .attr("text-anchor", "middle")
  .style("font-size", "30px")
  .style("text-decoration", "underline")
  .text("World Happiness Study");

const findLargest10 = (data, category) => {
  data.sort((a, b) => b[category] - a[category]);
  return data.slice(0, 10);
};

const scaleY = (data) => d3.scaleBand()
  .domain(data.map(d => d["Country or region"]))
  .rangeRound([margin.top, height - margin.bottom])
  .padding(0.1);

const scaleX = (data, category) => d3.scaleLinear()
  .domain([0, d3.max(data, d => d[category])]).nice()
  .range([margin.left, width - margin.right]);


const yAxis = (g, data) => g
  .attr("transform", `translate(${margin.left},0)`)
  .call(d3.axisLeft(scaleY(data)));

const xAxis = (g, data, category) => g
  .attr("transform", `translate(0,${height - margin.bottom})`)
  .call(d3.axisBottom(scaleX(data, category)).ticks(width / 80));
// .call(g => g.select(".domain").remove());

const render = async (category) => {
  const data = await d3.csv('world-happiness/2019.csv');

  top10 = findLargest10(data, category);

  console.log(top10);

  svg.append("text")
    .attr("x", (width / 2))
    .attr("y", margin.top - 20 + height)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("text-decoration", "underline")
    .text(`Effects of ${category} on Happiness`);


  svg.append("g")
    .attr("fill", "steelblue")
    .selectAll("rect")
    .data(top10)
    .join("rect")
    .attr("x", scaleX(top10, category)(0))
    .attr("y", (_, i) => {
      console.log(scaleY(top10).bandwidth() * i);
      scaleY(top10).bandwidth() * (i + 2);
    })
    // .attr("y", 29 * 3)
    .attr("width", d => scaleX(top10, category)(d[category]) - scaleX(top10, category)(0))
    .attr("height", scaleY(top10).bandwidth());


  // console.log(top10);
  // svg.append("g")
  //   .attr("fill", "white")
  //   .attr("text-anchor", "end")
  //   .attr("font-family", "sans-serif")
  //   .attr("font-size", 12)
  //   .selectAll("text")
  //   .data(top10)
  //   .join("text")
  //   .attr("x", d => scaleX(top10, category)(d[category]) - 4)
  //   .attr("y", (d, i) => scaleY(top10)(i) + scaleY(top10).bandwidth() / 2)
  //   .attr("dy", "0.35em")
  //   .text(d => scaleX(top10, category)(d[category]));

  const x = svg.append("g");
  xAxis(x, top10, category);

  const y = svg.append("g");
  yAxis(y, top10);
};

render("GDP per capita");
