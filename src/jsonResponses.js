const notes = {};

const respondJSON = (request, response, status, object) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);
  response.end();
};

const addNote = (request, response, body) => {
  const responseJSON = {
    message: 'Event name and date are both required.',
  };

  if (!body.name || !body.date) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 201;

  if (notes[body.name]) {
    responseCode = 204;
  } else {
    notes[body.name] = {};
  }

  notes[body.name].name = body.name;
  notes[body.name].date = body.date;

  if (body.desc !== '') {
    notes[body.name].desc = body.desc;
  } else {
    notes[body.name].desc = '';
  }

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode);
};

const getNotes = (request, response, body) => {
    
  const responseJSON = {
    notes,
  };

  const topPriorities = {};
  const allNotes = Object.keys(notes);

  if (body.important == true) {
      
      console.log(body.important);
      
    allNotes.forEach((note) => {
      if (parseInt(note.time, 10) >= parseInt(body.time, 10)) {
        topPriorities[note.name] = notes[note.name];
      }
    });

    return respondJSON(request, response, 200, topPriorities);
  }

  return respondJSON(request, response, 200, responseJSON);
};

const getNotesMeta = (request, response) => respondJSONMeta(request, response, 200);

const notReal = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  respondJSON(request, response, 404, responseJSON);
};

const notRealMeta = (request, response) => {
  respondJSONMeta(request, response, 404);
};

module.exports = {
  addNote,
  getNotes,
  getNotesMeta,
  notReal,
  notRealMeta,
};
