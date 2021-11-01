const express = require('express')
const userRouter = require('./routers/user')
const postRouter = require('./routers/post')
const cors = require('cors')
const Post = require('./models/post')
const User = require('./models/user')


require('./db/mongoose')

const app = express()
const port = 3001

// const multer = require('multer')
// const upload = multer({
//     dest:'images'
// })

// app.post('/upload', upload.single('upload') ,(req, res) => {
//     res.send()
// })

// const post = Post.findById('616707099f019944c5f661e9')
// post.populate('owner').exec((err, post)=>{
//     console.log(post.owner)
// })

// const user = User.findById('6167067e41f5778f01b409be')
// user.populate('posts').exec((err, p) =>{
//     console.log("ABC")
//     console.log(p.posts)
// })

// console.log(typeof(user))

app.use(express.json())
app.use(cors())
app.use(userRouter)
app.use(postRouter)

app.get('/', (req, res) => {
    res.send({"greeting":"Phuong"})
})

app.listen(port, () => {
    console.log(`Running on port: ${port}`)
})