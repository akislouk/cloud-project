// Executes the middleware and catches any async errors that may not be handled
export default (fn) => (req, res, next) => fn(req, res, next).catch(next);
