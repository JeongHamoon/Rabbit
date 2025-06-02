let bubbleColors = {
  normal: [40, 0, 0, 200],
  happy: [30, 70, 30, 200],
  surprised: [70, 30, 30, 200],
  angry: [100, 20, 20, 200],
  sad: [20, 20, 50, 200],
  sleepy: [30, 30, 30, 200]
};

let emotionMessages = {
  normal: [
    "Hi! I'm here to guide you through my portfolio.",
    "Feeling curious? Let’s explore together!"
  ],
  happy: [
    "This is so exciting! Let me show you everything I’ve prepared.",
    "I’m overjoyed to have you here today!"
  ],
  surprised: [
    "Oh! That was unexpected, but let me show you what I’ve got!",
    "I didn’t see that coming! Let’s dive in."
  ],
  angry: [
    "This didn’t go as planned, but I’ll try my best!",
    "I might be a bit frustrated, but I still have cool work to show you."
  ],
  sad: [
    "I’m feeling a little down, but my work still shines.",
    "Today’s not the best day for me, but let’s explore together anyway."
  ],
  sleepy: [
    "I might be a bit sleepy, but I’m still excited to show you.",
    "Yawn… But I’m here to help you out."
  ]
};

let surprisedGif; // ✅ 새로 추가
let happyGif; // ✅ happy GIF 추가
let rabbitGif;
let speech = "";
let showSpeech = false;
let emotion = "normal";
let speechTimer = 0;
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
  rabbitGif = loadImage("Normal.gif"); // ✅ 새로 추가: GIF 이미지 로드
  happyGif = loadImage("Happy.gif");   // ✅ happy GIF 불러오기
  surprisedGif = loadImage("Surpised.gif"); // ✅ 추가
}

