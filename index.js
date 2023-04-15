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



app.post('/addVisitList',addVisitListHandler);
app.get('/vistList',vistListHandler);
app.put('/UPDATE/:id', updateFeedBackHandler);
app.delete('/DELETE/:id', deletevisitSite);


function addVisitListHandler(req,res){
    let {name,city,image,overview,feedback} =req.body; //destructuring
    let sql=`INSERT INTO visitlist (name,city,image,overview,feedback)
    VALUES ($1,$2,$3,$4,$5) RETURNING * `
    let values=[name,city,image.imageUrl_1,overview,feedback]
    client.query(sql,values).then((result)=>{
        console.log(req.body);
        res.status(201).json(result.rows)
    })
    .catch()
    
    
 }

 function vistListHandler(req,res){
   
        let sql=`SELECT * FROM visitlist `;
        client.query(sql).then((result)=>{
            res.json(result.rows)
        })
       .catch()
     
 }

 function updateFeedBackHandler(req,res){
    let id = req.params.id // params
    let {feedback} = req.body;
    let sql=`UPDATE visitlist SET feedback = $1 WHERE id = $2 RETURNING *;`;
    let values = [feedback,id];
    client.query(sql,values).then(result=>{
        console.log(result.rows);
        res.send(result.rows)
    }).catch()
}

function deletevisitSite(req,res){
    let id = req.params.id; 
    let sql=`DELETE FROM visitlist WHERE id = $1;` ;
    let value = [id];
    client.query(sql,value).then(result=>{
        res.status(204).send("deleted");
    }).catch()

}

 client.connect().then(()=>{
    app.listen(port,()=>{
        console.log(`listening on port${port}`);
    })

}).catch()

