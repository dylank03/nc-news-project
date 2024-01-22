const {selectAllUsers} = require('../models/usersModel')

exports.getAllUsers = (req, res)=>{
    selectAllUsers().then((users)=>{
        res.status(200).send({users})
    })
}