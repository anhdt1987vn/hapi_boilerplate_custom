'use strict';

const Model = require('objection').Model;

class Animal extends Model {

  static get tableName(){

    return 'Animal';
  }

  static get jsonSchema() {

    return {
      type: 'object',
      required: ['name'],

      properties: {
        id: {
          type: 'integer'
        },
        ownerId: {
          type: ['integer', 'null']
        },
        name: { 
          type: 'string',
          minLength: 1,
          maxLength: 255
        },
        species: {
          type: 'string',
          minLength: 1,
          maxLength: 255
        }
      }
    };
  }

  static get realtionMappings(){

    return {
      owner: {
        relation: Model.BelongsToOneRelation,
        modelClass: __dirname + '/lib/models/Person',
        join: {
          from: 'Animal.ownerId',
          to: 'Person.id'
        }
      }
    };
  }
}

module.exports = Animal;