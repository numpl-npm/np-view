/* v1_10 */

function table_show( target_id) {
  console.log(target_id);
  if (! document.getElementById(target_id)) {return null};

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

  let target = get_target( target_id );
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

function get_target(target_id) {
  let targets = document.querySelectorAll("#" + target_id);
  return targets[targets.length - 1];
};

function get_cap_div (target_id, sel="caption div") {
  return get_target(target_id).querySelector(sel);
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

function q_show(target_id, q) {
  if (! q) {return;};

  let q_arr = q.match(new RegExp(get_cell_form(), "g"));

  let target = get_target(target_id);
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

function bg_show(target_id, bg, show=true) {
  if (! bg) {return;};
  let target = get_target(target_id);
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

function fx (btn, ev) {
  if (ev == 'click') {
    btn.classList.toggle('active')
  };
  return btn.classList.contains('active') || ev == 'enter';
};

function cap_show(target_id, btn_bg={}, cap, cap_div=undefined) {
  /* default if undefined is passed */
  if (! cap) {return;};

  Object.entries(btn_bg).map(([k, v]) => {
    cap = cap.replaceAll(
      new RegExp(`<${k}\\s+(\\w+)>(.*?)<\/>`, "g"),
      `<button class="btn bg_$1"
         onmouseover="javascript:bg_show(\'${target_id}\', ${obj_to_str(v)}, fx(this,\'enter\'));"
         onmouseout="javascript:bg_show(\'${target_id}\', ${obj_to_str(v)}, fx(this,\'leave\'));"
         onClick="javascript:bg_show(\'${target_id}\', ${obj_to_str(v)}, fx(this,\'click\'));"
       >$2</button>`
    );
  });
  cap = cap.replace(/<(fst|snd|com|bg_.*?)>/g, "<span class=\"$1\">");
  cap = cap.replace(/<\/(fst|snd|com|bg_.*?)?>/g, "</span>");

  if (cap_div === undefined) {cap_div = get_cap_div(target_id);};
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

function q_str (q, sep = "") {
  if (! q) {return null};

  const cell_form = "([.0?1-9]|\\[[\\w ().?#!_+-]*(,[\\w ().?#!_+-]*)?\\])";
  let q_arr = q.match(new RegExp(cell_form, "g"));
  let q_str = q_arr.map(c => c.match(/^[1-9]$/) ? c : ".").join("");

  return q_str.replace(/(.........)/g, "$1" + sep);
};
