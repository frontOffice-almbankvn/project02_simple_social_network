const express = require('express')
const Post = require('../models/post')
const auth = require('../middleware/auth')
const User = require('../models/user')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;
const router = new express.Router()

router.post('/posts', auth, async (req, res) => {
    const post = new Post({
        ...req.body,
        owner: req.user._id
    })

    try {
        await post.save()
        res.status(201).send(post)
    } catch(e){
        console.log(e)
        res.status(400).send(e)
    }
})



router.get('/posts', auth, async (req, res) =>{
    const match = {}
    const sort = {}

    // if(req.query.completed){
        
    // }
    // console.log(req.user)
    console.log("get /posts")

    try{
        // const user = new User({
        //     ...req.user
        // })
        // console.log(u.email)

        // await user.populate('posts').exec((err, a) => {
        //     res.send(a.posts)
        // })
        //const user = await User.findById(req.user._id)
        await req.user.populate(
            {
                path:'posts',
                options:{
                    sort:{
                        createdAt:-1
                    }
                }
            }        
        )
        // .exec((err,a) => {
        //     res.send(a.posts)
        // })
        //res.send(req.user)
        res.send(req.user.posts)


    } catch (e){
        console.log(e)
        res.status(500).send()
    }
})

router.post('/visitposts', auth, async (req, res) => {
    try{
        const search_id = req.body.search_id;
        console.log(search_id)
        const ls = await Post.aggregate([
            {$match:{owner:ObjectId(search_id)}},
            {$sort:{createdAt:-1}}
        ])
        console.log(ls)
        res.send(ls)
    } catch(e){
        console.log(e)
        res.status(500).send()
    }
})


router.delete('/posts/:id', auth, async (req,res) => {
    try{
        const post = await Post.findByIdAndDelete({_id: req.params.id, owner: req.user._id})

        if (!post){
            res.status(404).send()
        }
    } catch (e){
        res.status(500).send()
    }
})


module.exports = router