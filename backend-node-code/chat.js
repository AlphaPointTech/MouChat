require('dotenv').config();
const fs = require('fs');
const OpenAI = require('openai');
const constant = require('./constant')
const gpt_funcs = require('./gpt_funcs')
const axios = require('axios')

const assistantId = process.env.ASSISTANT_ID;
const vectorid = process.env.VECTOR_STORE
const openai = new OpenAI({
    apiKey: process.env.API_KEY
});



const CATEGORIES = {
    "Prevalence rates" : 'Search for information on the prevalence of myopia, addressing the following questions: 1) What is the prevalence of myopia in different age groups? 2) How does the prevalence of myopia vary across different regions (urban vs rural)? 3) How has the prevalence of myopia changed over the past decade? Focus on age group variations, geographic region differences, and trends, utilizing data from health surveys, population databases, electronic health records, pediatric clinics, academic studies, census data, geographic health databases, ophthalmic clinics, regional health surveys, longitudinal studies, national health reports, academic publications, and WHO reports., Also answer all the questions mentioned in this query. Answering the questions is very important. also conclude resources mentioned in this instructions. The report must be at least 3000 words, always supported by references from the aforementioned sources. Cite all sources used in this report with proper academic formatting.',
    "Progression Rates" : 'Search for information on myopia progression rates considering the following sub-categories: Age of Onset, Demographic Factors, and Environmental Factors. Answer these questions: How quickly does myopia progress in individuals based on their age at onset? What demographic factors (e.g., gender, ethnicity) influence the rate of myopia progression? How do environmental factors (e.g., screen time, outdoor activities) affect the rate of myopia progression? Utilize sources such as longitudinal patient records, pediatric health studies, clinical trial data, electronic health records, demographic studies, national health databases, academic journals, patient registries, lifestyle surveys, environmental health records, and wearable device data, Also answer all the questions mentioned in this query. Answering the questions is very important. also conclude resources mentioned in this instructions. The report must be at least 3000 words, supported by references from the aforementioned sources. Cite all sources used in this report with proper academic formatting.',
    "Treatment Efficacy" : 'Search for information on myopia treatment efficacy considering the following sub-categories: Treatment Type, Compliance Rates, and Side Effects. Answer these questions: Which treatments are most effective in slowing myopia progression? What are the compliance rates for different myopia treatments? What are the common side effects associated with different myopia treatments? Utilize sources such as clinical trial data, treatment registries, meta-analyses, patient follow-up surveys, patient adherence studies, health insurance claims data, pharmacovigilance databases, and academic publications, Also answer all the questions mentioned in this query. Answering the questions is very important. also conclude resources mentioned in this instructions. The report must be at least 3000 words, supported by references from the aforementioned sources. Cite all sources used in this report with proper academic formatting.',
    "Risk Factor Analysis" : 'Search for information on myopia risk factors considering the following sub-categories: Genetic Factors, Environmental Factors, and Lifestyle Factors. Answer these questions: What are the major genetic risk factors for developing myopia? How do environmental factors (e.g., screen time, exposure to natural light) correlate with myopia development? How do lifestyle choices (e.g., reading habits, screen time) influence the likelihood of developing myopia? Utilize sources such as genetic databases, genome-wide association studies (GWAS), academic publications, patient medical histories, environmental health studies, lifestyle surveys, geographic information systems (GIS), epidemiological studies, behavioral studies, and wearable technology data, Also answer all the questions mentioned in this query. Answering the questions is very important. also conclude resources mentioned in this instructions. The report must be at least 3000 words, supported by references from the aforementioned sources. Cite all sources used in this report with proper academic formatting.',
    "Impact of Educational Programmemes for the public" : 'Search for information on the impact of educational programmes for myopia prevention and management, focusing on these sub-categories: Programme Type, Behavioral Change, and Programme Elements. Address the following questions: What type of educational programmes are most effective in preventing or managing myopia? How effective are educational programmes in changing behavior related to myopia prevention? Which elements of educational programmes contribute most to their success? Use sources such as educational programme records, school health initiatives, academic studies, government health reports, pre- and post-programme surveys, behavioral health studies, academic research, school health reports, programme evaluation reports, interviews with educators, and government education records, Also answer all the questions mentioned in this query. Answering the questions is very important. also conclude resources mentioned in this instructions. The report must be at least 3000 words, supported by references from the aforementioned sources. Cite all sources used in this report with proper academic formatting.',
    "Service Delivery Metrics" : 'Search for information on service delivery metrics for myopia management, focusing on these sub-categories: Access to Services, Healthcare Professionals, Geographic Distribution, Service Frequency, and Training Programmes. Address the following questions: How accessible are specialized myopia services in different regions? How many healthcare professionals are trained and available to provide myopia management services? What is the geographic distribution of myopia management services? How often do patients with myopia seek treatment? What are the available training programmes for healthcare professionals in myopia management? Use sources such as geographic health databases, health service utilization records, GIS tools, patient satisfaction surveys, professional licensing databases, healthcare workforce surveys, academic studies, training programme records, health service distribution maps, national healthcare databases, WHO health service reports, health insurance claims data, academic research, and professional education records, Also answer all the questions mentioned in this query. Answering the questions is very important. also conclude resources mentioned in this instructions. The report must be at least 3000 words, supported by references from the aforementioned sources. Cite all sources used in this report with proper academic formatting.',
    "Patient Outcomes" : 'Search for information on patient outcomes related to myopia treatments, focusing on these sub-categories: Treatment Outcomes and Quality of Life. Address the following questions: What are the long-term outcomes of different myopia treatments? How do different treatments impact the quality of life of patients with myopia? Use sources such as longitudinal follow-up studies, clinical trial results, patient registries, academic publications, quality of life assessments, patient-reported outcome measures (PROMs), clinical follow-up surveys, and academic research, Also answer all the questions mentioned in this query. Answering the questions is very important. also conclude resources mentioned in this instructions. The report must be at least 3000 words, supported by references from the aforementioned sources. Cite all sources used in this report with proper academic formatting.',
    "Market Analysis" : 'Search for information on market analysis related to myopia, focusing on these sub-categories: Product Demand, Product Popularity, Geographic Trends, and Consumer Behavior. Address the following questions: What is the current demand for myopia-related products and services? Which myopia-related products are most popular among consumers? How does the demand for myopia-related products vary by region? What consumer behaviors are driving the demand for myopia-related products? Use sources such as market research reports, sales data, consumer surveys, healthcare product usage databases, consumer health technology usage reports, product reviews, regional sales data, consumer behavior studies, market segmentation reports, GIS tools, behavioral economics studies, and focus groups, Also answer all the questions mentioned in this query. Answering the questions is very important. also conclude resources mentioned in this instructions. The report must be at least 3000 words, supported by references from the aforementioned sources. Cite all sources used in this report with proper academic formatting.',
    "Legislative and Policy Impact" : 'Search for information on the legislative and policy impact related to myopia, focusing on these sub-categories: Policy Changes, Compliance, and Policy Outcomes. Address the following questions: How do recent legislative changes affect myopia management practices? How compliant are healthcare providers with new regulations on myopia management? What impact do specific policies have on the outcomes of myopia management? Use sources such as government health policy documents, public health records, compliance reports, academic publications, regulatory agency reports, healthcare provider surveys, compliance audits, industry reports, comparative studies, outcome evaluations, and academic research, Also answer all the questions mentioned in this query. Answering the questions is very important. also conclude resources mentioned in this instructions. The report must be at least 3000 words, supported by references from the aforementioned sources. Cite all sources used in this report with proper academic formatting.',
    "Predictive Modeling" : 'Search for information on predictive modeling related to myopia, focusing on these sub-categories: Risk Prediction, Intervention Targeting, and Model Accuracy. Address the following questions: Can we predict which individuals are most at risk of developing myopia? Which populations should be targeted with specific interventions based on predictive models? How accurate are the predictive models in forecasting myopia development? Use sources such as predictive modeling studies, genetic and environmental datasets, machine learning algorithms, academic research, population health studies, predictive modeling reports, healthcare provider insights, model validation studies, machine learning performance metrics, retrospective analyses, and academic publications, Also answer all the questions mentioned in this query. Answering the questions is very important. also conclude resources mentioned in this instructions. The report must be at least 3000 words, supported by references from the aforementioned sources. Cite all sources used in this report with proper academic formatting.',
    "Philanthropic Funding Tracking" : 'Search for information on philanthropic funding tracking related to myopia control, focusing on these sub-categories: Funding Amounts, Funded Projects, and Impact of Funding. Address the following questions: How much philanthropic funding is directed towards myopia control annually? Which types of projects or research receive the most funding in myopia control? How does philanthropic funding impact regional or global myopia control efforts? Use sources such as philanthropic foundations’ reports, grant databases, non-profit financial disclosures, academic research, grant-giving organisations’ reports, project outcome reports, funding agency databases, funding outcome studies, trend analysis reports, and regional public health records, Also answer all the questions mentioned in this query. Answering the questions is very important. also conclude resources mentioned in this instructions. The report must be at least 3000 words, supported by references from the aforementioned sources. Cite all sources used in this report with proper academic formatting.',
    "Technologies" : 'Search for information on technologies related to myopia management, focusing on these sub-categories: Optical Technologies, Diagnostic Technologies, and Treatment Technologies. Address the following questions: What optical technologies (e.g., lenses, contact lenses) are being used for myopia management? What diagnostic tools (e.g., OCT scans) are most effective in detecting and monitoring myopia? What new technologies are being developed for myopia treatment? Use sources such as technology usage reports, product development reports, patent filings, academic research, clinical diagnostic reports, product development data, research and development reports, clinical trial data, technology patents, and technology reviews, Also answer all the questions mentioned in this query. Answering the questions is very important. also conclude resources mentioned in this instructions. The report must be at least 3000 words, supported by references from the aforementioned sources. Cite all sources used in this report with proper academic formatting.',
    "Products" : 'Search for information on products related to myopia management, focusing on these sub-categories: Corrective Lenses, Contact Lenses, and Drug Interventions. Address the following questions: Which types of corrective lenses are most effective for managing myopia? What types of contact lenses are available for myopia management, and how effective are they? What pharmaceutical products are being used or developed for myopia management? Use sources such as clinical trial data, product reviews, sales data, academic studies, product catalogs, consumer reviews, drug trial data, pharmaceutical product databases, academic publications, and clinical guidelines, Also answer all the questions mentioned in this query. Answering the questions is very important. also conclude resources mentioned in this instructions. The report must be at least 3000 words, supported by references from the aforementioned sources. Cite all sources used in this report with proper academic formatting.',
    "Companies" : 'Search for information on companies involved in myopia management, focusing on these sub-categories: Manufacturers, Research & Development, and Market Leaders. Address the following questions: Which companies are leading the market in myopia management products? What companies are at the forefront of research and development in myopia management? Who are the market leaders in myopia-related products and services? Utilize sources such as market share reports, company financial reports, product development news, industry reports, patent filings, R&D reports, company press releases, academic collaborations, industry leader lists, company financial statements, and analyst reports, Also answer all the questions mentioned in this query. Answering the questions is very important. also conclude resources mentioned in this instructions. The report must be at least 3000 words, supported by references from the aforementioned sources. Cite all sources used in this report with proper academic formatting.',
    "Training Programmes" : 'Search for information on training programmes related to myopia management, focusing on these sub-categories: Professional Training and Technology Training. Address the following questions: What are the available training programmes for optometrists and ophthalmologists in myopia management? How are healthcare professionals being trained to use new technologies in myopia management? Utilize sources such as academic programme curricula, continuing education provider records, professional association guidelines, training programme directories, training programme syllabi, technology company training materials, academic publications, and professional workshops and seminars, Also answer all the questions mentioned in this query. Answering the questions is very important. also conclude resources mentioned in this instructions. The report must be at least 3000 words, supported by references from the aforementioned sources. Cite all sources used in this report with proper academic formatting.',
    "Regulations" : 'Search for information on regulations related to myopia management, focusing on the following sub-categories: Legislation, Compliance Requirements, and Regulatory Changes. Address these questions: What are the current regulations governing myopia management practices? What compliance requirements do healthcare providers need to meet for myopia management? How do recent regulatory changes impact myopia management practices? Utilize sources such as government health department documents, legal databases, regulatory agency reports, industry compliance guidelines, regulatory agency reports, healthcare compliance manuals, industry guidelines, legal databases, comparative studies, legal updates, healthcare provider feedback, and government publications, Also answer all the questions mentioned in this query. Answering the questions is very important. also conclude resources mentioned in this instructions. The report must be at least 3000 words, supported by references from the aforementioned sources. Cite all sources used in this report with proper academic formatting.',
    "Clinical Trials" : 'Search for information on clinical trials related to myopia management, focusing on the following sub-categories: Ongoing Trials, Trial Outcomes, and Participation Rates. Address these questions: What ongoing clinical trials are currently being conducted for myopia management? What are the reported outcomes of completed clinical trials in myopia management? What are the participation rates for clinical trials related to myopia management? Utilize sources such as clinical trial registries, academic publications, pharmaceutical company reports, clinical research networks, peer-reviewed journals, clinical trial reports, pharmaceutical company updates, healthcare provider feedback, clinical trial databases, patient recruitment reports, and academic publications, Also answer all the questions mentioned in this query. Answering the questions is very important. also conclude resources mentioned in this instructions. The report must be at least 3000 words, supported by references from the aforementioned sources. Cite all sources used in this report with proper academic formatting.',
    "Publications" : 'Search for information on publications related to myopia management, focusing on the following sub-categories: Research Articles, Review Papers, and Clinical Guidelines. Address these questions: What are the most influential research articles published on myopia management? What review papers provide comprehensive analyses of current trends in myopia research? What clinical guidelines have been published on the management of myopia? Utilize sources such as academic databases (e.g., PubMed, Google Scholar), citation analysis tools, peer-reviewed journals, university repositories, systematic review databases, medical association guidelines, professional society publications, healthcare provider manuals, and academic journals, Also answer all the questions mentioned in this query. Answering the questions is very important. also conclude resources mentioned in this instructions. The report must be at least 3000 words, supported by references from the aforementioned sources. Cite all sources used in this report with proper academic formatting.',
    "Non-Profits Involved" : 'Search for information on non-profits involved in myopia research and management, focusing on the following sub-categories: Organisations, Funding Initiatives, and Partnerships. Address these questions: Which non-profits are actively involved in myopia research and management? What initiatives are non-profits funding to address myopia on a global scale? How are non-profits partnering with other organisations to enhance myopia management efforts? Utilize sources such as non-profit organisation directories, grant-giving agency reports, partnership records, academic collaborations, non-profit annual reports, project outcome reports, partnership announcements, and healthcare provider feedback, Also answer all the questions mentioned in this query. Answering the questions is very important. also conclude resources mentioned in this instructions. The report must be at least 3000 words, supported by references from the aforementioned sources. Cite all sources used in this report with proper academic formatting.',
    "Academic Institutions" : 'Search for information on academic institutions involved in myopia research and education, focusing on the following sub-categories: Optometry Programmes, Ophthalmology Programmes, and Collaborative Research. Address these questions: Which academic institutions are leading in optometry education and research? What are the top academic institutions for ophthalmology research in myopia? How are academic institutions collaborating with industry and government on myopia research? Utilize sources such as university rankings, academic programme descriptions, research output metrics, professional association rankings, university research rankings, academic journal impact metrics, research funding data, academic conference presentations, academic-industry partnership records, government research grants, university collaboration reports, and peer-reviewed journals, Also answer all the questions mentioned in this query. Answering the questions is very important. also conclude resources mentioned in this instructions. The report must be at least 3000 words, supported by references from the aforementioned sources. Cite all sources used in this report with proper academic formatting.',
}

