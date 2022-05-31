import React from "react";
import '../styles/welcome.css';
import '../styles/login_themes.css'
import validation from "../utilis/validation";
import authorize from "../utilis/authorize";


class Welcome_page extends React.Component {

    constructor(props) {
        super(props);
        this.theme_id = Math.floor(Math.random() * (31 - 1)) + 1;
        this.state = {
            authorize: false,
            username: '',
            password: '',
            AutoLogin: false,
            state_view : 1,
            alert_info : {mode: 0, text_alert: "Adres e-mail bądż hasło są niepoprawne lub użytkownik nie istnieje!"},
            RegOutput: {
                Name: '',
                Surrname: '',
                login: '',
                Password: '',
                RPassword: '',
            }

        };
        document.title = 'Zaloguj sie'
    }

    login_alert() {
        return (
            <div className={"login_alert_box " + (this.state.alert_info.mode == 1 ? 'error_alert' : 'succes_alert')}>
                <p>
                    {this.state.alert_info.text_alert}
                </p>
            </div>
        )
    }

    // componentDidMount() {
    //     authorize.isAuthorized(this.props.Logged)
    // }

    set_alert(text, mode=1) {
        this.setState({alert_info : {mode: mode, text_alert: text}})
    }

    submit_login() {
        this.setState({username : 'ratajx1@gmail.com', password: 'root'})
        if (this.state.username.replaceAll(' ', '').length !== 0 &&
            this.state.password.replaceAll(' ', '').length !== 0) {
            if (validation.validateEmail(this.state.username)) {
                authorize.authorize(this.state.username, this.state.password, this.state.AutoLogin).then(
                    e => {
                        if (e) {
                            // console.log(this.props.history)
                            window.location.href = '/main/dashboard'
                            // alert("succes")
                        } else {
                            this.set_alert('Adres e-mail bądź hasło są niepoprawne lub podane konto nie istnieje!')
                        }
                    }
                )
            } else this.set_alert('Zły format adresu e-mail!')
        } else this.set_alert('Wszystkie pola muszą zostać wypełnione!')
    }

    submit_regiser() {
        if (this.state.RegOutput.Name.replaceAll(' ', '').length !== 0 &&
            this.state.RegOutput.Surrname.replaceAll(' ', '').length !== 0 &&
            this.state.RegOutput.login.replaceAll(' ', '').length !== 0  &&
            this.state.RegOutput.Password.replaceAll(' ', '').length !== 0 &&
            this.state.RegOutput.RPassword.replaceAll(' ', '').length !== 0
        ) {
            if (
                this.state.RegOutput.Password.replaceAll(' ', '')
                !==
                this.state.RegOutput.RPassword.replaceAll(' ', '')
            ) {
                return this.set_alert('Hasła nie są takie same')
            }

            if (validation.validateEmail(this.state.RegOutput.login)) {
                authorize.register(this.state.RegOutput.login, this.state.RegOutput.Password, this.state.RegOutput.Name, this.state.RegOutput.Surrname).then(
                    e => {
                        if (e) {
                            // console.log(this.props.history)
                            window.location.href = '/main/dashboard'
                            // alert("succes")
                        } else {
                            this.set_alert('Adres e-mail bądź hasło są niepoprawne lub podane konto nie istnieje!')
                        }
                    }
                )
            } else this.set_alert('Zły format adresu e-mail!')
        } else this.set_alert('Wszystkie pola muszą zostać wypełnione!')
    }

