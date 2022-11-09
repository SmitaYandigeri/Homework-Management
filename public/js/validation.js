const validation = new JustValidate('#form');

validation
  .addField('#loginEmailId', [
    {
      rule: 'required',
      errorMessage: 'Email is required',
    },
    {
      rule: 'email',
      errorMessage: 'Email is invalid!',
    },
  ]).addField('#loginPassword', [
    {
        rule: 'required',
        errorMessage: 'Password is required',
    },
    {
      rule: 'password',
    },
  ]);

