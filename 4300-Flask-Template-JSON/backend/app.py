import json
import os
from flask import Flask, render_template, request
from flask_cors import CORS
from helpers.MySQLDatabaseHandler import MySQLDatabaseHandler
import pandas as pd
import re
import numpy as np

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

#Angela similarity method

#open and read data from file
file = open('4300_dataset.json')
data = json.load(file)
file.close()

#initialize variables that will be useful later
#word to number
num_to_token = {}
token_to_num = {}
num_good_types = 0
good_types = set()
#restaurant to number
res_to_num = {}
num_to_res = {}

#PRE-PROCESSING
#will be used to determine whether or not something is a good type
#number of reviews something appears in
occurrences = {}
total_reviews = 0
#makes sure we are not having words occur multiple times
word_set = set()
#used for indexing
total_restaurants = 0

#Finding Good Types
#tokenizer method
def tokenizer(text):
  word_regex = re.compile(r"""
  (\w+)
    """, re.VERBOSE)
  return re.findall(word_regex, text)

#loop through all restaurants
for restaurant in data.keys():
  #we won't be deleting any restaurants so we can do this bit now
  res_to_num[restaurant] = total_restaurants
  num_to_res[total_restaurants] = restaurant
  total_restaurants += 1
  #loop through all reviews
  print(restaurant, data[restaurant].keys())
  try:
    for review in data[restaurant]['reviews']:
      #tokenize
      tokens = list(set(tokenizer(review.lower())))
      total_reviews += 1
      #update occurrence list 
      for token in tokens:
        if token in word_set:
          occurrences[token] += 1
        else:
          occurrences[token] = 1
        word_set.add(token)
  except:
    pass

#filter for good types
for word in word_set:
  if occurrences[word] >= 10:
    good_types.add(word)
    num_to_token[num_good_types] = word
    token_to_num[word] = num_good_types
    num_good_types += 1
  

#create inverted index
#we want to keep match query to restaurant, not query to individual review
#so counts will be based on number of times in all reviews for restaurants
inv_idx = {}
for restaurant in data.keys():
  cur_res_num = res_to_num[restaurant]
  #keeps track of occurrences for current restaurant
  cur_occur = {}
  try:
    #sum up occurrences over each review
    for review in data[restaurant]['reviews']:
      #tokenize review
      tokenized = tokenizer(review.lower())
      #get list of words in review
      token_set = set(tokenized)
      #for each word
      for token in token_set:
        #make sure token is good type
        if token in good_types:
          #update occurrences for current restaurant
          if token in cur_occur:
            cur_occur[token] += 1
          else:
            cur_occur[token] = 1
    #add occurrences to overall inverted index
    for token in cur_occur.keys():
      if token in inv_idx:
        inv_idx[token].append((cur_res_num, cur_occur[token]))
      else:
        inv_idx[token] = [(cur_res_num, cur_occur[token])]
  except:
    pass
  for token in cur_occur:
    #sort by increasing restaurant number
    inv_idx[token].sort(key=lambda x : x[0])

#compute idf values
idf = {}
for word in inv_idx.keys():
    list_docs = inv_idx[word]
    idf[word] = math.log2(total_restaurants / (1 + len(list_docs)))

#compute norms 
calc_sum = np.array([0] * total_restaurants)
for term in idf.keys():
    restaurants = token_to_num[term]
    for (restaurant_num, count) in restaurants:
        calc_sum[restaurant_num] += idf[term] * idf[term] * count * count
norms = calc_sum
norms = np.sqrt(norms)
norms[np.isnan(norms)] = 0

def ranks(query):
    #process query
    tokenized_query = tokenizer(query.lower())
    query_token_set = set(tokenized_query)
    query_word_counts = {}
    for word in query_token_set:
      if word in query_word_counts:
        query_word_counts[word] += 1
      else:
         query_word_counts[word] = 1
    query_norm = 0
    for word in query_word_counts.keys():
      if word in idf:
        query_norm += idf[word] * idf[word] * query_word_counts[word] * query_word_counts[word]
    query_norm = math.sqrt(query_norm)
    score_acc = {}
    for word in query_word_counts.keys():
        if word in good_types:
            for (restaurant, count) in inv_idx[word]:
                if restaurant in score_acc:
                    score_acc[restaurant] += idf[word] * count * query_word_counts[word] * idf[word]
                else:
                    score_acc[restaurant] = idf[word] * count * query_word_counts[word] * idf[word]
    results = []
    for restaurant in score_acc.keys():
       results.append((score_acc[restaurant] / norms[restaurant] * query_norm))
    return sorted(results, key=lambda x : x -[0])

#end of angela similarity method

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