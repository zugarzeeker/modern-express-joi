# modern-express-joi
An express.js middleware makes a powerful validation request with the Joi validation.

## Inspiration
`express-validator` and `Joi validation`

## Usage
- `npm install modern-express-joi`
- `import { modernValidator } from 'modern-express-joi'`
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
<!-- Sanitize your object from locations  -->

### `modernValidator(Object, [errorFormatter])`
Passing `schemaTemplates` as object that has key name of your schema templates to construct an express middleware.

### `errorFormatter(errors)`
You can pass `errorFormatter` as a function to `modernValidator` that is optional second params for formatting errors when using `req.validationErrors()`.

### `req.validationErrors()`
Getting your result of validation after you called `req.checkAny`. It returns `false` if it has no validation errors, but It returns `error array` in otherwise.


## Example Simple Validation

```js
// examples/simple-validation.js
import Joi from Joi
import express from 'express'
const app = express()

const template = Joi.object.keys({
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
  "name": "Hello",
  "age": 18
}

// Response 400
{ }
```

## Example Error Formatter
```js
// examples/error-formatter.js
import Joi from Joi
import express from 'express'
const app = express()

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

app.use(modernValidator(schemaTemplates, errorFormatter))
app.post('/users', (req, res) => {
  req.checkBody('template')
  req.sanitizeBody('template')
  const errors = req.validationErrors()
  if (errors) res.status(400).send(errors)
  else res.status(200).send({ message: 'Success' })
})
```
