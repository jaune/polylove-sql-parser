var parser = require('./polylove-sql-parser.js');

function flatten(toFlatten) {
  if (Array.isArray(toFlatten) && toFlatten.length > 0) {
    var head = toFlatten[0];
    var tail = toFlatten.slice(1);

    return flatten(head).concat(flatten(tail));
  } else {
    return [].concat(toFlatten);
  }
};

module.exports = function (input) {
	var data = parser.parse(input);

//	console.log(flatten(data.orderBy));

  var constants = {};
  var propertyByNames = {};
  var propertyByIndexes = [];

  var propIndex = 0;


  flatten(data.where).forEach(function (part) {
    if (typeof part == 'object'){
      switch(part.type) {
        case 'property': 
          if (!propertyByNames.hasOwnProperty(part.name)) {
            propertyByIndexes.push(part.name);
          }
        break;
        case 'constant': constants[part.name] = 1; break;
      }
    }
  });


  flatten(data.orderBy).forEach(function (part) {
    if (typeof part == 'object'){
      switch(part.type) {
        case 'property':
          if (!propertyByNames.hasOwnProperty(part.name)) {
            propertyByIndexes.push(part.name);
          }
        break;
        case 'constant': constants[part.name] = 1; break;
      }
    }
  });



  data.properties = propertyByIndexes;
  data.constants = Object.keys(constants);

	return data;
}