from flask import Flask
# import pyrebase
# Local imports
from config.config_env import app_config # fire_config

# try:
#     config_name = os.environ['FLASK_CONFIG']
# except Exception:
#     raise Exception('Debe definir varibles de entorno FLASK_CONFIG ej: export FLASK_CONFIG=development')

config_name = "development"
# app = Flask(__name__, instance_relative_config=True)
app = Flask(__name__)
app.config.from_object(app_config[config_name])
# app.config.from_pyfile('config.py')

# firebase = pyrebase.initialize_app(fire_config)

from app.web_service import *
from app.basic_app import *