
//require('@tensorflow');

/*
$ yarn add @tensorflow-models/handpose
$ yarn add @tensorflow/tfjs-core, @tensorflow/tfjs-converter
$ yarn add @tensorflow/tfjs-backend-webgl # or @tensorflow/tfjs-backend-wasm
*/

require('@tensorflow/tfjs-core');
const handpose = require('@tensorflow-models/handpose');
const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-backend-webgl');


/*async*/
function main() {
    // Load the MediaPipe handpose model.
    const model = handpose.load(); /*await*/
    // Pass in a video stream (or an image, canvas, or 3D tensor) to obtain a
    // hand prediction from the MediaPipe graph.
    const tensor = tf.browser.fromPixels('hand.jpg');
  
  
    const predictions = /* await */ model.estimateHands(tensor);
    if (predictions.length > 0) {
      /*
      `predictions` is an array of objects describing each detected hand, for example:
      [
        {
          handInViewConfidence: 1, // The probability of a hand being present.
          boundingBox: { // The bounding box surrounding the hand.
            topLeft: [162.91, -17.42],
            bottomRight: [548.56, 368.23],
          },
          landmarks: [ // The 3D coordinates of each hand landmark.
            [472.52, 298.59, 0.00],
            [412.80, 315.64, -6.18],
            ...
          ],
          annotations: { // Semantic groupings of the `landmarks` coordinates.
            thumb: [
              [412.80, 315.64, -6.18]
              [350.02, 298.38, -7.14],
              ...
            ],
            ...
          }
        }
      ]
      */
  
      for (let i = 0; i < predictions.length; i++) {
        const keypoints = predictions[i].landmarks;
  
        // Log hand keypoints.
        for (let i = 0; i < keypoints.length; i++) {
          const [x, y, z] = keypoints[i];
          console.log(`Keypoint ${i}: [${x}, ${y}, ${z}]`);
        }
      }
    }
  }
  main();