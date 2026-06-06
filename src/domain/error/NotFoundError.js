const DomainError = require('./DomainError');

/**
 * 资源不存在异常
 */
class NotFoundError extends DomainError {
  constructor(resource, identifier = null) {
    const message = identifier 
      ? `${resource} with id '${identifier}' not found`
      : `${resource} not found`;
    super(message, 'NOT_FOUND');
    this.resource = resource;
    this.identifier = identifier;
  }
}

module.exports = NotFoundError;
