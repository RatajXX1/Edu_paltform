import React from "react";
import '../../styles/dashboard/head_bar.css'
import Logo from '../../images/user.jpg'
import {Link} from "react-router-dom";
import serverPath from "../../utilis/server-path";
import {toast} from "react-toastify";


export default class Head_bar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            open_pop: false,
            NewAcv: false
        }

    }

    componentDidMount() {
        this.CheckAcv()
    }

    make_pop() {
        if (this.state.open_pop) this.setState({open_pop: false})
        else this.setState({open_pop: true})
    }

    async CheckAcv() {
        try {
            const resp = await fetch(serverPath() + 'api/Activity/new.php',
                {
                    method: 'GET',
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    },
                    credentials: 'include'
                }).then(sx => sx.json()).catch(null)

            if (resp !== null) {
                if (resp['CODE'] === 'OK') {
                    this.state.NewAcv = true
                    this.forceUpdate()
                }
            }
        } catch (e) {

        }
    }

    render() {
        return (
            <div className={'head_bar_main'}>

                <div className={'head_bar_uttilis'}>
                    <div className={'head_bar_main_item head_bar_menu_bar_bt'}>
                        <button id={'Head_bar_mobile_menu_bar_bt'}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                 className="bi bi-list" viewBox="0 0 16 16">
                                <path fill-rule="evenodd"
                                      d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                            </svg>
                        </button>
                    </div>
                    <div id={'head_bar_header_text'} className={'head_bar_main_item'}>
                        <h1>Platforma Edukacjyjna</h1>
                    </div>
                </div>

                <div className={'head_bar_main_item head_bar_user_info'}>
                    <div className={'head_bar_user_info_buttons'}>
                        <Link to={'/main/activity'}>
                            {

                                (
                                    () =>
                                    {
                                        if (!this.state.NewAcv) return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                                                                           className="bi bi-bell" viewBox="0 0 16 16">
                                            <path
                                                d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
                                        </svg>
                                        else return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                          className="bi bi-bell-fill"
                                                         viewBox="0 0 16 16">
                                            <path
                                                d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z"/>
                                        </svg>
                                    }
                                )()
                            }
                        </Link>
                    </div>
                    {/*<div className={'head_bar_user_info_buttons'}>*/}
                    {/*    <button>*/}
                    {/*        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"*/}
                    {/*             className="bi bi-chat" viewBox="0 0 16 16">*/}
                    {/*            <path*/}
                    {/*                d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z"/>*/}
                    {/*        </svg>*/}
                    {/*    </button>*/}
                    {/*</div>*/}
                    <div className={'head_bar_user_profile_button'} onClick={this.make_pop.bind(this)}>
                        <a id={'head_bar_user_profile_name'}>{ this.props.User_data['Name'] + ' ' + this.props.User_data['Surrname'] }</a>
                        <div className={'head_bar_main_item_profile'}>
                            <img src={Logo}/>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             className="bi bi-caret-down-fill" viewBox="0 0 16 16">
                            <path
                                d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                        </svg>
                    </div>

                </div>
                {
                    //  profil ,preferencje, wyloguj sie
                    this.state.open_pop && (
                        <User_util_pop close={this.make_pop.bind(this)}/>
                    )
                }
            </div>
        )
    }

}

class User_util_pop extends React.Component {
    constructor(props) {
        super(props);
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target) && !document.querySelector('.head_bar_main').contains(event.target)) {
            this.props.close()
        }
    }

    async logoutfunc() {
        try {
            fetch(
                serverPath() + 'api/auth/logout.php',
                {
                    method:"GET",
                    headers: {
                        'Access-Control-Allow-Origin':'*',
                        // 'Content-Type': 'multipart/form-data'
                    },
                    credentials: 'include'
                }
            ).then(
                () => {window.location.href = '/'}
            )

        } catch (e) {

        }
    }

    render() {
        return (
            <div ref={this.setWrapperRef} className={'head_bar_user_utilis'}>
                <Link className={'head_bar_user_utilis_item'} to={'/main/Profile'}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                         className="bi bi-person" viewBox="0 0 16 16">
                        <path
                            d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                    </svg>
                    <a>Profil</a>
                </Link>
                <Link className={'head_bar_user_utilis_item'} to={'/main/activity'}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                         className="bi bi-bell" viewBox="0 0 16 16">
                        <path
                            d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
                    </svg>
                    <a>Aktywność</a>
                </Link>
                {/*<div className={'head_bar_user_utilis_item'}>*/}
                {/*    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"*/}
                {/*         className="bi bi-wrench" viewBox="0 0 16 16">*/}
                {/*        <path*/}
                {/*            d="M.102 2.223A3.004 3.004 0 0 0 3.78 5.897l6.341 6.252A3.003 3.003 0 0 0 13 16a3 3 0 1 0-.851-5.878L5.897 3.781A3.004 3.004 0 0 0 2.223.1l2.141 2.142L4 4l-1.757.364L.102 2.223zm13.37 9.019.528.026.287.445.445.287.026.529L15 13l-.242.471-.026.529-.445.287-.287.445-.529.026L13 15l-.471-.242-.529-.026-.287-.445-.445-.287-.026-.529L11 13l.242-.471.026-.529.445-.287.287-.445.529-.026L13 11l.471.242z"/>*/}
                {/*    </svg>*/}
                {/*    <a>Preferencje</a>*/}
                {/*</div>*/}
                <div className={'head_bar_user_utilis_line'}/>
                <div onClick={this.logoutfunc.bind(this)} className={'head_bar_user_utilis_item'}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                         className="bi bi-door-open" viewBox="0 0 16 16">
                        <path d="M8.5 10c-.276 0-.5-.448-.5-1s.224-1 .5-1 .5.448.5 1-.224 1-.5 1z"/>
                        <path
                            d="M10.828.122A.5.5 0 0 1 11 .5V1h.5A1.5 1.5 0 0 1 13 2.5V15h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V1.5a.5.5 0 0 1 .43-.495l7-1a.5.5 0 0 1 .398.117zM11.5 2H11v13h1V2.5a.5.5 0 0 0-.5-.5zM4 1.934V15h6V1.077l-6 .857z"/>
                    </svg>
                    <a>Wyloguj sie</a>
                </div>
            </div>
        )
    }
}
