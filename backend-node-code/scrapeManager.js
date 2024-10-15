const assistant = require('./assistant');
const bing = require('./bing');
const data = require('./data');
const db = require('./db');


async function checkCodeExistance(countryCode) {
    try {
        const index = data.countriesArray.findIndex(x => x.code == countryCode);
        if (index === -1) {
            console.error("No country found in data file");
            return -1
        }
        let cid;
        const checkCountryExistance = await db.checkCountryCode(countryCode);
        if (checkCountryExistance.status == -1) {
            console.error("No country found in database...inserting country now");
            const addCountry = await db.saveCountry(data.countriesArray[index].code, data.countriesArray[index].name);
            if (addCountry.status == -1) {
                console.error("Unable to add country");
                return -1
            }
            cid = addCountry.cid
        } else {
            cid = checkCountryExistance.cid
        }
        console.log("Scrapping data for: ", data.countriesArray[index].name);
        return { "country_data": data.countriesArray[index], "cid": cid }
    } catch (error) {
        console.log("Error duriong scrape", error);

    }

}

async function runScrape(code = "") {
    const countryData = await checkCodeExistance(code)
    if (countryData == -1) {
        console.error("No country found");
        return;

    }    
    try {
        const pages = [];
        const countryName = countryData.country_data.name
        const searches = [
            `Myopia prevalence in ${countryName} statistics`,
            `Myopia prevalence by age group 0-18 19-45 46+ ${countryName} percentages`,
            `Myopia prevalence rural vs urban ${countryName} percentages`,
        ]        
        const linksAndData = await bing.bingSearch(searches)
        const dataFile = await assistant.saveFile(linksAndData.data)
        const queryResponse = await assistant.runQuery(`Give me the following data for the country of ${countryName}: Myopia prevalence in percentage, Myopia prevalence by age groups 0-18, 19-45 and 46+ in percentages and Myopia prevalence rural vs urban in 2024 percentages. Also, rate on a scale of 1 to 5, the availability or quality of data based on the files available If no percentage or data is found for each respective category or element, simply return "--" as the value. Provide the response through the clean_myopia_prevalence_responses function`);
        await handleResponses(queryResponse, countryData.cid, linksAndData.links)
        console.log("Scrapping data for: " + countryName + " is complete");
        return true;
    } catch (error) {
        console.error("Master warning, ", error);
        return false;
    }
}

async function handleResponses(responseObj, id, links) {
    try {
        console.log(responseObj);
        
        const today = new Date();
        if (typeof responseObj === 'object' && responseObj !== null) {
            console.log("Is object");
        } else {
            console.log("Not object");
            return false;
        }
        // db.saveToSingleColumn('reference_links', JSON.stringify(links), id);
        const prevalence = {
            "age_groups": responseObj.age_groups,
            "geographic_regions": responseObj.geographic_regions
        }
        await db.saveToSingleColumn('myopiaPercentage', responseObj.myopiaPercentage, id);
        await db.saveToSingleColumn('prevalence', JSON.stringify(prevalence), id);
        await db.saveToSingleColumn('data_availability', responseObj.data_availability, id);
        await db.saveToSingleColumn('lastScrapeDate', today, id)
    } catch (error) {
        console.error("Error handling the response: ", error);
    }
}

async function scrapeAfricanContinent() {
    console.log("Scrapping the african continent");
    let index = success = failed = 0;
    for (const element of data.africanCountries) {
        const result = await runScrape(element.code);
        index++;
        if (result == true) {
            success++
        }else{
            failed++
        }
        console.log("Countries scrapped \nScrapped: "+index+"/"+data.africanCountries.length+" \nSuccess: "+success+"\nFailed: "+failed);
    }
}


async function manualscrapeManager(countryCodes) {
    console.log("Scrapping the country codes: ", ...countryCodes);
    let index = success = failed = 0;
    for (const element of countryCodes) {
        const result = await runScrape(element);
        index++;
        if (result == true) {
            success++
        }else{
            failed++
        }
        console.log("Countries scrapped \nScrapped: "+index+"/"+countryCodes.length+" \nSuccess: "+success+"\nFailed: "+failed);
    }
    console.log("Scrapping complete");
    
    return;
}



