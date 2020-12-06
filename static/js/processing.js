

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

function setup() {

  //load();
  createCanvas(windowWidth, windowHeight);
  
  strokeWeight(5)
  capture = createCapture(VIDEO);

  capture.hide();

  /* Button */
  st_button = createButton('Start session');
  st_button.position(windowWidth * .2, windowHeight * .93);
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


function draw() {

  clear();
  //setup();

  image(capture, windowWidth * .1, 
                 windowHeight * .1, 
                 500, 
                 350); 
  
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
    st_button.position(windowWidth * .2, windowHeight * .93);
    st_button.mousePressed(b_switch);
    st_button.style('background-color', 'red');
    st_button.style('color', 'white');
    st_button.style('font-family', myFont);
  } else {
    st_button.remove()
    st_button = createButton('Start session');
    st_button.position(windowWidth * .2, windowHeight * .93);
    st_button.mousePressed(b_switch);
    st_button.style('background-color', 'green');
    st_button.style('color', 'white');
  }


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

  let c = get(windowWidth * .1, 
              windowHeight * .1, 
              500, 
              350);

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

