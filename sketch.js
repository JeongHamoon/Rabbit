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
  bgImg     = loadImage("bg.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  for (let x = 0; x <= width; x += 60) {
    wavePoints.push({ x: x, y: height * 0.8 });
  }
  for (let i = 0; i < width; i += 40) {
    dynamicCurvePoints.push({ x: i, y: height / 2 });
  }
}

function draw() {
  imageMode(CENTER);  // 배경을 (0,0) 기준으로 그리기
  tint(255, 40);
  image(bgImg, width/2, height/2, width, height);
  noTint();

  // 2) 이펙트
  drawDynamicCurve();
  drawRipples();
  drawLightGrid();
  drawResponsiveCurve();

  // 3) 로고와 눈
  let imgX = width/2, imgY = height/2;
  imageMode(CENTER);
  image(rabbitImg, imgX, imgY);
  imageMode(CORNER);

  eyeL.x = imgX - 10; eyeL.y = imgY - 140;
  eyeR.x = imgX + 50; eyeR.y = imgY - 150;
  drawEyes();

  // 4) 시계
  const clockOffsetX = 143, clockOffsetY = 63, clockRadius = 25;
  drawClockHands(imgX + clockOffsetX, imgY + clockOffsetY, clockRadius);
}

function drawEyes() {
  let offset = 5;
  let angleL = atan2(mouseY - eyeL.y, mouseX - eyeL.x);
  let angleR = atan2(mouseY - eyeR.y, mouseX - eyeR.x);

  if (!blink) {
    fill(180,20,20); noStroke();
    ellipse(eyeL.x + cos(angleL)*offset, eyeL.y + sin(angleL)*offset, 23,20);
    fill(255);
    ellipse(eyeL.x + cos(angleL)*offset - 3, eyeL.y + sin(angleL)*offset - 3, 7,7);

    fill(180,20,20);
    ellipse(eyeR.x + cos(angleR)*offset, eyeR.y + sin(angleR)*offset, 16,15);
    fill(255);
    ellipse(eyeR.x + cos(angleR)*offset - 3, eyeR.y + sin(angleR)*offset - 3, 5,5);
  } else {
    fill(0);
    ellipse(eyeL.x, eyeL.y, 16,5);
    ellipse(eyeR.x, eyeR.y, 16,5);
  }
}

function mousePressed() {
  blink = true;
  setTimeout(() => blink = false, 150);
  rippleEffects.push({ x:mouseX, y:mouseY, radius:0, alpha:255 });
}

function drawLightGrid() {
  strokeWeight(1.5);
  let wave = sin(frameCount * 0.05) * 10;
  let colors = ['#b22222','#7A140F','#000000'];

  for (let x=0; x<width; x+=40) {
    for (let y=0; y<height; y+=40) {
      let dx = x - mouseX, dy = y - mouseY;
      let d = sqrt(dx*dx+dy*dy), a = atan2(dy,dx);
      let off = map(d,0,300,20,0);
      let px = x + cos(a)*off, py = y + sin(a)*off;
      let col = colors[int((x+y+frameCount*2)/40) % colors.length];
      stroke(color(col + hex(120 + 80*sin(frameCount*0.02 + x*0.01 + y*0.01),2)));
      point(px, py + wave);
    }
  }
}

function drawResponsiveCurve() {
  noFill();
  stroke(255,50,50,60);
  strokeWeight(2);
  beginShape();
  for (let pt of wavePoints) {
    let d = dist(mouseX,mouseY,pt.x,pt.y);
    let offY = map(d,0,300,-60,60);
    let w = sin(frameCount*0.05 + pt.x*0.01)*10;
    let ty = height * 0.3 + offY + w;
    pt.y = lerp(pt.y, ty, 0.1);
    curveVertex(pt.x, pt.y);
  }
  endShape();
}

function drawDynamicCurve() {
  noFill();
  let num = 12, sp = height/(num+1);
  stroke(255,60,60,120);
  for (let i=0; i<num; i++) {
    strokeWeight(map(i,0,num-1,1.5,0.2));
    beginShape();
    let baseY = sp*(i+1);
    for (let pt of dynamicCurvePoints) {
      let d = dist(mouseX,mouseY,pt.x,baseY);
      let offY = map(d,0,300,-40,40);
      let w = sin(frameCount*0.05 + pt.x*0.01 + i*0.1)*10;
      let ty = baseY + offY + w;
      pt.y = lerp(pt.y, ty, 0.1);
      curveVertex(pt.x, pt.y);
    }
    endShape();
  }
}

function drawRipples() {
  noFill();
  for (let i=rippleEffects.length-1; i>=0; i--) {
    let r = rippleEffects[i];
    stroke(255,100,100,r.alpha); strokeWeight(2);
    beginShape();
    for (let j=0; j<TWO_PI; j+=PI/12) {
      let angle = j + frameCount*0.05;
      let rad = r.radius + sin(j*6+frameCount*0.1)*5;
      curveVertex(r.x+cos(angle)*rad, r.y+sin(angle)*rad);
    }
    endShape(CLOSE);
    r.radius += 2; r.alpha -= 4;
    if (r.alpha<=0) rippleEffects.splice(i,1);
  }
}

function drawClockHands(x, y, radius) {
  const hr = hour()%12, mn = minute(), sc = second();
  push(); translate(x,y); strokeCap(ROUND);

  // 시침 (검정)
  stroke(0); strokeWeight(6);
  let hA = map(hr+mn/60,0,12,0,TWO_PI)-HALF_PI;
  line(0,0, cos(hA)*radius*0.5, sin(hA)*radius*0.5);

  // 분침 (검정)
  strokeWeight(4);
  let mA = map(mn+sc/60,0,60,0,TWO_PI)-HALF_PI;
  line(0,0, cos(mA)*radius*0.8, sin(mA)*radius*0.8);

  // 초침 (빨강)
  stroke('#b22222'); strokeWeight(2);
  let sA = map(sc,0,60,0,TWO_PI)-HALF_PI;
  line(0,0, cos(sA)*radius*0.9, sin(sA)*radius*0.9);

  pop();
}
