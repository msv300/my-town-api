/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    emailAddress: {
      type: 'string',
      required: true,
      unique: true,
      isEmail: true,
      maxLength: 200,
      example: 'carol.reyna@microsoft.com'
    },

    password: {
      type: 'string',
      required: true,
      description: 'Securely hashed representation of the user\'s login password.',
      protect: true,
      example: 'somePass#123'
    },

    firstName: {
      type: 'string',
      required: true,
      description: 'User\'s first name',
      maxLength: 60,
      example: 'Microwave'
    },

    lastName: {
      type: 'string',
      required: true,
      description: 'User\'s last name',
      maxLength: 60,
      example: 'Lisa'
    },

    mobileNo: {
      required: true,
      type: 'string',
      maxLength: 20,
      // regex: /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/i,
      description: 'Mobile number for OTP verification and other services.',
      example: '+91 2342424234',
    },

  },

  customToJSON: function () {
    let user = _.omit(this, ['password', 'authenticationToken']);
    return {
      ...user,
      fullName: user.firstName + " " + user.lastName,
      initials: pickInitials(user.firstName, user.lastName),
    };
  },

};

const pickInitials = (firstName, lastName) => {
  let initial;
  if (firstName && lastName)
    initial = firstName[0] + lastName[0];
  else if (firstName)
    initial = firstName.slice(0, 2);
  else if (lastName)
    initial = lastName.slice(0, 2);
  
  return initial.toUpperCase();
};
