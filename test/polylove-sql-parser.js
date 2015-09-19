var chai = require('chai');
var parser = require('../polylove-sql-parser.js');

var expect = chai.expect;


describe('Parser', function() {
	describe('#parse()', function() {

		it('SELECT * FROM movies', function () {
      var qSimpleSelect = parser.parse('SELECT * FROM movies');

      expect(qSimpleSelect).to.deep.equal({
        columns: ['*'],
        from: [['movies', 'movies']],
        where: [],
        orderBy: []
      });
  	});

    it('SELECT * FROM movies WHERE movies.year = {{year}}', function () {
      var qSimpleSelect = parser.parse('SELECT * FROM movies WHERE movies.year = {{year}}');

      expect(qSimpleSelect).to.deep.equal({
        columns: ['*'],
        from: [['movies', 'movies']],
        where: ['=', ['movies', 'year'], { type: 'property', name: 'year' }],
        orderBy: []
      });
    });

    it('SELECT * FROM movies WHERE movies.year = {{year}} AND :title = movies.title', function () {
      var qSimpleSelect = parser.parse('SELECT * FROM movies WHERE movies.year = {{year}} AND :title = movies.title');

      expect(qSimpleSelect).to.deep.equal({
        columns: ['*'],
        from: [['movies', 'movies']],
        where: ['and',
          ['=', ['movies', 'year'], { type: 'property', name: 'year' }],
          ['=', ['movies', 'title'], { type: 'constant', name: 'title' }]
        ],
        orderBy: []
      });
    });

    it('SELECT * FROM movies WHERE movies.year = {{year}} ORDER BY movies.title', function () {
      var qSimpleSelect = parser.parse('SELECT * FROM movies WHERE movies.year = {{year}} ORDER BY movies.title');

      expect(qSimpleSelect).to.deep.equal({
        columns: ['*'],
        from: [['movies', 'movies']],
        where: ['=', ['movies', 'year'], { type: 'property', name: 'year' }],
        orderBy: [['movies', 'title']]
      });
    });

    it('SELECT * FROM movies WHERE movies.year = {{year}} ORDER BY movies.title DESC', function () {
      var qSimpleSelect = parser.parse('SELECT * FROM movies WHERE movies.year = {{year}} ORDER BY movies.title DESC');

      expect(qSimpleSelect).to.deep.equal({
        columns: ['*'],
        from: [['movies', 'movies']],
        where: ['=', ['movies', 'year'], { type: 'property', name: 'year' }],
        orderBy: [['movies', 'title', 'DESC']]
      });
    });

	});
});