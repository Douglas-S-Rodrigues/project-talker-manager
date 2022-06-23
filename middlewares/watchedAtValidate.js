function middlewareValidateWatchedAt(request, response, next) {
  const { talk: { watchedAt } } = request.body;
  const reg = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/;
  
  if (!watchedAt) {
    return response.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
  }
  if (!reg.test(watchedAt)) {
    return response.status(400)
    .json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  next();
}

module.exports = middlewareValidateWatchedAt;