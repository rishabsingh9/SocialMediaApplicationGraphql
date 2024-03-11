// module.exports.validateRegisterInput=(username,email,password,confirmPassword)=>{
// const errors={};
// if(username.trim()===''){
//     errors.username="Username must not be empty"
// }
// else if(email.trim()=''){
//     errors.email='email must not be empty'
// }
// else{
//     const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
//     if (!email.match(regEx)) {
//       errors.email = 'Email must be a valid email address';
//     }

// }

// if(password.trim()=''){
//     errors.password='password must not be empty'
// }
// else if(password!==confirmPassword){
//     errors.confirmPassword='passwords must match'
// }

// return{
//     errors,
//     valid:Object.keys(errors).length<1
// }
// }
module.exports.validateRegisterInput = (
    username,
    email,
    password,
    confirmPassword
  ) => {
    const errors = {};
    if (username.trim() === '') {
      errors.username = 'Username must not be empty';
    }
    if (email.trim() === '') {
      errors.email = 'Email must not be empty';
    } else {
      const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
      if (!email.match(regEx)) {
        errors.email = 'Email must be a valid email address';
      }
    }
    if (password === '') {
      errors.password = 'Password must not empty';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords must match';
    }
  
    return {
      errors,
      valid: Object.keys(errors).length < 1
    };
  };

  module.exports.validateLoginInput=(username,password)=>{
    const errors={};
    if(username.trim()==''){
        errors.username="username can not be empty"
    }
    else if(password.trim()==''){
        errors.password="password can not be empty"
    }
    return{
        errors,
        isvalid:Object.keys(errors).length<1
    }
  }
  