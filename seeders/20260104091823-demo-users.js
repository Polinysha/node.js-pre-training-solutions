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
      SELECT id from "Users";
    );
    
    const usersRows = users[0];
    
    return queryInterface.bulkInsert('Todos', [
      {
        title: 'Купить продукты',
        description: 'Молоко, хлеб, яйца',
        status: 'active',
        userId: usersRows[0].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Сделать домашку',
        description: 'Задание по математике',
        status: 'completed',
        userId: usersRows[0].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Позвонить маме',
        description: 'Поздравить с днем рождения',
        status: 'pending',
        userId: usersRows[0].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Подготовить отчет',
        description: 'Еженедельный отчет о работе',
        status: 'active',
        userId: usersRows[1].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Изучить SQL',
        description: 'Выполнить задания по SQL',
        status: 'active',
        userId: usersRows[1].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Запланировать отпуск',
        description: 'Выбрать даты и отель',
        status: 'pending',
        userId: usersRows[1].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Обновить резюме',
        description: 'Добавить новые навыки',
        status: 'active',
        userId: usersRows[2].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Купить подарок',
        description: 'Подарок на день рождения друга',
        status: 'completed',
        userId: usersRows[2].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Записаться на курсы',
        description: 'Курсы английского языка',
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
