import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
import { fetchJSON, renderProjects } from "../global.js";

const projects = await fetchJSON("../lib/projects.json");

const projectsContainer = document.querySelector(".projects");
renderProjects(projects, projectsContainer, "h2");

// Fix title
document.querySelector("h1").textContent = `${projects.length} Projects`;


// -----------------------------
// Prepare pie chart data (projects per year)
// -----------------------------
let rolledData = d3.rollups(
  projects,
  v => v.length,
  d => d.year
);

let data = rolledData.map(([year, count]) => ({
  label: year,
  value: count
}));

// -----------------------------
// Pie + arc generators
// -----------------------------
let sliceGenerator = d3.pie()
  .value(d => d.value);

let arcGenerator = d3.arc()
  .innerRadius(20)
  .outerRadius(40);

let arcData = sliceGenerator(data);

// Color scale
let colors = d3.scaleOrdinal(d3.schemeTableau10);

// -----------------------------
// Draw pie chart
// -----------------------------
d3.select('#projects-pie-plot')
  .selectAll('path')
  .data(arcData)
  .join('path')
  .attr('d', arcGenerator)
  .attr('fill', (_, i) => colors(i));

// -----------------------------
// Build legend
// -----------------------------
let legend = d3.select('.legend');

data.forEach((d, idx) => {
  legend
    .append('li')
    .attr('class', 'legend-item')
    .attr('style', `--color:${colors(idx)}`)
    .html(`
      <span class="swatch"></span>
      ${d.label} <em>(${d.value})</em>
    `);
    
d3.selectAll('#projects-pie-plot path')
  .on('mouseenter', function () {
    d3.select(this).attr('opacity', 0.6);
  })
  .on('mouseleave', function () {
    d3.select(this).attr('opacity', 1);
  });

});