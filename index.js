import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

function renderPieChart(projectsGiven, searchBar, projectsContainer) {
  // Clear existing paths and legend
  const svg = d3.select('#projects-pie-plot');
  svg.selectAll('*').remove();
  const legend = d3.select('.legend');
  legend.selectAll('*').remove();

  // Process data: count projects per year
  const rolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year
  );
  
  const data = rolledData.map(([year, count]) => ({ value: count, label: year }));
  data.sort((a, b) => b.label - a.label); // Sort by year descending

  // Create pie and arc generators
  const sliceGenerator = d3.pie().value((d) => d.value);
  const arcData = sliceGenerator(data);
  const arcGenerator = d3.arc().innerRadius(20).outerRadius(50);
  
  const colors = d3.scaleOrdinal(d3.schemeCategory10);

  // Setup click state
  let selectedIndex = -1;
  const clearBtn = document.getElementById('clear-filter-btn');

  function filterProjects() {
    if (selectedIndex === -1) {
      renderProjects(projectsGiven, projectsContainer, 'h2');
      clearBtn.style.display = 'none';
      svg.selectAll('path').attr('class', '');
    } else {
      const selectedYear = data[selectedIndex].label;
      const filtered = projectsGiven.filter(p => p.year === selectedYear);
      renderProjects(filtered, projectsContainer, 'h2');
      clearBtn.style.display = 'inline-block';
      svg.selectAll('path').attr('class', (d, i) => i === selectedIndex ? 'selected' : '');
    }
  }

  // Clear button resets the pie chart selection but keeps the text search
  clearBtn.onclick = () => {
    selectedIndex = -1;
    filterProjects();
  };

  // Render pie chart paths
  arcData.forEach((d, idx) => {
    svg.append('path')
      .attr('d', arcGenerator(d))
      .attr('fill', colors(idx))
      .style('cursor', 'pointer')
      .on('click', () => {
        selectedIndex = selectedIndex === idx ? -1 : idx;
        filterProjects();
      });
  });

  // Render legend
  data.forEach((d, idx) => {
    legend.append('li')
      .attr('class', 'legend-item')
      .style('cursor', 'pointer')
      .html(`<span class="swatch" style="background-color:${colors(idx)}"></span> ${d.label} <em>(${d.value})</em>`)
      .on('click', () => {
        selectedIndex = selectedIndex === idx ? -1 : idx;
        filterProjects();
      });
  });
}

async function init() {
  const projects = await fetchJSON('./lib/projects.json');
  const projectsContainer = document.querySelector('.projects');
  const searchBar = document.querySelector('.searchBar');
  
  if (projects && projects.length > 0) {
    renderProjects(projects, projectsContainer, 'h2');
    renderPieChart(projects, searchBar, projectsContainer);
  } else {
    projectsContainer.innerHTML = '<p>No projects found.</p>';
  }

  if (searchBar && projectsContainer && projects) {
    searchBar.addEventListener('input', (event) => {
      const query = event.target.value.toLowerCase();
      const filteredProjects = projects.filter((project) => {
        const title = project.title ? project.title.toLowerCase() : "";
        const description = project.description ? project.description.toLowerCase() : "";
        return title.includes(query) || description.includes(query);
      });
      renderProjects(filteredProjects, projectsContainer, 'h2');
      // Update pie chart with filtered data
      renderPieChart(filteredProjects, searchBar, projectsContainer);
    });
  }

  // GitHub stats
  const githubData = await fetchGitHubData('ssirimilla');
  const profileStats = document.querySelector('#profile-stats');

  if (profileStats && githubData) {
    profileStats.innerHTML = `
      <dl>
        <dt>Repos</dt><dd>${githubData.public_repos || 0}</dd>
        <dt>Followers</dt><dd>${githubData.followers || 0}</dd>
        <dt>Following</dt><dd>${githubData.following || 0}</dd>
        <dt>Gists</dt><dd>${githubData.public_gists || 0}</dd>
      </dl>
    `;
  }
}

init();