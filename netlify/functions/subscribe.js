const fetch = require("node-fetch");

exports.handler = async (event) => {
    try {
        const { email } = JSON.parse(event.body);

        if (!email) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "E-mail é obrigatório!" })
            };
        }

        const API_KEY = process.env.BREVO_API_KEY;
        const LIST_ID = parseInt(process.env.BREVO_LIST_ID, 10); // Converte para número

        if (!API_KEY || !LIST_ID) {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: "Erro no servidor: API_KEY ou LIST_ID não configurados." })
            };
        }

        const response = await fetch("https://api.brevo.com/v3/contacts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": API_KEY
            },
            body: JSON.stringify({
                email,
                listIds: [LIST_ID]
            })
        });

        const result = await response.json(); // Captura a resposta do Brevo

        if (!response.ok) {
            throw new Error(result.message || "Erro ao cadastrar e-mail no Brevo.");
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "E-mail cadastrado com sucesso!" })
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: `Erro: ${error.message}` })
        };
    }
};
