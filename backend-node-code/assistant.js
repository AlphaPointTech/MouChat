require('dotenv').config();
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
const { response } = require('express');
// const { log } = require('console');
const assistantId = process.env.ASSISTANT_ID;
const vectorid = process.env.VECTOR_STORE;
const messageHistory = [];
const searchLimits = 2;
const maxTokens = 3000;

const openai = new OpenAI({
    apiKey: process.env.API_KEY
});

// async function createVector(name = "") {
//     if (name == "") {
//         return null;
//     }
//     const vectorStore = await openai.beta.vectorStores.create({
//         name: name
//     });
//     return vectorStore.id
// }

function splitArrayIntoChunks(arr, chunkSize) {
    let result = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        result.push(arr.slice(i, i + chunkSize));
    }
    return result;
}

async function saveFile(filePath = "") {
    try {
        const fileStreams = [filePath].map((path) =>
            fs.createReadStream(path)
        );

        const files = await openai.beta.vectorStores.fileBatches.uploadAndPoll(vectorid, {
            files: fileStreams,
        })

        await openai.beta.assistants.update(assistantId, {
            tool_resources: { file_search: { vector_store_ids: [vectorid] } },
        });

        // fs.unlink(filePath, (err) => {
        //     if (err) {
        //         console.error(`Error deleting ${filePath}:`, err);
        //     }
        // });
        return vectorid;
    } catch (error) {
        console.error("Error saving file: ", error);
        return vectorid;
    }
}

async function runQuery(msgTxt) {
    const thread = await openai.beta.threads.create();
    const message = await openai.beta.threads.messages.create(
        thread.id,
        { role: "user", content: msgTxt }
    );

    let run = await openai.beta.threads.runs.createAndPoll(
        thread.id,
        {
            assistant_id: assistantId
        }
    );
    if (run.status === 'requires_action') {
        const arguments = run.required_action.submit_tool_outputs.tool_calls[0].function.arguments
        const function_name = run.required_action.submit_tool_outputs.tool_calls[0].function.name;
        return JSON.parse(arguments);

        // const queries = [];            
        //     for (const element of run.required_action.submit_tool_outputs.tool_calls) {
        //         console.log(element);
        //         queries.push(element.)
        //     }
    }
    if (run.status === 'completed') {
        const messages = await openai.beta.threads.messages.list(
            run.thread_id
        );
        for (const message of messages.data.reverse()) {
            if (message.role == 'assistant') {
                const response = message.content[0].text.value;
                console.log(response);

                return {
                    'status': 2,
                    'response': response
                }
            }
        }
    }
}

// runQuery('Give me the following data for the country of South Africa: Myopia prevalence in percentage, Myopia prevalence by age groups 0-18, 19-45 and 46+ in percentages and Myopia prevalence rural vs urban in 2024 percentages. Also, rate on a scale of 1 to 5, the availability or quality of data based on the results found. If no percentage or data is found for each respective category or element, simply return "--" as the value.')

async function deleteFilesFromVector() {
    const vectorStoreFiles = await openai.beta.vectorStores.files.list(
        vectorid
    );
    const ids = vectorStoreFiles.body.data.map(item => item.id);
    for (const element of ids) {
        await openai.files.del(element);
    }
}



async function viewVectorFiles() {
    const vectorStoreFiles = await openai.beta.vectorStores.files.list(
        vectorid
    );
    console.log(vectorStoreFiles.body);
}
// deleteFilesFromVector();
// viewVectorFiles();

module.exports = {
    saveFile,
    runQuery
};

