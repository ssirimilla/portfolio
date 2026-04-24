console.log("IT'S ALIVE!");

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// ---------------- NAV ----------------
let pages = [
  { url: "/portfolio/", title: "Home" },
  { url: "/portfolio/projects/", title: "Projects" },
  { url: "/portfolio/contact/", title: "Contact" },
  { url: "/portfolio/resume/", title: "Resume" },
  { url: "https://github.com/ssirimilla", title: "GitHub" },
];



let nav = document.createElement("nav");
document.body.prepend(nav);

for (let p of pages) {
  let url = p.url;

  let a = document.createElement("a");
  a.href = url;
  a.textContent = p.title;

  a.classList.toggle(
    "current",
    a.host === location.host && a.pathname === location.pathname
  );

  a.toggleAttribute("target", a.host !== location.host);

  nav.append(a);
}

let select = document.createElement("select");
select.className = "color-scheme";

select.innerHTML = `
  <option value="light dark">Auto</option>
  <option value="light">Light</option>
  <option value="dark">Dark</option>
`;

select.value = localStorage.colorScheme || "light dark";

select.addEventListener("change", () => {
  document.documentElement.style.colorScheme = select.value;
  localStorage.colorScheme = select.value;
});

// apply saved preference on load
document.documentElement.style.colorScheme = select.value;

document.body.append(select);


// __________--___________---__--_-__-_-_-_____----___----_---_-____---___--_--__-----_----

export async function fetchJSON(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch JSON: ${response.statusText}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error fetching JSON:", error);
  }
}

export function renderProjects(projects, containerElement, headingLevel = "h2") {
  containerElement.innerHTML = "";

  for (const project of projects) {
    const article = document.createElement("article");

    article.innerHTML = `
      <${headingLevel}>${project.title}</${headingLevel}>
      <img src="${project.image}" alt="${project.title}">
      <p>${project.description}</p>
    `;

    containerElement.appendChild(article);
  }
}