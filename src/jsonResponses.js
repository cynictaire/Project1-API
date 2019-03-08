//Holds all the notes
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

//Add a new note when user submit with the required parameters 
const addNote = (request, response, body) => {
  const responseJSON = {
    message: 'Exam Title and Date are both required.',
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
  notes[body.name].time = body.time;

  if (body.desc !== '') {
    notes[body.name].desc = body.desc;
  } else {
    notes[body.name].desc = '';
  }

  if (responseCode === 201) {
    responseJSON.message = 'Wrote a note!';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode);
};

//Retrieve all the notes that has been added
const getNotes = (request, response, body) => {
  let responseJSON = {
    notes,
  };

  //Holds notes that have study time longer than 45 minutes
  const topPriorities = {};
  const allNotes = Object.keys(notes);

  //If note is considered as 'important' due to its study time
  if (body.important) {

    //Iterate through all the notes
    allNotes.forEach((note) => {
     
      //If the note's study time is longer than or equal to 45 minutes
      if (parseInt(notes[note].time, 10) >= parseInt(body.time, 10)) {
        
        //Add it to topPriorities
        topPriorities[note] = notes[note];
      }
    });
    
    //Return topPriorities instead of notes
    responseJSON = { notes: topPriorities };
    return respondJSON(request, response, 200, responseJSON);
  }

  return respondJSON(request, response, 200, responseJSON);
};

const getNotesMeta = (request, response) => respondJSONMeta(request, response, 200);

//Not Found page
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
