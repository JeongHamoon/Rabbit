let rabbitImg;
let eyeL = { x: 0, y: 0 };
let eyeR = { x: 0, y: 0 };
let blink = false;
let bgImg;
let wavePoints = [];
let dynamicCurvePoints = []; // ✅ 전역으로 선언
let rippleEffects = [];

function preload() {
  rabbitImg = loadImage("Asset 4@4x.png");
  bgImg = loadImage("bg.png"); // 배경 이미지
}

function setup() {
  createCanvas(1440, 1040);
  imageMode(CENTER);
  for (let x = 0; x <= width; x += 60) {
  wavePoints.push({ x: x, y: height * 0.8 });}
  for (let i = 0; i < width; i += 40) {
    dynamicCurvePoints.push({ x: i, y: height / 2 });
  }

}

function draw() {
  drawDynamicCurve(); // ✅ 반드시 draw() 함수 내부에 있어야 화면에 나타남
  drawRipples();
  drawLightGrid(); // 🔴 마우스 반응 빛 배경
  drawResponsiveCurve(); // 💫 부드러운 배경 곡선
  tint(255, 40); // 투명도 조절 (0~255)
  image(bgImg, width / 2, height / 2,1440, 1024);
  noTint(); // 이후 이미지에는 영향 없도록 초기화
  function drawGlow() {
  push();
  noStroke();
  for (let r = 200; r > 0; r -= 10) {
    fill(180, 30, 30, map(r, 200, 0, 0, 40));
    ellipse(width/2, height/2 + 100, r * 2);
  }
  pop();
  }
  

  // 로고 위치
  let imgX = width / 2;
  let imgY = height / 2;
  image(rabbitImg, imgX, imgY);

  // 눈 좌표 설정
  eyeL.x = imgX + -10;
  eyeL.y = imgY - 140;
  eyeR.x = imgX + 50;
  eyeR.y = imgY - 150;

  let offset = 5;
  let angleL = atan2(mouseY - eyeL.y, mouseX - eyeL.x);
  let angleR = atan2(mouseY - eyeR.y, mouseX - eyeR.x);

  if (!blink) {
    // 왼쪽 눈
    fill(180, 20, 20);
    noStroke();
    ellipse(eyeL.x + cos(angleL) * offset, eyeL.y + sin(angleL) * offset, 23, 20);
    fill(255);
    ellipse(eyeL.x + cos(angleL) * offset - 3, eyeL.y + sin(angleL) * offset - 3, 7, 7);

    // 오른쪽 눈
    fill(180, 20, 20);
    ellipse(eyeR.x + cos(angleR) * offset, eyeR.y + sin(angleR) * offset, 16, 15);
    fill(255);
    ellipse(eyeR.x + cos(angleR) * offset - 3, eyeR.y + sin(angleR) * offset - 3, 5, 5);
  } else {
    fill(0);
    ellipse(eyeL.x, eyeL.y, 16, 5);
    ellipse(eyeR.x, eyeR.y, 16, 5);
  }
   // 3) 오른손 시계 오프셋
  const clockOffsetX = 143;
  const clockOffsetY = 65;
  const clockRadius = 30;
  drawClockHands(
    imgX + clockOffsetX,
    imgY + clockOffsetY,
    clockRadius
  );
}
let dancheongColors = ['#b22222', '#7A140F', '#000000'];

function drawLightGrid() {
  strokeWeight(1.5);
  let wave = sin(frameCount * 0.05) * 10;

  for (let x = 0; x < width; x += 40) {
    for (let y = 0; y < height; y += 40) {
      let dx = x - mouseX;
      let dy = y - mouseY;
      let distMouse = sqrt(dx * dx + dy * dy);
      let angle = atan2(dy, dx);
      let offset = map(distMouse, 0, 300, 20, 0);

      let px = x + cos(angle) * offset;
      let py = y + sin(angle) * offset;

      // 색상 주기적 순환
      let col = dancheongColors[int((x + y + frameCount * 2) / 40) % dancheongColors.length];
      stroke(color(col + hex(120 + 80 * sin(frameCount * 0.02 + x * 0.01 + y * 0.01), 2))); // alpha 추가
      point(px, py + wave);
    }
  }
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
    let offsetY = map(d, 0, 300, -60, 60); // 가까울수록 더 휘어짐
    let wave = sin(frameCount * 0.05 + pt.x * 0.01) * 10;
    let targetY = height * 0.3 + offsetY + wave;
    pt.y = lerp(pt.y, targetY, 0.1); // 부드러운 반응
    curveVertex(pt.x, pt.y);
  }
  endShape();
}

