// async/await error catcher
const catchAsyncErrors = fn => (
  (req, res, next) => {
    const routePromise = fn(req, res, next);
    if (routePromise.catch) {
      routePromise.catch(err => next(err));
    }
  }
);

exports.catchAsync = catchAsyncErrors;



// Session ID generator

const crypto = require('crypto');

function generateSession(length) {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

exports.generateSession = generateSession;
