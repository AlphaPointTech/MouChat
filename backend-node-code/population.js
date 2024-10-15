const axios = require('axios');

// Function to get population data for a country from World Population Review
async function getPopulation(countryName) {
    try {
        // URL to get population data for a specific country
        const response = await axios.get(
            `https://worldpopulationreview.com/countries/${countryName.toLowerCase()}-population`
        );
        
        const data = response.data;
        
        console.log(`Country: ${data.name}`);
        console.log(`Population: ${data.population}`);
    } catch (error) {
        console.error('Error fetching population data:', error.message);
    }
}

// Fetch population data for a country
getPopulation('United States');
