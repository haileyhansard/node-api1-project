const express = require('express');
const shortid = require('shortid');

const server = express();
server.use(express.json());

server.get('/', (req, res) => {
    res.send("Server is up and running! Nice. ");
});

let users = [
    {
        id: shortid.generate(), // hint: use the shortid npm package to generate it
        name: "Jane Doe", // String, required
        bio: "Not Tarzan's Wife, another Jane"  // String, required
      },
      {
        id: shortid.generate(), 
        name: "Jack Nicholson", 
        bio: "Actor known for his leading roles in movies including As Good As It Gets, A Few Good Men, and The Shining."
      },
      {
        id: shortid.generate(), 
        name: "Al Pacino",
        bio: "Actor known for his leading roles in movies including Dog Day Afternoon, The Godfather, and Heat."
      }
];

// get /api/users
// get array of users
server.get('/api/users', (req, res) => {
    try {
        res.status(200).json(users);
    } catch(err) {
        res.status(500).json({ errorMessage: "The users information could not be retrieved." })
    }
});

// get /api/users/:id
// get a specific user by id and returns the user object
server.get('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const user = users.find(user => user.id === id);

    try {
        if (!user) {
            res.status(404).json({ message: "The user with the specified ID does not exist." });
        } else {
            res.status(200).json(user)
        }
    } catch(err) {
        res.status(500).json({ errorMessage: "The user information could not be retrieved." })
    }
});

// post /api/users
// post/create/add a new user using the information sent inside the request body
server.post('/api/users', (req, res) => {
    const userToAdd = req.body;
    userToAdd.id = shortid.generate();

    try {
        if (!userToAdd.name || !userToAdd.bio) {
            res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
        } else {
            users.push(userToAdd);
            res.status(201).json(userToAdd);
        }
    } catch(err) {
        res.status(500).json({ errorMessage: "There was an error while saving the user to the database." });
    }
});

// delete /api/users/:id
// delete a specific user and return the deleted user
server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const userToDelete = users.find(user => user.id === id);
    try {
        if(!userToDelete) {
            res.status(404).json({ message: "The user with the specified ID does not exist." });
        } else {
            users = users.filter(user => user.id !== id);
            res.status(200).json(userToDelete);
        }
    } catch(err) {
        res.status(500).json({ errorMessage: "The user could not be removed." });
    }
});

// put /api/users/:id
// put/update the user with the specified id using data from the request body, and return the modified user
server.put('/api/users/:id', (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        let userToUpdate = users.find(user => user.id === id);

        if(!userToUpdate) {
            res.status(404).json({ message: "The user with the specified ID does not exist" })
        } else if (!userToUpdate.name || !userToUpdate.bio) {
            res.status(400).json({ errorMessage: "Please provide name and bio for the user" });
        } else {
            userToUpdate = Object.assign(userToUpdate, updates);
            res.status(200).json(userToUpdate)
        }
        } catch(err) {
            res.status(500).json({ errorMessage: "The user information could not be modified." })
        }
});


const port = 5000;

server.listen(port, () => console.log(`server running on port ${port}...`));
