import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
import {
    useGetTodosQuery,
    useAddTodoMutation,
    useUpdateTodoMutation,
    useDeleteTodoMutation
 } from "../api/apiSlice";

export default function TodoList() {
    const [newTodo, setNewTodo] = useState('');

    const {
        data: todos,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetTodosQuery();

    const [addTodo] = useAddTodoMutation({ fixedCacheKey: 'status-bar' });
    const [updateTodo] = useUpdateTodoMutation({ fixedCacheKey: 'status-bar' });
    const [deleteTodo] = useDeleteTodoMutation({ fixedCacheKey: 'status-bar' });

    function handleSubmit(e) {
        e.preventDefault();
        addTodo({ userId: 1, title: newTodo, completed: false });
        setNewTodo('');
    }

    const newItemSection = 
        <form onSubmit={handleSubmit}>
            <label htmlFor="new-todo">Enter a new todo item</label>
            <div className="new-todo">
                <input
                    type="text"
                    id="new-todo"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Enter new todo"
                />
            </div>
            <button className="submit">
                <FontAwesomeIcon icon={faUpload} />
            </button>
        </form>

        const list = todos?.map(todo => {
            return (
                <article key={todo.id}>
                    <div className="todo">
                        <input
                            type="checkbox"
                            checked={todo.completed}
                            id={todo.id}
                            onChange={() => updateTodo({ ...todo, completed: !todo.completed })}
                        />
                        <label htmlFor={todo.id}>{todo.title}</label>
                    </div>
                    <button className="trash" onClick={() => deleteTodo({ id: todo.id })}>
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </article>
            );
        })

        const content = isLoading ? <p>Loading...</p>
            : isSuccess ? list
                : isError ? <p>{error.error}</p> : '';

        return (
            <main>
                <h1>Todo List</h1>
                {newItemSection}
                {content}
            </main>
        );
}