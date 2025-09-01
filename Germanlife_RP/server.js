const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));


function loadRules() {
  const filePath = path.join(__dirname, 'config', 'regelwerk.json');
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Fehler beim Laden des Regelwerks:', err);
    return { title: 'Regelwerk', sections: [] };
  }
}

function loadFrakRules() {
  const filePath = path.join(__dirname, 'config', 'fraktionsregelwerk.json');
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Fehler beim Laden des Regelwerks:', err);
    return { title: 'Regelwerk', sections: [] };
  }
}

app.get('/', (req, res) => {
  res.render('index', { title: 'Germanlife Roleplay' });
});

app.get('/regelwerk', (req, res) => {
  const rules = loadRules();
  res.render('regelwerk', { title: 'GLRP - Regelwerk', rules });
});

app.get('/fraktionsregelwerk', (req, res) => {
  const frakrules = loadFrakRules();
  res.render('fraktionsregelwerk', { title: 'GLRP - Fraktions Regelwerk', frakrules });
});

app.get('/impressum', (req, res) => {
    res.render('impressum', { title: 'GLRP - Impressum' });
});

app.get('/datenschutz', (req, res) => {
    res.render('datenschutz', { title: 'GLRP - Datenschutz' });
});

app.listen(port, () => {
  console.log(`GLRP Website läuft auf Port: ${port}`);
});
