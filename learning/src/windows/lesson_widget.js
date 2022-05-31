import React from "react";
import "../styles/lesson_widget.css"
import {Link} from "react-router-dom";
import serverPath from "../utilis/server-path";

class Lesson_widget extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Link to={'/main/lesson?ID=' + this.props.ID} className={"lesson_widget_main"}>
                <div className={"lesson_widget_main_image"} style={{background: `url(${serverPath() + 'api/Files/' + this.props.Image})`}}>

                </div>
                <h3 className={'lesson_widget_main_title'}>{this.props.Name}</h3>
                {/*<div className={'lesson_widget_main_state'}>*/}
                {/*    <div className={"lesson_widget_main_state_bar"}/>*/}
                {/*</div>*/}
                {/*<a className={'lesson_widget_main_state_text'}>Ukończono: 50%</a>*/}
            </Link>
        )
    }

}

export default Lesson_widget;