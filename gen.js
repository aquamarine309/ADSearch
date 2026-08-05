importScripts("map.js", "fuse.js");

const m = map.map(x => ({
  c: x.c.replace(/\{(\d)\}/g, (_, x) => x === "1" ? "{value}" : `{value${x}}`).replace(/\n/g, "\\n").replace(/^"(.+)"$/gui, "$1"),
  e: x.e.replace(/\{(\d)\}/g, (_, x) => x === "1" ? "{value}" : `{value${x}}`).replace(/\n/g, "\\n").replace(/^"(.+)"$/gui, "$1"),
  n: x.n
}));

const fuse = new Fuse(m, { keys: ["n", "e", "c"], includeScore: true });

const cache = new Map();

function simpleSearch(x) {
  const list = [];
  for (const item of m) {
    if (item.e.toLowerCase().replace(/\s/g, "").includes(x.toLowerCase().replace(/\s/g, "")) ||
    item.c.includes(x)) {
      list.push({ item, score: 1 - x.length / item.e.length });
    }
  }
  if (list.length === 0) return fuse.search(x, { limit: 10 });
  list.sort((a, b) => a.score - b.score);
  return list.slice(0, 10);
}

onmessage = function(e) {
  const data = e.data;
  if (cache.has(data)) {
    postMessage(cache.get(data));
    return;
  }
  function mapFn(x) {
    x = x.replace(/\%(\d)\$\w/g, (m, n) => t[n - 1])
          .replace(new RegExp(value.replace(/([\+\$\.\^\(\)\{\}\[\]\*\?\\\|])/g, "\\$1"), "gui"),
            m => `<span class="highlight">${m}</span>`)
          .replace(/undefined/g,
            m => `<span class="undefined">【数值】</span>`);
    if (useBr) return x.replace(/\\n/g, "<br>");
    return x;
  }
  let x = 1;
  const t = [];
  let value = data.replace(/\.{3}/g, "…").replace(/(\$\{(.+?)\})|(\{\{(.+?)\}\})/g, m => { t.push(m); return `%${x++}$s` });
  const useBr = value.includes("<br>");
  if (useBr) value = value.replace(/<br>\n*/, "\\n");
  const result = simpleSearch(value).map(x => ({
    item: {
      c: mapFn(x.item.c),
      e: mapFn(x.item.e),
      n: x.item.n
    },
    score: x.score
  }));
  cache.set(data, result);
  postMessage(result);
}