/* v1_s2 v1_15 */

let colrs = [ /* Pale tone */
  "#F5B090", "#FCD7A1", "#FFF9B1", "#D7E7AF", "#A5D4AD", "#A2D7D4",
  "#9FD9F6", "#A3BCE2", "#A59ACA", "#CFA7CD", "#F4B4D0", "#F5B2B2",
];

function add_colrs() {
  let css_sh = document.createElement("style"); 
  css_sh.type = "text/css"; 
  document.getElementsByTagName("head").item( 0 ).appendChild(css_sh);

  bg_n = (c, n) => `.bg_${n} {background-color: ${c};}`;
  bg_fst_n = (c, n) => `.bg_fst_${n} {
    background-image: linear-gradient(to bottom right,
    ${c} 0%, ${c} 50%, white 50%, white 100%);
  }`;
  bg_n_mix = (c, n) => `.bg_${n}_mix {
    background-image: linear-gradient(to bottom right,
    ${c} 0%, ${c} 50%, ${colrs[1]} 50%, ${colrs[1]} 100%);
  }`;
  bg_snd_n = (c, n) => `.bg_snd_${n} {
    background-image: linear-gradient(to bottom right,
    white 0%, white 50%, ${c} 50%, ${c} 100%);
  }`;
  bg_mix_n = (c, n) => `.bg_mix_${n} {
    background-image: linear-gradient(to bottom right,
    ${c} 0%, ${c} 50%, ${colrs[0]} 50%, ${colrs[0]} 100%);
  }`;
  bg_fst = `.bg_fst {
    background-image: linear-gradient(to bottom right,
    ${colrs[0]} 0%, ${colrs[0]} 50%, white 50%, white 100%);
  }`;
  bg_snd = `.bg_snd {
    background-image: linear-gradient(to bottom right,
    white 0%, white 50%, ${colrs[1]} 50%, ${colrs[1]} 100%);
  }`;
  bg_com = `.bg_com, .bg_goal {background-color: ${colrs[10]};}`;
  bg_mix = `.bg_mix {
    background-image: linear-gradient(to bottom right,
    ${colrs[0]} 0%, ${colrs[0]} 50%, ${colrs[1]} 50%, ${colrs[1]} 100%);
  }`;
  bg_goal_fst = `.bg_com_fst, .bg_goal_fst {
    background-image: linear-gradient(to bottom right,
    ${colrs[10]} 0%, ${colrs[10]} 50%, white 50%, white 100%);
  }`;
  bg_goal_snd = `.bg_com_snd, .bg_goal_snd {
    background-image: linear-gradient(to bottom right,
    white 0%, white 50%, ${colrs[10]} 50%, ${colrs[10]} 100%);
  }`;
  let my_css = document.styleSheets.item(document.styleSheets.length - 1);
  my_css.insertRule(bg_fst, my_css.cssRules.length);
  my_css.insertRule(bg_snd, my_css.cssRules.length);
  my_css.insertRule(bg_com, my_css.cssRules.length);
  my_css.insertRule(bg_mix, my_css.cssRules.length);
  my_css.insertRule(bg_goal_fst, my_css.cssRules.length);
  my_css.insertRule(bg_goal_snd, my_css.cssRules.length);
  colrs.forEach((c, i) => {
    let n = (i + 1).toString();
    n = n.replace("10","a").replace("11","b").replace("12","c");
    my_css.insertRule(bg_n(c, n), my_css.cssRules.length);
    my_css.insertRule(bg_fst_n(c, n), my_css.cssRules.length);
    my_css.insertRule(bg_n_mix(c, n), my_css.cssRules.length);
    my_css.insertRule(bg_snd_n(c, n), my_css.cssRules.length);
    my_css.insertRule(bg_mix_n(c, n), my_css.cssRules.length);
  });
};

function add_mix(n, m) {
  n_ix = parseInt(
           n.replace("a","10").replace("b","11").replace("c","12")
         ) - 1;
  m_ix = parseInt(
           m.replace("a","10").replace("b","11").replace("c","12")
         ) - 1;
  rule = `.bg_${n}_${m} {
    background-image: linear-gradient(to bottom right,
      ${colrs[n_ix]} 0%, ${colrs[n_ix]} 50%,
      ${colrs[m_ix]} 50%, ${colrs[m_ix]} 100%);
  }`;

  let my_css = document.styleSheets.item(document.styleSheets.length - 1);
  my_css.insertRule(rule, my_css.cssRules.length);
};

