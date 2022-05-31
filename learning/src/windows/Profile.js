import React from "react";
import '../styles/profiles.css';
import serverPath from "../utilis/server-path";
import Logo from '../images/user.jpg'
import {toast} from "react-toastify";
import crypto from "../utilis/crypto";


export default class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ID: 0,
            PopView: 0,
            Output: {
                Password: '',
                RPassword: ''
            }
        }
    }

    componentDidMount() {
        this.initilizeParams()
    }

    initilizeParams() {
        const params = new URLSearchParams(window.location.search)
        try {
            if (params.get("ID") !== undefined) this.state.ID = parseInt(params.get('ID'))
        } catch (e) {

        }
    }

    async sumbitChangePaswortd() {
        if (
            this.state.Output.Password.replaceAll(' ', '') !==
            this.state.Output.RPassword.replaceAll(' ', '')
        ) {
            return toast.error('Hasła nie są takie same!', {closeOnClick: true, theme: 'colored'})
        }

        try {
            this.state.Output.Password = await crypto.sha256(this.state.Output.Password.replaceAll(' ', '') )
            const resp = await fetch(
                serverPath() + 'api/Users/Changepass.php',
                {
                    method:"POST",
                    headers: {
                        'Access-Control-Allow-Origin':'*',
                        // 'Content-Type': 'multipart/form-data'
                    },
                    body: JSON.stringify({Password: this.state.Output.Password}),
                    credentials: 'include'
                }
            ).then(se => se.json()).catch(null)
            if (resp !== null) {
                if (resp['CODE'] === 'OK') {
                    toast.success('Pomyślnie zaktualizowano hasło', {closeOnClick: true, theme: 'colored'})
                } else {
                    toast.error('Wystąpił błąd!', {closeOnClick: true, theme: 'colored'})
                }
                this.ClosePop()
            } else {
                toast.error('Wystąpił błąd!', {closeOnClick: true, theme: 'colored'})
                this.ClosePop()
            }
        } catch (e) {
            toast.error('Wystąpił błąd!', {closeOnClick: true, theme: 'colored'})
            this.ClosePop()
        }
    }

    ChangePassword() {
        this.state.PopView = 1
        this.forceUpdate()
    }

    ClosePop() {
        this.state.PopView = 0
        this.forceUpdate()
    }

    Popview() {
        if (this.state.PopView === 1) {
            return (
                <div className={'User_list_view_mian_pop_back'}>
                    <div className={'User_list_view_mian_pop'}>
                        <h2>Zmiana hasła</h2>
                        <div className={'User_list_view_mian_pop_body'}>
                            <label>
                                Hasło
                            </label>
                            <input style={{width: '50%'}} type={"password"} onChange={e => this.state.Output.Password = e.target.value}/>
                            <label>
                                Powtórz hasło
                            </label>
                            <input style={{width: '50%'}}  type={"password"} onChange={e => this.state.Output.RPassword = e.target.value}/>
                        </div>
                        <div className={'User_list_view_mian_pop_buttons'}>
                            <button onClick={this.ClosePop.bind(this)} >zamknij</button>
                            <button onClick={this.sumbitChangePaswortd.bind(this)}>zapisz</button>
                        </div>
                    </div>
                </div>
            )
        }
    }

    render() {
        return (
            <div className={'Profile_main_view'}>
                {
                    this.Popview()
                }
                <div className={'Profile_main_view_body'}>
                    <div className={'Profile_main_view_body_item'}>
                        <div className={'Profile_main_view_body_item_image'}>
                            <img src={ this.props.Image === "" || this.props.Image === undefined ? Logo : serverPath() + this.props.Image}/>
                        </div>
                        <div className={'Profile_main_view_body_item_text'}>
                            <div className={'Profile_main_view_body_item_text_o'}>
                                <span>{this.props.User_data.Name + ' ' + this.props.User_data.Surrname}</span>
                                {/*<button>*/}
                                {/*    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"*/}
                                {/*         className="bi bi-pencil-square" viewBox="0 0 16 16">*/}
                                {/*        <path*/}
                                {/*            d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>*/}
                                {/*        <path fill-rule="evenodd"*/}
                                {/*              d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>*/}
                                {/*    </svg>*/}
                                {/*</button>*/}
                            </div>
                            <div className={'Profile_main_view_body_item_text_o'}>
                                <span style={{fontWeight: 'lighter', fontSize: '15px'}}>{this.props.User_data.Email}</span>
                                {/*<button>*/}
                                {/*    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"*/}
                                {/*         className="bi bi-pencil-square" viewBox="0 0 16 16">*/}
                                {/*        <path*/}
                                {/*            d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>*/}
                                {/*        <path fill-rule="evenodd"*/}
                                {/*              d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>*/}
                                {/*    </svg>*/}
                                {/*</button>*/}
                            </div>

                        </div>
                    </div>
                    <span onClick={this.ChangePassword.bind(this)} style={{display: 'block', marginTop: '20px', fontWeight: 'bold', cursor: 'pointer'}}>Zmień hasło</span>
                </div>
            </div>
        )
    }

}