from flask import Flask, request, jsonify
from urllib.request import urlopen
import joblib
app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
    return "Hello"
@app.route('/prediction', methods=['POST'])
def predict():
    lr = joblib.load(urlopen("https://firebasestorage.googleapis.com/v0/b/vaksajns.appspot.com/o/random_forest%20(1)?alt=media")) 
    if lr:
        json = request.json
        print(json)
        predict = list(lr.predict([json]))
        return jsonify({'prediction': str(predict[0])})
    else:
        return 'Failed to load'

if __name__ == "__main__":
    app.run()
