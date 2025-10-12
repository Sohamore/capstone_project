from flask import Flask, request, jsonify
import aiml
import os

app = Flask(__name__)

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'
    return response

BRN = os.path.join(os.path.dirname(__file__), 'bot_brain.brn')
AIML_DIR = os.path.join(os.path.dirname(__file__), '')

kernel = aiml.Kernel()
if os.path.exists(BRN):
    kernel.loadBrain(BRN)
else:
    # load aiml files
    for file in os.listdir(AIML_DIR):
        if file.endswith('.aiml'):
            kernel.learn(os.path.join(AIML_DIR, file))
    kernel.saveBrain(BRN)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json() or {}
    message = data.get('message', '')
    if not message:
        return jsonify({'reply': "I didn't receive a message."}), 400
    reply = kernel.respond(message)
    return jsonify({'reply': reply})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
