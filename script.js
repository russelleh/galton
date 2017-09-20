function draw(context, node, depth, index, h) {
  if (node.extant) {
    context.fillStyle = "hsl(" + node.hue * 360 + ", 100%, 50%)";
    context.fillRect(depth, index % h, 1, 1);
    index += 1;
  } else {
    context.fillStyle = "hsl(" + node.hue * 360 + ", 0%, 50%)";
    context.fillRect(depth, index % h, 1, 1);
    index += 1;
  }

  if (node.children.length) {
    depth += 1;
    for (var i = 0; i < node.children.length; i++) {
      index = draw(context, node.children[i], depth, index, h);
    }
  }

  return index;
};

function extinguish(node) {
  if (node.extant) {
    if (node.alive) {
      node.extant = true;
    } else {
      node.extant = false;
      if (node.children.length) {
        for (var i = 0; i < node.children.length; i++) {
          var child_extant = extinguish(node.children[i]);
          node.extant = node.extant || child_extant;
        }
      }
    }
  }
  return node.extant;
}

function propagate(node) {
  if (node.extant) {
    if (node.alive) {
      node.alive = false;
      var children = Math.floor(Math.random() * 3);
      for (var i = 0; i < children; i++) {
        var hue_change = (Math.random() - 0.5) / 12;
        node.children.push({
          extant:   true,
          alive:    true,
          children: [],
          hue:      node.hue + hue_change,
        });
      }
    } else {
      if (node.children.length) {
        for (var i = 0; i < node.children.length; i++) {
          propagate(node.children[i]);
        }
      }
    }
  }
  return node;
}

document.addEventListener("DOMContentLoaded", function(event) {
  const fps = 30;

  var nodes = [];
  nodes.push({
    extant:   true,
    alive:    true,
    children: [],
    hue:      Math.random(),
  });

  var   canvas  = document.getElementsByTagName("canvas")[0];
  const context = canvas.getContext("2d");

  const w = window.innerWidth;
  const h = window.innerHeight;
  const r = window.devicePixelRatio;
  const l = 4;

  canvas.width  = w * r;
  canvas.height = h * r;

  setInterval(function() {
    context.fillStyle = "black";
    context.fillRect(0, 0, w, h);
    index = draw(context, nodes[0], 0, 0, h);

    extinguish(nodes[0]);
    if (nodes[0].extant) {
      nodes[0] = propagate(nodes[0])
    } else {
      nodes = [{
        extant:   true,
        alive:    true,
        children: [],
        hue:      Math.random(),
      }];
    }
  }, 1000 / fps);
});
