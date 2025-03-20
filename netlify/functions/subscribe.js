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

        const response = await fetch("https://api.brevo.com/v3/contacts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "accept": "application/json",
                "api-key": process.env.BREVO_API_KEY
            },
            body: JSON.stringify({
                email: email,
                listIds: [123], // Substitua pelo ID da sua lista no Brevo
                updateEnabled: true
            })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Erro ao adicionar contato");
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Inscrição realizada com sucesso!" })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
