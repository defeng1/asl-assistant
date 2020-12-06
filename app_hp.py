# app.py
from flask import Flask, jsonify, request, render_template
#from run_kmeans import run_kmeans
from io import BytesIO
from tensorflow.keras.preprocessing.image import load_img, img_to_array 
from PIL import Image, ImageOps
import base64
import json
import numpy as np
import re
import tensorflow as tf
from tensorflow.keras.models import load_model
import statistics 
from statistics import mode 
hp_model = load_model('handpose.h5')

import cv2
import mediapipe as mp
mp_drawing = mp.solutions.drawing_utils
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=True,
    max_num_hands=1,
    min_detection_confidence=0.1)

app = Flask(__name__)


@app.route('/upload', methods=['POST'])
def upload():
    # Get the image data from the POST
    r_json = request.get_json()
    
    image_list = json.loads(r_json['data'])
    kmeans_in = []
    predictions = []
    # Notes to self: need to create an array of images -> pass to kmeans model 
    # -> get array and pass each one to cnn -> render in template
    for i, val in image_list.items():
        img = Image.open(BytesIO(base64.b64decode(val))) #Converts to an image
        #img.save('out.png')
        img = img.convert('RGB')
        kmeans_in.append(img)

    #ADD Try kmeans, catch error and then return the original data
    out_json = {}
    for i in kmeans_in:

        image = ImageOps.mirror(i)
        # Convert the BGR image to RGB before processing.
        image = cv2.cvtColor(np.array(image), cv2.COLOR_BGR2RGB)
        results = hands.process(image)
        #print(results.multi_hand_landmarks)

        if not results.multi_hand_landmarks:
            predictions.append('nothing')
            continue

        for hand_landmarks in results.multi_hand_landmarks:
            oneline = str.join(" ", str(hand_landmarks).splitlines())
      
            """
            Ugly text pre-processing
            """
            for r in (('x:', '"x":'), ('z:', ',"z":'), ('visibility:', ',"visibility":'), ('y:', ',"y":'),('presence:', ',"presence":')):
                oneline = oneline.replace(*r)
            landmarks = re.findall(r'\{(.*?)\}', oneline)
            json_o = '{'
            for idx, x in enumerate(landmarks):
                json_o += '"{0}": '.format(idx) + '{' + x + '}, \n'
            json_o = json_o[:-3] + '}'

            #Finally gets json in right format! Yay
            hello = json.loads(json_o)

            image_arr = []
            for idx, i in enumerate(hello.items()):
                #print(i)
                image_arr.append([i[1]['x'], i[1]['y'], i[1]['z']])
            
        image_arr = np.array(image_arr)
        image_arr = np.expand_dims(image_arr, 0)
        im_tensor = tf.convert_to_tensor(image_arr)

        pred = hp_model.predict(im_tensor, batch_size=1)

        predictions.append(np.argmax(pred))

    #a = iter(predictions)
    print(predictions)
    classnames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'del', 'space']

    #predictions = [classnames[i] for i in predictions if i is not 'nothing']
    try:
        prediction = mode([i for i in predictions if i is not 'nothing'])
    except:
        print("Predictions were all nothing")
        return json.dumps({"guess": " "});


    print(prediction)

    return json.dumps({"guess": classnames[prediction]});

@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(port=5000, debug=True, threaded=True)