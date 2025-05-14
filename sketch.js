let rabbitImg;
let eyeL = { x: 0, y: 0 };
let eyeR = { x: 0, y: 0 };
let blink = false;
let bgImg;
let wavePoints = [];
let dynamicCurvePoints = [];
let rippleEffects = [];

function preload() {
  rabbitImg = loadImage("Asset 4@4x.png");
  bgImg = loadImage("bg.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);

  dynamicCurvePoints = [];
  for (let x = -width; x <= width * 2; x += 40) {
    dynamicCurvePoints.push({ x: x, y: height / 2 });
  }


  wavePoints = [];
  for (let x = 0; x <= width; x += 60) {
    wavePoints.push({ x: x, y: height * 0.8 });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  wavePoints = [];
  for (let x = 0; x <= width; x += 60) {
    wavePoints.push({ x: x, y: height * 0.8 });
  }

  dynamicCurvePoints = [];
    for (let x = -width; x <= width * 2; x += 40) {
    dynamicCurvePoints.push({ x: x, y: height / 2 });
  }

}

function draw() {
  drawDynamicCurve();
  drawRipples();
  drawLightGrid();
  drawResponsiveCurve();
  tint(255, 40);
  image(bgImg, width / 2, height / 2, width, height);
  noTint();

  let scaleFactor = min(width / 1440, 1);

  let imgW = rabbitImg.width * scaleFactor;
  let imgH = rabbitImg.height * scaleFactor;

  let imgX = width / 2;
  let imgY = height / 2;
  image(rabbitImg, imgX, imgY, imgW, imgH);

  eyeL.x = imgX + (-10 * scaleFactor);
  eyeL.y = imgY + (-140 * scaleFactor);
  eyeR.x = imgX + (50 * scaleFactor);
  eyeR.y = imgY + (-150 * scaleFactor);

  let offset = 5 * scaleFactor;
  let angleL = atan2(mouseY - eyeL.y, mouseX - eyeL.x);
  let angleR = atan2(mouseY - eyeR.y, mouseX - eyeR.x);

  if (!blink) {
    noStroke();
    fill(180, 20, 20);
    ellipse(eyeL.x + cos(angleL) * offset, eyeL.y + sin(angleL) * offset, 23 * scaleFactor, 20 * scaleFactor);
    fill(255);
    ellipse(eyeL.x + cos(angleL) * offset - 3, eyeL.y + sin(angleL) * offset - 3, 7 * scaleFactor, 7 * scaleFactor);

    fill(180, 20, 20);
    ellipse(eyeR.x + cos(angleR) * offset, eyeR.y + sin(angleR) * offset, 16 * scaleFactor, 15 * scaleFactor);
    fill(255);
    ellipse(eyeR.x + cos(angleR) * offset - 3, eyeR.y + sin(angleR) * offset - 3, 5 * scaleFactor, 5 * scaleFactor);
  } else {
    fill(0);
    ellipse(eyeL.x, eyeL.y, 16 * scaleFactor, 5 * scaleFactor);
    ellipse(eyeR.x, eyeR.y, 16 * scaleFactor, 5 * scaleFactor);
  }

  const clockOffsetX = 143 * scaleFactor;
  const clockOffsetY = 65 * scaleFactor;
  const clockRadius = 30 * scaleFactor;
  drawClockHands(imgX + clockOffsetX, imgY + clockOffsetY, clockRadius);
}

function mousePressed() {
  blink = true;
  setTimeout(() => blink = false, 150);
  rippleEffects.push({
    x: mouseX,
    y: mouseY,
    radius: 0,
    alpha: 255
  });
}

function drawResponsiveCurve() {
  noFill();
  stroke(255, 50, 50, 60);
  strokeWeight(2);
  beginShape();
  for (let pt of wavePoints) {
    let d = dist(mouseX, mouseY, pt.x, pt.y);
    let offsetY = map(d, 0, 300, -60, 60);
    let wave = sin(frameCount * 0.05 + pt.x * 0.01) * 10;
    let targetY = height * 0.3 + offsetY + wave;
    pt.y = lerp(pt.y, targetY, 0.1);
    curveVertex(pt.x, pt.y);
  }
  endShape();
}

function drawLightGrid() {
  strokeWeight(1.5);
  let wave = sin(frameCount * 0.05) * 10;
  let dancheongColors = ['#b22222', '#7A140F', '#000000'];

  for (let x = 0; x < width; x += 40) {
    for (let y = 0; y < height; y += 40) {
      let dx = x - mouseX;
      let dy = y - mouseY;
      let distMouse = sqrt(dx * dx + dy * dy);
      let angle = atan2(dy, dx);
      let offset = map(distMouse, 0, 300, 20, 0);

      let px = x + cos(angle) * offset;
      let py = y + sin(angle) * offset;

      let col = dancheongColors[int((x + y + frameCount * 2) / 40) % dancheongColors.length];
      stroke(color(col + hex(120 + 80 * sin(frameCount * 0.02 + x * 0.01 + y * 0.01), 2)));
      point(px, py + wave);
    }
  }
}

function drawDynamicCurve() {
  noFill();
  let numCurves = 12;
  let spacing = height / (numCurves + 1);

  for (let i = 0; i < numCurves; i++) {
    let baseY = spacing * (i + 1);
    let thickness = map(i, 0, numCurves - 1, 1.2, 0.4);

    stroke(255, 60, 60, 120); // 반투명 붉은 곡선
    strokeWeight(thickness);

    beginShape();

    // ✅ 왼쪽 보조점: 첫 점 이전 좌표를 baseY 기준으로 넣기
    let first = dynamicCurvePoints[0];
    curveVertex(first.x - 40, baseY); // 왼쪽 외곽 보조점
    curveVertex(first.x, baseY);      // 첫 실제 포인트

    for (let pt of dynamicCurvePoints) {
      let d = dist(mouseX, mouseY, pt.x, baseY);
      let offsetY = map(d, 0, 300, -40, 40); // 마우스와의 거리 기반
      let wave = sin(frameCount * 0.05 + pt.x * 0.01 + i * 0.1) * 10;
      let y = baseY + offsetY + wave;

      curveVertex(pt.x, y); // 곡선 포인트
    }

    // ✅ 오른쪽 보조점
    let last = dynamicCurvePoints[dynamicCurvePoints.length - 1];
    curveVertex(last.x, baseY);        // 마지막 점
    curveVertex(last.x + 40, baseY);   // 오른쪽 외곽 보조점

    endShape();
  }
}




function drawRipples() {
  noFill();
  for (let i = rippleEffects.length - 1; i >= 0; i--) {
    let r = rippleEffects[i];
    stroke(255, 100, 100, r.alpha);
    strokeWeight(2);
    beginShape();
    for (let j = 0; j < TWO_PI; j += PI / 12) {
      let angle = j + frameCount * 0.05;
      let rad = r.radius + sin(j * 6 + frameCount * 0.1) * 5;
      let x = r.x + cos(angle) * rad;
      let y = r.y + sin(angle) * rad;
      curveVertex(x, y);
    }
    endShape(CLOSE);

    r.radius += 2;
    r.alpha -= 4;

    if (r.alpha <= 0) {
      rippleEffects.splice(i, 2);
    }
  }
}

function drawClockHands(x, y, radius) {
  const hr = hour() % 12;
  const mn = minute();
  const sc = second();

  push();
  translate(x, y);

  stroke(255);
  strokeWeight(6);
  const hAngle = map(hr + mn / 60, 0, 12, 0, TWO_PI) - HALF_PI;
  line(0, 0, cos(hAngle) * radius * 0.5, sin(hAngle) * radius * 0.5);

  strokeWeight(4);
  const mAngle = map(mn + sc / 60, 0, 60, 0, TWO_PI) - HALF_PI;
  line(0, 0, cos(mAngle) * radius * 0.8, sin(mAngle) * radius * 0.8);

  stroke(255, 100, 100);
  strokeWeight(2);
  const sAngle = map(sc, 0, 60, 0, TWO_PI) - HALF_PI;
  line(0, 0, cos(sAngle) * radius * 0.9, sin(sAngle) * radius * 0.9);

  pop();
}
