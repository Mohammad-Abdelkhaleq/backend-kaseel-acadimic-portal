'use strict';

const express = require('express');
const dataModules = require('../models');
const router = express.Router();
const basicAuth = require('../middleware/basic.js')
const bearerAuth = require('../middleware/bearer.js')
const permissions = require('../middleware/acl.js')

router.param('model', (req, res, next) => {
  const modelName = req.params.model;
  console.log('Available Models:', Object.keys(dataModules));
  console.log('Model Name:', modelName);
  if (dataModules[modelName]) {
    req.model = dataModules[modelName];
    console.log('req.model', dataModules[modelName]);
    next();
  } else {
    next('Invalid Model');
  }
});

router.get('/:model', bearerAuth, permissions('read'), handleGetAll);
router.get('/:model/:id', bearerAuth, permissions('read'), handleGetOne);
router.post('/:model', bearerAuth, permissions('create'), handleCreate);
router.put('/:model/:id', bearerAuth, permissions('create'), handleUpdate);
router.delete('/:model/:id', bearerAuth, permissions('delete'), handleDelete);

async function handleGetAll(req, res) {
  try {
    let allRecords = await req.model.get();
    res.status(200).json(allRecords);
  } catch (error) {
    console.error('Error getting all records:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function handleGetOne(req, res) {
  try {
    const id = req.params.id;
    let theRecord = await req.model.get(id);
    res.status(200).json(theRecord);
  } catch (error) {
    console.error('Error getting one record:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


async function handleCreate(req, res) {
  try {
    let obj = req.body;
    let newRecord = await req.model.create(obj);
    res.status(201).json(newRecord);
  } catch (error) {
    console.error('Error creating a record:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


async function handleUpdate(req, res) {
  try {
    const id = req.params.id;
    const obj = req.body;
    let updatedRecord = await req.model.update(id, obj);
    res.status(200).json(updatedRecord);
  } catch (error) {
    console.error('Error updating a record:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function handleDelete(req, res) {
  try {
    let id = req.params.id;
    let deletedRecord = await req.model.delete(id);
    res.status(200).json(deletedRecord);
  } catch (error) {
    console.error('Error deleting a record:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = router;