function setup() {
  createCanvas(windowWidth, windowHeight); // ✅ 전체 뷰포트로 꽉 채우기!
  imageMode(CENTER);
  for (let x = 0; x <= width; x += 60) {
  wavePoints.push({ x: x, y: height * 0.8 });}
  for (let i = 0; i < width; i += 40) {
    dynamicCurvePoints.push({ x: i, y: height / 2 });
  }
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // ✅ 창 크기 변화에 따라 canvas 재조정
}
function draw() {
  drawDynamicCurve(); // ✅ 반드시 draw() 함수 내부에 있어야 화면에 나타남
  drawRipples();
  drawLightGrid(); // 🔴 마우스 반응 빛 배경
  drawResponsiveCurve(); // 💫 부드러운 배경 곡선
  tint(255, 40); // 투명도 조절 (0~255)
  image(bgImg, width / 2, height / 2, width, height); // ✅ canvas 크기에 맞춤
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
  
    let currentGif = rabbitGif; // 기본 Normal
  if (emotion === "happy") {
    currentGif = happyGif;
  } else if (emotion === "surprised") {
    currentGif = surprisedGif;
  }
  
   image(currentGif, imgX, imgY); // 최종 출력


  // 눈 좌표 설정
  eyeL.x = imgX + -10;
  eyeL.y = imgY - 140;
  eyeR.x = imgX + 50;
  eyeR.y = imgY - 150;

  let offset = 5;
  let angleL = atan2(mouseY - eyeL.y, mouseX - eyeL.x);
  let angleR = atan2(mouseY - eyeR.y, mouseX - eyeR.x);

if (!blink) {
  fill(180, 20, 20);
  noStroke();

  if (emotion === "happy") {
    ellipse(eyeL.x + cos(angleL) * offset, eyeL.y + sin(angleL) * offset, 26, 20);
    ellipse(eyeR.x + cos(angleR) * offset, eyeR.y + sin(angleR) * offset, 20, 15);
  } else if (emotion === "surprised") {
    ellipse(eyeL.x + cos(angleL) * offset, eyeL.y + sin(angleL) * offset, 30, 25);
    ellipse(eyeR.x + cos(angleR) * offset, eyeR.y + sin(angleR) * offset, 24, 20);
  } else if (emotion === "angry") {
    ellipse(eyeL.x + cos(angleL) * offset, eyeL.y + sin(angleL) * offset, 20, 10);
    ellipse(eyeR.x + cos(angleR) * offset, eyeR.y + sin(angleR) * offset, 16, 10);
  } else if (emotion === "sad") {
    ellipse(eyeL.x + cos(angleL) * offset, eyeL.y + sin(angleL) * offset + 5, 22, 15);
    ellipse(eyeR.x + cos(angleR) * offset, eyeR.y + sin(angleR) * offset + 5, 18, 13);
  } else if (emotion === "sleepy") {
    ellipse(eyeL.x + cos(angleL) * offset, eyeL.y + sin(angleL) * offset, 23, 8);
    ellipse(eyeR.x + cos(angleR) * offset, eyeR.y + sin(angleR) * offset, 16, 6);
  } else {
    ellipse(eyeL.x + cos(angleL) * offset, eyeL.y + sin(angleL) * offset, 23, 20);
    ellipse(eyeR.x + cos(angleR) * offset, eyeR.y + sin(angleR) * offset, 16, 15);
  }

  fill(255);
  ellipse(eyeL.x + cos(angleL) * offset - 3, eyeL.y + sin(angleL) * offset - 3, 7, 7);
  ellipse(eyeR.x + cos(angleR) * offset - 3, eyeR.y + sin(angleR) * offset - 3, 5, 5);
} else {
  fill(0);
  ellipse(eyeL.x, eyeL.y, 16, 5);
  ellipse(eyeR.x, eyeR.y, 16, 5);
}

    // 말풍선
  if (showSpeech) {
    drawSpeechBubble(imgX + 100, imgY - 150, speech);
  }

  // 말풍선 표시시간 관리
  if (showSpeech && millis() - speechTimer > 2000) {
    showSpeech = false;
  }

   // 3) 오른손 시계 오프셋
  const clockOffsetX = 143;
  const clockOffsetY = 63;
  const clockRadius = 25;
  drawClockHands(
    imgX + clockOffsetX,
    imgY + clockOffsetY,
    clockRadius
  );
}
function drawSpeechBubble(x, y, txt) {
  y -= 130; // 말풍선 위치 위로 살짝 이동
  push();

  // ✅ 폰트 설정 (p5.js 기본 폰트 외에 웹폰트 로드도 가능!)
  textFont('Georgia'); // 원하는 글꼴로 변경 가능: Georgia, Courier, Arial 등
  textSize(20);
  textAlign(LEFT, TOP);

  let padding = 15; // 말풍선 여백
  let maxWidth = 200; // 최대 너비 제한
  let wrappedText = '';
  let words = txt.split(' ');
  let line = '';
  for (let n = 0; n < words.length; n++) {
    let testLine = line + words[n] + ' ';
    let testWidth = textWidth(testLine);
    if (testWidth > maxWidth && n > 0) {
      wrappedText += line + '\n';
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  wrappedText += line;

  // ✅ 말풍선 크기 계산
  let boxWidth = maxWidth + padding * 3;
  let boxHeight = textAscent() * (wrappedText.split('\n').length) + padding * 4;
// 🟩 여기서 말풍선 색을 emotion 기반으로!
  let c = bubbleColors[emotion];
  fill(c[0], c[1], c[2], c[3]);
  stroke(255, 100);
  strokeWeight(2);
  rect(x, y, boxWidth, boxHeight, 20);

  fill(255, 230, 230);
  noStroke();
  text(wrappedText, x + padding, y + padding, maxWidth, boxHeight);
  pop();

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
   // 🟩 랜덤 감정과 메시지
  let emotions = ["normal", "happy", "surprised", "angry", "sad", "sleepy"];
  emotion = random(emotions);

  // 🟩 선택된 감정의 메시지 중 하나 출력
  let options = emotionMessages[emotion];
  speech = random(options);
  showSpeech = true;
  speechTimer = millis();
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
// --> 스케치 맨 아래에, 전역에 딱 한 번만 이 함수를 선언합니다.
function drawClockHands(x, y, radius) {
  const hr = hour() % 12;
  const mn = minute();
  const sc = second();

  push();
  translate(x, y);

  // 시침 (흰색, 굵기 6)
  stroke(1);
  strokeWeight(5);
  let hAngle = map(hr + mn/60, 0, 12, 0, TWO_PI) - HALF_PI;
  line(0, 0,
       cos(hAngle) * radius * 0.5,
       sin(hAngle) * radius * 0.5);

  // 분침 (흰색, 굵기 4)
  strokeWeight(4);
  let mAngle = map(mn + sc/60, 0, 60, 0, TWO_PI) - HALF_PI;
  line(0, 0,
       cos(mAngle) * radius * 0.8,
       sin(mAngle) * radius * 0.8);

  // 초침 (빨간색, 굵기 2)
  stroke(255, 0, 0);
  strokeWeight(2);
  let sAngle = map(sc, 0, 60, 0, TWO_PI) - HALF_PI;
  line(0, 0,
       cos(sAngle) * radius * 0.9,
       sin(sAngle) * radius * 0.9);

  pop();
}



