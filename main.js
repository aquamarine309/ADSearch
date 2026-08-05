const input = $("#input");
const btn = $("#btn");
const list = $("#list");
const copyBtn = $("#copy");
const percentsBtn = $("#percents");

let needCopy = copyBtn.prop("checked");

copyBtn.click(function(el) {
  needCopy = el.target.checked;
});

let showPercents = copyBtn.prop("checked");

function formatRow(x, max = 40) {
  if (x.length <= max) return x;
  return x.slice(0, max - 3) + "...";
}

percentsBtn.click(function(el) {
  showPercents = el.target.checked;
});

const worker = new Worker("gen.js");

const loading = $("<div>搜索中...</div>");

btn.click(function(context) {
  list.empty();
  list.append(loading);
  worker.postMessage(input.val().replace(/\s*\n\s*/g, " "));
});

worker.onmessage = function(e) {
  list.empty();
  for (const item of e.data) {
    const el = $(
      `<div class="item">
        ${showPercents ? 
          `<span class="index">
            ${(100 - item.score * 100).toFixed(1)}%
          </span>` : ""}
        <span class="key">
            [${formatRow(item.item.n)}]
        </span>
        <span>
          ${item.item.e}
        </span>
        <hr>
        <span>${item.item.c}</span>
      </div>`
    );
    el.click(() => needCopy && copyToClipboard(item.item.c.replace(/<(.+?)>/g, "")));
    list.append(el);
  }
  if (e.data.length === 0) {
    list.append($("<div>搜索结果不存在</div>"))
  }
}

worker.onerror = function(e) {
  console.log(e.message);
}

window.copyToClipboard = (function() {
  let el = document.createElement('textarea');
  document.body.appendChild(el);
  el.style.position = "absolute";
  el.style.left = '-9999999px';
  el.setAttribute('readonly', '');
  return function(str) {
    try {
      el.value = str;
      el.select();
      return document.execCommand('copy');
    } catch (ex) {
      console.log(ex);
      return false;
    }
  };
}());

// const f = (x, ...y) => x.replace(/\%(\d)\$s/g, (_, a) => y[a - 1]);

const j = k => k.match(/\$\{(.+?)\}/g);

const f = x => x === 0 ? 1 : x * f(x - 1);

const c = (n, r) => f(n) / r.reduce((x, y) => x * f(y), 1);




function convertToSum(value, len) {
  if (len === 2) return new Array(value - 1).fill(0).map((_, x) => [x + 1, value - x - 1]);
  const result = [];
  for (let i = 1; i < value; i++) {
    const k = convertToSum(value - i, len - 1);
    for (const m of k) {
      result.push([i, ...m]);
    }
  }
  
  return result;
}

/*const n = 6365;
const t = 6365;

const r = new Array(n * t + 1).fill(0);

const u = convertToSum(n, t);

let isHigher = new Array(n * t + 1).fill(false);

for (const e of u) {
  const l = c(n, e);
  const p = e.reduce((x, y, z) => x + y * (z + 1), 0);
  r[p] += l;
  isHigher[p] = r[p] > 114514;
  if (isHigher.filter(x => x).length > 100) break;
}

console.log(r.includes(114514)) */

let r = 0;

/*for (let i = 1; i < 6365; i++) {
  let a = 1;
  for (let j = 1; j <= i; j++) {
    a *= (6 + j) / j;
  }
  r += a;
}*/

console.log(r);

