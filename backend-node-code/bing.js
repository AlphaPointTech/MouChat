require('dotenv').config();
const cheerio = require('cheerio');
const axios = require('axios');
const puppeteer = require('puppeteer');
const crypto = require('crypto');
const util = require('util');
const fs = require('fs');
const SUBSCRIPTION_KEY = process.env.SUBSCRIPTION_KEY;
const queryLimit = 3;
const path = require('path');
const { PDFDocument } = require('pdf-lib');
const { log } = require('console');
const writeFileAsync = util.promisify(fs.writeFile);

async function bingSearch(queries, offset = 0) {
    const endpoint = 'https://api.bing.microsoft.com/v7.0/search';
    const all_links = []
    try {
        for (const query of queries) {
            const response = await axios.get(endpoint, {
                headers: {
                    'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
                },
                params: {
                    q: query,
                    count: queryLimit,
                    offset: offset
                },
            });
            const results = response.data.webPages.value;
            all_links.push(...results);
        }
        const scrappedData = await preparePagesForScraping(all_links);
        const pathsOnlyArray = scrappedData.map(item => item.path)
        const outputFile = await combinePDFs(scrappedData);
        // const outputFile = await combineFiles(pathsOnlyArray);

        return { 'data': outputFile, 'links': all_links };
    } catch (error) {
        console.error('Error fetching search results:', error.message);
        return 'failed'
    }
}


async function combinePDFs(pages) {
    try {
        const pdfPaths = pages
            .filter(item => item.path !== null)
            .map(item => item.path);
        const mergedPdf = await PDFDocument.create();
        for (const pdfPath of pdfPaths) {
            // Load each PDF file
            const pdfBytes = fs.readFileSync(pdfPath);
            const pdf = await PDFDocument.load(pdfBytes);
            // Copy all pages from the current PDF into the merged PDF
            const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            pages.forEach((page) => mergedPdf.addPage(page));
        }
        for (const pdfPath of pdfPaths) {
            fs.unlink(pdfPath, (err) => {
                if (err) {
                    console.error(`Error deleting ${filePath}:`, err);
                }
            });
        }
        let outputFilePath = await generateRandomFileName('pdf');
        outputFilePath = 'final_folder/' + outputFilePath;
        const mergedPdfBytes = await mergedPdf.save();
        fs.writeFileSync(outputFilePath, mergedPdfBytes);
        return outputFilePath
    } catch (error) {
        console.error("The following error has occured during PDF merging: ", error);
        return false
    }
}


async function combineFiles(files) {
    const outputFilePath = 'final_folder/' + await generateRandomFileName('txt');
    let combinedData = '';
    for (const file of files) {
        try {
            const data = fs.readFileSync(file, 'utf8');
            combinedData += data + '\n\n';
        } catch (error) {
            console.log(`Error reading file ${file}: ${error.message}`);
        }
    }
    try {
        await writeFileAsync(outputFilePath, combinedData);
        console.log("File successfully written");
        console.log(outputFilePath);
        return outputFilePath;
    } catch (error) {
        console.log(`Error writing to ${outputFile}: ${error.message}`);
    }
}


// async function combineSpecificTextFiles(filePaths) {
//     try {
//         const outputFilePath = 'pages/' + await generateRandomFileName('txt');
//         let combinedContent = '';

//         // Read and combine content from each specified file
//         for (const filePath of filePaths) {
//             const content = await fs.readFile(filePath, 'utf8');
//             combinedContent += content + '\n\n'; // Add two newlines between file contents
//         }

//         // Write the combined content to the output file
//         await fs.writeFile(outputFilePath, combinedContent.trim());

//         console.log(`Combined ${filePaths.length} files into ${outputFilePath}`);
//     } catch (error) {
//         console.error('Error combining files:', error);
//     }
// }

async function preparePagesFcsdcdsorScraping(results = [], res) {
    // console.log("scrapping started");
    const url = `https://myopiainstitute.org/myopia/`
    const pLimit = (await import('p-limit')).default;
    const limit = pLimit(5); // Limit to 5 concurrent pages
    const browser = await puppeteer.launch({ headless: true });
    const scrapedPagesArray = await Promise.all(results.map(result =>
        limit(() => scrapePage(result.url, browser))
    ));
    return scrapedPagesArray;
}

