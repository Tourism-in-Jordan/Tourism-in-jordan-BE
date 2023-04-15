'use strict'
const express = require('express');
const sitesData = require('./data.json');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const { Client } = require('pg');
require('dotenv').config();
const PORT=process.env.PORT;
const url = process.env.URL;
const apiKey =process.env.API_KEY;
const client = new Client(url);
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


//////////// Routes ////////////
app.get('/', homeRouteHandler);
app.post('/addVisitList',addVisitListHandler);
app.get('/weather/:city', getWeatherHandler);
app.get('/vistList',vistListHandler);
app.put('/UPDATE/:id', updateFeedBackHandler);
app.delete('/DELETE/:id', deletevisitSite);
app.get('*', handelNotFoundError);
app.use(errorHandler);

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


///////// Functions /////////

function homeRouteHandler(req, res) {

    let siteDetails = sitesData.map((site) => {
        return new Sites(site)
    })

    res.json(siteDetails);
}


function addVisitListHandler(req,res){
    let {name,city,image,overview,feedback} =req.body; //destructuring
    let sql=`INSERT INTO visitlist (name,city,image,overview,feedback)
    VALUES ($1,$2,$3,$4,$5) RETURNING * `
    let values=[name,city,image.imageUrl_1,overview,feedback]
    client.query(sql,values).then((result)=>{
        console.log(req.body);
        res.status(201).json(result.rows)
       }).catch((error)=>{
        errorHandler(error,req,res);
    })
}

 
 
function updateFeedBackHandler(req,res){
    let id = req.params.id // params
    let feedback = req.body.feedback;
    let sql=`UPDATE visitlist SET feedback = $1 WHERE id = $2 RETURNING *;`;
    let values = [feedback,id];
    client.query(sql,values).then(result=>{
        console.log(result.rows);
        res.send(result.rows)

    }).catch((error)=>{
        errorHandler(error,req,res);
    })
}


function deletevisitSite(req,res){
    let id = req.params.id; 
    let sql=`DELETE FROM visitlist WHERE id = $1;` ;
    let value = [id];
    client.query(sql,value).then(result=>{
        res.status(204).send("deleted");
    }).catch((error)=>{
        errorHandler(error,req,res);
    })
}




function vistListHandler(req,res){
    let sql=`SELECT * FROM visitlist `;
    client.query(sql).then((result)=>{
        res.json(result.rows)
       }).catch((error)=>{
        errorHandler(error,req,res);
    })
}

 


function getWeatherHandler(req, res) {
    let cityName = req.params.city;
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&APPID=${apiKey}`
    axios.get(url)
        .then(result => {
            res.json(result.data)
            console.log(result)
            // res.json(result)
        }).catch((error)=>{
        errorHandler(error,req,res);
    })
}



function handelNotFoundError(req,res){
    res.status(404).send('Not Found');
}

function errorHandler(err,req,res){
    res.status(500).send(err);
}


client.connect().then(()=>{
    app.listen(PORT,()=>{
        console.log(`listening on port${PORT}`);
    })

}).catch()
