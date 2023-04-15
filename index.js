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
const PORT=process.env.PORT || 3001;



app.put('/UPDATE/:id', updateFeedBackHandler);
app.delete('/DELETE/:id', deletevisitSite);
app.get('*', handelNotFoundError);
app.use(errorHandler);

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


