// iss using promises

const needle = require('needle');

const fetchMyIP = () => {
  return needle('get','https://api.ipify.org?format=json')
    .then((response) => {
      const body = response.body;
      const ip = body.ip;
      return ip;
    });
};

const fetchCoordsByIP = (ip) => {
  return needle('get', `http://ipwho.is/${ip}`)
    .then((response) => {
      const body =  response.body;
      const latitude = body.latitude;
      const longitude = body.longitude;
      return {latitude, longitude};
    });
};

const fetchISSFlyOverTimes = (coords) => {
  const latitude = coords.latitude;
  const longitude = coords.longitude;
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`;
  return needle('get', url)
    .then((response) => {
      const body = response.body;
      const passTimes = body.response;
      return passTimes;
    });
};

const nextISSTimesForMyLocation = () => {
  return fetchMyIP()
    .then((ip) => fetchCoordsByIP(ip))
    .then((coords) => fetchISSFlyOverTimes(coords))
    .then((passtimes) => {
      return passtimes;
    });
};

module.exports = { nextISSTimesForMyLocation };