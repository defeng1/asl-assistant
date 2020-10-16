let capture;
let button;
let photo;

function setup() {
  
  createCanvas(displayWidth, displayHeight);
  
  capture = createCapture(VIDEO);
  capture.size(500, 500);
  capture.hide();

  /* Button */
  button = createButton('Start session');
  button.position(displayWidth * .1, displayHeight * .9);
  button.mousePressed(saveFrame);
  fill(100);

}



function draw() {
  background(255);
  
  image(capture, displayWidth * .1, 
                 displayHeight * .1, 
                 displayWidth * .6, 
                 displayHeight * .7);
        

  /* textSize(16);
  textAlign(CENTER);
  text("ASL Assistant", displayWidth * .5, 100); */
}

//function mousePressed() {
function saveFrame() {

  /*let c = get(displayWidth * .1, 
                      displayHeight * .1, 
                      displayWidth * .6, 
                      displayHeight * .7);  // 
  let pic = image(c, 0, 0);
  save(c, 'output.png'); */
  let c = get();

  c.save('outputPhoto','png');


  console.log(typeof(c))
}



