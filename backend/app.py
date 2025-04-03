from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return "Welcome to da future"

@app.route('/process-data', methods=['POST'])
def process_data():
    #This extracts data from the request
    data = request.get_json()
    input_text = data.get('input_text', '')

    #here is where you can process the input_text as needed
    response = {
        'message': 'Data enroute!',
        'input_text': input_text
    }
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)