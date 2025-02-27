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
        const LIST_ID = process.env.BREVO_LIST_ID;

        const response = await fetch("https://api.brevo.com/v3/contacts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": API_KEY
            },
            body: JSON.stringify({
                email,
                listIds: [parseInt(LIST_ID)]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erro ao cadastrar e-mail");
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "E-mail cadastrado com sucesso!" })
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message })
        };
    }
};
