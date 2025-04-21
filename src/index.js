const express = require('express');
const cors = require('cors');
const {DataSource} = require('typeorm')

console.log(1);


const server = express();
server.use(cors());
server.use(express.json());
// JSON - javascript object notation

const PORT = 8080;



const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "testapril",
    password: process.env.DB_PASSWORD,
    database: "db3april",
    synchronize: false,
    logging: true,
    entities: [],
    subscribers: [],
    migrations: [],
})


// simple data base connection
AppDataSource.initialize().then(()=>{
    console.log(`Successfully connected`);

    AppDataSource.manager.query(`
    select count(1)
    from game_user 
    join purchased_game 
    on purchased_game.user_id = game_user.id
    where game_user.name = 'Yaroslav'
	`).then(dbResponse=>{
	    console.log(dbResponse);
	});

}).catch(error=>{
    console.log(`Failed connected: ${error}`);
});


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

const groups = Array(10).fill(0).map((_,idx)=>`group_${idx}`).map(groupId=> ({groupId}));

// endpoint - кінечна точка
server.get('/groups',(request, response)=>{
    response.json(groups);
});

// request = {
// body = структура у форматі JSON 
// request.path = шлях запиту
// request.query = query parameters here 

server.post('/groups', (request, response)=>{
    console.log(request.body);
    groups.push(request.body);
    response.send('ok');
});

// ..../groups?groupId=3-13
server.delete('/groups', (request, response)=>{
    console.log(request.query.groupId);

    if(request.query.groupId == undefined){
	response.status(400).send(`groupId query paramter doesn't exist`);
	return;
    }

    const indexToDelete = groups.findIndex(gr=>gr.groupId == request.query.groupId);
    // if not found index = -1
    if(indexToDelete >= 0){
	groups.splice(indexToDelete,1);
	response.send('deleted successfully');
    }
    response.status(404).send('cannot find element');
});

server.get('/fun',(_,response)=>{
    response.status(200).json({ errorCode:500, errorMessage:'very bad happened'});
});

// Status codes 
// 200 - ok 
// 201 - created sucessfully 
// 2xx - GOOD 
//
// 304 - redirect 
// 3xx
//
//
// controlled and expected error
// 400 - bad request 
// 404 - item not found
// 401 - authorization
// 429 - DDOS
//
//
// Unexpected
// 500 - unexpected error
// 503 - server cannot answered
// 5xx - VERY BAD

server.listen(PORT, ()=>{
    console.log(`Server started on http://localhost:${PORT}`);
});




