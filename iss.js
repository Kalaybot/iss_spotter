const needle = require('needle');

const fetchMyIP = (callback) => {
  needle.get('https://api.ipify.org?format=json', (error, response, body) => {
    if (error) {
      callback(error, null); // throws error if there's some issue in needle.get or network issues
    }
    if (response.statusCode !== 200) { // if request is not equals to 200 then it returns whatever status code it found
      callback((`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
      return;
    }

    const ip = body.ip;
    callback(null, ip); // go through the API body and looks for the IP
  });
};

// fetch coordinations by ip function
const fetchCoordsByIP = (ip, callback) => {
  needle.get(`http://ipwho.is/${ip}`, (error, response, body) => {
    if (error) {
      callback(error, null); //same as before throws error if network issues or needle.get
      return;
    }

    if  (response.statusCode !== 200) {
      callback((`Status code ${response.statusCode} when fetching coordinates for IP: ${body}`), null); // gives the error status code
      return;
    }

    if (!body.success) {
      const message = `Success status was ${body.success}. Server message says: ${body.message} when fetching for IP ${body.ip}`;
      callback(Error(message), null); // gives this meesage if Invalid IP is provided
      return;
    }

    const latitude = body.latitude;
    const longitude = body.longitude;
    callback(null, {latitude, longitude}); // returns coordinates as an object
  });
};

// Fly over times function
const fetchISSFlyOverTimes = (coords, callback) => {
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;

  needle.get(url, (error, response, body) => {
    if (error) {
      callback(error, null); // throws error if there's network issue/needle.get
      return;
    }
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null); // Error messasge if fail retreiving API body and gives status code
      return;
    }
    
    const passes = body.response;
    callback(null, passes); // returns response part of the body from API
  });
};

// chaining all functions in one function
const nextISSTimesForMyLocation = (callback) => {

  fetchMyIP((error, ip) => { // function starts by fetching IP
    if (error) {
      return callback(error, null); // if error return error msg from fetchMyIpP function
    }

    fetchCoordsByIP(ip, (error, loc) => { // if successful fetching IP next is fetching the location
      if (error) {
        return callback(error, null); // return error msg from fetchCoordsByIP if error
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => { // finding location successful then next is finding when is next will pass by
        if (error) {
          return callback(error, null); // same from above return msg if error.
        }

        callback(null, nextPasses);
      });
    });
  });
};

module.exports = {
  nextISSTimesForMyLocation
};