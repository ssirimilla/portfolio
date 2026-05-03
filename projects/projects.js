import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";
import { fetchJSON, renderProjects } from "../global.js";

// -----------------------------
// Load data
// -----------------------------
const projects = await fetchJSON("/portfolio/lib/projects.json");

const projectsContainer = document.querySelector(".projects");
const searchInput = document.querySelector(".searchBar");
const svg = d3.select("#projects-pie-plot");
const legend = d3.select(".legend");

let query = "";
let selectedYear = null;

// -----------------------------
// Search input
// -----------------------------
searchInput.addEventListener("input", (e) => {
  query = e.target.value.toLowerCase();
  updateView();
});

// Initial render
updateView();

// -----------------------------
// Main update function
// -----------------------------
function updateView() {
  // 1. Filter by search
  let filtered = projects.filter((p) =>
    Object.values(p).join(" ").toLowerCase().includes(query)
  );

  // 2. Filter by selected year
  if (selectedYear !== null) {
    filtered = filtered.filter(
      (p) => String(p.year) === String(selectedYear)
    );
  }

  // 3. Render project list
  renderProjects(filtered, projectsContainer, "h2");

  // 4. Aggregate data (year counts)
  const data = d3.rollups(
    filtered,
    (v) => v.length,
    (d) => d.year
  ).map(([year, count]) => ({
    label: year,
    value: count,
  }));

  // Optional: sort years
  data.sort((a, b) => d3.ascending(a.label, b.label));

  // 5. Render pie + legend
  renderPie(data);
}

// -----------------------------
// Pie chart renderer
// -----------------------------
function renderPie(data) {
  const radius = 50;

  const pie = d3.pie().value((d) => d.value);
  const arc = d3.arc().innerRadius(20).outerRadius(radius);
  const colors = d3.scaleOrdinal(d3.schemeTableau10);

  // Clear previous render
  svg.selectAll("*").remove();
  legend.selectAll("*").remove();

  // Create centered group
  const g = svg
    .attr("viewBox", `${-radius} ${-radius} ${radius * 2} ${radius * 2}`)
    .append("g");

  // Draw arcs
  g.selectAll("path")
    .data(pie(data))
    .join("path")
    .attr("d", arc)
    .attr("fill", (_, i) => colors(i))
    .attr("class", (d) =>
      d.data.label === selectedYear ? "selected" : ""
    )
    .style("cursor", "pointer")
    .on("click", (event, d) => {
      const year = d.data.label;

      selectedYear = selectedYear === year ? null : year;

      console.log("clicked year:", year);
      console.log("selectedYear:", selectedYear);

      updateView();
    });

  // Legend
  legend
    .selectAll("li")
    .data(data)
    .join("li")
    .attr("class", (d) =>
      d.label === selectedYear ? "selected" : ""
    )
    .style("--color", (_, i) => colors(i))
    .style("cursor", "pointer")
    .html(
      (d) =>
        `<span class="swatch"></span>${d.label} <em>(${d.value})</em>`
    )
    .on("click", (event, d) => {
      const year = d.label;

      selectedYear = selectedYear === year ? null : year;

      updateView();
    });
}