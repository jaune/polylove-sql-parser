var chai = require('chai');
var parse = require('../index.js');

var expect = chai.expect;
describe('#parse()', function() {

	it('SELECT * FROM movies', function () {
    var qSimpleSelect = parse('SELECT * FROM movies');

    expect(qSimpleSelect).to.deep.equal({
      columns: ['*'],
      constants: [],
      properties: [],
      from: [['movies', 'movies']],
      where: [],
      orderBy: []
    });
	});

  it('SELECT * FROM movies WHERE movies.year = {{year}}', function () {
    var qSimpleSelect = parse('SELECT * FROM movies WHERE movies.year = {{year}}');

    expect(qSimpleSelect).to.deep.equal({
      columns: ['*'],
      constants: [],
      properties: ['year'],
      from: [['movies', 'movies']],
      where: ['=', ['movies', 'year'], { type: 'property', name: 'year' }],
      orderBy: []
    });
  });

  it('SELECT * FROM movies WHERE movies.year = {{year}} AND :title = movies.title', function () {
    var qSimpleSelect = parse('SELECT * FROM movies WHERE movies.year = {{year}} AND :title = movies.title');

    expect(qSimpleSelect).to.deep.equal({
      columns: ['*'],
      constants: ['title'],
      properties: ['year'],
      from: [['movies', 'movies']],
      where: ['and',
        ['=', ['movies', 'year'], { type: 'property', name: 'year' }],
        ['=', ['movies', 'title'], { type: 'constant', name: 'title' }]
      ],
      orderBy: []
    });
  });

  it('SELECT * FROM movies WHERE movies.year = {{year}} ORDER BY movies.title', function () {
    var qSimpleSelect = parse('SELECT * FROM movies WHERE movies.year = {{year}} ORDER BY movies.title');

    expect(qSimpleSelect).to.deep.equal({
      columns: ['*'],
      constants: [],
      properties: ['year'],
      from: [['movies', 'movies']],
      where: ['=', ['movies', 'year'], { type: 'property', name: 'year' }],
      orderBy: [['movies', 'title']]
    });
  });

  it('SELECT * FROM movies WHERE movies.year = {{year}} ORDER BY movies.title DESC', function () {
    var qSimpleSelect = parse('SELECT * FROM movies WHERE movies.year = {{year}} ORDER BY movies.title DESC');

    expect(qSimpleSelect).to.deep.equal({
      columns: ['*'],
      constants: [],
      properties: ['year'],
      from: [['movies', 'movies']],
      where: ['=', ['movies', 'year'], { type: 'property', name: 'year' }],
      orderBy: [['movies', 'title', 'DESC']]
    });
  });

  it('SELECT * FROM movies WHERE movies.year = {{year}} ORDER BY movies.title {{direction}}', function () {
    var qSimpleSelect = parse('SELECT * FROM movies WHERE movies.year = {{year}} ORDER BY movies.title {{direction}}');

    expect(qSimpleSelect).to.deep.equal({
      columns: ['*'],
      constants: [],
      properties: ['year', 'direction'],
      from: [['movies', 'movies']],
      where: ['=', ['movies', 'year'], { type: 'property', name: 'year' }],
      orderBy: [['movies', 'title', { type: 'property', name: 'direction' }]]
    });
  });

});
