const input = $("#input");
const btn = $("#btn");
const list = $("#list");
const copyBtn = $("#copy");
const percentsBtn = $("#percents");

const fuse = new Fuse(map, {keys:["e", "c"], includeScore: true});

let needCopy = copyBtn.prop("checked");

copyBtn.click(function(el) {
  needCopy = el.target.checked;
});

let showPercents = copyBtn.prop("checked");

percentsBtn.click(function(el) {
  showPercents = el.target.checked;
});

btn.click(function(context) {
  const value = input.val();
  list.empty();
  const s = fuse.search(value, {limit: 10});
  for (const item of s) {
    const el = $(
      `<div class="item">${showPercents ? `<span class="index">${(100 - item.score * 100).toFixed(1)}%</span>` : ""}<span>${item.item.e.replace(new RegExp(value, "gui"), m => `<span class="highlight">${m}</span>`)}</span><hr><span>${item.item.c.replace(new RegExp(value, "gui"), m => `<span class="highlight">${m}</span>`)}</span></div>`
    );
    el.click(() => needCopy && copyToClipboard(item.item.c));
    list.append(el);
  }
  if (s.length === 0) {
    list.append($("<div>搜索结果不存在</div>"))
  }
});

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
    } catch(ex) {
      console.log(ex);
      return false;
    }
  };
}());