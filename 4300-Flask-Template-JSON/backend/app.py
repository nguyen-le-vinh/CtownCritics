import json
import os
from flask import Flask, render_template, request
from flask_cors import CORS
from helpers.MySQLDatabaseHandler import MySQLDatabaseHandler
import pandas as pd
import string

# ROOT_PATH for linking with all your files. 
# Feel free to use a config.py or settings.py with a global export variable
os.environ['ROOT_PATH'] = os.path.abspath(os.path.join("..",os.curdir))

# Get the directory of the current script
current_directory = os.path.dirname(os.path.abspath(__file__))

# Specify the path to the JSON file relative to the current script
json_file_path = os.path.join(current_directory, 'init.json')

# Assuming your JSON data is stored in a file named 'init.json'
with open(json_file_path, 'r') as file:
    data = json.load(file)
    restaurants_df = pd.DataFrame(data)

MIN_FREQ = 10

reviews_by_restaurant = {}
word_counts = {}
count = 0

for k in restaurants_df.keys():
    reviews_by_restaurant[k] = restaurants_df[k]['reviews']

for restaurant in reviews_by_restaurant: 
    reviews = reviews_by_restaurant[restaurant]
    
    try:
        for line in reviews:
            splt = line.lower().replace('\n', " ").translate(str.maketrans('', '', string.punctuation)).split(" ")
            
            for elem in splt:
                if elem not in word_counts:
                    word_counts[elem] = 1
                else:
                    word_counts[elem] += 1
    except:
        # don't know why this breaks for only one single occurrence but?
        count += 1

good_types = set()

for elem in word_counts:
    if word_counts[elem] >= MIN_FREQ:
        good_types.add(elem)

app = Flask(__name__)
CORS(app)

# Sample search using json with pandas
def json_search(locPreference, pricePreference, foodPreference, qualityPreference):
    # change later once more info has been added to json
    # ie. location of restaurant + price info
    name = 'Oishii Bowl'
    reviews = restaurants_df['Oishii Bowl']['reviews'][:2]
    ratings = restaurants_df['Oishii Bowl']['star rating']
    
    rating_score = 0
    rating_total = 0
    
    for r in ratings:
        rating_score += ratings[r] * int(r)
        rating_total += ratings[r]

    ret_dct1 = {'name': name, 'reviews': reviews, 'rating': round(rating_score/rating_total, 2)}
    ret_dct2 = {'name': name, 'reviews': reviews, 'rating': round(rating_score/rating_total, 2)}

    combined = {'results': [ret_dct1, ret_dct2]}

    return json.loads(json.dumps(combined))

@app.route("/")
def home():
    return render_template('base.html',title="sample html")

@app.route("/restaurants")
def episodes_search():
    locPreference = request.args.get("locPreference")
    pricePreference = request.args.get("pricePreference")
    foodPreference = request.args.get("foodPreference")
    qualityPreference = request.args.get("qualityPreference")
    return json_search(locPreference, pricePreference, foodPreference, qualityPreference)

if 'DB_NAME' not in os.environ:
    app.run(debug=True,host="0.0.0.0",port=5000)