function drawDynamicCurve() {
  noFill();

  let numCurves = 12;
  let spacing = height / (numCurves + 1); // 화면 세로를 균등하게 나눔

  for (let i = 0; i < numCurves; i++) {
    let baseY = spacing * (i + 1); // 각 곡선의 y 위치
    let thickness = map(i, 0, numCurves - 1, 1.5, 0.2); // 두께를 위에서 아래로 점점 얇게

    stroke(255, 60, 60, 120);
    strokeWeight(thickness);

    beginShape();
    for (let pt of dynamicCurvePoints) {
      let d = dist(mouseX, mouseY, pt.x, baseY);
      let offsetY = map(d, 0, 300, -40, 40);
      let wave = sin(frameCount * 0.05 + pt.x * 0.01 + i * 0.1) * 10;
      let targetY = baseY + offsetY + wave;
      pt.y = lerp(pt.y, targetY, 0.1);
      curveVertex(pt.x, pt.y);
    }
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
      let angle = j + frameCount * 0.05; // 회전감
      let rad = r.radius + sin(j * 6 + frameCount * 0.1) * 5;
      let x = r.x + cos(angle) * rad;
      let y = r.y + sin(angle) * rad;
      curveVertex(x, y);
    }
    endShape(CLOSE);

    // 퍼지게
    r.radius += 2;
    r.alpha -= 4;

    if (r.alpha <= 0) {
      rippleEffects.splice(i, 2); // 사라짐
    }
  }
}
function drawClockHands(x, y, radius) {
  let hr = hour() % 12;
  let mn = minute();
  let sc = second();
}

function drawClockHands(x, y, radius) {
  const hr = hour() % 12;
  const mn = minute();
  const sc = second();

  push();
  translate(x, y);
  stroke(1);
  
  // 시침
  strokeWeight(6);
  // 시침 각도: 0시 기준 위쪽, 시계 방향 증가
  const hAngle = map(hr + mn/60, 0, 12, 0, TWO_PI) - HALF_PI;
  line(0, 0,
       cos(hAngle) * radius * 0.5,
       sin(hAngle) * radius * 0.5);

  // 분침
  strokeWeight(4);
  const mAngle = map(mn + sc/60, 0, 60, 0, TWO_PI) - HALF_PI;
  line(0, 0,
       cos(mAngle) * radius * 0.8,
       sin(mAngle) * radius * 0.8);
  pop();
  
  function drawClockHands(x, y, radius) {
  const hr = hour() % 12;
  const mn = minute();
  const sc = second();

  push();
  translate(x, y);

  // 시침 (흰색, 굵기 6)
  stroke(255);
  strokeWeight(6);
  const hAngle = map(hr + mn/60, 0, 12, 0, TWO_PI) - HALF_PI;
  line(0, 0, cos(hAngle) * radius * 0.5, sin(hAngle) * radius * 0.5);

  // 분침 (흰색, 굵기 4)
  strokeWeight(4);
  const mAngle = map(mn + sc/60, 0, 60, 0, TWO_PI) - HALF_PI;
  line(0, 0, cos(mAngle) * radius * 0.8, sin(mAngle) * radius * 0.8);

  // 초침 (빨간색, 굵기 2)
  stroke(255, 0, 0);
  strokeWeight(2);
  const sAngle = map(sc, 0, 60, 0, TWO_PI) - HALF_PI;
  line(0, 0, cos(sAngle) * radius * 0.9, sin(sAngle) * radius * 0.9);

  pop();
}

}


