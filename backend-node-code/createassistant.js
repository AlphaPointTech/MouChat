require('dotenv').config();
const OpenAI = require('openai');
const openai = new OpenAI({
  apiKey: process.env.API_KEY
});

async function createassistant() {
  const myAssistant = await openai.beta.assistants.create({
    instructions:
      "You are a bot that helps obtain information from files scraped by a web scrapper. If no data is present from the files, feel free to add your own data.",
    // "You search answeres online",
    name: "Myopia Assistant",
    tools: [
      { type: "file_search" },
      {
        type: "function",
        function: {
          name: "clean_myopia_prevalence_responses",
          description: "All responses from queries for myopia prevalence queries should be passed to this function",
          "strict": true,
          parameters: {
            type: "object",
            properties: {
              "myopiaPercentage": {
                type: "number",
                description: "Myopia total prevalence in percentage"
              },
              "data_availability": {
                type: "number",
                description: "The rating of data"
              },
              "age_groups": {
                type: "object",
                description: "Myopia percentages in different age groups",
                "properties": {
                  "0-18": {
                    "type": "number",
                    "description": "The prevalence of myopia in the age group of <18"
                  },
                  "19-45": {
                    "type": "number",
                    "description": "The prevalence of myopia in the age group of 19-45"
                  },
                  "46+": {
                    "type": "number",
                    "description": "The prevalence of myopia in the age group of 45+"
                  },
                },
                "additionalProperties": false,
                "required": [
                  "0-18",  // Add this to required
                  "19-45",
                  "46+"
                ]
              }, 
              "geographic_regions": {
                type: "object",
                description: "Myopia prevalence in rural and urban areas",
                "properties": {
                  "urban": {
                    "type": "number",
                    "description": "The prevalence of myopia in the urban areas"
                  },
                  "rural": {
                    "type": "number",
                    "description": "The prevalence of myopia in the rural areas"
                  }
                },
                "additionalProperties": false,
                "required": [
                  "urban",  // Add this to required
                  "rural"
                ]
              },
            },
            "additionalProperties": false,
            "required": [
              "myopiaPercentage",
              "data_availability",
              "age_groups",
              "geographic_regions",
            ]
          }
        }
      },
    ],
    model: "gpt-4o"
  });
  console.log(myAssistant);
}
async function createvector() {
  const vectorStore = await openai.beta.vectorStores.create({
    name: "Scrape Data Cache"
  });
  console.log("Vector id: " + vectorStore.id);

}

const bing_results_cleaner_tools = [{
  type: "function",
  function: {
    "name": "process_bing_result",
    "description": "Generate a strict JSON object based on the results obtained from the call_bing function call. If the bing results contained incoherent or no information that help answer the qestion, simply return null in all the parameters.",
    "strict": true,
    "parameters": {
      "type": "object",
      "properties": {
        "results_found": {
          "type": "boolean",
          "description": "If the desired result is found, results_found is true, else it is false"
        }, "results": {
          "type": "object",
          "description": "The results",
          "properties": {
            "Age Group (<18)": {
              "type": "number",
              "description": "The prevalence of myopia in the age group of <18"
            },
            "Age Group (19-45)": {
              "type": "number",
              "description": "The prevalence of myopia in the age group of 19-45"
            },
            "Age Group (>= 45)": {
              "type": "number",
              "description": "The prevalence of myopia in different age groups >=45"
            },
            "Geographic Region": {
              "type": "string",
              "description": "The prevalence of myopia variation across different regions (urban vs rural)"
            },
            "Time Period": {
              "type": "string",
              "description": "Change of the prevalence of myopia over the past decades"
            }
          },
          "additionalProperties": false,
          "required": [
            "Age Group",  // Add this to required
            "Geographic Region",
            "Time Period"
          ]
        },
      },
      "additionalProperties": false,
      "required": [
        "results_found",  // Add this to required
        "results"
      ]
    }
  }
}]

// asst_vJjrG0CuZU5ReFuX5C9naxOU

createassistant();