import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
import { fetchJSON, renderProjects } from "../global.js";

const projects = await fetchJSON("../lib/projects.json");

const projectsContainer = document.querySelector(".projects");
renderProjects(projects, projectsContainer, "h2");

// Fix title
document.querySelector("h1").textContent = `${projects.length} Projects`;

// PIE CHART
let data = projects.map(d => d.year);

let arcGenerator = d3.arc().innerRadius(0).outerRadius(20);
let sliceGenerator = d3.pie();

let arcData = sliceGenerator(data);

let colors = d3.scaleOrdinal(d3.schemeTableau10);

d3.select('#projects-pie-plot')
  .selectAll('path')
  .data(arcData)
  .join('path')
  .attr('d', arcGenerator)
  .attr('fill', (_, i) => colors(i));