var modernValidator = require('../lib').default
var Joi = require('joi')
var express = require('express')
var bodyParser = require('body-parser');
var app = express()
app.use(bodyParser.json())

var schemaTemplates = {
  templateName: Joi.string().required(),
  templateAge: Joi.number().positive().optional()
}

app.use(modernValidator(schemaTemplates))
app.post('/users', (req, res) => {
  req.checkBody('templateName', 'name')
  req.checkBody('templateAge', 'age')
  req.sanitizeBody('templateName', 'name')
  req.sanitizeBody('templateAge', 'age')
  var errors = req.validationErrors()
  if (errors) res.status(400).send(errors)
  else res.status(200).send({ message: 'Success' })
})

app.listen(8080)
console.log('Running at port 8080');
