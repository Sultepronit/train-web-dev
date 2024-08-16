import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { store } from './app/store.js';
import { Provider } from 'react-redux';
import { fetchUsers } from './features/users/usereSlice.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { fetchPosts } from './features/posts/postsSlice.js';

// first thing fetch users!
store.dispatch(fetchUsers());
// and of course, fetch posts or they wouldn't be available on other pages than main!
store.dispatch(fetchPosts());

ReactDOM.createRoot(document.getElementById('root')).render(  
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/*" element={<App />}/>
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>,
);
