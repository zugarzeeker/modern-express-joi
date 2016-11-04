# modern-express-joi

[![NPM version][npm-svg]][npm]

[npm]: https://www.npmjs.com/package/modern-express-joi
[npm-svg]: https://img.shields.io/npm/v/modern-express-joi.svg?style=flat


An express.js middleware makes a powerful validation request with the Joi validation.

## Inspiration
`express-validator` and `Joi validation`

## Usage
- `npm install modern-express-joi`
- `import modernValidator from 'modern-express-joi'`
- make an `express` middleware from passing schemas to `modernValidator`
- add middleware to express
- call `req.checkAny` for validating
- call `req.sanitizeAny` for sanitizing

### `req.checkAny(String, [option])`
Passing first params as string to select schema template.
You can pass `option` as string for deep checking field by key name.

Here are available commands.
- `req.checkBody` for validation `req.body`.
- `req.checkQuery` for validation `req.query`.
- `req.checkParams` for validation `req.params`.
- ~~req.checkHeaders~~ coming soon
- ~~req.checkCookies~~ coming soon

### `req.sanitizeAny(String)`
This is similar to `req.checkAny` about passing params, but it converts the target object such as `req.body`, `req.query`, `req.params` etc to defining format in `schemaTemplates`.

### `modernValidator(Object, [option])`
Passing `schemaTemplates` as object that has key name of your schema templates to construct an express middleware.
The second optional parameter must be an object that contains functions, and key names are only `errorFormatter`, `customValidator`, or `customSanitizer`.

#### Example Passing Parameters
```js
modernValidator(schemaTemplates, {
  errorFormatter: (errors) => {},
  customValidator: (value) => {},
  customSanitizer: (value) => {}
})
```

#### `errorFormatter(errors)`
A function that receives `errors array` or `false` for formatting errors when using `req.validationErrors()`.

#### `customValidator(value)`
A function that validates the received value then returns `error array` or `false`.

#### `customSanitizer(value, schema)`
A function that recieves value and schema then returns formatting value follows by schema.

### `req.validationErrors()`
Getting your result of validation after you called `req.checkAny`. It returns `false` if it has no validation errors, but It returns `error array` in otherwise.


## Example Simple Validation

```js
// examples/simple-validation.js
import modernValidator from 'modern-express-joi'
import Joi from 'joi'
import express from 'express'
import bodyParser = from 'body-parser'
const app = express()
app.use(bodyParser.json())

const template = Joi.object().keys({
  name: Joi.string().required(),
  age: Joi.number().positive().optional()
})
const schemaTemplates = {
  template
}

app.use(modernValidator(schemaTemplates))
app.post('/users', (req, res) => {
  req.checkBody('template')
  req.sanitizeBody('template')
  const errors = req.validationErrors()
  if (errors) res.status(400).send(errors)
  else res.status(200).send({ message: 'Success' })
})

app.listen(8080)
console.log('Running at port 8080')

```

### Passed
```json
// Request
{
  "name": "Hello",
  "age": 18
}

// Response 200
{ "message": "Success" }
```

### Failed
```json
// Request
{
  "age": "not number"
}

// Response 400
[
  {
    "message": "\"name\" is required",
    "path": "name",
    "type": "any.required",
    "context": {
      "key": "name"
    }
  }
]
```

## Example Error Formatter
```js
// examples/error-formatter.js
import modernValidator from 'modern-express-joi'
import Joi from 'joi'
import express from 'express'
import bodyParser = from 'body-parser'
const app = express()
app.use(bodyParser.json())

const template = Joi.object.keys({
  name: Joi.string().required(),
  age: Joi.number().positive().optional()
})
const schemaTemplates = {
  template
}
const errorFormatter = (errors) => (
  errors.map(error => error.message)
)

app.use(modernValidator(schemaTemplates, { errorFormatter }))
app.post('/users', (req, res) => {
  req.checkBody('template')
  req.sanitizeBody('template')
  const errors = req.validationErrors()
  if (errors) res.status(400).send(errors)
  else res.status(200).send({ message: 'Success' })
})

app.listen(8080)
console.log('Running at port 8080')
```

## Example Deep Checking Field
```js
// examples/deep-checking.js
import modernValidator from 'modern-express-joi'
import Joi from 'joi'
import express from 'express'
import bodyParser = from 'body-parser'
const app = express()
app.use(bodyParser.json())

const template = Joi.object().keys({
  name: Joi.string().required(),
  age: Joi.number().positive().optional()
})
const schemaTemplates = {
  template
}
const errorFormatter = (errors) => (
  errors.map(error => error.message)
)

app.use(modernValidator(schemaTemplates, { errorFormatter }))
app.post('/users', (req, res) => {
  req.checkBody('template')
  req.sanitizeBody('template')
  const errors = req.validationErrors()
  if (errors) res.status(400).send(errors)
  else res.status(200).send({ message: 'Success' })
})

app.listen(8080)
console.log('Running at port 8080')
```
