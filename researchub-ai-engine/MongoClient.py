from dotenv import load_dotenv
from pymongo import MongoClient

##Loads the .env file into os.environ
load_dotenv()

## os helps python interact with operating system
import os

DB_URI = os.getenv("MONGO_DB_URI")
DB_NAME = os.getenv("MONGO_DB_NAME")

# print(DB_URI)


# TODO, move to MongoEngine (ODM) provides schema validations, easier to maintain
def getDatabase():
    # DB connection string
    CONNECTION_STRING = DB_URI
    # Creates connection to mongo db via mongo client
    client = MongoClient(CONNECTION_STRING)
    # provides access to a specific DB
    return client[DB_NAME]


if __name__ == "__main__":
    dbName = getDatabase()
