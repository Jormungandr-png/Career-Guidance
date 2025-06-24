from flask import Flask, request, jsonify
from flask_cors import CORS
import cohere
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

co = cohere.Client(os.getenv("COHERE_API_KEY"))

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_message = data.get("message")
    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    try:
        response = co.generate(
            model='command-xlarge-nightly',
            prompt=user_message,
            max_tokens=150,
            temperature=0.7,
            stop_sequences=["--"]
        )
        reply = response.generations[0].text.strip()
        return jsonify({"reply": reply})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