const convertToHTML = (gptResponse) => {
    let htmlContent = gptResponse
        // Convert bold sections (**) to <strong> tags
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Convert newlines to paragraph tags
        .replace(/\n\s*\n/g, '</p><p>')
        // Add paragraph tag for the first paragraph
        .replace(/^(.*?)(?=<strong>)/, '<p>$1')
        // Convert bullet points
        .replace(/(\d+\.)/g, '<li>$1</li>')
        // Convert citations like  
        .replace(/【(\d+:\d+)†source】/g, '<span class="citation">[$1]</span>')
        // Close any <p> tag before <ul>
        .replace(/<\/p><li>/g, '<ul><li>')
        // Close <ul> at the end of the list
        .replace(/<\/li>(?!<li>)/g, '</li></ul><p>')
        .replace(/<\/p>\s*$/, '</p>'); // Ensure no trailing closing paragraph tag
    
    console.log('converted')
    return htmlContent;
}




const user_asked_about_his_email = (data) => {
    console.log('This is email: ' + data.email)
    return data
}



let FUNCSMAP = {
    'user_asked_about_his_email' : user_asked_about_his_email,
    'user_search_for_myopia' : gpt_funcs.user_search_for_myopia,
    'fetch_prevalence_rate_chart_data' : gpt_funcs.fetch_prevalence_rate_chart_data,
}
console.log(constant.FUNCS)
async function runQuery(msgTxt, category, condition, country_name) {

    const semanticResult = await fetchPapers(condition, category, country_name);

    let cat_inst = CATEGORIES[category]
    //console.log(cat_inst)
    const completion = await openai.chat.completions.create({
        messages: [
            {"role": "assistant", "content": 'huzi@gmail.com is user"s email'},
            {"role": "assistant", "content": 'Provide detailed data and dynamic key-value pairs for the category, for the disease and country. The data should be suitable for visualization and mapping. Include any relevant statistics, trends, and key data points.'},
            {"role": "assistant", "content": `Instructions : ${cat_inst}`},
            {"role": "user", "content": msgTxt},
        ],
        model: "gpt-4o-mini",
        function_call: "auto",
        functions: constant.FUNCS
    });
    const choice = completion.choices[0]
    const message_obj = choice.message
    const function_call = message_obj.function_call

    // console.log("message_obj", message_obj);

    // console.log('done')
    if (function_call) {
        const func_name = function_call.name
        const func_args = JSON.parse(function_call.arguments)
        return {
            'status': 1,
            'response': FUNCSMAP[func_name](func_args),
            'semantic_data': semanticResult ?? {}
        }
    }
    return {
        'status': 1,
        'response': convertToHTML(message_obj.content)
    }


    async function fetchPapers(condition, category, country) {
        
        let queryString = `Eye Care ${condition} ${category} In ${country}`;

        // Function to capitalize the first letter of each word
        queryString = queryString
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
        
        queryString = queryString.replace(/\s+/g, '+');
        
        console.log(queryString);



        var options = {
            method: 'GET',
            url: 'https://api.semanticscholar.org/graph/v1/paper/search',
            params: {
                query: queryString,
                fields: 'title,authors,url,abstract,references',
                limit: 10  // Limit to 500 results
            },
            headers: {
              'User-Agent': 'insomnia/2023.5.8',
              'x-api-key': 'goaCkYKOGr3WnmkklDqLX4xVSYaSxT8E7rLS956A'
            }
          };
          
        try {
            console.log('try ', condition);
            // Wait for the axios request to complete and return the result
            const response = await axios.request(options);
            console.log('response', response);
            return response.data;  // Return the response data
        } catch (error) {
            console.error('Error fetching papers:', error.message);
            return null;  // Return null in case of an error
        }
    }



    // const p_file = await openai.files.create({
    //     file: fs.createReadStream("personal.txt"),
    //     purpose: "assistants",
    //   });
    // const m_file = await openai.files.create({
    //     file: fs.createReadStream("myopia.pdf"),
    //     purpose: "assistants",
    //   });


    // let fncs = FUNCS.map(fn => ({type: "function", function : fn}))
    // const assistant = await openai.beta.assistants.create({
    //     model: "gpt-4o-mini",
    //     instructions: "You are a healthcare bot. Use the provided functions to answer questions.",
    //     tools:  fncs,
    //   });

    // const thread = await openai.beta.threads.create()
    // const message = await openai.beta.threads.messages.create(
    //     thread.id,
    //     { 
    //         role: "user", 
    //         content: msgTxt, 
    //         attachments: [
    //             { file_id: 'file-msUwjr0tYnM41PRc0qMOMP95', tools: [{ type: "file_search" }] },
    //             { file_id: 'file-7ZEiveRRJPmN0flAwYVv5Lvr', tools: [{ type: "file_search" }] }
    //         ],
    //         }
    // );
    // let run = await openai.beta.threads.runs.createAndPoll(
    //     thread.id,
    //     {
    //         // assistant_id: 'asst_8VfLm2rQa2lqrkOWvlQkH5d9',
    //         assistant_id: assistantId,
    //     }
    // );
    // const messages = await openai.beta.threads.messages.list(
    //     run.thread_id
    // );
    // console.log('done')
    // if (run.status === 'completed') {
    //     for (const message of messages.data.reverse()) {
    //         if (message.role == 'assistant') {
    //             let response = message.content[0].text.value;
    //             return {
    //                 'status': 1,
    //                 'response': convertToHTML(response)
    //             }
    //         }
    //     }
    // }
    // else if (run.status == 'requires_action'){
    //     if (run.required_action.type == 'submit_tool_outputs'){
    //         const func_name = run.required_action.submit_tool_outputs.tool_calls[0].function.name;
    //         const args = run.required_action.submit_tool_outputs.tool_calls[0].function.arguments
    //         const func_args = JSON.parse(args)
    //         return {
    //             'status': 1,
    //             'response': FUNCSMAP[func_name](func_args)
    //         }
    //     }
    // }
    // return run
}

module.exports = {
    runQuery
};
