import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Register from './Register';
import Chat from './Chat';

// Use the environment variable to define your backend URL
const API = import.meta.env.VITE_BACKEND_URL;

const App = () => {
    return (
        <Router>
            <div className="App">
                <Switch>
                    <Route path="/register">
                        <Register apiUrl={API} />
                    </Route>
                    <Route path="/chat">
                        <Chat apiUrl={API} />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
};

export default App;
