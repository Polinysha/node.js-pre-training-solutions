'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        username: 'john_doe',
        email: 'john@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'jane_smith',
        email: 'jane@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'alex_wong',
        email: 'alex@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
    
    const users = await queryInterface.sequelize.query(
      `SELECT id from "Users";`
    );
    
    const usersRows = users[0];
    
    return queryInterface.bulkInsert('Todos', [
      {
        title: 'Buy groceries',
        description: 'Milk, bread, eggs',
        status: 'active',
        userId: usersRows[0].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Do homework',
        description: 'Math assignment',
        status: 'completed',
        userId: usersRows[0].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Call mom',
        description: 'Wish happy birthday',
        status: 'pending',
        userId: usersRows[0].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Prepare report',
        description: 'Weekly work report',
        status: 'active',
        userId: usersRows[1].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Study SQL',
        description: 'Complete SQL tasks',
        status: 'active',
        userId: usersRows[1].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Plan vacation',
        description: 'Choose dates and hotel',
        status: 'pending',
        userId: usersRows[1].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Update resume',
        description: 'Add new skills',
        status: 'active',
        userId: usersRows[2].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Buy gift',
        description: "Friend's birthday gift",
        status: 'completed',
        userId: usersRows[2].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Enroll in courses',
        description: 'English language courses',
        status: 'pending',
        userId: usersRows[2].id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Todos', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};
