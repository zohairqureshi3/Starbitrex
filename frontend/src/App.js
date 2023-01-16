import React from 'react'
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import './assets/css/starbitrex.css';
import './assets/css/newstarbitrex.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import NotFound from './NotFound';
import routes from './routes';

require('dotenv').config()

const App = (props) => {

    return (
        <React.Fragment>
            <Router>
                <Routes>

                    {routes.map((route, index) => (
                        <Route exact={route.exact} path={route.path} element={<route.layout title={route.name}> <route.component /> </route.layout>} key={index} />
                    ))}

                    <Route path="*" element={<NotFound />} />

                </Routes>
            </Router>
        </React.Fragment>
    )
}

export default App;

if (document.getElementById('app')) {
    ReactDOM.render(<App />, document.getElementById('app'));
}
