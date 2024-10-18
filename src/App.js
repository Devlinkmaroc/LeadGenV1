import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function App() {
    const [leads, setLeads] = useState([]);
    const [form, setForm] = useState({
        nom: '',
        prenom: '',
        civilite: '',
        adresse: '',
        cp: '',
        ville: '',
        telephone: '',
        email: ''
    });
    const [error, setError] = useState('');
    const [token, setToken] = useState('');

    // Fonction pour générer ExternalId unique
    const generateExternalId = () => {
        return Math.floor(Math.random() * 100000000);  // Génère un ID aléatoire à 8 chiffres
    };

    // Fonction pour générer la date et heure actuelles au format ISO
    const generateDateFormulaire = () => {
        return new Date().toISOString();  // Retourne la date actuelle au format ISO 8601
    };

    // Se connecter et obtenir le token JWT
    const login = async () => {
        try {
            const response = await axios.post('http://localhost:5000/login', {
                username: 'testuser',
                password: 'testpassword'
            });
            setToken(response.data.access_token);
            localStorage.setItem('jwtToken', response.data.access_token); // Stocke le token dans le localStorage
        } catch (error) {
            console.error('Login error:', error);
            setError('Login failed');
        }
    };

    const fetchLeads = useCallback(async () => {
        try {
            const jwtToken = localStorage.getItem('jwtToken'); // Récupère le token du localStorage
            const response = await axios.get('http://localhost:5000/leads', {
                headers: { Authorization: `Bearer ${jwtToken}` }
            });
            setLeads(response.data);
        } catch (error) {
            console.error('Error fetching leads:', error);
            setError('Failed to fetch leads');
        }
    }, []);

    useEffect(() => {
        login(); // Connexion pour obtenir le token JWT
        fetchLeads();
    }, [fetchLeads]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const jwtToken = localStorage.getItem('jwtToken'); // Récupère le token du localStorage
            const externalId = generateExternalId();  // Génération de ExternalId
            const dateFormulaire = generateDateFormulaire();  // Génération de DateFormulaire

            const leadData = {
                ...form,
                ExternalId: externalId,
                DateFormulaire: dateFormulaire
            };

            await axios.post('http://localhost:5000/leads', leadData, {
                headers: { Authorization: `Bearer ${jwtToken}` }
            });

            fetchLeads();  // Actualise la liste des leads
        } catch (error) {
            console.error('Error submitting lead:', error);
            setError('Failed to submit lead');
        }
    };

    return (
        <div>
            <h1>Formulaire de Saisie des Leads</h1>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '400px', margin: '0 auto' }}>
                <label>Nom :</label>
                <input name="nom" onChange={handleChange} placeholder="Nom" required />
                
                <label>Prénom :</label>
                <input name="prenom" onChange={handleChange} placeholder="Prénom" required />
                
                <label>Civilité :</label>
                <input name="civilite" onChange={handleChange} placeholder="Civilité" required />
                
                <label>Adresse :</label>
                <input name="adresse" onChange={handleChange} placeholder="Adresse" required />
                
                <label>Code Postal :</label>
                <input name="cp" onChange={handleChange} placeholder="Code Postal" required />
                
                <label>Ville :</label>
                <input name="ville" onChange={handleChange} placeholder="Ville" required />
                
                <label>Téléphone :</label>
                <input name="telephone" onChange={handleChange} placeholder="Téléphone" required />
                
                <label>Email :</label>
                <input name="email" onChange={handleChange} placeholder="Email" required />
                
                <button type="submit" style={{ marginTop: '20px' }}>Envoyer Lead</button>
            </form>
        </div>
    );
}

export default App;
