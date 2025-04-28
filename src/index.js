const express = require('express');
const cors = require('cors');

console.log(1);

function loggerMiddleware(req,res,next){
    console.log(req.path);
    next();
}

const REQUESTS_LIMIT = 5;
const requestsPerSecond = {};

const benchMarking = {};
 
 
const antiDDOSMiddleware = (req,res,next) =>{
    const ip = req.ip;
    if(requestsPerSecond[ip] == undefined){
requestsPerSecond[ip] = [];
    }
 
    const ipRequests = requestsPerSecond[ip];
 
    ipRequests.push(new Date().getTime());
 
    if(ipRequests < REQUESTS_LIMIT){
	next();
	return;
    }
 
    const lastRequest = ipRequests[ipRequests.length - 1];
    const firstRequest = ipRequests[ipRequests.length - 1 - REQUESTS_LIMIT];
 
    const diffInMilliseconds =  lastRequest - firstRequest;
 
    if(diffInMilliseconds < 1000){
	res.status(429).send('SPAMMER');
	return;
    }
    next();
};

function benchMarkingMiddleware(req,_,next){
    const beforeTime = new Date().getTime();
    next();
    const afterTime = new Date().getTime();

    if(!benchMarking[req.path]){
	benchMarking[req.path] = [];
    }

    benchMarking[req.path].push(afterTime - beforeTime);
    const total = benchMarking[req.path].reduce((acc,n)=>acc+n,0);
    console.log(`Req: ${req.path}, total:${total} Avg: ${total/benchMarking[req.path].length}`);
}




const server = express();

server.use(cors());
server.use(express.json());
server.use(antiDDOSMiddleware);
server.use(loggerMiddleware);
server.use(benchMarkingMiddleware);
// JSON - javascript object notation

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

server.get('/fun', antiDDOSMiddleware, (_,response)=>{
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




