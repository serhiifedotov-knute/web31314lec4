const express = require('express');

console.log(1);


const server = express();

const PORT = 8080;


// http://localhost:8080
// http - protocol;
// ftp - file system protocal;
// https - http secured connection; 
// ws - web sockets;
// wss - ws secured
//
//
// localhost - domain name
// knute.edu.ua - domain name
// develop.knute.edu.ua / develop - host

// 8080 - PORT server listens too [3000 - 9000]
//
//
// http://localhost:8080/groups/123 
// "groups/123" - path
// http://localhost:8080/groups/123?page=2&page_size=20
// page=2  , page_size=20 - query parameters

// Request has 5 types of methods:
// GET - 	for getting data ( no changes)
// POST - 	for creating data
// PUT - 	for updating data ( full replace, full update)
// PATCH - 	for updating some partial fields ( small part of data)
// DELETE -	for deleting data
//

const groups = Array(20).fill(0).map((_,idx)=>`group_${idx}`).map(groupId=> ({groupId}));

// endpoint - кінечна точка
server.get('/groups',(request, response)=>{
    response.json(groups);
});

server.listen(PORT, ()=>{
    console.log(`Server started on http://localhost:${PORT}`);
});




