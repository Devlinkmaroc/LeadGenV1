from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

# Modèle simplifié pour les leads (pas de base de données nécessaire)
@app.route('/leads', methods=['POST'])
def add_lead():
    data = request.json
    url = generate_url(data)
    response = requests.get(url)
    return jsonify({'status': 'success', 'response_status': response.status_code})

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
    url = base_url + "&".join([f"{key}={value}" for key, value in params.items()])
    return url

if __name__ == '__main__':
    app.run(debug=True)
