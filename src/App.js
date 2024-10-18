import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    civilite: '',
    adresse: '',
    cp: '',
    ville: '',
    telephone: '',
    email: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Générer ExternalId et DateFormulaire
    const ExternalId = Math.floor(Math.random() * 100000000); // Génération d'un ID aléatoire
    const DateFormulaire = new Date().toISOString(); // Date actuelle au format ISO

    // Créer l'URL à envoyer
    const url = `http://ws.ga-media.fr/services?GA_part=EGNSDGGC&GA_ws=WBJQUCEP&ExternalId=${ExternalId}&DateFormulaire=${DateFormulaire}&nom=${formData.nom}&prenom=${formData.prenom}&civilite=${formData.civilite}&adresse=${formData.adresse}&cp=${formData.cp}&ville=${formData.ville}&telephone=${formData.telephone}&email=${formData.email}`;

    try {
      const response = await axios.get(url);
      console.log('Response:', response.data);
      alert('Lead envoyé avec succès!');
      // Réinitialiser le formulaire
      setFormData({
        nom: '',
        prenom: '',
        civilite: '',
        adresse: '',
        cp: '',
        ville: '',
        telephone: '',
        email: '',
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi du lead:', error);
      alert('Erreur lors de l\'envoi du lead. Veuillez réessayer.');
    }
  };

  return (
    <div className="App">
      <h1>Formulaire de Saisie des Leads</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Civilité:</label>
          <select name="civilite" value={formData.civilite} onChange={handleChange} required>
            <option value="">Sélectionner</option>
            <option value="Monsieur">Monsieur</option>
            <option value="Madame">Madame</option>
          </select>
        </div>
        <div>
          <label>Nom:</label>
          <input type="text" name="nom" value={formData.nom} onChange={handleChange} required />
        </div>
        <div>
          <label>Prénom:</label>
          <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} required />
        </div>
        <div>
          <label>Adresse:</label>
          <input type="text" name="adresse" value={formData.adresse} onChange={handleChange} required />
        </div>
        <div>
          <label>Code Postal:</label>
          <input type="text" name="cp" value={formData.cp} onChange={handleChange} required />
        </div>
        <div>
          <label>Ville:</label>
          <input type="text" name="ville" value={formData.ville} onChange={handleChange} required />
        </div>
        <div>
          <label>Téléphone:</label>
          <input type="text" name="telephone" value={formData.telephone} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <button type="submit">Envoyer</button>
      </form>
    </div>
  );
}

export default App;
