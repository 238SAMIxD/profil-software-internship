const express = require('express');
const path = require('path');
const open = require('open');

const index = "./public/index.html";
const app = express();
const host = "localhost";
const port = 3000;

app.use( express.static( path.join( __dirname, "public" ) ) );

app.listen( port, host, () => {
    console.log(`App running on ${host}:${port}/`);
    open(`http://${host}:${port}` );
});