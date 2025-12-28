"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTodo = exports.removeTodo = exports.updateTodo = exports.addTodo = void 0;
const addTodo = (state, todo) => {
    return [...state, todo];
};
exports.addTodo = addTodo;
const updateTodo = (state, id, update) => {
    const index = state.findIndex(t => t.id === id);
    if (index === -1) {
        throw new Error(`Todo with id ${id} not found`);
    }
    const updatedTodo = {
        ...state[index],
        ...update
    };
    return [
        ...state.slice(0, index),
        updatedTodo,
        ...state.slice(index + 1)
    ];
};
exports.updateTodo = updateTodo;
const removeTodo = (state, id) => {
    const index = state.findIndex(t => t.id === id);
    if (index === -1) {
        throw new Error(`Todo with id ${id} not found`);
    }
    return [
        ...state.slice(0, index),
        ...state.slice(index + 1)
    ];
};
exports.removeTodo = removeTodo;
const getTodo = (state, id) => {
    return state.find(t => t.id === id);
};
exports.getTodo = getTodo;
