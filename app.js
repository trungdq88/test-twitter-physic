function parseSvg(raw) {
  return new window.DOMParser().parseFromString(raw, 'image/svg+xml');
}

var select = function (root, selector) {
  return Array.prototype.slice.call(root.querySelectorAll(selector));
};

(function () {
  // module aliases
  var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Events = Matter.Events,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Svg = Matter.Svg,
    Vertices = Matter.Vertices,
    Common = Matter.Common,
    Composite = Matter.Composite;

  // create an engine
  var engine = Engine.create();

  // provide concave decomposition support library
  Common.setDecomp(decomp);

  // create a renderer
  var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: 800,
      height: 600,
      wireframes: false,
      background: 'transparent'
    }
  });

  // create two boxes and a ground
  var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
  var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

  const svgRoot = parseSvg(`
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512">
<path id="user-icon" d="M12 4.435c-1.989-5.399-12-4.597-12 3.568 0 4.068 3.06 9.481 12 14.997 8.94-5.516 12-10.929 12-14.997 0-8.118-10-8.999-12-3.568z"/>
</svg>
  `);
  const retweetRoot = parseSvg(`
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512">
<path id="user-icon" d="M5 10v7h10.797l1.594 2h-14.391v-9h-3l4-5 4 5h-3zm14 4v-7h-10.797l-1.594-2h14.391v9h3l-4 5-4-5h3z"/>
</svg>
  `);
  // const bodyC = Bodies.rectangle(100, 200, 1400, 50, {
  //   isStatic: true,
  //   render: { fillStyle: 'black' }
  // });
  // add all of the bodies to the world
  Composite.add(engine.world, [
    Bodies.rectangle(400, 0, 800, 50, {
      isStatic: true,
      render: { fillStyle: '#ffffff' }
    }),
    Bodies.rectangle(400, 600, 800, 50, {
      isStatic: true,
      render: { fillStyle: '#ffffff' }
    }),
    Bodies.rectangle(800, 300, 50, 600, {
      isStatic: true,
      render: { fillStyle: '#ffffff' }
    }),
    Bodies.rectangle(0, 300, 50, 600, {
      isStatic: true,
      render: { fillStyle: '#ffffff' }
    }),

    // right
    Bodies.rectangle(510, 400, 20, 600, {
      isStatic: true,
      render: { fillStyle: 'transparent' }
    }),
    // bottom
    Bodies.rectangle(225, 510, 600, 20, {
      isStatic: true,
      render: { fillStyle: 'transparent' }
    }),
    Bodies.rectangle(200, 460, 600, 20, {
      isStatic: true,
      render: { fillStyle: 'transparent' },
      angle: Math.PI * 0.25
    }),
    Bodies.rectangle(455, 460, 600, 20, {
      isStatic: true,
      render: { fillStyle: 'transparent' },
      angle: -Math.PI * 0.25
    }),
    Bodies.rectangle(135, 400, 20, 600, {
      isStatic: true,
      render: { fillStyle: 'transparent' }
    })
  ]);

  var vertexSets = select(svgRoot, 'path').map(function (path) {
    return Vertices.scale(Svg.pathToVertices(path, 4), 2, 2);
  });

  var retweetVertexSets = select(retweetRoot, 'path').map(function (path) {
    return Vertices.scale(Svg.pathToVertices(path, 1), 1, 1);
  });

  const hearts = [];

  const createHeart = (x, y) =>
    Bodies.fromVertices(
      x || Common.random(0, 700),
      y || 40,
      vertexSets,
      {
        friction: 0.00001,
        restitution: 0.5,
        density: 0.001,
        render: {
          fillStyle: '#ce3a60',
          strokeStyle: '#ce3a60',
          lineWidth: 1
        }
      },
      true
    );

  const createRetweet = (x, y) => {
    const body = Bodies.fromVertices(
      x || Common.random(0, 700),
      y || 40,
      retweetVertexSets,
      {
        friction: 0.00001,
        restitution: 0.5,
        density: 0.001,
        render: {
          fillStyle: '#59bc6d',
          strokeStyle: '#59bc6d',
          lineWidth: 1
        }
      },
      true
    );
    return body;
  };

  for (let i = 0; i < 0; i++) {
    hearts.push(createHeart(undefined, 200));
  }

  Composite.add(engine.world, hearts);

  hearts.forEach((body) => {
    var forceMagnitude = 0.03 * body.mass;

    Body.applyForce(body, body.position, {
      x:
        (forceMagnitude + Common.random() * forceMagnitude) *
        Common.choose([1, -1]),
      y: -forceMagnitude + Common.random() * -forceMagnitude
    });
  });

  // var counter = 0,
  //   scaleFactor = 1.01;
  // Events.on(engine, 'beforeUpdate', function (event) {
  //   counter += 1;
  //
  //   var p = 300 + 10 * Math.sin(engine.timing.timestamp * 0.08);
  //   Body.setVelocity(bodyC, { x: 100, y: p - bodyC.position.y });
  //   Body.setPosition(bodyC, { x: 100, y: p });
  // });

  // run the renderer
  Render.run(render);

  // create runner
  var runner = Runner.create();

  // run the engine
  Runner.run(runner, engine);

  window.add = function add() {
    const body = createHeart(Common.random(240, 450), 60);
    Composite.add(engine.world, body);
    var forceMagnitude = 0.05 * body.mass;

    // Body.applyForce(body, body.position, {
    //   x:
    //     (forceMagnitude + Common.random() * forceMagnitude) *
    //     Common.choose([1, -1]),
    //   y: -forceMagnitude + Common.random() * -forceMagnitude
    // });
  };
  window.addRetweet = function addRetweet() {
    const body = createRetweet(60, 60);
    Composite.add(engine.world, body);
    var forceMagnitude = 0.05 * body.mass;

    Body.applyForce(body, body.position, {
      x:
        (forceMagnitude + Common.random() * forceMagnitude) *
        Common.choose([1, -1]),
      y: -forceMagnitude + Common.random() * -forceMagnitude
    });
  };
})();

test.addEventListener('click', () => {
  if (test.classList.contains('liked')) {
    test.classList.remove('liked');
  } else {
    test.classList.add('liked');
    add();
  }
});
