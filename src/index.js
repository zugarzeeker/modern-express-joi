import _ from 'lodash'
import Joi from 'joi'

const modernValidator = (schemas, options = {}) => (req, res, next) => {
  const { errorFormatter, customValidator, customSanitizer } = options
  req._validationErrors = []
  const getValidationErrors = () => (
    (req._validationErrors.length === 0)
    ? false
    : _.uniqWith(req._validationErrors, _.isEqual)
  )
  req.validationErrors = () => (
    errorFormatter
    ? errorFormatter(req._validationErrors)
    : getValidationErrors()
  )
  const validateSchema = (toValidate) => (selectingSchema, field) => {
    const targetValue = field ? _.get(toValidate, field) : toValidate
    return Joi.validate(targetValue, schemas[selectingSchema])
  }
  _.map(['body', 'query', 'params'], location => {
    const toValidate = _.get(req, location)
    req[`check${_.capitalize(location)}`] = (...pipeline) => {
      const field = pipeline[1]
      if (customValidator) {
        const error = customValidator(toValidate)
        req._validationErrors = req._validationErrors.concat(error)
      } else {
        const error = validateSchema(toValidate)(...pipeline).error
        if (error) {
          error.details = error.details.map(detail => {
            detail.path = (field ? `${field}.` : '') + detail.path
            return detail
          })
          req._validationErrors = [...req._validationErrors, ...error.details]
        }
      }
    }
    req[`sanitize${_.capitalize(location)}`] = (...pipeline) => {
      req[location] = (
        customSanitizer
        ? customSanitizer(toValidate)
        : validateSchema(toValidate)(...pipeline).value
      )
    }
  })
  next()
}

export default modernValidator
