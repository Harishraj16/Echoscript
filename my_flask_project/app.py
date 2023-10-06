from flask import Flask, request, jsonify
import os
import speech_recognition as sr

app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'Hello, Flask!'


@app.route('/upload_audio', methods=['POST'])
def upload_audio():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400

    audio_file = request.files['audio']

    if audio_file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Check if the file format is supported (e.g., mp3, wav, ogg)
    allowed_extensions = {'mp3', 'wav', 'ogg'}
    if not allowed_file(audio_file.filename, allowed_extensions):
        return jsonify({'error': 'Unsupported file format'}), 400

    # Save the uploaded audio file to a temporary location
    upload_dir = 'uploads'
    os.makedirs(upload_dir, exist_ok=True)
    audio_path = os.path.join(upload_dir, audio_file.filename)
    audio_file.save(audio_path)

    # Perform speech recognition using SpeechRecognition library
    recognizer = sr.Recognizer()
    with sr.AudioFile(audio_path) as source:
        audio_data = recognizer.record(source)

    try:
        transcription = recognizer.recognize_google(audio_data)
        return jsonify({'transcription': transcription}), 200
    except sr.UnknownValueError:
        return jsonify({'error': 'Unable to transcribe audio'}), 500
    except sr.RequestError as e:
        return jsonify({'error': f'Speech recognition request failed: {str(e)}'}), 500


def allowed_file(filename, allowed_extensions):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions


if __name__ == '__main__':
    app.run(debug=True)
