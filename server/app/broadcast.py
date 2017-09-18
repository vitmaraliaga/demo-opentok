from main import app

@app.route('/broadcast/start', methods=['POST'])
def create_broadcast():
    session_id = request.json['session_id']
    streams = request.json['streams']
    rtmp = request.json['rtmp']


    return jsonify(
        api_key = api_key,
        
        session_id = session_id,
        token = token,
        username = username
    )