console.log("IT'S ALIVE!");

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// ---------------- NAV ----------------
let pages = [
  { url: "", title: "Home" },
  { url: "projects/", title: "Projects" },
  { url: "contact/", title: "Contact" },
  { url: "https://github.com/ssirimilla", title: "GitHub" },
];

const BASE_PATH =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "/"
    : "/portfolio/"; // change this

let nav = document.createElement("nav");
document.body.prepend(nav);

for (let p of pages) {
  let url = !p.url.startsWith("http") ? BASE_PATH + p.url : p.url;

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

