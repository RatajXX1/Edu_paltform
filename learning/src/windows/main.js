import React from "react";
import Head_bar from "./dashboard/head_bar";
import Menu_bar from "./dashboard/menu_bar";
import Dashboard from "./dashboard/dashboard";
import Lessons from "./lessons";
import Lesson from "./lesson";
import CreateLesson from "./CreateLesson";
import '../styles/dashboard.css'
import SimpleBar from "simplebar-react";
import 'simplebar/dist/simplebar.min.css';
import CreatedLessons from "./CreatedLessons";
import Profile from "./Profile"
import Userlist from "./Manage/UsersList";
import GroupList from "./Manage/GroupList";
import Answers from "./Answers";
import Activity from "./activity";
import LessonGroup from "./LessonGroup";
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from "react-toastify";

class Main extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            mobile_view: false,
            MainScroll: React.createRef()
        }
        // console.log(this.props.User_data)
    }

    selectedPage() {
        switch (window.location.pathname) {
            case '/main/dashboard':
                return <Dashboard User_data={this.props.User_data}/>
            case '/main/lessons':
                return <Lessons scroll={this.state.MainScroll}/>
            case '/main/lessonsGroup':
                return <LessonGroup scroll={this.state.MainScroll}/>
            case '/main/lesson':
                return <Lesson/>
            case '/main/createlesson':
                return <CreateLesson/>
            case '/main/createdLesson':
                return <CreatedLessons scroll={this.state.MainScroll}/>
            case '/main/Profile':
                return <Profile User_data={this.props.User_data}/>
            case '/main/Answers':
                return <Answers scroll={this.state.MainScroll}/>
            case '/admin/users':
                return <Userlist scroll={this.state.MainScroll}/>
            case '/admin/groups':
                return <GroupList scroll={this.state.MainScroll}/>
            case '/main/activity':
                return <Activity/>
        }
    }

    render() {
        return (
            <div className={'D_man_view'}>
                <ToastContainer />
                <Head_bar User_data={this.props.User_data}/>
                <div className={'D_work_view'}>
                    <Menu_bar mobileBt={'#Head_bar_mobile_menu_bar_bt'} User_data={this.props.User_data}/>
                    <SimpleBar scrollableNodeProps={{ref:this.state.MainScroll}}  forceVisible="y" autoHide={false} style={{width: '99%'}}>
                        {
                            this.selectedPage()
                        }
                    </SimpleBar>
                </div>
            </div>
        )
    }

}

export default Main;