const sequelize = require('./connection');
const express = require('express');
// const mysql = require('mysql2');
const QUEST = require('./lib/options');

const app = express();
const PORT = process.env.PORT || 3001;

const quest = new QUEST();

// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

sequelize.sync({ force: true }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));

    quest.questions();
});

