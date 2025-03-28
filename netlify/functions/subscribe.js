const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Método não permitido" })
        };
    }

    try {
        console.log("Recebendo requisição...");
        console.log("Variáveis de ambiente:", process.env.BREVO_API_KEY, process.env.BREVO_LIST_IDS);

        const { email, listId } = JSON.parse(event.body);
        if (!email) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "E-mail é obrigatório" })
            };
        }

        const API_KEY = process.env.BREVO_API_KEY;
        const LIST_IDS = process.env.BREVO_LIST_IDS.split(',').map(id => parseInt(id.trim(), 10));

        console.log("IDs de lista disponíveis:", LIST_IDS);
        
        // Se um listId foi enviado, verifica se é válido
        const selectedListId = listId ? parseInt(listId, 10) : LIST_IDS[0]; // Se não for enviado, usa o primeiro da lista
        console.log("List ID selecionado:", selectedListId);

        if (!LIST_IDS.includes(selectedListId)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "ID de lista inválido" })
            };
        }

        const response = await fetch("https://api.brevo.com/v3/contacts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "accept": "application/json",
                "api-key": API_KEY
            },
            body: JSON.stringify({
                email: email,
                listIds: [selectedListId],
                updateEnabled: true
            })
        });

        const data = await response.json();
        console.log("Resposta da API:", data);

        if (!response.ok) {
            throw new Error(data.message || "Erro ao adicionar contato");
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Inscrição realizada com sucesso!" })
        };
    } catch (error) {
        console.error("Erro ao processar a requisição:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