function table_show( target_sel) {
  console.log(target_sel);
  if (! get_target(target_sel)) {return null};

  let main_div = document.createElement("div");
  main_div.align = "left";

  let table = document.createElement("table");
  table.classList.add("board");
  let caption = document.createElement("caption");
  let cap_div = document.createElement("div");
  caption.appendChild(cap_div);
  let board = document.createElement("tbody");
  table.appendChild(caption);
  table.appendChild(board);
  main_div.appendChild(table);

  let target = get_target(target_sel);
  target.appendChild(main_div);

  for (let i = 0; i < 9; i++) {
    let tr = document.createElement("tr");
    for (let j = 0; j < 9; j++) {
      let td = document.createElement("td");
      tr.appendChild(td);
    }
    board.appendChild(tr);
  }

  return true;
};

function get_target(target_sel) {
  return document.querySelector(target_sel);
};

function get_cap_div (target_sel, sel="caption div") {
  return get_target(target_sel).querySelector(sel);
};

function get_cell_form () {
  return "(?:[.0?1-9]|\\[[\\w ().?#!_+-]*(?:,[\\w ().?#!_+-]*)?\\])";
};

function add_candi (td, q) {
  if (! q) {return;};
  rm_candi(td); 

  let span = document.createElement("span");
  let marks = q.slice(1, -1).split(",");
  marks = marks.map(txt => {
    txt = txt.replaceAll(" ", "\u00A0");
    return txt;
  });
  if (marks.length == 1) {
    let fst = document.createElement("span");
    if (marks[0][0] == "!") {
      marks[0] = marks[0].slice(1);
      fst.classList.add("com");
    }
    fst.classList.add("left");
    fst.textContent = marks[0];
    td.appendChild(fst);
  } else {
    let fst = document.createElement("span");
    if (marks[0][0] == "#") {
      marks[0] = marks[0].slice(1);
    } else {
      fst.classList.add("fst");
    };
    fst.classList.add("left");
    fst.textContent = marks[0];
    td.appendChild(fst);
    let br = document.createElement("br");
    td.appendChild(br);
    let snd = document.createElement("span");
    if (marks[1][0] == "#") {
      marks[1] = marks[1].slice(1);
    } else {
      snd.classList.add("snd");
    };
    snd.classList.add("left");
    snd.textContent = marks[1];
    td.appendChild(snd);
  }
};

function rm_candi (td) {
  while (td.firstChild) {
    td.removeChild(td.lastChild);
  }
};

function q_show(target_sel, q) {
  if (! q) {return;};

  let q_arr = q.match(new RegExp(get_cell_form(), "g"));

  let target = get_target(target_sel);
  let tds = target.querySelectorAll("table.board td");

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      let p = 9 * i + j;
      let td = tds[p];
      if (q_arr[p] == ".") {
        ;
      } else if (q_arr[p].length == 1) {
        td.textContent = q_arr[p];
      } else {
        add_candi(td, q_arr[p]);
      }
    }
  }
  tds.forEach(td => td.style.padding = "0px");
};

let last_target_sel = '';
let last_bg = {};

function bg_show(target_sel, bg, show=true) {
  if (! target_sel || ! bg || show === null) {return};

  if (show) {
    bg_show(last_target_sel, last_bg, false);
    last_target_sel = target_sel;
    last_bg = structuredClone(bg);
  };

  let target = get_target(target_sel);
  Object.keys(bg).map(cls => {
    to_ixs(bg[cls]).map(ix => {
      let sel = "table.board tr:nth-child(" + ix[1] + ") td:nth-child(" + ix[2] + ")"
      td = target.querySelector(sel);
      r_cls = cls[0] == "." ? cls.slice(1) : "bg_" + cls ;
      if (show) {
        td.classList.add(r_cls);
        add_candi(td, ix[0]);
      } else {
        td.classList.remove(r_cls);
        if (ix[0]) {rm_candi(td);};
      };
    });
  });
};

function obj_to_str (obj) {
  return [
    "{",
    Object.entries(obj).map(([k, v]) => `'${k}': '${v}'`).join(', '),
    "}"
  ].join("");
}

let last_btn = undefined;

function btn_toggle (btn, ev) {
  if (ev != 'click' && last_btn !== undefined) {return null};
  if (ev == 'click') {
    if (last_btn && last_btn != btn
          && last_btn.classList.contains('active')) {
      last_btn.classList.toggle('active');
    };
    last_btn = btn.classList.contains('active') ? undefined : btn;
    btn.classList.toggle('active');
  };
  return btn.classList.contains('active') || ev == 'enter';
};

