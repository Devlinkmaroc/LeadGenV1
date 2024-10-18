from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

# Modèle simplifié pour les leads (pas de base de données nécessaire)
@app.route('/leads', methods=['POST'])
def add_lead():
    data = request.json
    if data is None:
        return jsonify({'error': 'No data provided'}), 400

    url = generate_url(data)
    try:
        response = requests.get(url)
        response.raise_for_status()
        return jsonify({'status': 'success', 'response_status': response.status_code})
    except requests.exceptions.RequestException as e:
        return jsonify({'error': 'Failed to connect to external service', 'details': str(e)}), 500

def generate_url(data):
    base_url = "http://ws.ga-media.fr/services?"
    params = {
        "GA_part": "EGNSDGGC",
        "GA_ws": "WBJQUCEP",
        "ExternalId": data.get('ExternalId', ''),
        "DateFormulaire": data.get('DateFormulaire', ''),
        "nom": data.get('nom', ''),
        "prenom": data.get('prenom', ''),
        "civilite": data.get('civilite', ''),
        "adresse": data.get('adresse', ''),
        "cp": data.get('cp', ''),
        "ville": data.get('ville', ''),
        "telephone": data.get('telephone', ''),
        "email": data.get('email', '')
    }
    url = base_url + "&".join([f"{key}={value}" for key, value in params.items()])
    return url

if __name__ == '__main__':
    app.run(debug=True)
