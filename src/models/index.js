'use strict';
require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

const userModel = require('./users/users.js');
const coursesModel = require('./courses/courses.js');
const enrollmentsModel = require('./enrollments/enrollments.js');
const messagesModel=require('./messagesTable/messages.js');
const roomsModel=require('./rooms/rooms.js');
const privateMessagesModel=require('./messagesTable/privateMessages.js');
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const Collection = require('./data-collection.js');

const POSTGRES_URI = process.env.NODE_ENV === "test" ? "sqlite::memory:" : process.env.DATABASE_URL;
let sequelizeOptions = process.env.NODE_ENV === "production" ?
    {
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
    } :
    {}


const sequelize = new Sequelize(POSTGRES_URI,sequelizeOptions);
const users = userModel(sequelize, DataTypes);
const courses = coursesModel(sequelize, DataTypes);
const enrollments = enrollmentsModel(sequelize, DataTypes);
const messages=messagesModel(sequelize,DataTypes);
const rooms=roomsModel(sequelize,DataTypes);
const privateMessages=privateMessagesModel(sequelize,DataTypes);
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
users.hasMany(courses, { foreignKey: 'teacher_id', sourceKey: 'id', onDelete: 'CASCADE', onUpdate: 'CASCADE', as: 'taughtCourses' });
courses.belongsTo(users, { foreignKey: 'teacher_id', targetKey: 'id', onDelete: 'CASCADE', onUpdate: 'CASCADE', as: 'teacher' });

users.hasMany(enrollments, { foreignKey: 'student_id', sourceKey: 'id', onDelete: 'CASCADE', onUpdate: 'CASCADE', as: 'studentEnrollments' });
enrollments.belongsTo(users, { foreignKey: 'student_id', targetKey: 'id', onDelete: 'CASCADE', onUpdate: 'CASCADE', as: 'student' });

courses.hasMany(enrollments, { foreignKey: 'course_id', sourceKey: 'id', onDelete: 'CASCADE', onUpdate: 'CASCADE', as: 'courseEnrollments' });
enrollments.belongsTo(courses, { foreignKey: 'course_id', targetKey: 'id', onDelete: 'CASCADE', onUpdate: 'CASCADE', as: 'course' });

//TODO: fix this for the messages if has time 
messages.hasMany(rooms,{foreignKey:'room_id',sourceKey:'id'});
rooms.belongsTo(messages,{foreignKey:'room_id',targetKey:'id'});
users.hasMany(privateMessages,{foreignKey:'sender',sourceKey:'username'});
privateMessages.belongsTo(users,{foreignKey:'sender',targetKey:'username'});

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

module.exports = {
  db: sequelize,
//   reviews: new Collection(reviews),
//   charger: new Collection(charger),
//   reservation: new Collection(reservation),
  users: users, 
  courses: courses,
  enrollments: enrollments,
  messagesModal: messages,
  roomsModal: rooms,
  privateMessagesModal: privateMessages,

};