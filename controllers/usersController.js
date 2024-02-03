const {selectAllUsers, selectUserByUsername} = require('../models/usersModel')

exports.getAllUsers = (req, res)=>{
    selectAllUsers().then((users)=>{
        res.status(200).send({users})
    })
}

exports.getUserByUsername = (req,res,next)=>{
    const {username} = req.params
    selectUserByUsername(username).then((user)=>{
        res.status(200).send({user})
    }).catch(next)
}