async function draw () {
  const data = await d3.csv("data.csv", d => {
    return {
      "Country": d.Country.toUpperCase(),
      "GDP": +d.GDP,
      "Adventure": +d.Adventure,
      "Cultural Influence": +d['Cultural Influence'],
      "Entrepreneurship": +d.Entrepreneurship,
      "Heritage": +d.Heritage,
      "Power": +d.Power
    }
  });

  const xAccessor = d => d.GDP

  const parameters = ["Adventure", "Cultural Influence", "Entrepreneurship", "Heritage", "Power"]
  const svg = d3.select('#chart svg')
  const width = svg.node().clientWidth
  const height = svg.node().clientHeight
  const margin = 30

  const ctr = svg.append('g')
    .attr('transform', `translate(${margin}, 0)`)


  const yScale = d3.scaleLinear().domain([0, 100]).range([height - margin, margin])
  const yAxis = d3.axisLeft(yScale)
  ctr.append('g')
    .call(yAxis)

  const xScale = d3.scaleLinear().domain([0, d3.max(data, xAccessor)]).range([0, width-margin*2])
  const xAxis = d3.axisBottom(xScale)
  ctr.append('g')
    .attr('transform', `translate(0, ${height-margin})`)
    .call(xAxis)

  const colorScale = d3.scaleOrdinal()
    .domain(data.map(d => d.Country))
    .range(d3.schemeDark2)

  const symbolScale = d3.scaleOrdinal()
    .domain(parameters)
    .range([d3.symbolCircle, d3.symbolCross, d3.symbolDiamond, d3.symbolSquare, d3.symbolStar]);

  
  parameters.forEach(param => {
    const className = param.toLowerCase().replace(/\s+/g, '-')

    ctr.selectAll(`${className}`)
      .data(data)
      .join("path")
      .attr("d", d3.symbol().type(symbolScale(param)).size(100))
      .attr("transform", d => `translate(${xScale(xAccessor(d))}, ${yScale(+d[param])})`)
      .attr("stroke", "black")
      .attr("stroke-width", 1)
  })
}

draw();