var base64 = (i) => {
  return ((new Buffer(i, 'ascii')).toString('base64'));
}

var unbase64 = (i) => {
  return ((new Buffer(i, 'base64')).toString('ascii'));
}

export { base64, unbase64 };