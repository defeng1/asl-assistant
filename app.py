# app.py
from flask import Flask, jsonify, request, render_template
from run_kmeans import run_kmeans
from io import BytesIO
from PIL import Image
import base64
import json
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
    # Notes to self: need to create an array of images -> pass to kmeans model 
    # -> get array and pass each one to cnn -> render in template
    for i, val in image_list.items():
        img = Image.open(BytesIO(base64.b64decode(val))) #Converts to an image
        #img.save('out.png')
        img = img.convert('RGB')
        kmeans_in.append(img)

    kmeans_out = run_kmeans(kmeans_in)
    print(kmeans_out)
    # Probabilities
    #prediction = model.predict(inputs);
    #label = model.predict_classes(inputs)
    # Send everything back as JSON
    return jsonify(status='got image');

@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(port=5000, debug=True, threaded=True)