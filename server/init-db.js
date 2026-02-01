const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ''
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL server');

    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // Split queries by semicolon (assuming simple split works for this schema)
    // Filter out empty lines/whitespace
    const queries = schemaSql.split(';').filter(q => q.trim().length > 0);

    let completed = 0;

    queries.forEach(query => {
        db.query(query, (err, result) => {
            if (err) {
                console.error('Error executing query:', query, err);
            } else {
                console.log('Executed query successfully');
            }
            completed++;
            if (completed === queries.length) {
                console.log('Database initialization complete');
                db.end();
                process.exit(0);
            }
        });
    });
});
