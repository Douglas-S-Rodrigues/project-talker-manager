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
  next();
}

module.exports = middlewareValidateEmail;