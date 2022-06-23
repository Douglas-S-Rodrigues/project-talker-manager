const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const crypto = require('crypto');
const middlewareValidateToken = require('./middlewares/tokenValidate');
const middlewareValidateEmail = require('./middlewares/emailValidate');
const middlewareValidatePassword = require('./middlewares/passwordValidate');
const middlewareValidateName = require('./middlewares/nameValidate');
const middlewareValidateAge = require('./middlewares/ageValidate');
const middlewareValidateTalk = require('./middlewares/talkValidate');
const middlewareValidateWatchedAt = require('./middlewares/watchedAtValidate');
const middlewareValidateRate = require('./middlewares/rateValidate');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (_request, response) => { 
  try {
    const talkers = await fs.readFile('talker.json', 'utf8');
    return response.status(200).json(await JSON.parse(talkers));
  } catch (error) {
    return response.status(200).json([]);
  }
});

app.get('/talker/:id', async (request, response) => {
    const id = Number(request.params.id);
    const talkers = JSON.parse(await fs.readFile('talker.json', 'utf8'));
    const searchId = talkers.find((talkerId) => talkerId.id === id);
    if (searchId) return response.status(200).json(searchId);
    return response.status(404).json({ message: 'Pessoa palestrante não encontrada' });
});

app.post('/login', middlewareValidateEmail, middlewareValidatePassword, (_request, response) => {
  const token = crypto.randomBytes(8).toString('hex');
  return response.status(200).json({ token });
});

app.post('/talker',
middlewareValidateToken,
middlewareValidateName,
middlewareValidateAge,
middlewareValidateTalk,
middlewareValidateWatchedAt,
middlewareValidateRate,
async (request, response) => {
  const { name, age, talk } = request.body;
  const prevState = JSON.parse(await fs.readFile('talker.json', 'utf8'));
  const newTalker = { id: prevState.length + 1, name, age, talk };
  await fs.writeFile('talker.json', JSON.stringify([...prevState, newTalker]));
  return response.status(201).json(newTalker);
});

app.listen(PORT, () => {
  console.log('Online');
});
