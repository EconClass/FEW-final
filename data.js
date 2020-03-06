const margin = { top: 50, right: 30, bottom: 35, left: 80 },
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

const svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


let top10 = [];

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
  const x = scaleX(top10, category);
  const y = scaleY(top10);

  // Add Header
  svg.append("text")
    .attr("x", (width / 2))
    .attr("y", 30 - (margin.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "30px")
    .style("text-decoration", "underline")
    .text("World Happiness Study");

  // Add X-Axis Label
  svg.append("text")
    .attr("x", (width / 2))
    .attr("y", margin.top - 20 + height)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("text-decoration", "underline")
    .text(`Effects of ${category} on Happiness`);

  // Add Bars
  svg.append("g")
    .attr("fill", "steelblue")
    .selectAll("rect")
    .data(top10)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", x(0))
    .attr("y", (d, i) => {
      for (i == 0; i < top10.length; i++) {
        return y.bandwidth() * (i + 2);
      }
    })
    .attr("width", d => x(d[category]) - x(0))
    .attr("height", y.bandwidth());


  // Add Numeric Value of Bars
  svg.append("g")
    .attr("fill", "white")
    .attr("text-anchor", "end")
    .attr("font-family", "sans-serif")
    .attr("font-size", 12)
    .selectAll("text")
    .data(top10)
    .join("text")
    .attr("x", d => x(d[category]) - 10)
    .attr("y", (d, i) => {
      for (i > 0; i < top10.length; i++) {
        return (y.bandwidth() * (i + 2)) + 10;
      }
    })
    .attr("dy", "0.35em")
    .text(d => x.tickFormat(20)(d[category]));

  const axisX = svg.append("g");
  xAxis(axisX, top10, category);

  const axisY = svg.append("g");
  yAxis(axisY, top10);
};

render("GDP per capita");

const showButtons = () => {
  const buttonBar = document.getElementById("button-bar");

  const indicators = [
    "GDP per capita",
    "Social support",
    "Healthy life expectancy",
    "Generosity"
  ];

  indicators.forEach((indicator) => {
    const bttn = document.createElement("button");
    bttn.textContent = indicator;
    bttn.onclick = () => {
      svg.selectAll("*").remove();
      render(indicator);
    };
    buttonBar.appendChild(bttn);
  });
};
showButtons();