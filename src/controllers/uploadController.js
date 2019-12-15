const Post = require('../models/Post')

module.exports = {
  async list (req, res) {
    try {
      const posts = await Post.find()

      return res.json(posts)
    } catch (err) {
      return res.status(500).json({ error: 'Errror to list files' })
    }
  },
  async create (req, res) {
    try {
      const { originalname: name, size, key, location: url = '' } = req.file

      const post = await Post.create({
        name,
        size,
        key,
        url
      })

      return res.json(post)
    } catch (err) {
      return res.status(400).json({ error: 'Erro to create a new file' })
    }
  },
  async delete (req, res) {
    try {
      const post = await Post.findById(req.params.id)

      if (!post) {
        return res.status(400).json({ error: 'This file doesn\'t exist' })
      }

      await post.remove()

      return res.sendStatus(200)
    } catch (err) {
      return res.status(400).json({ error: 'Error to delete file' })
    }
  }
}
