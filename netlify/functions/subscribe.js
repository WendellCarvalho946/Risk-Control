require('dotenv').config();
const fetch = require('node-fetch');

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Método não permitido" })
        };
    }

    try {
        const { email } = JSON.parse(event.body);
        if (!email) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "E-mail é obrigatório" })
            };
        }

        const API_KEY = process.env.BREVO_API_KEY;
        const LIST_IDS = process.env.BREVO_LIST_ID 
            ? process.env.BREVO_LIST_ID.split(',').map(id => parseInt(id.trim(), 10))
            : [];

        if (LIST_IDS.length === 0) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Nenhuma lista de contatos configurada" })
            };
        }

        const response = await fetch("https://api.brevo.com/v3/contacts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "api-key": API_KEY
            },
            body: JSON.stringify({
                email,
                listIds: LIST_IDS
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: data.message || "Erro ao adicionar contato" })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Contato adicionado com sucesso", data })
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Erro interno do servidor", details: error.message })
        };
    }
};
