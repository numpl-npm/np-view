function v_show( target_id, v ) {
  console.log(target_id);
  if (! document.getElementById(target_id)) {return null};

  const cell_form = "([.0?1-9]|\\[[\\w ().?#!_+-]*(,[\\w ().?#!_+-]*)?\\])";
  let q_arr = v.q.match(new RegExp(cell_form, "g"));
  if (! q_arr) {return null};

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

  let targets = document.querySelectorAll("#" + target_id);
  let target = targets[targets.length - 1];

  target.appendChild(main_div);

  for (let i = 0; i < 9; i++) {
    let tr = document.createElement("tr");
    for (let j = 0; j < 9; j++) {
      let td = document.createElement("td");
      tr.appendChild(td);
      let p = 9 * i + j;
      if (q_arr[p] == ".") {
        td.textContent = null;
      } else if (q_arr[p].length == 1) {
        td.textContent = q_arr[p];
      } else {
        let span = document.createElement("span");
        let marks = q_arr[p].slice(1, -1).split(",");
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
      }
    }
    board.appendChild(tr);
  }

  let tags = target.querySelectorAll("table.board td");
  tags.forEach((tag)=>{tag.style.padding = "0px";})

  if (v.c) {
    let a_cap = v.c;
    a_cap = a_cap.replace(/<(fst|snd|com|bg_.*?)>/g, "<span class=\"$1\">");
    a_cap = a_cap.replace(/<\/(fst|snd|com|bg_.*?)?>/g, "</span>");
    cap_div.innerHTML = a_cap;
  };

  if (v.bg) {
    Object.keys(v.bg).map(cls => {
      to_ixs(v.bg[cls]).map(ix => {
        let sel = "table.board tr:nth-child(" + ix[0] + ") td:nth-child(" + ix[1] + ")"
        tag = target.querySelector(sel);
        tag.classList.add("bg_" + cls);
      });
    });
  };

  return true;
};

function to_ixs (rc_str) {
  let ixs = [];
  let rc_arr = rc_str.match(new RegExp("(r\\d+c\\d+)", "gi"));
  if (rc_arr) {
    rc_arr.map(rc => {
      let r_str = rc.match(new RegExp("r\\d+", "i")).join("");
      let r_arr = r_str.match(new RegExp("\\d", "g"));
      let c_str = rc.match(new RegExp("c\\d+", "i")).join("");
      let c_arr = c_str.match(new RegExp("\\d", "g"));
      r_arr.map(r => c_arr.map(c => ixs.push([r, c])));
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
