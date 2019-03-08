const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

//Handle POST request
const handlePost = (request, response, parsedUrl) => {
    
  if (parsedUrl.pathname === '/addNote') {
      
    const res = response;
    const body = [];

    request.on('error', (err) => {
      console.dir(err);

      res.statusCode = 400;
      res.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);

      jsonHandler.addNote(request, res, bodyParams);
    });
  }
};

const onRequest = (request, response) => {
    
  const parsedUrl = url.parse(request.url);
  const bodyParams = query.parse(parsedUrl.query);

  switch (request.method) {
        
    //Handle GET requests
    case 'GET':
      if (parsedUrl.pathname === '/') {
        htmlHandler.getIndex(request, response);
      } else if (parsedUrl.pathname === '/style.css') {
        htmlHandler.getCSS(request, response);
      } else if (parsedUrl.pathname === '/getNotes') {
        jsonHandler.getNotes(request, response, bodyParams);
      } else if (parsedUrl.pathname === '/notReal') {
        jsonHandler.notReal(request, response);
      } else {
        jsonHandler.notReal(request, response);
      }
      break;
    
    //Handle HEAD requests
    case 'HEAD':
      if (parsedUrl.pathname === '/getNotes') {
        jsonHandler.getNotesMeta(request, response);
      } else if (parsedUrl.pathname === '/notReal') {
        jsonHandler.notRealMeta(request, response);
      } else {
        jsonHandler.notRealMeta(request, response);
      }
      break;
          
    //Handle POST requests
    case 'POST':
      if (parsedUrl.pathname === '/addNote') {
        handlePost(request, response, parsedUrl);
      } else {
        jsonHandler.notReal(request, response);
      }
      break;
    default:
      jsonHandler.notReal(request, response);
      break;
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
