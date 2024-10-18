import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import './App.css'; // Assurez-vous d'importer le fichier CSS

function App() {
    const [leads, setLeads] = useState([]);
    const [form, setForm] = useState({});
    const [chartData, setChartData] = useState({});
    const [error, setError] = useState('');
    const [token, setToken] = useState('');

    const login = async () => {
        try {
            const response = await axios.post('http://localhost:5000/login', {
                username: 'testuser',
                password: 'testpassword'
            });
            setToken(response.data.access_token);
            localStorage.setItem('jwtToken', response.data.access_token);
        } catch (error) {
            console.error('Login error:', error);
            setError('Login failed');
        }
    };

    const fetchLeads = useCallback(async () => {
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            const response = await axios.get('http://localhost:5000/leads', {
                headers: { Authorization: `Bearer ${jwtToken}` }
            });
            setLeads(response.data);
            prepareChartData(response.data);
        } catch (error) {
            console.error('Error fetching leads:', error);
            setError('Failed to fetch leads');
        }
    }, []);

    useEffect(() => {
        login();
        fetchLeads();
    }, [fetchLeads]);

    const prepareChartData = (leads) => {
        if (!leads || leads.length === 0) {
            return;
        }
        
        const cities = leads.map(lead => lead.ville);
        const counts = {};
        cities.forEach(city => { counts[city] = (counts[city] || 0) + 1; });
        setChartData({
            labels: Object.keys(counts),
            datasets: [{
                label: '# de Leads',
                data: Object.values(counts),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        });
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            await axios.post('http://localhost:5000/leads', form, {
                headers: { Authorization: `Bearer ${jwtToken}` }
            });
            fetchLeads();
        } catch (error) {
            console.error('Error submitting lead:', error);
            setError('Failed to submit lead');
        }
    };

    return (
        <div className="container">
            <h1>Ajouter un Lead</h1>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <input name="nom" onChange={handleChange} placeholder="Nom" required />
                <input name="prenom" onChange={handleChange} placeholder="Prénom" required />
                <input name="civilite" onChange={handleChange} placeholder="Civilité" required />
                <input name="adresse" onChange={handleChange} placeholder="Adresse" required />
                <input name="cp" onChange={handleChange} placeholder="Code Postal" required />
                <input name="ville" onChange={handleChange} placeholder="Ville" required />
                <input name="telephone" onChange={handleChange} placeholder="Téléphone" required />
                <input name="email" type="email" onChange={handleChange} placeholder="Email" required />
                <button type="submit">Ajouter Lead</button>
            </form>
            <ul className="lead-list">
                {leads.map((lead, index) => (
                    <li key={index} className="lead-item">{lead.nom} {lead.prenom} - {lead.ville}</li>
                ))}
            </ul>
            <div className="chart-container">
                <h2>Leads par Ville</h2>
                <Bar data={chartData} />
            </div>
        </div>
    );
}

export default App;
