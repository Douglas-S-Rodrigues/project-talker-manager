const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const crypto = require('crypto');

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
    const { id } = request.params;
    const talkers = JSON.parse(fs.readFileSync('./talker.json', 'utf8'));
    const searchId = talkers.find((talkerId) => talkerId.id === Number(id));
    if (searchId) return response.status(200).json(searchId);
    return response.status(404).json({ message: 'Pessoa palestrante não encontrada' });
});

function middlewareValidateEmail(request, response, next) {
  const { email } = request.body;
  const reg = /\S+@\S+\.\S+/; // https://www.horadecodar.com.br/2020/09/07/expressao-regular-para-validar-e-mail-javascript-regex/
  const validate = reg.test(email);

  if (!email) {
    return response.status(400).json({ message: 'O campo "email" é obrigatório' }); 
  }    
  if (!validate) {
    return response.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  return next();
}

function middlewareValidatePassword(request, response, next) {
  const { password } = request.body;
  if (!password) {
    return response.status(400).json({ message: 'O campo "password" é obrigatório' });
  } 
  if (password.length < 6) {
    return response.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  } 
  return next();
}

app.post('/login', middlewareValidateEmail, middlewareValidatePassword, (_request, response) => {
  const token = crypto.randomBytes(8).toString('hex');
  return response.status(200).json({ token });
});

app.listen(PORT, () => {
  console.log('Online');
});
