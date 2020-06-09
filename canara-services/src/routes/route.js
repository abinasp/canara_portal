const express = require('express');
const auth = require('../modules/auth');
const validToken = require('../utils/token');


const router = express.Router();

router.get("/", (req,res)=>{
    res.json({
        success: true,
        message: 'Welcome to canara bank api localization'
    });
});

router.get("/check", validToken.isValidToken(), async(req,res) => {
    try{
        const { user } = req.body;
        res.json({
            success: true,
            message: 'Check successful',
            data: await auth.check(user)
        });
    }catch(error){
        console.log(error);
        res.json({
            success: false,
            message: "Error in check",
            error: error.message
        });
    }
});

router.post("/login", async(req,res)=>{
    try{
        const { username, password } = req.body;
        res.json({
            success: true,
            message: 'Login successful',
            data: await auth.login(username, password)
        });
    }catch(error){
        console.log(error);
        res.json({
            success: false,
            message: "Error in login",
            error: error.message
        });
    }
});

router.post("/create-user", async (req,res) => {
    try{
        const { name, username, password, role } = req.body;
        res.json({
            success: true,
            message: 'User created successful',
            data: await auth.createUser(name, username, password, role)
        });
    }catch(error){
        console.log(error);
        res.json({
            success: false,
            message: "Error in creating user",
            error: error.message
        })
    }
});

router.get("/get-user", validToken.isValidToken(), async (req,res) => {
    try{
        res.json({
            success: true,
            message: 'User list fetched successfully',
            data: await auth.getUsers()
        });
    }catch(error){
        console.log(error);
        res.json({
            success: false,
            message: "Error in fetching users",
            error: error.message
        })
    }
});

router.put("/update-user", validToken.isValidToken(), async (req,res) => {
    try{
        const { updatedUser } = req.body;
        res.json({
            success: true,
            message: 'User updated successfully',
            data: await auth.editUser(updatedUser)
        });
    }catch(error){
        console.log(error);
        res.json({
            success: false,
            message: "Error in updating user",
            error: error.message
        })
    }
});

router.post("/delete-user", validToken.isValidToken(), async (req,res) => {
    try{
        console.log(req.body)
        const { apikey } = req.body;
        res.json({
            success: true,
            message: 'User deleted successfully',
            data: await auth.deleteUser(apikey)
        });
    }catch(error){
        console.log(error);
        res.json({
            success: false,
            message: "Error in deleting user",
            error: error.message
        })
    }
});

module.exports = router;