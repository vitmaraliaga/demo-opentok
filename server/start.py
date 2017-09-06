from flask import Flask, render_template, request, redirect, url_for, jsonify
from opentok import OpenTok, MediaModes, OutputModes
from email.utils import formatdate
import os, time

try:
    api_key = os.environ['API_KEY']
    api_secret = os.environ['API_SECRET']
except Exception:
    raise Exception('Debe definir variables de entorno API_KEY y API_SECRET')

app = Flask(__name__)
opentok = OpenTok(api_key, api_secret)
session = opentok.create_session(media_mode=MediaModes.routed)

from flask_cors import CORS, cross_origin
# https://pypi.python.org/pypi/Flask-Cors
cors = CORS(app)

@app.template_filter ('datefmt')
def datefmt(dt):
    return formatdate(time.mktime(dt.timetuple()))

@app.route('/')
def index():
    return render_template('index.html')    

@app.route('/host')
def host():
    key = api_key
    session_id = session.session_id
    token = opentok.generate_token(session_id)
    return render_template('host.html', api_key=key, session_id=session_id, token=token)

@app.route('/participant')
def participant():
    key = api_key
    session_id = session.session_id
    token = opentok.generate_token(session_id)
    return render_template("participant.html", api_key=key, session_id=session_id, token=token)

@app.route("/history")
def history():
    page = int(request.args.get('page', '1'))
    offset = (page - 1) * 5
    archives = opentok.get_archives(offset=offset, count=5)
    show_previous = '/history?page=' + str(page-1) if page > 1 else None
    show_next = '/history?page=' + str(page+1) if archives.count > (offset + 5) else None

    return render_template('history.html', archives=archives, show_previous=show_previous,
                            show_next=show_next)

@app.route('/download/<archive_id>')
def download(archive_id):
    archive = opentok.get_archive(archive_id)
    return redirect(archive.url)

@app.route('/start', methods=['POST'])
def start():
    has_audio = 'hasAudio' in request.form.keys()
    has_video = 'hasVideo' in request.form.keys()
    output_mode = OutputModes[request.form.get('outputMode')]

    archive = opentok.start_archive(session.session_id, name="Python Archiving Sanple App", 
                has_audio=has_audio, has_video=has_video, output_mode=output_mode)
    return archive.json()

@app.route('/stop/<archive_id>')
def stop(archive_id):
    archive = opentok.stop_archive(archive_id)
    return archive.json()

@app.route('/delete/<archive_id>')
def delete(archive_id):
    opentok.delete_archive(archive_id)
    return redirect(url_for('history'))


# =====================WEB SERVICES==================




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


if __name__ == '__main__':
    app.debug = True
    app.run()