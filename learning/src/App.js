import './App.css';
import {Component} from "react";
import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import Welcome_page from "./windows/welcom_page";
import Main from './windows/main';
import Lessons from "./windows/lessons";
import authorize from './utilis/authorize'
import {ProtectedRoute} from "./utilis/ProtectedRoute";



class App extends Component {

    constructor() {
        super();
        this.state = {
            Logged: false,
            User_data: null
        }
    }

    componentDidMount() {
        // authorize.CheckAuthorize().then(
        //     data => this.setState({Logged: data !== null, User_data: data !== null ? data : null})
        // )
    }

    render() {
        return (
            <Router>
               <Routes>
                    <Route path='/' element={<Welcome_page/>}/>
                    <Route path={'/main'} exact={'true'} >
                        <Route path='dashboard' element={<ProtectedRoute><Main/></ProtectedRoute>}/>
                        <Route path='lessons' element={<ProtectedRoute><Main/></ProtectedRoute>}/>
                        <Route path='lesson' element={<ProtectedRoute><Main/></ProtectedRoute>}/>
                        <Route path='createlesson' element={<ProtectedRoute><Main/></ProtectedRoute>}/>
                        <Route path='createdLesson' element={<ProtectedRoute><Main/></ProtectedRoute>}/>
                        <Route path='Profile' element={<ProtectedRoute><Main/></ProtectedRoute>}/>
                        <Route path='Answers' element={<ProtectedRoute><Main/></ProtectedRoute>}/>
                        <Route path='activity' element={<ProtectedRoute><Main/></ProtectedRoute>}/>
                        <Route path='lessonsGroup' element={<ProtectedRoute><Main/></ProtectedRoute>}/>
                    </Route>
                    <Route path={'/admin'} exact={'true'} >
                        <Route path='users' element={<ProtectedRoute><Main/></ProtectedRoute>}/>
                        <Route path='groups' element={<ProtectedRoute><Main/></ProtectedRoute>}/>
                    </Route>

                </Routes>

            </Router>
        );

    }
}

export default App;
