let video;
let poseNet;
let pose;
let canvas;
let skeleton;
let flag=0;
let brain;
let poseLabel='';
let target;
let poseCounter;
let target2;
let t=['B','A','C','E','G'];
let posesArray = ['Prayer Pose', 'Lotus Pose', 'Cow-Face Pose','Warrior I', 'Tree Pose'];
let posesHindi = ['(Pranama-asan)', '(Padma-asana)', '(Gomukha-asan)','(Ustra-asan)', '(Virabhadra-asana)', '(Vrikshasana)'];
let targethindi;
let counter;


// let resizeReset = function() {
// 	w = canvasBody.width = window.innerWidth;
// 	h = canvasBody.height = window.innerHeight;
// }

// const opts = {
// 	particleColor: "rgb(200,200,200)",
// 	lineColor: "rgb(200,200,200)",
// 	particleAmount: 30,
// 	defaultSpeed: 1,
// 	variantSpeed: 1,
// 	defaultRadius: 2,
// 	variantRadius: 2,
// 	linkRadius: 200,
// };

// window.addEventListener("resize", function(){
// 	deBouncer();
// });

// let deBouncer = function() {
//     clearTimeout(tid);
//     tid = setTimeout(function() {
//         resizeReset();
//     }, delay);
// };

// let checkDistance = function(x1, y1, x2, y2){
// 	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
// };

// let linkPoints = function(point1, hubs){
// 	for (let i = 0; i < hubs.length; i++) {
// 		let distance = checkDistance(point1.x, point1.y, hubs[i].x, hubs[i].y);
// 		let opacity = 1 - distance / opts.linkRadius;
// 		if (opacity > 0) {
// 			drawArea.lineWidth = 0.5;
// 			drawArea.strokeStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`;
// 			drawArea.beginPath();
// 			drawArea.moveTo(point1.x, point1.y);
// 			drawArea.lineTo(hubs[i].x, hubs[i].y);
// 			drawArea.closePath();
// 			drawArea.stroke();
// 		}
// 	}
// }

// Particle = function(xPos, yPos){
// 	this.x = Math.random() * w;
// 	this.y = Math.random() * h;
// 	this.speed = opts.defaultSpeed + Math.random() * opts.variantSpeed;
// 	this.directionAngle = Math.floor(Math.random() * 360);
// 	this.color = opts.particleColor;
// 	this.radius = opts.defaultRadius + Math.random() * opts. variantRadius;
// 	this.vector = {
// 		x: Math.cos(this.directionAngle) * this.speed,
// 		y: Math.sin(this.directionAngle) * this.speed
// 	};
// 	this.update = function(){
// 		this.border();
// 		this.x += this.vector.x;
// 		this.y += this.vector.y;
// 	};
// 	this.border = function(){
// 		if (this.x >= w || this.x <= 0) {
// 			this.vector.x *= -1;
// 		}
// 		if (this.y >= h || this.y <= 0) {
// 			this.vector.y *= -1;
// 		}
// 		if (this.x > w) this.x = w;
// 		if (this.y > h) this.y = h;
// 		if (this.x < 0) this.x = 0;
// 		if (this.y < 0) this.y = 0;
// 	};
// 	this.draw = function(){
// 		drawArea.beginPath();
// 		drawArea.arc(this.x, this.y, this.radius, 0, Math.PI*2);
// 		drawArea.closePath();
// 		drawArea.fillStyle = this.color;
// 		drawArea.fill();
// 	};
// };

// function setup(){
// 	particles = [];
// 	resizeReset();
// 	for (let i = 0; i < opts.particleAmount; i++){
// 		particles.push( new Particle() );
// 	}
// 	window.requestAnimationFrame(loop);
// }

// function loop(){
// 	window.requestAnimationFrame(loop);
// 	drawArea.clearRect(0,0,w,h);
// 	for (let i = 0; i < particles.length; i++){
// 		particles[i].update();
// 		particles[i].draw();
// 	}
// 	for (let i = 0; i < particles.length; i++){
// 		linkPoints(particles[i], particles);
// 	}
// }

