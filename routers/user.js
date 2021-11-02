const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const req = require('express/lib/request')
const mongoose = require('mongoose')


const router = new express.Router()


router.post('/users', async (req, res)=>{

    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (e){
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) =>{
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (e){
        console.log(e)
        res.status(400).send()
    }
})

router.post('/users/follow', auth, async (req, res) =>{
    try{

        if (!req.user.followPeople){
            req.user.followPeople = []
        }

        let m = req.user.followPeople.filter(x => {

            return x.toString() === req.body.followPeople_id
            }
        )
        
        if (m.length >0) {
            res.send(req.user.followPeople)
            return
        }

        req.user.followPeople = req.user.followPeople.concat( req.body.followPeople_id )
        
        // req.user.friends = new Set(req.user.friends)
        await req.user.save()
        res.send(req.user.followPeople)
    } catch(e){
        console.log(e)
        res.status(400).send()
    }
})

router.post('/users/unfollow', auth, async (req, res) => {
    try {
        let m = req.user.followPeople.filter(x => {
            
            return !x.toString() === req.body.followPeople_id
            }
        )

        req.user.followPeople = m
        await req.user.save()
        res.send(req.user.followPeople)

        
    } catch(e){
        console.log(e)
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        // console.log(req)
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        
        res.send()
    } catch(e){
        console.log(e)
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})


router.post('/follows', auth, async (req, res) => {
    // console.log("get follows",req.body.text )

    const value_match = new RegExp(`.*${req.body.text}.*`)
    // console.log(req.user.followPeople)
    const ls = await User.aggregate([{$match:{
        _id:{$ne:req.user._id},
        email:{$regex:value_match}
                }},
        {
            $project:{_id:1, email:1}
        },
        {
            $addFields:{
                followStatus:{
                    $switch:{
                        branches:[
                            {case:{$in:["$_id",req.user.followPeople ? req.user.followPeople: []]},then:"Followed"}
                        ],
                        default:"Follow"
                    }
                }
            }
        }
    ])
    
    res.send(ls)
})

router.delete('/users/me', auth, async (req, res) => {
    try{
        await req.user.remove()
        res.send(req.user)
    } catch (e){
        res.status(500).send()
    }
})


const upload = multer({
    dest:'avatars',
    limits:{
        fileSize: 8000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
        // cb(new Error('Please upload an image'))
    }
})

router.post('/users/me/avatar', upload.single('avatar'), (req, res) => {
    console.log("request: ", req.body)
    res.send()
})

module.exports = router