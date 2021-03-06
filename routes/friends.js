'use strict';

const express = require('express');
const router = express.Router();

const {User, Friend, Hospitalization} = require('../models');

//GET requests
router.get('/:userId', (req, res) => Friend.findAll({
  where: {
    $or: [{
      friend_id: req.params.userId
    },
    {user_id: req.params.userId}]
  },
  //to get the friend name and username
  include: [
    {model: User},
    {model: User, as: 'friend'}
  ]
})
  .then(friends => 
    res.json({friends: friends.map(friend => Object.assign({}, friend.apiRepr(), {
      friendName: friend.friend.name, 
      userName:friend.User.name})
    )})));

router.get('/new/:id', (req, res) => Friend.findOne({
  where: {id: req.params.id}, 
  include: [
    {model: User},
    {model: User, as: 'friend'}
  ]
})
  .then(friend => 
    res.json(Object.assign({}, friend.apiRepr(), {
      friendName: friend.friend.name, 
      userName:friend.User.name})
    )));

//POST request
router.post('/', (req, res) => {
  const requiredFields = ['user_id', 'friend_id', 'status'];
  requiredFields.forEach(field => {
    if(!(field in req.body)) {
      const message = `Missing ${field} in request body`;
      return res.status(400).send(message);
    }
  });
  return Friend.create(req.body)
    .then(friend => res.status(201).json(friend.apiRepr()))
    .catch(err => res.status(500).json({message: err}));
});

router.put('/:id', (req, res) => {
  if(!('status' in req.body)) {
    return res.status(400).send('missing status in req.body');
  }
  Friend.update({
    status: req.body.status
  },
  {
    where: {id: req.params.id}
  })
    .then(friend => res.status(204).end())
    .catch(err => res.status(500).json({message: 'internal server error'}));
});

router.delete('/:id', (req, res) => {
  return Friend.destroy({where: {id: req.params.id}})
    .then(friend => res.status(204).end())
    .catch(err => res.status(500).json({message: 'internal server error'}));
});

module.exports = router;