const express = require("express");
const app = express();
const port = process.env.PORT || 5001;

app.get('/', (req, res) => {
    res.send('Welcome to our API');
});

app.listen(port , () => {
    console.log(`Server listening on port http://localhost:${port}`);
});