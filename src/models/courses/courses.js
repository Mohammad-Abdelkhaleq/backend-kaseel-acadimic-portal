// This file contains the model for the courses table in the database.
"use strict"

const courseModel = (sequelize, DataTypes) => sequelize.define('Courses', {
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    start_date: { type: DataTypes.DATE, allowNull: false },
    end_date: { type: DataTypes.DATE, allowNull: false },
    teacher_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: {
            model: 'Users', 
            key: 'id', 
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    }
});

module.exports = courseModel;
