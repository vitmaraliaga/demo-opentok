# =====================WEB SERVICES==================
from flask import request, redirect, jsonify, make_response
from basic_app import api_key, api_secret, session, opentok
from main import app


# https://pypi.python.org/pypi/Flask-Cors
from flask_cors import CORS, cross_origin
cors = CORS(app)


# Mis funciones
@app.route('/session')
def get_session():
    key = api_key
    session_id = session.session_id
    token = opentok.generate_token(session_id)
    
    return jsonify(
        api_key = key,
        session_id = session_id,
        token = token
        )

# methodo funciona como web services
@app.route('/start-client', methods=['POST'])
def start_lient():

    has_audio = request.json['hasAudio']
    has_video = request.json['hasVideo']
    output_mode = OutputModes[request.json['outputMode']]
    session_id = request.json['sessionId']
    name_gravacion = request.json['nameGravacion']

    archive = opentok.start_archive(session_id, name=name_gravacion, 
                has_audio=has_audio, has_video=has_video, output_mode=output_mode)
    return jsonify(archive.json())

@app.route('/archive/<archive_id>/view')
def view_client(archive_id):
    archive = opentok.get_archive(archive_id)
    if archive.status=='available':
        
        return redirect(archive.url)
    else:
        print("El video no esta disponible")
        return jsonify(code = 404)


@app.route('/stop-client/<archive_id>', methods=['POST'])
def stop_client(archive_id):
    archive = opentok.stop_archive(archive_id)
    return jsonify(archive.json())


@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)