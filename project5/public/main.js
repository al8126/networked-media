new p5(function(p) {

  const RAW = [
    [ 87,  166, "back",       0 ],  //  1
    [134,  166, "then",       0 ],  //  2
    [170,  161, "i",          0 ],  //  3
    [175,  125, "only",       0 ],  //  4
    [162,  100, "knew",       0 ],  //  5
    [123,   58, "css",        1 ],  //  6  ← lift pen
    [193,  161, "and",        0 ],  //  7
    [205,  121, "html.",      0 ],  //  8
    [205,   87, "now",        0 ],  //  9
    [205,   40, "i",          1 ],  // 10  ← lift pen
    [220,  163, "can",        0 ],  // 11
    [283,  178, "do",         1 ],  // 12  ← lift pen
    [236,  237, "all",        0 ],  // 13
    [244,  317, "this!",      0 ],  // 14
    [240,  412, "i'm",        0 ],  // 15
    [244,  478, "glad",       0 ],  // 16
    [275,  539, "i",          0 ],  // 17
    [303,  591, "survived",   0 ],  // 18
    [240,  591, "this",       2 ],  // 19
    [291,  629, "class",      0 ],  // 20
    [409,  634, "and",        0 ],  // 21
    [452,  620, "sam",        0 ],  // 22
    [448,  568, "allowed",    0 ],  // 23
    [382,  544, "silly",      0 ],  // 24
    [240,  591, "this",       2 ],  // 25
    [417,  591, "projects",   0 ],  // 26
    [440,  549, "so",         0 ],  // 27
    [456,  497, "it",         0 ],  // 28
    [484,  412, "was",        0 ],  // 29
    [511,  307, "less",       1 ],  // 30  ← lift pen
    [444,  241, "painful.",   0 ],  // 31
    [492,  227, "sorry",      0 ],  // 32
    [507,  203, "but",        0 ],  // 33
    [527,  142, "no",         0 ],  // 34
    [504,   90, "more",       1 ],  // 35  ← lift pen
    [519,  182, "but",        0 ],  // 36
    [543,  194, "js",         0 ],  // 37
    [578,   97, "ever",       1 ],  // 38
    [566,  175, "again",      0 ],  // 39
    [620,  175, "please.",    0 ],  // 40
    [657,  148, "(over)",     0 ],  // 41
  ];

  const LIFT_AT   = new Set([5, 9, 11, 29, 34, 37]);
  const SHARED    = {};
  const SHARED_AT = {};

  let dots     = [];
  let conns    = [];
  let revealed = new Set();
  let state    = 'wait';
  let step     = 0;
  let dragX    = 0;
  let dragY    = 0;
  let S        = 700;

  function sc(v)  { return v * S / 700; }
  function dx(i)  { return sc(dots[i].rx); }
  function dy(i)  { return sc(dots[i].ry); }

  function dotColor(type) {
    if (type === 1) return p.color('#e8899a');
    if (type === 2) return p.color('#99b3e8');
    if (type === 3) return p.color('#c09ae8');
    return p.color('#1a1a1a');
  }

  function snapR() { return sc(22); }

  p.setup = function() {
    S = Math.min(p.windowWidth, p.windowHeight, 700);
    const cnv = p.createCanvas(S, S);
    cnv.parent('canvas-container');
    cnv.style('display', 'block');
    p.textFont('Georgia');
    dots = RAW.map(([rx, ry, word, type]) => ({ rx, ry, word, type }));
  };

  p.windowResized = function() {
    S = Math.min(p.windowWidth, p.windowHeight, 700);
    p.resizeCanvas(S, S);
  };

  p.draw = function() {
    p.clear();
    const lw = sc(1.5);

    p.strokeWeight(lw);
    p.stroke(200, 65, 65);
    for (const { a, b } of conns) {
      p.line(dx(a), dy(a), dx(b), dy(b));
    }

    if (state === 'drag') {
      p.stroke(200, 65, 65, 150);
      p.strokeWeight(lw);
      p.line(dx(step), dy(step), dragX, dragY);
    }

    for (let i = 0; i < dots.length; i++) {
      if (SHARED[i] !== undefined) continue;

      const d         = dots[i];
      const cx        = dx(i);
      const cy        = dy(i);
      const r         = sc(5);
      const siblings  = [i, ...(SHARED_AT[i] || [])];
      const isActive  = state === 'wait' && siblings.includes(step);
      const isTarget  = state === 'drag' && step + 1 < dots.length && siblings.includes(step + 1);
      const fullyDone = siblings.every(s => revealed.has(s));

      if (fullyDone) {
        if (isActive) {
          const pulse = p.map(p.sin(p.frameCount * 0.09), -1, 1, 0.2, 0.7);
          p.noStroke(); p.fill(255, 185, 0, pulse * 120);
          p.circle(cx, cy, sc(28));
        }
        p.noStroke(); p.fill(120);
        p.textSize(sc(8)); p.textAlign(p.CENTER, p.BOTTOM);
        siblings.forEach((s, n) => p.text(s + 1, cx, cy - sc(8) * (siblings.length - 1 - n)));
        p.fill('#111'); p.textSize(sc(13)); p.textAlign(p.CENTER, p.TOP);
        p.text(d.word, cx, cy + sc(1));

      } else {
        if (isActive) {
          const pulse = p.map(p.sin(p.frameCount * 0.09), -1, 1, 0.35, 1.0);
          p.noStroke(); p.fill(255, 185, 0, pulse * 160);
          p.circle(cx, cy, sc(22));
        }
        if (isTarget) {
          const dist  = p.dist(dragX, dragY, cx, cy);
          const close = p.map(p.constrain(dist, 0, snapR()), 0, snapR(), 1, 0);
          p.noStroke(); p.fill(80, 200, 120, 70 + close * 140);
          p.circle(cx, cy, sc(22));
        }
        p.noStroke(); p.fill(dotColor(d.type));
        p.circle(cx, cy, r * 2);

        p.textSize(sc(8.5)); p.textAlign(p.LEFT, p.BOTTOM);
        siblings.forEach((s, n) => {
          const yOff = sc(9) * n;
          p.noStroke(); p.fill('#1a1a1a');
          p.text(s + 1, cx + r + sc(1.5), cy + sc(1) + yOff);
          if (revealed.has(s)) {
            p.fill('#111'); p.textSize(sc(11)); p.textAlign(p.LEFT, p.TOP);
            p.text(dots[s].word, cx + r + sc(2), cy + sc(2) + yOff);
            p.textSize(sc(8.5)); p.textAlign(p.LEFT, p.BOTTOM);
          }
        });
      }
    }

    if (state === 'wait' && step === 0 && conns.length === 0) {
      p.noStroke();
      p.fill(120, 120, 120, 200);
      p.textSize(sc(11));
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text('press dot 1 to start', S / 2, S - sc(8));
    }
  };

  function tryPress(mx, my) {
    if (state !== 'wait') return;
    if (step >= dots.length - 1) return;
    if (p.dist(mx, my, dx(step), dy(step)) < snapR()) {
      revealed.add(step);
      state = 'drag';
      dragX = mx;
      dragY = my;
    }
  }

  function tryRelease(mx, my) {
    if (state !== 'drag') return;
    const nxt = step + 1;
    if (nxt < dots.length && p.dist(mx, my, dx(nxt), dy(nxt)) < snapR()) {
      conns.push({ a: step, b: nxt });
      revealed.add(nxt);
      step = nxt;
      if (LIFT_AT.has(step) && step < dots.length - 1) step++;
      state = 'wait';
    } else {
      state = 'wait';
    }
  }

  p.mousePressed  = () => tryPress(p.mouseX, p.mouseY);
  p.mouseDragged  = () => { if (state === 'drag') { dragX = p.mouseX; dragY = p.mouseY; } };
  p.mouseReleased = () => tryRelease(p.mouseX, p.mouseY);

  p.touchStarted = function() {
    if (p.touches.length) tryPress(p.touches[0].x, p.touches[0].y);
    return false;
  };
  p.touchMoved = function() {
    if (state === 'drag' && p.touches.length) {
      dragX = p.touches[0].x;
      dragY = p.touches[0].y;
    }
    return false;
  };
  p.touchEnded = function() {
    tryRelease(dragX, dragY);
    return false;
  };

});