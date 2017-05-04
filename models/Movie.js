'use strict';

const Model = require('objection').Model;

class Movie extends Model {

  static get tableName() {
		
    return 'Movie';
  }

  static get jsonSchema(){
		
    return {
      type: 'object',
      required: ['name'],

      properties: {
        id: {
          type: 'integer'
        },
        name: {
          type: 'string',
          minLength: 1,
          maxLength: 255
        }
      }
    };
  }

  static get relationMappings(){
		
    return {
      actors: {
        relation: Model.ManyToManyRelation,
        modelClass: __dirname + '/lib/models/Person',
        join: {
          from: 'Movie.id',
          through: {
            from: 'Person_Movie.movieId',
            to: 'Person_Movie.personId'
          },
          to: 'Person.id'
        }
      }
    };
  }
}

module.exports = Movie;