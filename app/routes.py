from flask import render_template, jsonify
from app import app
import json, requests

@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html', title='Equivtracker')

@app.route('/_get_json')
def get_json():
    r = requests.get('http://api.binance.com/api/v1/ticker/allPrices')
    data = json.loads(r.text)
    return jsonify(data)


