import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
import { fetchJSON, renderProjects } from "../global.js";

// -----------------------------
// Load data
// -----------------------------
const projects = await fetchJSON('/portfolio/lib/projects.json');

const projectsContainer = document.querySelector(".projects");
const searchInput = document.querySelector(".searchBar");

let query = "";

// -----------------------------
// Render initial state
// -----------------------------
renderProjects(projects, projectsContainer, "h2");
document.querySelector("h1").textContent = `${projects.length} Projects`;

renderPieChart(projects);

// -----------------------------
// Search logic
// -----------------------------
searchInput.addEventListener("input", (event) => {
  query = event.target.value.toLowerCase();

  const filteredProjects = projects.filter((project) => {
    const values = Object.values(project).join(" ").toLowerCase();
    return values.includes(query);
  });

  renderProjects(filteredProjects, projectsContainer, "h2");
  renderPieChart(filteredProjects);
});

// -----------------------------
// Reactive pie chart function
// -----------------------------
function renderPieChart(projectsGiven) {

  // roll up data by year
  const rolledData = d3.rollups(
    projectsGiven,
    v => v.length,
    d => d.year
  );

  const data = rolledData.map(([year, count]) => ({
    label: year,
    value: count
  }));

  const sliceGenerator = d3.pie()
    .value(d => d.value);

  const arcGenerator = d3.arc()
    .innerRadius(20)
    .outerRadius(40);

  const arcData = sliceGenerator(data);

  const colors = d3.scaleOrdinal(d3.schemeTableau10);

  // -----------------------------
  // Clear old chart + legend
  // -----------------------------
  d3.select("#projects-pie-plot").selectAll("*").remove();
  d3.select(".legend").selectAll("*").remove();

  // -----------------------------
  // Draw pie
  // -----------------------------
  d3.select("#projects-pie-plot")
    .selectAll("path")
    .data(arcData)
    .join("path")
    .attr("d", arcGenerator)
    .attr("fill", (_, i) => colors(i));

  // -----------------------------
  // Draw legend
  // -----------------------------
  const legend = d3.select(".legend");

  data.forEach((d, idx) => {
    legend
      .append("li")
      .attr("class", "legend-item")
      .attr("style", `--color:${colors(idx)}`)
      .html(`
        <span class="swatch"></span>
        ${d.label} <em>(${d.value})</em>
      `);
  });
}