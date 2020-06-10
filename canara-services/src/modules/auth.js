const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');

const dbc = require('../utils/dbc');
const authToken = require('../utils/token');


module.exports = {

    check: async function(user){
        const conn = await dbc.dbConn();
        const fetchUser = await conn.collection("users").findOne({apikey: user.apikey},{
            projection: {
                _id: 0,
                password: 0
            }
        });
        const userObj = {username: fetchUser.username, role: fetchUser.role, apikey: fetchUser.apikey};
        const token = authToken.generateToken(userObj);
        return {auth: token, user: fetchUser};
    },

    login: async function(username, password){
        const conn = await dbc.dbConn();
        const fetchUser = await conn.collection("users").findOne({username});
        if(!fetchUser){
            throw new Error("User doesn't exist");
        }
        if(!bcrypt.compareSync(password,fetchUser.password)){
            throw new Error("Authentication failed. Invalid credentials");
        }
        const user = {username: fetchUser.username, role: fetchUser.role, apikey: fetchUser.apikey};
        delete fetchUser._id;
        delete fetchUser.password;
        const token = authToken.generateToken(user);
        return {auth: token, user: fetchUser};
    },

    createUser: async function(name, username, password, role){
        const conn = await dbc.dbConn();
        const fetchUser = await conn.collection("users").findOne({ username });
        if(fetchUser){
            throw new Error("Username already exists");
        }
        const newUser = {
            name,
            username,
            password: bcrypt.hashSync(password, 10),
            role,
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
        ).toArray();
        return { userLists: fetchUsers};
    },

    editUser: async function(updatedUser){
        const conn = await dbc.dbConn();
        const { apikey } = updatedUser;
        const fetchUser = await conn.collection("users").findOne({apikey});
        if(!fetchUser){
            throw new Error("User doesn't exist");
        }
        const fetchUsername = await conn.collection("users").findOne({ username: updatedUser.username });
        if(fetchUsername){
            throw new Error("Same username already exist");
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