function make_btns (cap, btn_bg) {
  btn_form = new RegExp(`<btns_(\\w+)\\s+(\\w+)>(.*?)<\/>`, "i");
  cap_new = "";
  while (cap) {
    pos = cap.search(btn_form);
    if (pos == -1) {break};
    cap_new += cap.slice(0, pos);
    cap = cap.slice(pos);

    m = cap.match(btn_form); /* 1:tag name 2:color 3:text*/
    m[1] = "btns_" + m[1];
    m[3] = m[3].trim();
    if (btn_bg[m[1]]) {
      bgs = btn_bg[m[1]];
      bgs_len = bgs.length;
      bg_sum = {};
      txts = (m[3].length == 0 ? "S|&gt;|E" : m[3]).split("|");
      switch(txts.length) {
        case 1: txts = [m[3], "&gt", "E"]; break;
        case 2: txts.splice(1, 0, "&gt;"); break;
        default: break;
      }; /* txts: [start, middle, end] */
      txt = n => n == 0 ? txts[0] : n == bgs_len - 1 ? txts[2] : txts[1];
      Array.from(bgs).forEach((bg, n) => {
        b_txt = "txt" in bg ? bg["txt"] : txt(n);
        cap_new += `<${m[1]}_${n} ${m[2]}>${b_txt}</>`;
        if ("init" in bg) {bg_sum = bgs[0]};
        bg_sum = rm_dup(bg_sum, bg);
        bg_sum = {...bg_sum, ...bg};
        btn_bg[`${m[1]}_${n}`] = bg_sum;
      });
    };

    pos = cap.search(/<\/>/);
    cap = cap.slice(pos + 3);
  }
  return [cap_new + cap, btn_bg];
};

function cap_show(target_sel, btn_bg={}, cap, cap_div=undefined) {
  /* default if undefined is passed */
  if (! cap) {return;};

  [cap, btn_bg] = make_btns(cap, btn_bg);

  Object.entries(btn_bg).map(([k, v]) => {
    cap = cap.replaceAll(
      new RegExp(`<${k}\\s+(\\w+)>(.*?)<\/>`, "gi"),
      `<button class="btn bg_$1"
         onmouseover="javascript:bg_show(\'${target_sel}\', ${obj_to_str(v)}, btn_toggle(this,\'enter\'));"
         onmouseout="javascript:bg_show(\'${target_sel}\', ${obj_to_str(v)}, btn_toggle(this,\'leave\'));"
         onClick="javascript:bg_show(\'${target_sel}\', ${obj_to_str(v)}, btn_toggle(this,\'click\'));"
       >$2</button>`
    );
  });
  cap = cap.replace(/<(fst|snd|com|bg_.*?)>/g, "<span class=\"$1\">");
  cap = cap.replace(/<\/(fst|snd|com|bg_.*?)?>/g, "</span>");
  cap = cap.replace(/<_br>/g, "<span class=\"br\">&emsp;</span>");

  if (cap_div === undefined) {cap_div = get_cap_div(target_sel);};
  cap_div.innerHTML = cap;
};

function to_ixs (rc_str) {
  let ixs = [];
  let ixs_form = get_cell_form() + "?r\\d+c\\d+";
  let rc_arr = rc_str.match(new RegExp(ixs_form, "gi"));
  if (rc_arr) {
    rc_arr.map(rc => {
      let q = rc.match(new RegExp(get_cell_form()+"?", "i")).join("");
      let r_str = rc.match(new RegExp("r\\d+", "i")).join("");
      let r_arr = r_str.match(new RegExp("\\d", "g"));
      let c_str = rc.match(new RegExp("c\\d+", "i")).join("");
      let c_arr = c_str.match(new RegExp("\\d", "g"));
      r_arr.map(r => c_arr.map(c => ixs.push([q, r, c])));
    });
  };
  return ixs;
}

function rm_dup (bg_sum, bg) {
  let ixs_form = get_cell_form() + "?(r\\d+c\\d+)";

  let rc_elim = [];
  Object.entries(bg).map(([key, rc_str]) => {
    let rc_arr = rc_str.match(new RegExp(ixs_form, "gi"));
    rc_arr = (rc_arr ? rc_arr : []).map(
      rc => rc.replace(new RegExp(ixs_form, "gi"), "$1")
    );
    rc_elim = rc_elim.concat(rc_arr.map(
      rc => new RegExp(`${get_cell_form()}?${rc}`, "gi")
    ));
  });

  let bg_sum_new = {};
  let bg_sum_arr = Object.entries(bg_sum);
  bg_sum_arr.forEach(([k, v]) => {
    rc_elim.forEach(e => v = v.replace(e, ""));
    bg_sum_new[k] = v;
  });

  return bg_sum_new;
};

function q_str (q, sep = "") {
  if (! q) {return null};

  const cell_form = "([.0?1-9]|\\[[\\w ().?#!_+-]*(,[\\w ().?#!_+-]*)?\\])";
  let q_arr = q.match(new RegExp(cell_form, "g"));
  let q_str = q_arr.map(c => c.match(/^[1-9]$/) ? c : ".").join("");

  return q_str.replace(/(.........)/g, "$1" + sep);
};