// const canvasBody = document.getElementById("canvas"),
// drawArea = canvasBody.getContext("2d");
// let delay = 200, tid,
// rgb = opts.lineColor.match(/\d+/g);
// resizeReset();
// setup();

function setup() {
// Grab elements, create settings, etc.

/*
var video = document.getElementById('video');
// Get access to the camera!
if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Not adding `{ audio: true }` since we only want video now
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        //video.src = window.URL.createObjectURL(stream);
        video.srcObject = stream;
        video.play();
    });

  }   */
    //video = createCapture(VIDEO);
    //video.hide();

    /*  createCanvas(640, 480);
      video = createCapture(VIDEO);
      video.hide();

*/

  if (windowWidth<windowWidth/2  && windowHeight<windowHeight/2){
    canvas= createCanvas(500, 300);
    canvas.position(300,80);
    video = createCapture(VIDEO);
    video.hide();
  }

    canvas = createCanvas(600, 400);
    canvas.position(42,50);
    video = createCapture(VIDEO);
    video.hide();


poseNet = ml5.poseNet(video, modelLoaded);
poseNet.on('pose', gotPoses);
  poseCounter=0;
  counter = 0;
  targetLabel = posesArray[poseCounter];
  targethindi = posesHindi[poseCounter];
  target=t[poseCounter];
 document.getElementById("yogan").textContent = targetLabel;
 document.getElementById("yogahindi").textContent = targethindi;
  let options = {
    inputs: 34,
    outputs: 8,
    task: 'classification',
    debug: true
  }

  brain = ml5.neuralNetwork(options);
     const modelInfo = {
      model: 'model4/model.json',
      metadata: 'model4/model_meta.json',
      weights: 'model4/model.weights.bin',
    };

  brain.load(modelInfo, brainLoaded);

}

function brainLoaded() {
  console.log('pose classification ready!');

 classifyPose();
}
function windowResized() {
resizeCanvas(500, 300);
}

function classifyPose() {
  if (flag!=1){


  if (pose) {
    let inputs = [];
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      inputs.push(x);
      inputs.push(y);
    }

    brain.classify(inputs, gotResult);
  } else {
    setTimeout(classifyPose, 10);
  }
  }
}


function gotResult(error, results) {
document.getElementById("next").textContent = "";
document.getElementById("hold").textContent = "";
document.getElementById("welldone").textContent = "";
document.getElementById("time").textContent = "00:00";
  poseLabel='Hold pose for '+targetLabel;
  //console.log('iteration begin');
  console.log('Hold pose for '+targetLabel);
  if (results[0].label.toUpperCase()==target) {
    if (counter==30){
      console.log('next pose');
      poseLabel='Well done !! Next Pose';
      counter=0;
      nextPose();
      //flag=1;

    }
    else if (counter==0){
      console.log('iteration begin');
      counter+=1;
      document.getElementById("time").textContent = "00:"+"0"+counter;
      poseLabel='Hold pose for '+targetLabel;
      document.getElementById("hold").textContent = "Hold this pose";

      classifyPose();

    }
    else{
      poseLabel='Hold your pose';
      counter+=1;
      document.getElementById("hold").textContent = "Hold this pose";
      if (counter<9)
      document.getElementById("time").textContent = "00:"+"0"+counter;
      else{
        document.getElementById("time").textContent = "00:"+counter;
      }
      //console.log(poseLabel);
      //console.log(results[0].confidence);

      console.log(counter);
      classifyPose();
    }

  }
    else{
      poseLabel='Hold pose for '+targetLabel;
      document.getElementById("hold").textContent = "";
      document.getElementById("time").textContent = "00:00";
      counter=0;
      classifyPose();
    }

}

