import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
import { fetchJSON, renderProjects } from "../global.js";

// -----------------------------
// Load data
// -----------------------------
const projects = await fetchJSON('/portfolio/lib/projects.json');

const projectsContainer = document.querySelector(".projects");
const searchInput = document.querySelector(".searchBar");
const svg = d3.select("#projects-pie-plot");
const legend = d3.select(".legend");

let query = "";
let selectedIndex = -1;
let pieData = [];

searchInput.addEventListener("input", (e) => {
  query = e.target.value.toLowerCase();
  updateView();
});

updateView();

function updateView() {

  // -------------------------
  // STEP 1: search filter
  // -------------------------
  let filtered = projects.filter(p => {
    const values = Object.values(p).join(" ").toLowerCase();
    return values.includes(query);
  });

  // -------------------------
  // STEP 2: year filter (pie click)
  // -------------------------
  if (selectedIndex !== -1 && pieData[selectedIndex]) {
  const selectedYear = pieData[selectedIndex].label;

  filtered = filtered.filter(p =>
    String(p.year) === String(selectedYear)
  );
  }

  // -------------------------
  // Render list
  // -------------------------
  renderProjects(filtered, projectsContainer, "h2");

  // -------------------------
  // Render pie + legend
  // -------------------------
  renderPie(filtered);
}

function renderPie(projectsGiven) {
    pieData = rolledData.map(([year, count]) => ({
    label: year,
    value: count
    }));

  svg.selectAll("*").remove();
  legend.selectAll("*").remove();

  const rolled = d3.rollups(
    projectsGiven,
    v => v.length,
    d => d.year
  );

  const data = rolled.map(([year, count]) => ({
    label: year,
    value: count
  }));

  const pie = d3.pie().value(d => d.value);
  const arcData = pie(data);

  const arc = d3.arc()
    .innerRadius(20)
    .outerRadius(40);

  const colors = d3.scaleOrdinal(d3.schemeTableau10);

  // -------------------------
  // PIE WEDGES
  // -------------------------
  svg.selectAll("path")
    .data(arcData)
    .join("path")
    .attr("d", arc)
    .attr("fill", (_, i) => colors(i))
    .attr("class", (_, i) => i === selectedIndex ? "selected" : "")
    .on("click", (_, i) => {
      selectedIndex = selectedIndex === i ? -1 : i;
      updateView();
    });

  // -------------------------
  // LEGEND
  // -------------------------
  data.forEach((d, idx) => {
    legend.append("li")
      .attr("class", idx === selectedIndex ? "selected legend-item" : "legend-item")
      .attr("style", `--color:${colors(idx)}`)
      .html(`<span class="swatch"></span>${d.label} <em>(${d.value})</em>`)
      .on("click", () => {
        selectedIndex = selectedIndex === idx ? -1 : idx;
        updateView();
      });
  });

  searchInput.addEventListener("input", (e) => {
  query = e.target.value.toLowerCase();
  updateView();
});
}