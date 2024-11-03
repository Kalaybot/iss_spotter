const needle = require('needle');

const fetchMyIP = (callback) => {
  needle.get('https://api.ipify.org?format=json', (error, res, body) => {
    if (error) {
      callback(error, null); // throws error if there's some issue in needle.get or network issues
    }
    if (res.statusCode !== 200) { // if request is not equals to 200 then it returns whatever status code it found
      callback((`Status Code ${res.statusCode} when fetching IP: ${body}`), null);
      return;
    }

    const ip = body.ip;
    callback(null, ip); // go through the API body and looks for the IP
  });
};

module.exports = { fetchMyIP };