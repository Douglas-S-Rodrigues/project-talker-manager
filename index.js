const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const crypto = require('crypto');
const middlewareValidateEmail = require('./middlewares/emailValidate');
const middlewareValidatePassword = require('./middlewares/passwordValidate');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', (_request, response) => { 
  try {
    const talkers = fs.readFileSync('./talker.json', 'utf8');
    return response.status(200).json(JSON.parse(talkers));
  } catch (error) {
    return response.status(200).json([]);
  }
});

app.get('/talker/:id', (request, response) => {
    const id = Number(request.params.id);
    const talkers = JSON.parse(fs.readFileSync('./talker.json', 'utf8'));
    const searchId = talkers.find((talkerId) => talkerId.id === id);
    if (searchId) return response.status(200).json(searchId);
    return response.status(404).json({ message: 'Pessoa palestrante não encontrada' });
});

app.post('/login', middlewareValidateEmail, middlewareValidatePassword, (_request, response) => {
  const token = crypto.randomBytes(8).toString('hex');
  return response.status(200).json({ token });
});

// app.post('/talker', (request, response) => {
// });

app.listen(PORT, () => {
  console.log('Online');
});
