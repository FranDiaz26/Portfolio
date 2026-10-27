// Menú móvil
const btn = document.querySelector(".menu-btn");
const menu = document.querySelector(".menu");
btn.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  btn.setAttribute("aria-expanded", open);
});
menu.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    menu.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
  })
);
 
document.documentElement.classList.add("anim");
 
// Link activo + indicador que se desliza por el menú al ir bajando
const links = [...menu.querySelectorAll("a:not(.nav-cta)")];
const ind = document.createElement("span");
ind.className = "indicator";
menu.prepend(ind);
let current = null;
function moveInd(l) {
  if (!l) { ind.style.opacity = 0; return; }
  ind.style.cssText = `opacity:1;left:${l.offsetLeft}px;top:${l.offsetTop}px;width:${l.offsetWidth}px;height:${l.offsetHeight}px`;
}
const spy = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      current = links.find((l) => l.getAttribute("href") === "#" + e.target.id) || null;
      links.forEach((l) => l.classList.toggle("active", l === current));
      moveInd(current);
    }),
  { rootMargin: "-45% 0px -50% 0px" }
);
document.querySelectorAll("main section[id]").forEach((s) => spy.observe(s));
window.addEventListener("resize", () => moveInd(current));
 
// El subrayado de cada título se dibuja al llegar a la sección
const titles = new IntersectionObserver((entries, obs) =>
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in-view"); obs.unobserve(e.target); } }),
  { threshold: 0.2 }
);
document.querySelectorAll(".section").forEach((s) => titles.observe(s));
 
// Aparición suave de elementos al hacer scroll
const targets = document.querySelectorAll(".hero-text > *, .hero-card, .section h2, .card, .project, .contact");
targets.forEach((el) => el.classList.add("reveal"));
document.querySelectorAll(".grid-3").forEach((g) => [...g.children].forEach((c, i) => c.style.setProperty("--d", i * 0.12 + "s")));
document.querySelectorAll(".hero-text > *").forEach((c, i) => c.style.setProperty("--d", i * 0.08 + "s"));
const rev = new IntersectionObserver((entries, obs) =>
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const delay = parseFloat(el.style.getPropertyValue("--d")) || 0;
    el.classList.add("visible");
    obs.unobserve(el);
    // Al terminar se quita la clase para que el hover funcione normal
    setTimeout(() => { el.classList.remove("reveal", "visible"); el.style.removeProperty("--d"); }, 900 + delay * 1000);
  }),
  { threshold: 0.15 }
);
targets.forEach((el) => rev.observe(el));
 
// Barra de progreso de lectura
const bar = document.createElement("div");
bar.className = "progress";
document.body.prepend(bar);
const onScroll = () => {
  const h = document.documentElement;
  bar.style.transform = `scaleX(${h.scrollTop / (h.scrollHeight - h.clientHeight || 1)})`;
};
addEventListener("scroll", onScroll, { passive: true });
onScroll();
 
// Barras de habilidades: se llenan al entrar en pantalla
const bars = document.querySelector(".bars");
if (bars) {
  new IntersectionObserver((entries, obs) => {
    if (entries[0].isIntersecting) {
      bars.classList.add("in");
      obs.disconnect();
    }
  }, { threshold: 0.4 }).observe(bars);
}
 
// Capturas: centradas y con fondo difuminado; si falta una, se ve el marco con su texto
document.querySelectorAll(".mock-screen img").forEach((img) => {
  const box = img.parentElement;
  const ok = () => {
    box.style.setProperty("--img", `url("${img.currentSrc || img.src}")`);
    box.classList.add("loaded");
  };
  if (img.complete && img.naturalWidth) ok();
  else img.addEventListener("load", ok);
  img.addEventListener("error", () => img.remove());
});
 
// Formulario: valida y abre el correo con el mensaje armado
const form = document.getElementById("form");
const msg = form.querySelector(".form-msg");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  let valid = true;
  form.querySelectorAll("input, textarea").forEach((f) => {
    const ok = f.value.trim() && (f.type !== "email" || /^\S+@\S+\.\S+$/.test(f.value));
    f.classList.toggle("error", !ok);
    if (!ok) valid = false;
  });
  if (!valid) {
    msg.className = "form-msg err";
    msg.textContent = "Completá todos los campos con un email válido.";
    return;
  }
  const subject = encodeURIComponent("Contacto desde tu portfolio - " + data.get("nombre"));
  const body = encodeURIComponent(data.get("mensaje") + "\n\n" + data.get("nombre") + " (" + data.get("email") + ")");
  window.location.href = "mailto:franciscoexequieldiaz482@gmail.com?subject=" + subject + "&body=" + body;
  msg.className = "form-msg ok";
  msg.textContent = "Se abrió tu aplicación de correo con el mensaje listo para enviar.";
  form.reset();
});
 