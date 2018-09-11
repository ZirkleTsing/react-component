

function getMode(env) {
  console.log('env:', env)
  return env || 'production'
}

module.exports = {
  getMode
}