const express = require('express');
const { ToDo } = require('../models');

const router = express.Router();

router.route('/')
  // get all todos
  .get((req, res) => {
    ToDo.findAll().then((todos) => {
      res.json({
        todos,
      });
    });
  })

  // create  todo
  .post((req, res) => {
    const {
      subject,
      dueDate,
      done,
    } = req.body;
    // validate potentially here
    ToDo.create({
      subject,
      done,
      dueDate,
    }).then((todo) => {
      res.json(todo);
    });
  });

router.route('/:id')

  // get a specific todo
  .get((req, res) => {
    ToDo.findById(req.params.id).then((todo) => {
      if (todo) {
        res.json(todo);
      } else {
        res.send(404);
      }
    });
  })

  // update a given todo
  .put((req, res) => {
    const { subject, dueDate, done } = req.body;
    ToDo.findById(req.params.id).then((todo) => {
      const todoToUpdate = todo;
      todoToUpdate.subject = subject;
      todoToUpdate.dueDate = dueDate;
      todoToUpdate.done = done;
      todoToUpdate.save().then((updatedTodo) => {
        res.json(updatedTodo);
      });
    });
  })

  .delete((req, res) => {
    const idToDelete = req.params.id;
    ToDo.findById(idToDelete).then((todo) => {
      if (todo) {
        todo.destroy().then(() => {
          res.json({ delete: true });
        });
      } else {
        res.send(404);
      }
    });
  });

module.exports = router;
