const net = require('net');
const http = require('http');
const dns = require('dns');
const url = require('url');
const path = require('path');
const querystring = require('querystring');
const fs = require('fs');
const util = require('util');
const domain = require('domain');
const events = require('events');

const c = require('./util/console.js');

function start() {
  function onRequest(request, response) {
    const { pathname } = url.parse(request.url);
    console.log(`Request for ${pathname} received.`);
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.write('Hello World');
    response.end();
  }

  http.createServer(onRequest).listen(8888);
  console.log('Server has started.');
}

start();
