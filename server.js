require("dotenv").config();
const express = require("express");
const app = express();
const { Pool } = require('pg');
const port = process.env.PORT || 5001;
const cors = require("cors");
const pool = new Pool();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT"]
}));

app.get('/', (req, res) => {
    res.send('Welcome to our API');
});


app.get('/api/alltodos', (req, res) => {
    pool.query('SELECT * FROM grp10todo')
    .then((data) => res.json(data.rows))
    .catch((e) => {
        console.error('Error executing query 1:', e)
        res.sendStatus(500);
    })
});

// ADD NEW TASK
app.post('/api/newtask', (req, res) => {
    console.log("body:", req.body)
    const { task, date_added } = req.body;
    pool.query('INSERT INTO grp10todo(task, date_added) VALUES ($1, $2) RETURNING *;', [task, date_added])
        .then((result) => {
            const insertedTask = result;
            res.status(200).json({ message: 'New task added successfully', insertedTask })
        }).catch((error) => {
            console.error('Error inserting new task:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        })
})

//UPDATE TASK
app.put('/api/update/:id', (req, res) => {
    console.log("put body:", req.body)
    console.log("id:", req.params)
    const { id } = req.params;
    const { task, date_added } = req.body;
    pool.query('UPDATE grp10todo SET task=$1, date_added=$2 WHERE id=$3 RETURNING *;', [task, date_added, id])
    .then(() => {
        res.status(200).send(`${id} - ${task} has been updated.`)
    })
    .catch (() => {
    console.log(error);
    res.status(500).send("Oops, something went wrong :(") 
    }) 
})

//DELETE TASK
app.delete('/api/delete/:id', (req, res) => {
    const { id } = req.params; 
    pool.query('DELETE FROM grp10todo WHERE id=$1 RETURNING *;', [id])
        .then(() => {
        res.status(200).send(`${id}- has been deleted.`)
        })
        .catch(() => {
            console.log(error);
            res.status(500).send("Internal server error.")
    })
})

app.listen(port , () => {
    console.log(`Server listening on port http://localhost:${port}`);
});