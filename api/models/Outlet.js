/**
 * Outlet.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    name: {
      type: 'string',
      required: true,
      unique: true,
      description: 'Full representation of the Caregory Name',
      maxLength: 120,
      example: 'Indian Parlour',
    },

    overview: {
      type: 'string',
      required: true,
      description: 'Some overview about that Outlet',
      example: 'Facial/Haircut/Massage',
    },

    status: {
      type: 'string',
      isIn: ['active', 'deleted'],
      defaultsTo: 'active',
    },

    categories: {
      collection: 'category',
      via: 'outlet',
      through: 'outletcategory',
    },

    locations: {
      collection: 'location',
      via: 'outlet',
      through: 'locationoutlet',
    },

    items: {
      collection: 'item',
      via: 'outlet',
      through: 'outletitem',
    }

  },

};
