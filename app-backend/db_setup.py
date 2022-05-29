import pymongo
import redis

# Setting up MongoDB  
mongo_client = pymongo.MongoClient("localhost", 27017)
db = mongo_client['graphql-demo']

# Setting up redis
redis_client = redis.Redis(host='localhost', port=6379, db=0)