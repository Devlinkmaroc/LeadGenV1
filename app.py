from flask import Flask, request, jsonify
import requests
from urllib.parse import urlencode
import re

app = Flask(__name__)

# Modèle simplifié pour les leads (pas de base de données nécessaire)
@app.route('/leads', methods=['POST'])
def add_lead():
    data = request.json
    if data is None:
        return jsonify({'error': 'No data provided'}), 400

    # Validation des données
    required_fields = ['ExternalId', 'DateFormulaire', 'nom', 'prenom', 'civilite', 'adresse', 'cp', 'ville', 'telephone', 'email']
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({'error': f'Missing required field: {field}'}), 400

    if data['civilite'] not in ['Monsieur', 'Madame']:
        return jsonify({'error': 'Invalid civilite, must be Monsieur or Madame'}), 400

    if not validate_cp(data['cp']):
        return jsonify({'error': 'Invalid cp format, must be 5 digits'}), 400

    if not validate_email(data['email']):
        return jsonify({'error': 'Invalid email format'}), 400

    if not validate_telephone(data['telephone']):
        return jsonify({'error': 'Invalid telephone format'}), 400

    url = generate_url(data)
    print(f'Generated URL: {url}')  # Pour le débogage
    try:
        response = requests.get(url)
        response.raise_for_status()
        return jsonify({'status': 'success', 'response_status': response.status_code})
    except requests.exceptions.RequestException as e:
        return jsonify({'error': 'Failed to connect to external service', 'details': str(e), 'response': response.text if 'response' in locals() else 'No response'}), 500

def generate_url(data):
    base_url = "http://ws.ga-media.fr/services?"
    params = {
        "GA_part": "EGNSDGGC",
        "GA_ws": "WBJQUCEP",
        "ExternalId": data['ExternalId'],
        "DateFormulaire": data['DateFormulaire'],
        "nom": data['nom'],
        "prenom": data['prenom'],
        "civilite": data['civilite'],
        "adresse": data['adresse'],
        "cp": data['cp'],
        "ville": data['ville'],
        "telephone": data['telephone'],
        "email": data['email']
    }
    url = base_url + urlencode(params)
    return url

def validate_cp(cp):
    return cp.isdigit() and len(cp) == 5

def validate_email(email):
    return re.match(r"^[^@]+@[^@]+\.[^@]+$", email) is not None

def validate_telephone(telephone):
    return re.match(r"^0[1-9][0-9]{8}$", telephone) is not None

if __name__ == '__main__':
    app.run(debug=True)
