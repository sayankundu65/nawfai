import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
    // The API key is securely accessed from Netlify environment variables!
    // This prevents it from being exposed to the client bundle.
    const apiKey = process.env.GEMINI_API_KEY;

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Method not allowed, use POST" })
        };
    }

    if (!apiKey) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Missing GEMINI_API_KEY in environment" })
        };
    }

    try {
        const { prompt } = JSON.parse(event.body || "{}");
        // Example: Use `apiKey` here to call the Google Gemini API securely.
        // fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, ...)

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "API key securely accessed in Netlify Function!", promptReceived: prompt })
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" })
        };
    }
};