function nextPose(){
  if (poseCounter >= 3) {
    console.log("Well done, you have learnt all poses!");
    document.getElementById("hold").textContent = "";
    document.getElementById("next").textContent = "";
    document.getElementById("welldone").textContent = "Well Done!! You have completed all the poses.";
    var audio = new Audio('sound/sound.wav');
    audio.play();
    flag=1;

  }
  else{
    counter = 0;
    poseCounter = poseCounter + 1;
    targetLabel = posesArray[poseCounter];
    console.log("classifying will start");
    console.log("next pose target label" + targetLabel);
    document.getElementById("hold").textContent = "";

    target = t[poseCounter];
      //target2= posesHindi[poseCounter];
    document.getElementById("yogan").textContent = targetLabel;
    targethindi = posesHindi[poseCounter];
  document.getElementById("yogahindi").textContent = targethindi;
     document.getElementById("next").textContent = "Good job!! Please do the next pose.";
    console.log("classifying again");
    setTimeout(classifyPose, 4000)}

}


function modelLoaded() {
  console.log('poseNet ready');
}

function gotPoses(poses) {
  //console.log("getting poses");
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}
// NOTE: Uncomment this after you marge the code of the model

/* Legacy code below: getUserMedia
else if(navigator.getUserMedia) { // Standard
    navigator.getUserMedia({ video: true }, function(stream) {
        video.src = stream;
        video.play();
    }, errBack);
} else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
    navigator.webkitGetUserMedia({ video: true }, function(stream){
        video.src = window.webkitURL.createObjectURL(stream);
        video.play();
    }, errBack);
} else if(navigator.mozGetUserMedia) { // Mozilla-prefixed
    navigator.mozGetUserMedia({ video: true }, function(stream){
        video.srcObject = stream;
        video.play();
    }, errBack);
}
*/

//setInterval(function () {
//    secondPlay()
//}, 1000);


//setInterval(function () {
//    minutePlay()
//}, 10000);


function secondPlay() {
$("body").removeClass("play");
var aa = $("ul.secondPlay li.active");

if (aa.html() == undefined) {
    aa = $("ul.secondPlay li").eq(0);
    aa.addClass("before")
        .removeClass("active")
        .next("li")
        .addClass("active")
        .closest("body")
        .addClass("play");

}
else if (aa.is(":last-child")) {
    $("ul.secondPlay li").removeClass("before");
    aa.addClass("before").removeClass("active");
    aa = $("ul.secondPlay li").eq(0);
    aa.addClass("active")
        .closest("body")
        .addClass("play");
}
else {
    $("ul.secondPlay li").removeClass("before");
    aa.addClass("before")
        .removeClass("active")
        .next("li")
        .addClass("active")
        .closest("body")
        .addClass("play");
}

}

function minutePlay() {
$("body").removeClass("play");
var aa = $("ul.minutePlay li.active");

if (aa.html() == undefined) {
    aa = $("ul.minutePlay li").eq(0);
    aa.addClass("before")
        .removeClass("active")
        .next("li")
        .addClass("active")
        .closest("body")
        .addClass("play");

}
else if (aa.is(":last-child")) {
    $("ul.minutePlay li").removeClass("before");
    aa.addClass("before").removeClass("active");
    aa = $("ul.minutePlay li").eq(0);
    aa.addClass("active")
        .closest("body")
        .addClass("play");
}
else {
    $("ul.minutePlay li").removeClass("before");
    aa.addClass("before")
        .removeClass("active")
        .next("li")
        .addClass("active")
        .closest("body")
        .addClass("play");
}

}


function draw() {
  push();
  translate(video.width, 0);
  scale(-1, 1);
  image(video,0, 0, video.width,video.height);

  if (pose) {
    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(0);

      line(a.position.x, a.position.y, b.position.x, b.position.y);
    }
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(0);
      stroke(255);
      ellipse(x, y, 16, 16);
    }
  }
  pop();

  fill(255, 0, 255);
  noStroke();
  textSize(30);
  textAlign(CENTER, CENTER);
  text(poseLabel, width / 2, height -50);
}
