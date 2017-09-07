from flask import Flask

# Local imports
from config.config import app_config

# try:
#     config_name = os.environ['FLASK_CONFIG']
# except Exception:
#     raise Exception('Debe definir varibles de entorno FLASK_CONFIG ej: export FLASK_CONFIG=development')

config_name = "development"
# app = Flask(__name__, instance_relative_config=True)
app = Flask(__name__)
app.config.from_object(app_config[config_name])
# app.config.from_pyfile('config.py')

from app.web_service import *
from app.basic_app import *