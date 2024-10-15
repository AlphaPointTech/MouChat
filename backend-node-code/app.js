// require('dotenv').config();
const https = require('https')
const express = require('express');
const cors = require('cors');
const fs = require('fs');
// const db = require('./db')
const chat = require('./chat')

const port = process.env.PORT || 8080;
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:3000', // Allow requests from React app
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
};

app.use(cors(corsOptions));




app.listen(port, () => {
  console.log(`Express server is running at http://localhost:${port}/`);
});

app.get('/test', async function name(req, res) {
      res.send("Hello. All is well");
})

app.get('/pullContinentData', async function name(req, res) {
  try {
    const continent_id = req.query.continent_id;
    const response = await db.pullContinentData(continent_id);
    res.send(response);
  } catch (error) {
    console.error(error);

    res.status(500).send(error);
  }
})

app.get('/heatMapData', async function name(req, res) {
  try {
    const countryCode = req.query.countryCode;
    const response = await db.pullMyopiaValues(countryCode);    
    res.send(response);
  } catch (error) {
    console.error(error);

    res.status(500).send(error);
  }
})

app.get('/myopiaAI', async function name(req, res) {
  try {
    const query = req.query.query;
    const category = req.query.category;
    const condition = req.query.condition;
    const country_name = req.query.country_name;
    // console.log(query);
    
    const response = await chat.runQuery(query, category, condition, country_name)
    res.send(response);
  } catch (error) {
    // console.error(error);

    res.status(500).send(error);
  }
})
