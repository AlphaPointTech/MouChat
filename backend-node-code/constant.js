

const FUNCS = [
    // {
    //     "name": "fetch_prevalence_rate_chart_data",
    //     "description": "Fetch prevalence rate data for a disease to visualize on charts. The data includes prevalence rates segmented by age group, geographic region, and time period for visualizing trends and comparisons.",
    //     "parameters": {
    //       "type": "object",
    //       "properties": {
    //         "disease": {
    //           "type": "string",
    //           "description": "The name of the disease for which prevalence data is being requested (e.g., Myopia, Diabetes)."
    //         },
    //         "age_group": {
    //           "type": "array",
    //           "description": "An array of age groups for which the prevalence data is requested (e.g., ['Children', 'Adults', 'Elderly']).",
    //           "items": {"type": "string"}
    //         },
    //         "geographic_region": {
    //           "type": "array",
    //           "description": "An array of geographic regions for which the prevalence data is being requested (e.g., ['Urban', 'Rural', 'Zambia', 'South Africa']).",
    //           "items": {"type": "string"}
    //         },
    //         "time_period": {
    //           "type": "array",
    //           "description": "An array of years representing the time periods to compare (e.g., [2020, 2021, 2022, 2023]).",
    //           "items": {
    //             "type": "integer"
    //           }
    //         },
    //         "metrics": {
    //           "type": "array",
    //           "description": "An array of metrics to fetch for the chart (e.g., ['Prevalence Rate', 'Progression Rate']).",
    //           "items": {
    //             "type": "string"
    //           }
    //         },
    //         "format": {
    //           "type": "string",
    //           "description": "The format of the data to return for chart rendering (e.g., 'line_chart', 'bar_chart').",
    //           "enum": ["line_chart"]
    //         }
    //       },
    //       "required": ["disease", "age_group", "geographic_region", "time_period", "metrics"]
    //     }
    // },
    {
        name: "user_search_for_myopia",
        description: "If user indicates myopia or any related information, retrieve all related details dynamically.",
        parameters: {
            type: "object",
            properties: {
                progression_rate: {type: "integer", description: "Percentage value of Progression Rate"},
                autorefraction: {type: "string", description: "value of autorefraction Rate"},
                category: {
                    type: "string",
                    description: "value of category in user query", 
                },
                retinoscopy: {
                    type: "string",
                    description: "value of retinoscopy Rate", 
                },
                childred_age: {
                    type: "string",
                    description: "value of age group in response", 
                },
                population_projection_count: {
                    type: "string",
                    description: "total Population projection of user query", 
                },
                population_projection_year: {
                    type: "string",
                    description: "Population projection of user query by year", 
                },
                cities: {
                    type: "array",
                    description: "Array of cities search by user query. Cities array must be atleast length of 10", 
                    items : {
                        type : 'string'
                    }
                },
                country: {
                    type: "string",
                    description: "Country of user search query", 
                },
                diseases: {
                    "type": "array",
                    "description": "Array of user search query",
                    "items": {
                        "type": "string"
                    }
                },
                content: {
                    type: "string",
                    description: "Detailed content of user query. It must be minimum 2000 words. this should be an HTML format output. instead of gpt output format", 
                },
                additional_data: {
                    type: "array",  // Dynamic nested array of objects
                    description: "Dynamic array of additional data related to the query. Can include various information. array of minimum 10 cities",
                    items: {
                        type: "object",
                        additionalProperties: true, // Allow dynamic object structure
                        description: "Dynamic object containing additional related data",
                        properties : {
                            city: {
                                type: "string",
                                description: "City Name", 
                            },
                            population_before : {
                                type: "object",
                                description: "Population of mentioned disease in mention category before given content. This data should be for Past dates. All sub years in this Data should be same", 
                                properties : {
                                    year : {type: "string", description: "year of given content",},
                                    population_count : {type: "integer", description: "population_count of given content",}
                                }
                            },
                            population_after : {
                                type: "object",
                                description: "Population of mentioned disease in mention category after given content. This data should be for Future dates. All selected years should be same for this", 
                                properties : {
                                    year : {type: "string", description: "year of given content",},
                                    population_count : {type: "integer", description: "population_count of given content",}
                                }
                            },
                            incidence_rate: {
                                type: "integer",
                                description: "incidence_rate of given content", 
                            },
                            screen_time_hours: {
                                type: "string",
                                description: "screen_time_hours of given content", 
                            },
                            latest_news: {
                                type: "string",
                                description: "latest_news of given content", 
                            },
                            related_value: {
                                type: "integer",
                                description: "This field is must. Related value will be displayed on graph. this value will be relative to selected Disease and Category. Categories are : Prevalence rates, Progression Rates, Treatment Efficacy, Risk Factor Analysis, Impact of Educational Programmemes for the public, Service Delivery Metrics, Patient Outcomes, Market Analysis, Legislative and Policy Impact, Predictive Modeling, Philanthropic Funding Tracking, Technologies, Products, Companies, Training Programmes, Regulations, Clinical Trials, Publications, Non-Profits Involved, Academic Institutions. So value should be fetched from content and manage according to category which mentioned in user query", 
                            },
                            related_title: {
                                type: "string",
                                description: "in the same function i required related value. this related title field will be the exact title of that value", 
                            },
                        }
                    },
                },
                data: {
                    type: "array",  // Dynamic nested array of objects
                    description: "A chart showing Myopia progression and prediction, this data should vary from category to category. This data will be displayed in a chart so Column Name and Column Value will be dynamic from your response. (eg in category : prevalence rates, it will be a line chart that shows Myopia prevalence rates for the 10 years from 2022, 2023, 2024 and then 2025. This year value is just an example you must generate valid dynamic response)",
                    items: {
                        type: "object",
                        additionalProperties: true, // Allow dynamic object structure
                        description: "Dynamic object containing additional related data",
                        properties : {
                            column_name: {
                                type: "string",
                                description: "Value will be column name", 
                            },
                            column_value: {
                                type: "integer",
                                description: "Value will be column value", 
                            },
                        }
                    }
                }
            },
            semantic_data: "object",
            required: [
                "content", 
                "progression_rate", 
                "childred_age", 
                "population_projection_count", 
                "population_projection_year", 
                'autorefraction',
                'cities',
                'country',
                'diseases',
                'additional_data',
                'data',
            ],
        },
    },
    {
        name: "user_asked_about_his_email",
        description: "User asked about his email",
        parameters: {
            type: "object",
            properties: {
                email: {
                    type: "string",
                    description: "The email to be logged", 
                },
            },
            required: ["email"],
        },
    },
]


module.exports = {
    FUNCS
};
