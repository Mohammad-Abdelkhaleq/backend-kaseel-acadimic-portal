'use strict';

const express = require('express');
const dataModules = require('../models');
const router = express.Router();
const basicAuth = require('../middleware/basic.js')
const bearerAuth = require('../middleware/bearer.js')
const permissions = require('../middleware/acl.js')

router.param('model', (req, res, next) => {
    const modelName = req.params.model;
    if (dataModules[modelName]) {
        req.model = dataModules[modelName];
        
        next();
    } else {
        next('Invalid Model');
    }
});

// CRUD Routes for all models
router.get('/:model', bearerAuth, permissions('read'), handleGetAll);
router.get('/:model/:id', bearerAuth, permissions('read'), handleGetOne);
router.post('/:model', bearerAuth, permissions('create'), handleCreate);
router.put('/:model/:id', bearerAuth, permissions('create'), handleUpdate);
router.delete('/:model/:id', bearerAuth, permissions('delete'), handleDelete);

// custom routes
// getting all courses for a specific teacher
router.get('/teachers/:teacherId/courses', bearerAuth, permissions('read'), handleGetAllCoursesForTeacher);

// // getting all students for a specific course
// router.get('/courses/:courseId/students', bearerAuth, permissions('read'), handleGetAllStudentsForCourse);

// // getting all students for a specific teacher
// router.get('/teachers/:teacherId/students', bearerAuth, permissions('read'), handleGetAllStudentsForTeacher);

// // getting all courses for a specific student
// router.get('/students/:studentId/courses', bearerAuth, permissions('read'), handleGetAllCoursesForStudent);

// CRUD Route Handlers
async function handleGetAll(req, res) {

    try {
        console.log('req.model.name', req.model.name);

        if(req.model.name === 'Courses'){
            let allRecords = await req.model.findAll({
                include: [
                    {
                        model: dataModules.users,
                        as: 'teacher', // use the alias defined in the association
                        attributes: ['id', 'username', 'email'] // specify the fields you want from the Users model
                    }
                ]
            });
            res.status(200).json(allRecords);
            return;
        }

        let allRecords = await req.model.findAll({});
        res.status(200).json(allRecords);
    } catch (error) {
        console.error('Error getting all records:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function handleGetOne(req, res) {
    try {
        const id = req.params.id;
        let theRecord = await req.model.findOne({ where: { id: id } })
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

        const findOne = await req.model.findOne({ where: { id: id } })
        const updatedRecord = await findOne.update(obj);
        res.status(200).json(updatedRecord);
    } catch (error) {
        console.error('Error updating a record:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function handleDelete(req, res) {
    try {
        let id = req.params.id;
        let deletedRecord = await req.model.destroy({ where: { id: id } });
        let response = {
            id: id,
            message: 'Record was deleted'
        }
        res.status(200).json(response);
    } catch (error) {
        console.error('Error deleting a record:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Custom Route Handlers

async function handleGetAllCoursesForTeacher(req, res) {
    try {
        const teacherId = req.params.teacherId;
        const allCourses = await dataModules.courses.findAll({ where: { teacher_id: teacherId } });
        res.status(200).json(allCourses);
    }catch(error){
        console.error('Error getting all courses for a teacher:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports = router;