async function scrapePage(url, browser) {
    try {
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' }); 
        const path = 'pages/' + await generateRandomFileName('pdf');
        // Generate the PDF and save it to a file
        await page.pdf({
            path: path,
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px'
            }
        });
        await page.close();
        return { 'url': url, 'path': path };
    } catch (error) {
        console.error("Error visiting page: " + error);
        return { 'url': url, 'path': null };
    }
}

async function preparePagesForScraping(pagesToScrape = []) {
    // console.log("scrapping started");
    const pLimit = (await import('p-limit')).default;
    const limit = pLimit(5); // Limit to 5 concurrent pages
    const browser = await puppeteer.launch({ headless: true });
    const scrapedPagesArray = await Promise.all(pagesToScrape.map(result =>
        limit(() => scrapePage(result.url, browser))
    ));
    return scrapedPagesArray;
}

async function sscrapePage(url, browser) {
    try {
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });
        const html = await page.content();
        const $ = cheerio.load(html);
        // $('script, style, head, footer, nav, input, textarea').remove();
        let cleanedHTML = $('body').html();
        cleanedHTML.replace(/\s+/g, ' ').trim();
        await page.close();
        const outputFilePath = 'pages/' + await generateRandomFileName('txt');
        // saveToTextFile(outputFilePath);
        const savePath = fs.writeFile(outputFilePath, cleanedHTML, (err) => {
            if (err) {
                console.error(`Error writing ${url} to file`, err);
                return null;
            } else {
                return outputFilePath;
            }
        });
        return { 'url': url, 'path': outputFilePath };
    } catch (error) {
        console.error("Error visiting page: " + error);
        return { 'url': url, 'path': null };
    }
}

async function saveToTextFile(html) {
    const outputFilePath = 'pages/' + await generateRandomFileName('pdf');
    await fs.writeFile(outputFilePath, cleanedHTML);
}

async function saveHtmlToPdf(htmlContent, outputPath) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set the HTML content to the page
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // Save the content as a PDF
    await page.pdf({ path: outputPath, format: 'A4' });

    // Close the browser
    await browser.close();
}

async function saveToFile(html, url) {
    const path = `pages/${crypto.randomUUID()}.txt`
    fs.writeFile(path, html, (err) => {
        if (err) {
            console.error(`Error writing ${url} to file`, err);
            return null;
        } else {
            return path;
        }
    });
}

async function cleanWebpage(htmlContent) {
    try {
        let text = ""
        const $ = cheerio.load(htmlContent);
        const bodyContent = $('body').html();
        $('body').find('style, script, svg, img, input, select, textarea, header, nav, footer').remove();
        $('body').find('h1, h2, h3, h4, h5, p, span').each(function (index) {
            text += $(this).text().trim();
        });
        return text;
    } catch (error) {
        console.error('Error fetching or processing the webpage:', error);
        return null;
    }
}

async function runTest() {
    bingSearch('Latest manchester city scores');
}

async function testPuppeteer() {
    const browser = await puppeteer.launch({ headless: true });

    // Create a new page instance
    const page = await browser.newPage();

    // Navigate to the website you want to convert to PDF
    await page.goto('https://www.optometrytimes.com/view/myopia-an-epidemic-of-global-proportions', { waitUntil: 'networkidle2' });

    // Generate the PDF and save it to a file
    await page.pdf({
        path: 'website.pdf', // The file where the PDF will be saved
        format: 'A4', // Paper format
        printBackground: true, // Print background graphics
        margin: {
            top: '20px',
            right: '20px',
            bottom: '20px',
            left: '20px'
        }
    });

    // Close the browser
    await browser.close();
}

async function generateRandomFileName(extension) {
    const randomBytes = crypto.randomBytes(16).toString('hex');
    return `${randomBytes}.${extension}`;
}


module.exports = {
    bingSearch,
};
