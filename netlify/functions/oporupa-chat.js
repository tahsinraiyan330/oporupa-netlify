const MistralClient = require('@mistralai/mistralai');

// Initialize the Mistral client with your API key
const apiKey = process.env.MISTRAL_API_KEY;
const client = new MistralClient(apiKey);

exports.handler = async function(event, context) {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Parse the request body
        const { message } = JSON.parse(event.body);
        
        if (!message) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Message is required' })
            };
        }

        // Call the Mistral API
        const response = await client.agents.complete({
            agentId: "ag:9aca5309:20250914:oporupa-v1:77f094a7",
            messages: [{ role: "user", content: message }]
        });

        // Return the response
        return {
            statusCode: 200,
            body: JSON.stringify({ 
                response: response.choices[0].message.content 
            })
        };
        
    } catch (error) {
        console.error('Error:', error);
        
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Internal server error',
                message: error.message 
            })
        };
    }
};
