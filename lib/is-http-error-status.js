module.exports = isHttpErrorStatus;

function isHttpErrorStatus(statusCode, expectedStatusCode) {
  if (statusCode === 400) {
    return ("HTTP response Status Code: 400 Bad Request");
  } else if (statusCode === 403) {
    return ("HTTP response Status Code: 403 Forbidden");
  } else if (statusCode === 404) {
    return ("HTTP response Status Code: 404 Not Found");
  } else if (statusCode === 405) {
    return ("HTTP response Status Code: 405 Method Not Allowed");
  } else if (statusCode === 500) {
    return ("HTTP response Status Code: 500 Internal Server Error");
  } else if (statusCode !== expectedStatusCode) {
    return ("HTTP response Status Code: " + statusCode);
  } else {
    return false;

  }

}