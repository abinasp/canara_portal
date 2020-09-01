const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');

const dbc = require('../utils/dbc');
const authToken = require('../utils/token');


module.exports = {

    check: async function(user){
        const conn = await dbc.dbConn();
        let fetchUser = {}, userObj={};
        if(user.apikey === "d9dd6027-2c5f-4f87-9f4f-bfd21b87a26d"){
            userObj = {username: "canara@admin", role: "admin", apikey: "d9dd6027-2c5f-4f87-9f4f-bfd21b87a26d"};
            fetchUser = {
                name : "ADMIN Canara",
                username : "canara@admin",
                role : "admin",
                apikey : "d9dd6027-2c5f-4f87-9f4f-bfd21b87a26d",
                createdAt : 1591697989874.0,
                updateAt : 1591697989874.0
            }
        }else{
            fetchUser = await conn.collection("users").findOne({apikey: user.apikey},{
                projection: {
                    _id: 0,
                    password: 0
                }
            });
            userObj = {username: fetchUser.username, role: fetchUser.role, apikey: fetchUser.apikey};
        }
        const token = authToken.generateToken(userObj);
        return {auth: token, user: fetchUser};
    },

    login: async function(username, password){
        const conn = await dbc.dbConn();
        let user = {}, fetchUser={};
        if(username === "canara@admin" && password === "canara@123"){
            user = {username: "canara@admin", role: "admin", apikey: "d9dd6027-2c5f-4f87-9f4f-bfd21b87a26d"};
            fetchUser = {
                name : "ADMIN Canara",
                username : "canara@admin",
                role : "admin",
                apikey : "d9dd6027-2c5f-4f87-9f4f-bfd21b87a26d",
                createdAt : 1591697989874.0,
                updateAt : 1591697989874.0
            }
        }else{
            fetchUser = await conn.collection("users").findOne({username});
            if(!fetchUser){
                throw new Error("User doesn't exist");
            }
            if(!bcrypt.compareSync(password,fetchUser.password)){
                throw new Error("Authentication failed. Invalid credentials");
            }
            user = {username: fetchUser.username, role: fetchUser.role, apikey: fetchUser.apikey};
            delete fetchUser._id;
            delete fetchUser.password;
        }
        const token = authToken.generateToken(user);
        return {auth: token, user: fetchUser};
    },

    createUser: async function(name, username, password, role, languages){
        const conn = await dbc.dbConn();
        const fetchUser = await conn.collection("users").findOne({ username });
        if(fetchUser || username === "canara@admin"){
            throw new Error("Username already exists");
        }
        const newUser = {
            name,
            username,
            password: bcrypt.hashSync(password, 10),
            role,
            languages,
            apikey: uuid(),
            createdAt: Date.now(),
            updateAt: Date.now()
        }
        await conn.collection("users").insertOne({...newUser});
        return "User created successfully";
    },

    getUsers: async function(){
        const conn = await dbc.dbConn();
        const fetchUsers = await conn.collection("users").find(
            {
                "role": {"$ne": "admin"}
            },
            {
                projection: {
                    _id: 0,
                    password: 0
                }
            }
        ).sort({"_id": -1}).toArray();
        return { userLists: fetchUsers};
    },

    editUser: async function(updatedUser){
        const conn = await dbc.dbConn();
        const { apikey } = updatedUser;
        const fetchUser = await conn.collection("users").findOne({apikey});
        if(!fetchUser){
            throw new Error("User doesn't exist");
        }
        if(fetchUser.username !== updatedUser.username){
            const fetchUsername = await conn.collection("users").findOne({ username: updatedUser.username });
            if(fetchUsername){
                throw new Error("Same username already exist");
            }
        }
        if(updatedUser.password){
            updatedUser.password = bcrypt.hashSync(updatedUser.password, 10)
        }
        delete updatedUser.apikey;
        updatedUser.updatedAt = Date.now();
        await conn.collection("users").updateOne({apikey}, { $set: {...updatedUser}});
        return "User updated successfully";
    },

    deleteUser: async function(apikey){
        const conn = await dbc.dbConn();
        if(!apikey){
            throw new Error("Invalid user");
        }
        await conn.collection("users").deleteOne({apikey});
        return "User deleted successfully";
    }
}