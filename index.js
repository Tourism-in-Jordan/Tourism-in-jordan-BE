'use strict'
const express = require('express');
const sitesData = require('./data.json');
const cors= require('cors');
const axios=require('axios');
const bodyParser = require('body-parser');
const { Client } = require('pg');
require('dotenv').config();
const url=process.env.URL;
const client = new Client(url);
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
// const PORT=process.env.PORT || 3001;
const port=process.env.PORT || 3001;

