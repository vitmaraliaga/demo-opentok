from flask import json
import os

class Credenciales():
    apiKey = ''
    apiSecret = ''

    def __init__(self):
        self.ReadJson()

    def getApiKey(self):
        return self.apiKey

    def getApiSecret(self):
        return self.apiSecret

    def ReadJson(self):
        basedir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
        json_url = os.path.join(basedir, 'config/', 'config.json')
        data = json.load(open(json_url))
        self.apiKey = data['apiKey']
        self.apiSecret = data['apiSecret']
        


class fire_Config():
    apiKey = ''
    authDomain = ''
    databaseURL = ''
    storageBucket = ''

    def __init__(self):
        self.ReadJson()

    def getApiKey(self):
        return self.apiKey

    def getAuthDomain(self):
        return self.authDomain

    def getDatabaseURL(self):
        return self.databaseURL

    def getStorageBucket(self):
        return self.storageBucket

    def ReadJson(self):
        basedir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
        json_url = os.path.join(basedir, 'config/', 'fire_config.json')
        data = json.load(open(json_url))
        self.apiKey = data['apiKey']
        self.authDomain = data['authDomain']
        self.databaseURL = data['databaseURL']
        self.storageBucket = data['storageBucket']
