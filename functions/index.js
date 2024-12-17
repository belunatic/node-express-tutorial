const express = require("express");
const serverless = require("serverless-http");
const app = express();
const router = express.Router();

//to access the JSON formatted data from a request body
//without this the request.body would be undefined
app.use(express.json());

app.use("/.netlify/functions/index", router);
module.exports.handler = serverless(app);

let notes = [
	{
		id: "1",
		content: "HTML is easy",
		important: true,
	},
	{
		id: "2",
		content: "Browser can execute only JavaScript",
		important: false,
	},
	{
		id: "3",
		content: "GET and POST are the most important methods of HTTP protocol",
		important: true,
	},
];
/* 
Before express

    const app = http.createServer((request, response) => {
	response.writeHead(200, { "Content-Type": "application/json" });
	response.end(JSON.stringify(notes));

});
*/

//index page
app.get("/", (request, response) => {
	response.send(
		"<div><h1>Hello World!</h1><p> To use this api, start with '/api/notes'</p></div>"
	);
});

//get all the notes
app.get("/api/notes", (request, response) => {
	//this method will send the notes array that was passed to it as a JSON formatted string
	response.json(notes);
});

//get a specific note
app.get("/api/notes/:id", (request, response) => {
	//retrieve the id from the query string
	const id = request.params.id;
	//find not with the given id
	const note = notes.find((note) => note.id === id);

	//verify that the note is not empty
	if (note) {
		response.json(note);
	} else {
		//if note is undefined then update the status
		//use end() for responding to the request without sending any data
		response.status(404).end();
	}
});

//delete a note
app.delete("/api/notes/:id", (request, response) => {
	const id = request.params.id;
	notes = notes.filter((note) => note.id !== id);
	response.status(204).end();
});

//function to get the id
const generateId = () => {
	//find the largest Id
	const maxId =
		notes.length > 0 ? Math.max(...notes.map((n) => Number(n.id))) : 0;
	return String(maxId + 1);
};

app.post("/api/notes", (request, response) => {
	const body = request.body;

	//If the received data is missing a value for the content property
	if (!body.content) {
		return response.status(400).json({
			error: "Content Missing",
		});
	}
	//construct object from request.body
	const note = {
		content: body.content,
		important: Boolean(body.important) || false,
		id: generateId(),
	};

	//concat the list to notes
	notes = notes.concat(note);

	response.json(notes);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
