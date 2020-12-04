# app.py
from flask import Flask, jsonify, request, render_template
from run_kmeans import run_kmeans
from io import BytesIO
from keras.preprocessing.image import load_img, img_to_array 
from PIL import Image
import base64
import json
import numpy as np
from keras.models import load_model
cnn_model = load_model('model.h5')

app = Flask(__name__)

@app.route('/hello', methods=['GET', 'POST'])
def hello():

    # POST request
    if request.method == 'POST':
        print('Incoming..')
        print(request.get_data())  # parse as JSON
        return 'OK', 200

    # GET request
    else:
        message = {'greeting':'Hello from Flask!'}
        return jsonify(message)  # serialize and use JSON headers

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
    kmeans_out = run_kmeans(kmeans_in)
    out_json = {}
    for i in kmeans_out:
        print(i)
        i = i.resize((200, 200))
        #i = img_to_array(i) 
        i = np.expand_dims(i, axis=0)
        #i = np.reshape(i, (1, 200, 200, 3))
        pred = cnn_model.predict(i)
        predictions.append(np.argmax(pred))

    print(predictions[0], '\n')
    #a = iter(predictions)
    classnames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'del', 'nothing', 'space']

    keys = [str(i) for i in np.arange(0, len(predictions))]
    predictions = [classnames[i] for i in predictions]

    out = dict(zip(keys, predictions))
    #out = {str(i): np.argmax(i) for i in predictions}
    print(out)

    return json.dumps(out);

@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(port=5000, debug=True, threaded=True)