    login_inputs() {
        return (
            <div className="login_back">
                <h3>Logowanie</h3>
                <div className="login_back_body">
                    <div className="input_div">
                        <a>Adres e-mail</a>
                        <input type="text" placeholder="Adres e-mail" onChange={e => this.setState({username :e.target.value})}/>
                    </div>
                    <div className="input_div">
                        <a>Haslo</a>
                        <input type="password" placeholder="Hasło" onChange={e => this.setState({password :e.target.value})}/>
                    </div>
                    <label className="container">
                        <input type="checkbox" onChange={e => this.state.AutoLogin = e.target.checked}/>
                        <span className="checkmark"></span>
                        <a>
                            Nie wylogowywuj
                        </a>
                    </label>
                    {/*<span className="forgot_pass_bt" onClick={this.change_state.bind(this, 3)}>Przypomnij hasło</span>*/}
                    <button className="login_button" onClick={this.submit_login.bind(this)}>Zaloguj się</button>
                </div>
                <a className="login_create_account">Nie posiadasz konta? <span onClick={this.change_state.bind(this, 2)}>Stwórz je</span> </a>
            </div>
        )

    }

    change_state(e) {
        this.setState({state_view: e})
        switch (e) {
            case 1:
                document.title = 'Zaloguj sie'
                break;
            case 2:
                document.title = 'Zarejestruj się'
                break;
            case 3:
                document.title = 'Resetowanie hasła'
                break;
        }
    }

    register_inputs() {
        return (
            <div className="login_back">
                <h3>Rejestracja</h3>
                <div className="login_back_body">
                    <div className="input_div two_in">
                        <a>Imie i Nazwisko</a>
                        <input type="text" placeholder="Imię" onChange={e => this.state.RegOutput.Name = e.target.value}/>
                        <input type="text" placeholder="Nazwisko" onChange={e => this.state.RegOutput.Surrname = e.target.value}/>
                    </div>
                    <div className="input_div">
                        <a>Adres e-mail</a>
                        <input type="text" placeholder="Adres e-mail" onChange={e => this.state.RegOutput.login = e.target.value}/>
                    </div>
                    <div className="input_div">
                        <a>Haslo</a>
                        <input type="password" placeholder="Hasło" onChange={e => this.state.RegOutput.Password = e.target.value}/>
                    </div>
                    <div className="input_div">
                        <a>Powtórz haslo</a>
                        <input type="password" placeholder="Powtórz hasło" onChange={e => this.state.RegOutput.RPassword = e.target.value}/>
                    </div>

                    <button onClick={this.submit_regiser.bind(this)} className="login_button">Zarejestruj się</button>
                </div>
                <a className="login_create_account">Posiadasz już konto? <span onClick={this.change_state.bind(this, 1)}>Zaloguj sie</span> </a>
            </div>
        )
    }

    forgot_pass_intputs() {
        return (
            <div className="login_back forgot_pass_back">
                <h3>Resetowanie hasła</h3>
                <div className="login_back_body">
                    <button className="return_back_bt_forgot" onClick={this.change_state.bind(this, 1)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                             className="bi bi-arrow-left-short" viewBox="0 0 16 16">
                            <path fill-rule="evenodd"
                                  d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z"/>
                        </svg>
                        <a>Powrót do logowania</a>
                    </button>
                    <a className="forgot_pass_body">
                        Jeżeli istnieje konto posiadające dany adres e-mail to na podany adres przyjdą dalsze instrukcje resetowania hasła.
                    </a>
                    <div className="input_div forgot_pass_inputs">
                        <a>Adres e-mail</a>
                        <input type="text" placeholder="Adres e-mail"/>
                    </div>
                    <button className="login_button" onClick={this.submit_regiser.bind(this)}>Zresetuj hasło</button>
                </div>
            </div>
        )
    }

    switch_state() {
        if (this.state.state_view == 1) return this.login_inputs()
        else if (this.state.state_view == 2) return this.register_inputs()
        else return this.forgot_pass_intputs()
    }

    render() {
        return (
            <div className={'welcome_background theme_' + this.theme_id.toString()} >
                <div className="welcome_back">
                    <div className="welcome_text">
                        <div className="welcome_header">
                            <h1>Platforma Edukacyjna</h1>
                        </div>
                        <div className="welcome_body">
                            {this.switch_state()}
                        </div>
                        {this.state.alert_info.mode > 0 ? this.login_alert() : ''}
                    </div>
                </div>
            </div>
        )
    }

}

export default Welcome_page;