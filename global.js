console.log("IT'S ALIVE!");

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// ---------------- NAV ----------------
let pages = [
  { url: "/", title: "Home" },
  { url: "/projects/", title: "Projects" },
  { url: "/contact/", title: "Contact" },
  { url: "/resume/", title: "Resume" },
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