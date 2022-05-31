import React, {useState} from "react";
import {Route, Navigate} from "react-router-dom";
import authorize from "./authorize";

export class ProtectedRoute extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            Logged: false,
            user_data: null,
            checked: false
        }
    }

    componentDidMount() {
        authorize.CheckAuthorize().then(
            data => {
                if (data !== null) this.setState({Logged: true, user_data: data, checked: true})
                else this.setState({Logged: false, user_data: null, checked: true})
            }
        ).catch(() => {
            this.setState({Logged: false, user_data: null, checked: true})
        })
    }

    render() {
        if (this.state.checked) {
            if (this.state.Logged) {
                return (React.cloneElement(this.props.children, {User_data : this.state.user_data, history: this.props.history}))
            } else return (<Navigate replace to={'/'}/>)
        } else return (<h1>Autoryzacja w toku</h1>)
    }

}
