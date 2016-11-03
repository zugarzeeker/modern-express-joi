var modernValidator = require('../lib').default
var Joi = require('joi')
var express = require('express')
var bodyParser = require('body-parser');
var app = express()
app.use(bodyParser.json())

var template = Joi.object().keys({
  name: Joi.string().required(),
  age: Joi.number().positive().optional()
})
var schemaTemplates = {
  template
}

app.use(modernValidator(schemaTemplates))
app.post('/users', (req, res) => {
  req.checkBody('template')
  req.sanitizeBody('template')
  var errors = req.validationErrors()
  if (errors) res.status(400).send(errors)
  else res.status(200).send({ message: 'Success', body: req.body, x: '5' })
})

app.listen(8080)
console.log('Running at port 8080');
