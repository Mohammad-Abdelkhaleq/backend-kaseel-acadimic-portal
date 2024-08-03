// Field	Type	Description
// id	ObjectId	Unique identifier for the enrollment
// student_id	ObjectId	Reference to the student
// course_id	ObjectId	Reference to the course
// enrolled_at	Date	Timestamp of enrollment

"use strict"

const enrollmentsModel = (sequelize, DataTypes) => sequelize.define('Enrollments', {
    student_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: {
            model: 'Users', 
            key: 'id', 
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    course_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: {
            model: 'Courses', 
            key: 'id', 
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    enrolled_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
});

module.exports = enrollmentsModel;
