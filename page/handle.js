// Generated by CoffeeScript 1.4.0
var delay, get_time, load_task, log, make_item, prepare, q, read_time, tasks, update, view, viewing;

log = function() {
  var _ref;
  return typeof console !== "undefined" && console !== null ? (_ref = console.log) != null ? typeof _ref.apply === "function" ? _ref.apply(console, arguments) : void 0 : void 0 : void 0;
};

delay = function(f, t) {
  return setTimeout(t, f);
};

q = function(query) {
  return document.querySelector(query);
};

tasks = [];

view = "";

prepare = "";

read_time = function() {
  var d, h, m, mm, now;
  now = new Date;
  m = now.getMonth() + 1;
  d = now.getDate();
  h = now.getHours();
  mm = now.getMinutes();
  return "" + m + "-" + d + " " + h + ":" + mm;
};

get_time = function() {
  return new Date().getTime().toString();
};

update = function() {
  var count, key, value;
  localStorage.tasks = JSON.stringify(tasks);
  count = 0;
  for (key in tasks) {
    value = tasks[key];
    if (value.status.match(/wait/)) {
      count += 1;
    }
  }
  if (count > 20) {
    (q("#outline")).innerText = "As many as " + count + " tasks here";
  } else if (count > 1) {
    (q("#outline")).innerText = "You have " + count + " tasks left";
  } else if (count === 1) {
    (q("#outline")).innerText = "Last " + count + " tasks";
  } else {
    (q("#outline")).innerText = "Great!";
  }
  return (q("title")).innerText = "" + count + " left";
};

load_task = function() {
  try {
    tasks = JSON.parse(localStorage.tasks);
  } catch (err) {
    tasks = {};
  }
  update();
  return tasks;
};

make_item = function(data) {
  return lilyturf.dom(function() {
    return this.div({
      "class": "task",
      id: data.id
    }, this.div({
      "class": "title"
    }, this.text(data.title)), this.div({
      "class": "more"
    }, this.span({}, this.text(data.time)), data.tag != null ? this.span({}, this.text(data.tag)) : void 0, data.status.match(/wait/) != null ? this.span({
      "class": "done"
    }, this.text("done")) : data.status.match(/done/) != null ? this.span({
      "class": "failed"
    }, this.text("failed")) : void 0, this.span({
      "class": "detail"
    }, this.text("detail"))));
  });
};

viewing = function(elem) {
  var last;
  last = q(".viewing");
  if (last != null) {
    last.className = "";
  }
  return elem.className = "viewing";
};

window.onload = function() {
  var add, all, cancel, content, done, edit_item, editor, filter_tag, render, save, save_task, search, tag, tags, title, todo, wait;
  load_task();
  todo = q("#todo");
  tags = q("#tags");
  editor = q("#editor");
  title = q("#title");
  tag = q("#tag");
  content = q("#content");
  save = q("#save");
  cancel = q("#cancel");
  all = q("#all");
  done = q("#done");
  add = q("#add");
  wait = q("#wait");
  search = q("#search");
  save_task = function() {
    var data;
    data = {
      title: title.value.trim(),
      tag: tag.value.trim(),
      content: content.value.trim(),
      id: prepare,
      time: read_time(),
      status: "wait"
    };
    if (data.title.length > 3) {
      tasks[data.id] = data;
      update();
      render(/wait/);
      editor.style.left = "-540px";
      title.value = "";
      tag.value = "";
      return content.value = "";
    }
  };
  render = function(query) {
    var data, key;
    todo.innerHTML = "";
    for (key in tasks) {
      data = tasks[key];
      if (data.status.match(query)) {
        todo.appendChild(make_item(data));
      }
    }
    if (todo.innerHTML.trim() === "") {
      return todo.appendChild(lilyturf.dom(function() {
        return this.div({
          "class": "empty"
        }, this.text("Empty"));
      }));
    }
  };
  filter_tag = function(query) {
    var data, key;
    todo.innerHTML = "";
    for (key in tasks) {
      data = tasks[key];
      if (data.title.match(query)) {
        todo.appendChild(make_item(data));
      } else if (data.tag.match(query)) {
        todo.appendChild(make_item(data));
      } else if (data.content.match(query)) {
        todo.appendChild(make_item(data));
      }
    }
    if (todo.innerHTML.trim() === "") {
      return todo.appendChild(lilyturf.dom(function() {
        return this.div({
          "class": "empty"
        }, this.text("Empty"));
      }));
    }
  };
  edit_item = function(data) {
    log(data);
    prepare = data.id;
    title.value = data.title;
    tag.value = data.tag;
    content.value = data.content;
    return editor.style.left = "0px";
  };
  save.onclick = function() {
    return save_task();
  };
  all.onclick = function() {
    viewing(this);
    view = "all";
    render(/(?:)/);
    return editor.style.left = "-540px";
  };
  done.onclick = function() {
    viewing(this);
    view = "done";
    render(/done/);
    return editor.style.left = "-540px";
  };
  add.onclick = function() {
    prepare = get_time();
    title.value = "";
    tag.value = "";
    content.value = "";
    editor.style.left = "0px";
    return (q("#title")).focus();
  };
  cancel.onclick = function() {
    return editor.style.left = "-540px";
  };
  wait.onclick = function() {
    viewing(this);
    view = "wait";
    return render(/wait/);
  };
  search.addEventListener("input", function() {
    return filter_tag(RegExp(this.value));
  });
  wait.click();
  return todo.onclick = function(click) {
    var elem, id;
    elem = click.target;
    if (elem.className === "done") {
      id = elem.parentNode.parentNode.id;
      tasks[id].status = "done";
      update();
      return render(/wait/);
    } else if (elem.className === "failed") {
      id = elem.parentNode.parentNode.id;
      tasks[id].status = "wait";
      update();
      return render(/wait/);
    } else if (elem.className === "detail") {
      id = elem.parentNode.parentNode.id;
      prepare = get_time();
      edit_item(tasks[id]);
      return (q("#title")).focus();
    }
  };
};
