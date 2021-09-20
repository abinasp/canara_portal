import employee from '../employeeData.js';

const login = (req,res) => {
  const { formInput }  = req.body
  // console.log(formInput.username)
  let user
  employee.forEach((emp) => {
    if(emp.username === formInput.username) {
      user = emp
      return
    }
  });
  if(!user) {
    res.send({
      message: "User not exist"
    })
  }
  else {
    if(user.password === formInput.password) {
      res.send({
        message: "loggedIn successfully",
        data: user
      })
    }
    else {
      res.send({
        message: "Wrong Password"
      })
    }
  }
}

const showEmployee = (req, res) => {
  res.send({
    message: "Success",
    data: employee
  });
}

export{ 
  login,
  showEmployee 
};