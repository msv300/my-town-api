/**
 * Cart.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    quantity: {
      type: 'number',
      description: 'No of items to be added.',
      defaultsTo: 1,
      example: 1
    },

    user: {
      model: 'user',
    },

    item: {
      model: 'item',
    },

  },

};

