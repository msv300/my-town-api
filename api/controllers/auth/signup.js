module.exports = {

  friendlyName: 'Signup',

  description: 'Sign up for a new user account.',

  inputs: {

    emailAddress: {
      type: 'string',
      isEmail: true,
      description: 'The email address for the new account, e.g. m@example.com.',
      extendedDescription: 'Must be a valid email address.',
    },

    password: {
      required: true,
      type: 'string',
      maxLength: 200,
      example: 'passwordlol',
      description: 'The unencrypted password to use for the new account.'
    },

    firstName: {
      type: 'string',
      required: true,
      description: 'User\'s first name',
      maxLength: 60,
      example: 'Jose'
    },

    lastName: {
      type: 'string',
      required: true,
      description: 'User\'s last name',
      maxLength: 60,
      example: 'Lisa'
    },

    mobileNo: {
      type: 'string',
      example: '+919342424234',
      description: 'Mobile number for OTP verification and other services,',
    },

    gender: {
      type: 'string',
      isIn: ['male', 'female', 'other'],
      description: 'Gender',
      example: 'male'
    },

    locationId: {
      type: 'number',
      description: 'Location ID',
      example: 1
    },

  },

  exits: {

    invalid: {
      responseType: 'badRequest',
      description: 'The provided fullName, password and/or email address are invalid.',
      extendedDescription: 'If this request was sent from a graphical user interface, the request ' +
        'parameters should have been validated/coerced _before_ they were sent.'
    },

    emailAlreadyInUse: {
      statusCode: 400,
      responseType: 'badRequest',
      description: 'The provided email address or mobile is already in use.',
    },

    notFound: {
      responseType: 'notFound',
    },

  },

  fn: async function (inputs, exits) {
    if (!inputs.emailAddress && !inputs.mobileNo)
      return exits.invalid({ error: 'Either email or mobile number is mandatory.' });

    if (inputs.locationId && !await Location.findOne(inputs.locationId))
      return exits.notFound({ error: 'Location not found' });

    let newEmailAddress = inputs.emailAddress && inputs.emailAddress.toLowerCase();

    const { verifyEmailAddresses, verifyMobileNumber, emailProofTokenValidity } = sails.config.custom;

    let newUser = {
      emailAddress: newEmailAddress,
      password: await sails.helpers.passwords.hashPassword(inputs.password),
      firstName: inputs.firstName,
      lastName: inputs.lastName,
      mobileNo: inputs.mobileNo,
      gender: inputs.gender && inputs.gender.toLowerCase(),
      location: inputs.locationId,
    };

    if (newEmailAddress && verifyEmailAddresses)
      newUser = {
        ...newUser,
        emailProofToken: User.generateToken(),
        emailProofTokenExpiresAt: new Date(Date.now() + emailProofTokenValidity),
        emailStatus: 1
      };

    if (inputs.mobileNo && verifyMobileNumber) {
      newUser = {
        ...newUser,
        mobileVerificationToken: User.generateToken(),
        mobileVerificationStatus: 1
      }
    }

    // Build up data for the new user record and save it to the database.
    // (Also use `fetch` to retrieve the new ID so that we can use it below.)
    let newUserRecord = await User.create(newUser)
      .intercept(err => exits.invalid({ error: err }))
      .fetch();

    // if (newEmailAddress && verifyEmailAddresses) {
    //   sails.hooks.email.send(
    //     "verifyAccount",
    //     {
    //       fullName: inputs.firstName + ' ' + inputs.lastName,
    //       token: newUserRecord.emailProofToken
    //     },
    //     {
    //       to: newEmailAddress,
    //       subject: 'Please confirm your account'
    //     },
    //     (err) => { console.log(err || "It worked!"); }
    //   )
    //   // await sails.helpers.sendTemplateEmail.with({
    //   //   to: newEmailAddress,
    //   //   subject: 'Please confirm your account',
    //   //   template: 'verify-account-email',
    //   //   templateData: {
    //   //     fullName: inputs.firstName + ' ' + inputs.lastName,
    //   //     token: newUserRecord.emailProofToken
    //   //   }
    //   // });
    // }

    if (inputs.mobileNo && verifyMobileNumber) {
      try {
        await sails.helpers.sendOtp.with({
          id: newUserRecord.id,
          mobileNo: newUserRecord.mobileNo
        });
        return exits.success({ message: 'Succesfully sent.' });
      } catch (err) {
        return exits.errorSendingToken({ error: err });
      }
    }

    if (newUserRecord)
      return exits.success(newUserRecord);

  }

};


// sails.hooks.email.send(
//   "verifyAccount",
//   {
//     fullName: "Joe",
//     token: "Sasdfsdfsdfue"
//   },
//   {
//     to: "msv300@gmail.com",
//     subject: "Hi there"
//   },
//   function(err) {console.log(err || "It worked!");}
// )