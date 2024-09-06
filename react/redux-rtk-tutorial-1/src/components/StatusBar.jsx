import './StatusBar.css';
import { useState, useEffect } from 'react';
import {
    useGetTodosQuery,
    useAddTodoMutation,
    useUpdateTodoMutation,
    useDeleteTodoMutation
 } from "../features/api/apiSlice";

export default function StatusBar() {
    const [status, setStatus] = useState('');
    const [errorMessages, setErrorMessages] = useState([]);

    const allTheRequests = [
        useGetTodosQuery(),
        useAddTodoMutation({ fixedCacheKey: 'status-bar' })[1],
        useUpdateTodoMutation({ fixedCacheKey: 'status-bar' })[1],
        useDeleteTodoMutation({ fixedCacheKey: 'status-bar' })[1],
    ];

    useEffect(() => {
        const loading = allTheRequests.some(request => request.isLoading);
        const failed = allTheRequests.some(request => request.isError);
        setStatus(loading ? 'loading' : failed ? 'failed' : '');

        if(failed) {
            const newErrors = allTheRequests
                .filter(request => request.isError)
                    .map(request => request.error.error);

            setErrorMessages([...errorMessages, ...newErrors]);
        } else {
            setErrorMessages([]);
        }
    }, allTheRequests);

    return (
        <div>
            <div className={'status-bar ' + status} />
            {errorMessages.length ? (<div className="error-messages">
                {errorMessages.map((msg, index) => (
                    <p key={index}>{msg}</p>
                ))}
            </div>) : ''}
        </div>
    );
}