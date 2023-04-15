'use strict'
const express = require('express');
const sitesData = require('./data.json');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const { Client } = require('pg');
require('dotenv').config();
const url = process.env.URL;
const client = new Client(url);
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
// const PORT=process.env.PORT || 3001;
const port = process.env.PORT || 3001;


app.get('/vistList',vistListHandler);


function vistListHandler(req,res){
   
    let sql=`SELECT * FROM visitlist `;
    client.query(sql).then((result)=>{
        res.json(result.rows)
    })
   .catch()
 

//////////// Routes ////////////

app.get('/', homeRouteHandler);
app.get('/weather/:city', getWeatherHandler);



function homeRouteHandler(req, res) {

    let siteDetails = sitesData.map((site) => {
        return new Sites(site)
    })

    res.json(siteDetails);


}

function getWeatherHandler(req, res) {
    let cityName = req.params.city;
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&APPID=8637a68a72e0461a7615ac82c89bfdc8`

    axios.get(url)
        .then(result => {
            res.json(result.data.main.temp)
            console.log(result)
            // res.json(result)
        })
        .catch()

}

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
//////////// Constructor ////////////

function Sites(site) {

    this.id = site.id;
    this.name = site.name;
    this.city = site.city;
    this.location_lat = site.location_lat;
    this.location_lng = site.location_lng;
    this.overview = site.overview;
    this.image = site.image;

}