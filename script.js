function draw(context, node, depth, index, h) {
  if (node.extant) {
    context.fillStyle = "#fff";
    context.fillRect(depth, index % h, 1, 1);
    index += 1;
  } else {
    context.fillStyle = "#444";
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
        node.children.push({
          extant:   true,
          alive:    true,
          children: [],
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
  });

  var   canvas  = document.getElementsByTagName("canvas")[0];
  const context = canvas.getContext("2d");

  const w = window.innerWidth;
  const h = window.innerHeight;
  const r = window.devicePixelRatio;
  const l = 4;

  canvas.width  = w;
  canvas.height = h;

  setInterval(function() {
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    index = draw(context, nodes[0], 0, 0, canvas.height);

    extinguish(nodes[0]);
    if (nodes[0].extant) {
      nodes[0] = propagate(nodes[0])
    } else {
      nodes = [{
        extant:   true,
        alive:    true,
        children: [],
      }];
    }
  }, 1000 / fps);
});
