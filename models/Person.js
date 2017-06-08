'use strict';

const crypto = require('crypto');
const Model = require('objection').Model;
const Animal = require('./Animal');
const Movie = require('./Movie');

/**
 * @extends Model
 * @constructor
 */
class Person extends Model {
  // Table name is only required property
  static get tableName() {
    return 'Person';
  }

  
  // Optional JSON schema. This is not the database schema! Nothing is generated
    // based on this. This is only used for validation. Whenever a model instance
    // is created it is checked against this schema. http://json-schema.org/.
  static get jsonSchema() {

    return {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        id: {
          type: 'integer'
        },
        parentId: {
          type: ['integer', 'null']
        },
        email:{
          type: 'string',

        },
        password: {
          type: 'string',
          minLength: 6,
          maxLength: 255,
        },
        salt: {
          type: 'string',
          minLength: 6,
          maxLength: 255,
        },
        facebookId: {
          type: 'string',
          minLength: 6,
          maxLength: 255
        },
        googleId: {
          type: 'string',
          minLength: 6,
          maxLength: 255
        },
        firstName: {
          type: 'string',
          minLength: 1,
          maxLength: 255
        },
        lastName: {
          type: 'string',
          minLength: 1,
          maxLength: 255
        },
        age: {
          type: 'number'
        },
        address: {
          type: 'object',
          properties: {
            street: {
              type: 'string'
            },
            city: {
              type: 'string'
            },
            zipCode: {
              type: 'string'
            }
          }
        }
      }
    };
  }

  // This object defined the relations to other models.
  static get relationMappings() {

    return {
      pets: {
        relation: Model.HasManyRelation,
        // The related model. This can be either a Model subclass constructor or an
            // absolute file path to a module that exports one.
        modelClass: Animal,
        join: {
          from: 'Person.id',
          to: 'Animal.ownerId'
        }
      },

      movies: {
        relation: Model.ManyToManyRelation,
        modelClass: Movie,
        join: {
          from: 'Person.id',
          // ManyToMany relation needs the `through` object to describe the join table.
          through: {
            from: 'Person_Movie.personId',
            to: 'Person_Movie.movieId'
          },
          to: 'Movie.id'
        }
      },

      children: {
        relation: Model.HasManyRelation,
        modelClass: Person,
        join: {
          from: 'Person.id',
          to: 'Person.parentId'
        }
      }
    };
  }

  /**
   * generates random string of characters i.e salt
   * @function
   * @param {number} length - Length of the random string.
   */
  genRandomString (length){
    return crypto.randomBytes(Math.ceil(length/2))
              .toString('hex') /** convert to hexadecimal format */
              .slice(0,length);   /** return required number of characters */
  }

  /**
   * hash password with sha512.
   * @function
   * @param {string} password - List of required fields.
   * @param {string} salt - Data to be validated.
   */
  sha512 (password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
      salt:salt,
      passwordHash:value
    };
  }

}
module.exports = Person;
