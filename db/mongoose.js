const mongoose = require('mongoose')

mongoose.connect("mongodb://localhost:27017/psn", () => {
    console.log(`mongoose connected to 27017`)
})