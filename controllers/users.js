const usersRouter = require('express').Router()
const User = require('../models/User')

usersRouter.post('/', async (req, res) => {
    const { body } = req
    const { username, name, password} = body

    const user = new User({
        username,
        name,
        passwordHash: password
    })

    const savedUser = await user.save()

    res.json(savedUser)
})

module.exports = usersRouter;