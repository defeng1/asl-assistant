

let capture;
let button;
let bodypix;
let segmentation;
let stop = true;
var json_out = [];
let prediction = '';
let myFont;
//let json_out = {};
let interv2;

let hp;
let poses = [];


function setup() {

  //load();
  createCanvas(windowWidth, windowHeight);
  
  strokeWeight(5)
  capture = createCapture(VIDEO);

  /*hp = ml5.handpose(capture, modelReady);

  hp.on("predict", results => {
    poses = results;
  }); */

  capture.hide();

  /* Button */
  st_button = createButton('Start session');
  st_button.position(windowWidth * .2, windowHeight * .9);
  st_button.mousePressed(b_switch)
  st_button.style('color', 'green');
  fill(0);

  stroke(255);
  strokeWeight(2);


  line(windowWidth * .7,
       0,
       windowWidth * .7,
       displayHeight);    

  strokeWeight(0);
  fill(0, 0, 0, 150);
  rect(windowWidth * .7,
        0,
        windowWidth - (windowWidth * .6),
        windowHeight);  

  fill(255);
  textSize(100);
  p = text(prediction, windowWidth * .75, windowHeight * .5);
      
}

function modelReady() {
  console.log("Model loaded");
  // hp.singlePose();
}

function draw() {

  clear();
  //setup();

  image(capture, windowWidth * .1, 
                 windowHeight * .1, 
                 windowWidth * .4, 
                 windowHeight * .6); 
  
  fill(0);

  stroke(255);
  strokeWeight(2);

  line(windowWidth * .7,
      0,
      windowWidth * .7,
      displayHeight);    

  strokeWeight(0);
  fill(0, 0, 0, 150);
  rect(windowWidth * .7,
        0,
        windowWidth - (windowWidth * .6),
        windowHeight);  

  fill(255);
  textSize(100);
  p = text(prediction, windowWidth * .75, windowHeight * .5);


  if(!stop) {
    let c = get();
    st_button.remove()
    st_button = createButton('End session');
    st_button.position(windowWidth * .2, windowHeight * .9);
    st_button.mousePressed(b_switch);
    st_button.style('background-color', 'red');
    st_button.style('color', 'white');
    st_button.style('font-family', myFont);
  } else {
    st_button.remove()
    st_button = createButton('Start session');
    st_button.position(windowWidth * .2, windowHeight * .9);
    st_button.mousePressed(b_switch);
    st_button.style('background-color', 'green');
    st_button.style('color', 'white');
  }

  // Drawing hand landmarks
  //drawKeypoints();
  //drawSkeleton();
}




function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function b_switch() {
  stop = !stop;
  if(stop) {
    clearInterval(interv2);
  }
  if(!stop) {
    console.log(stop);
    interv2 = setInterval(function() {
      var data;
      var i;
      for(i = 0; i < 10; i++) { //Gets 10 frames per second
        setTimeout( function () { 
          key = i.toString();
          data = saveFrame();
          json_out.push(data);
        }, 150);
      }
      
      json_out = Object.assign({}, json_out);
      //Send POST request with json_out var
      fetch('/upload', {
        headers: {'Content-Type': 'application/json'},
        method: 'POST',
        body: JSON.stringify( {data: JSON.stringify(json_out) })
      }).then(function (response) {
        if (response.status !== 200) {
          console.log(`Looks like there was a problem. Status code: ${response.status}`);
          return;
        }
        response.json().then(function (data) {
          prediction = data["guess"]
          console.log(data);
        });
      }).catch(function (error) {
        console.log("Fetch error: " + error);
      });

      json_out = []

    }, 1500);
  }
}


function saveFrame() {

  /*let pic = image(c, 0, 0);
  save(c, 'output.png'); */

  let c = get(windowWidth * .2, 
              windowHeight * .1, 
              windowWidth * .5, 
              windowHeight * .6); 

  var base64 = c.canvas.toDataURL();
  // Get rid of the header stuff (should maybe do this in flask)
  var cleaned = base64.replace('data:image/png;base64,', '');
  // Make an object to post
  var data = {
    img: cleaned
  }

  c.loadPixels();
  let pixels = new Uint8ClampedArray(4);

  /*let data = {data: pixels, 
              width: (windowWidth * .5) - (windowWidth * .1),
              height: (windowHeight * .7) - (windowHeight * .1)}; */

  
  //const imageData = new ImageData(c.pixels, 720);
  
  //runModel(imageData);
  return cleaned;
}


// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    // let pose = poses[i].pose;
    // for (let j = 0; j < pose.keypoints.length; j++) {
    //   // A keypoint is an object describing a body part (like rightArm or leftShoulder)
    //   let keypoint = pose.keypoints[j];
    //   // Only draw an ellipse is the pose probability is bigger than 0.2
    //   if (keypoint.score > 0.2) {
    //     fill(255, 0, 0);
    //     noStroke();
    //     ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
    //   }
    // }
    let pose = poses[i];
    // console.log(pose)
    for (let j = 0; j < pose.landmarks.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.landmarks[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      // if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint[0], keypoint[1], 10, 10);
      // }
    }
  }
}


// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let annotations = poses[i].annotations;
    // For every skeleton, loop through all body connections
    stroke(255, 0, 0);
    for (let j = 0; j < annotations.thumb.length - 1; j++) {
      // let partA = annotations.thumb[j][0];
      // let partB = annotations.thumb[j][1];
      line(annotations.thumb[j][0], annotations.thumb[j][1], annotations.thumb[j + 1][0], annotations.thumb[j + 1][1]);
    }
    for (let j = 0; j < annotations.indexFinger.length - 1; j++) {
      line(annotations.indexFinger[j][0], annotations.indexFinger[j][1], annotations.indexFinger[j + 1][0], annotations.indexFinger[j + 1][1]);
    }
    for (let j = 0; j < annotations.middleFinger.length - 1; j++) {
      line(annotations.middleFinger[j][0], annotations.middleFinger[j][1], annotations.middleFinger[j + 1][0], annotations.middleFinger[j + 1][1]);
    }
    for (let j = 0; j < annotations.ringFinger.length - 1; j++) {
      line(annotations.ringFinger[j][0], annotations.ringFinger[j][1], annotations.ringFinger[j + 1][0], annotations.ringFinger[j + 1][1]);
    }
    for (let j = 0; j < annotations.pinky.length - 1; j++) {
      line(annotations.pinky[j][0], annotations.pinky[j][1], annotations.pinky[j + 1][0], annotations.pinky[j + 1][1]);
    }

    line(annotations.palmBase[0][0], annotations.palmBase[0][1], annotations.thumb[0][0], annotations.thumb[0][1]);
    line(annotations.palmBase[0][0], annotations.palmBase[0][1], annotations.indexFinger[0][0], annotations.indexFinger[0][1]);
    line(annotations.palmBase[0][0], annotations.palmBase[0][1], annotations.middleFinger[0][0], annotations.middleFinger[0][1]);
    line(annotations.palmBase[0][0], annotations.palmBase[0][1], annotations.ringFinger[0][0], annotations.ringFinger[0][1]);
    line(annotations.palmBase[0][0], annotations.palmBase[0][1], annotations.pinky[0][0], annotations.pinky[0][1]);
  }
}

