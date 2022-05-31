import React from "react";
import '../../styles/dashboard/dash_view.css'
import '../../styles/login_themes.css'
import SimpleBar from "simplebar-react";
import 'simplebar/dist/simplebar.min.css';
import Lesson_widget from "../lesson_widget";
import serverPath from "../../utilis/server-path";

class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.theme_id = Math.floor(Math.random() * (31 - 1)) + 1;
        this.state = {
            Lessons: []
        }
    }


    componentDidMount() {
        this.GetLatest().then(e => {
            this.forceUpdate()
        })
    }

    async GetLatest() {
        try {
            const resp = await fetch(serverPath() + 'api/Lessons/latest.php', {
                method:'GET',
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                credentials: 'include'
            }).then(data => data.json()).catch(null)
            if (resp !== null) {
                if (resp['CODE'] === 'OK') this.state.Lessons = resp['Lessons']
                else return []
            } else return []
        } catch (e) {
           return []
        }
    }

    RenderLatest() {
        const tab = []
        for (let i = 0; i < this.state.Lessons.length; i++) {
            tab.push(<Lesson_widget Image={this.state.Lessons[i]['Image']} ID={this.state.Lessons[i]['ID']} Name={this.state.Lessons[i]['Subject']}/>)
        }
        return tab
    }

    render() {
        return (
            // <SimpleBar forceVisible="y" autoHide={false} style={{width: '800px'}}>
                <div className={"Dash_main_view"}>
                    <div className={"Dash_main_view_head theme_" + this.theme_id.toString() }>
                        <h1>Platforma Edukacyjna</h1>
                    </div>
                    <div className={'Dash_main_view_hello_view'}>
                        <h1 >Witaj <b>{this.props.User_data.Name + ' ' + this.props.User_data.Surrname}</b> na <b>Platformie edukacyjnej</b>!</h1>
                    </div>
                    {
                        this.state.Lessons.length > 0 &&
                        <div className={"Dash_main_view_last_lesson"}>
                            <h2>Najnowsze lekcje</h2>
                            <SimpleBar forceVisible="x" autoHide={true}
                                       style={{width: '99%', left: '50%', transform: 'translate(-50%, 0)'}}>
                                <div className={"Dash_main_view_last_lesson_list"}>
                                    {/*<Lesson_widget/>*/}
                                    {
                                        this.RenderLatest()
                                    }
                                </div>
                            </SimpleBar>
                        </div>
                    }
                </div>
            // </SimpleBar>

        )
    }
}

export default Dashboard;