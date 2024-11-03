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

// fetch coordinations by ip function
const fetchCoordsByIP = (ip, callback) => {
  needle.get(`http://ipwho.is/${ip}`, (error, res, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (!body.success) {
      const message = `Success status was ${body.success}. Server message says: ${body.message} when fetching for IP ${body.ip}`;
      callback(Error(message), null);
      return;
    }

    const latitude = body.latitude;
    const longitude = body.longitude;
    callback(null, {latitude, longitude});
  });
};

module.exports = {
  fetchMyIP,
  fetchCoordsByIP
};