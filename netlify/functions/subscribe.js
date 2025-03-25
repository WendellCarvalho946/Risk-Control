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
        const LIST_IDS = process.env.BREVO_LIST_IDS.split(',').map(id => parseInt(id.trim(), 10));

        // Continue com a lógica do envio...
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Erro interno no servidor" })
        };
    }
};
