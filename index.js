// const express = require('express');
// const axios = require('axios');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(express.urlencoded({ extended: true }));

// app.get('/api/hello', async (req, res) => {
//     const visitorName = req.query.visitor_name;
//     let clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

//     console.log(`Client IP: ${clientIp}`);

//     try {
//         const locationResponse = await axios.get(`https://ipapi.co/${clientIp}/json/`);
//         const locationData = locationResponse.data;
//         console.log('Location Data:', locationData);

//         const location = locationData.city || locationData.region || 'Unknown';

//         if (location === 'Unknown') {
//             res.status(400).json({ error: 'Could not determine location' });
//             return;
//         }

//         const weatherApiKey = process.env.API_KEY;
//         if (!weatherApiKey) {
//             throw new Error('Weather API key is missing in environment variables');
//         }

//         const weatherResponse = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${location}`);
//         const weatherData = weatherResponse.data;
//         console.log('Weather Data:', weatherData);

//         const temperature = weatherData.current.temp_c;

//         res.send(`
//             Client IP: ${clientIp}
//             Location: ${location}
//             Greeting: Hello, ${clientName}!, the temperature is ${temperature} degrees Celsius in ${location}
//         `);
//     } catch (error) {
//         console.error('Error:', error.response ? error.response.data : error.message);
//         res.status(500).json({ error: 'An error occurred while processing your request' });
//     }
// });

// app.listen(PORT, () => {
//     console.log(`Server is running at http://localhost:${PORT}`);
// });


// const express = require('express');
// const axios = require('axios');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(express.urlencoded({ extended: true }));

// app.get('/api/hello', async (req, res) => {
//     const visitorName = req.query.visitor_name;
//     let clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

//     console.log(`Client IP: ${clientIp}`);

//     try {
//         const locationResponse = await axios.get(`https://ipapi.co/${clientIp}/json/`);
//         const locationData = locationResponse.data;
//         console.log('Location Data:', locationData);

//         if (!locationData || locationData.error) {
//             throw new Error('Could not determine location');
//         }

//         const location = locationData.city || locationData.region || 'Unknown';

//         const weatherApiKey = process.env.API_KEY;
//         if (!weatherApiKey) {
//             throw new Error('Weather API key is missing in environment variables');
//         }

//         const weatherResponse = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${location}`);
//         const weatherData = weatherResponse.data;
//         console.log('Weather Data:', weatherData);

//         const temperature = weatherData.current.temp_c;

//         res.json({
//             clientIp: clientIp,
//             location: location,
//             greeting: `Hello, ${visitorName}!`,
//             temperature: `The temperature is ${temperature} degrees Celsius in ${location}`
//         });
//     } catch (error) {
//         console.error('Error:', error.message);
//         res.status(500).json({ error: 'An error occurred while processing your request' });
//     }
// });

// app.listen(PORT, () => {
//     console.log(`Server is running at http://localhost:${PORT}`);
// });


const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

app.get('/api/hello', async (req, res) => {
    const visitorName = req.query.visitor_name;
    let clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    console.log(`Client IP: ${clientIp}`);
    if (clientIp === '::1' || clientIp === '127.0.0.1') {
        console.log('Client IP is localhost, skipping geolocation and weather API calls');
        return res.status(400).json({ error: 'Cannot determine location for localhost IP' });
    }

    try {

        const locationResponse = await axios.get(`https://ipapi.co/${clientIp}/json/`);
        const locationData = locationResponse.data;
        console.log('Location Data:', locationData);

        if (!locationData || locationData.error) {
            throw new Error('Could not determine location');
        }

        const location = locationData.city || locationData.region || 'Unknown';

        const weatherApiKey = process.env.API_KEY;
        if (!weatherApiKey) {
            throw new Error('Weather API key is missing in environment variables');
        }

        const weatherResponse = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${location}`);
        const weatherData = weatherResponse.data;
        console.log('Weather Data:', weatherData);

        const temperature = weatherData.current.temp_c;

        res.json({
            clientIp: clientIp,
            location: location,
            greeting: `Hello, ${visitorName}!`,
            temperature: `The temperature is ${temperature} degrees Celsius in ${location}`
        });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
