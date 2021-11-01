const jwt = require('jsonwebtoken')

const token = jwt.sign({f:'b'},'a')

console.log(token)