from flask import Flask, jsonify, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
socketio = SocketIO(app, cors_allowed_origins="*")

tasks = []

@app.route('/tasks', methods=['GET'])
def get_tasks():
    return jsonify(tasks)

@app.route('/tasks', methods=['POST'])
def add_task():
    task = request.json.get('task')
    if task:
        tasks.append(task)
        socketio.emit('task_added', task)
        return jsonify({'task': task}), 201
    return jsonify({'error': 'Task content is required'}), 400

@socketio.on('connect')
def handle_connect():
    emit('all_tasks', tasks)

if __name__ == '__main__':
    socketio.run(app, debug=True)
