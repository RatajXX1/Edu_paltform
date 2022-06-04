import React from "react";
import '../styles/Answers.css';
import SimpleBar from "simplebar-react";
import 'simplebar/dist/simplebar.min.css';
import logo from "../images/user.jpg";
import serverPath from "../utilis/server-path";
import parse from 'html-react-parser';

export default class Answers extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            SeeAnswer: false,
            SeeAnswerID: 0,
            LesID: 0,
            Page: 0,
            CanLoad: true,
            Content: [],
            AnswerView: {

            }
        }
        this.initilizeParams()

        this.StateNames = {
            0: '',
            1: 'Wysłane do poprawy',
            2: 'Czeka na zweryfikowanie',
            3: 'Zweryfikowana',
        }

        this.onBottom = this.onBottomEvent.bind(this)

    }

    initilizeParams() {
        const params = new URLSearchParams(window.location.search)
        try {
            if (params.get("id") !== undefined) this.state.LesID = parseInt(params.get('id'))
            else this.state.Error = true
        } catch (e) {
            this.state.Error = true
        }
    }

    componentDidMount() {
        this.GetData()
        if (this.props.scroll !== undefined && this.props.scroll.current !== null) {
            this.props.scroll.current.addEventListener('scroll', this.onBottom)
        }
    }

    componentWillUnmount() {
        if (this.props.scroll !== undefined && this.props.scroll.current !== null) {
            this.props.scroll.current.removeEventListener('scroll', this.onBottom)
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.scroll.current !== null
        ) {
            this.props.scroll.current.addEventListener('scroll', this.onBottom)
            this.props.scroll.current.addEventListener('scroll', this.onBottom)
        }
    }

    RefreshData() {
        this.setState(
            {
                SeeAnswer: false,
                SeeAnswerID: 0,
                LesID: 0,
                Page: 1,
                Content: [],
                AnswerView: {}
            }
        )
        this.initilizeParams()
        this.GetData()
    }

    async SetState(State) {
        try {
            const resp = await fetch(
                serverPath() + `api/Answers/setstate.php?ID=${this.state.SeeAnswerID}&state=${State}`,
                {
                    method: 'GET',
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    },
                    credentials: 'include'
                }
            ).then(r => r.json()).catch(null)

            if (resp !== null) {
                if (resp['CODE'] === 'OK') {
                    // this.state.AnswerView = resp['Answer']
                    // this.state.SeeAnswer = true
                    this.RefreshData()
                    // alert("Zaktualizonwo stan")

                }
            }
        } catch (e) {

        }
    }

    onBottomEvent(e) {
        if (e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight)
        {
            if (this.state.CanLoad) {
                this.state.Page += 1
                this.getData()
            }
        }
    }

    async GetData() {
        try {
            const resp = await fetch(
                serverPath() + `api/Answers/?ID=${this.state.LesID}&page=${this.state.Page}`,
                {
                    method: 'GET',
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    },
                    credentials: 'include'
                }
            ).then(r => r.json()).catch(null)

            if (resp !== null) {
                if (resp['CODE'] === 'OK') {
                    this.state.Content = this.state.Content.concat(resp['Answers'])
                    if (Object.entries(resp['Answers']).length >= 25) {
                        this.state.CanLoad = true
                    } else this.state.CanLoad = false
                    this.forceUpdate()
                }
            }
        } catch (e) {

        }
    }

    async GetAnswerData(AnswerID) {
        try {
            const resp = await fetch(
                serverPath() + `api/Answers/answer.php?ID=${AnswerID}`,
                {
                    method: 'GET',
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    },
                    credentials: 'include'
                }
            ).then(r => r.json()).catch(null)

            if (resp !== null) {
                if (resp['CODE'] === 'OK') {
                    this.state.AnswerView = resp['Answer']
                    this.state.SeeAnswerID = AnswerID
                    this.state.SeeAnswer = true
                    this.forceUpdate()
                }
            }
        } catch (e) {

        }
    }

    SeeAnswer() {
        if (!this.state.SeeAnswer) {
            this.state.SeeAnswer = true
            this.forceUpdate()
        } else {
            this.state.SeeAnswer = false
            this.forceUpdate()
        }
    }

    AnswerPop() {
        return (
            <div className={'Answers_main_view_pop_back'}>
                <div className={'Answers_main_view_pop_view'}>
                    <SimpleBar  forceVisible="y"  autoHide={false} style={{width: '100%', maxHeight: '400px', overflowX: 'hidden'}}>
                        <div className={'Answers_main_view_pop_view_body'}>
                                <div className={'Answers_main_view_pop_view_body_header'}>
                                    <p>Odpowiedz Użytkownika <b>{this.state.AnswerView.Name + ' ' + this.state.AnswerView.Surrname}</b> na <b>Rodział {this.state.AnswerView.ContentChapter}</b></p>
                                </div>
                                <h2>Odpowiedź</h2>
                                <div>
                                    {
                                        parse(this.state.AnswerView.ContentText)
                                    }
                                </div>
                            {
                                this.state.AnswerView.ContentFiles.length > 0 &&
                                <div>
                                    <b>Załaczone pliki</b>
                                    <div className={'Answers_main_view_pop_view_body_files_Div'}>
                                        {(
                                            () => {
                                                const tab = []
                                                for (let i = 0; i < this.state.AnswerView.ContentFiles.length; i++) {
                                                    tab.push(
                                                        <div onClick={() => {
                                                            window.open(serverPath() + 'api/Files' + this.state.AnswerView.ContentFiles[i].FilePath, '_blank')
                                                        }}
                                                            className={'Dash_main_view_body_chapter_files_item Dash_main_view_body_chapter_files_item_close_bt '}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16"
                                                                 height="16"
                                                                 className="bi bi-file-arrow-down" viewBox="0 0 16 16">
                                                                <path
                                                                    d="M8 5a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5A.5.5 0 0 1 8 5z"/>
                                                                <path
                                                                    d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
                                                            </svg>
                                                            <div
                                                                className={'Dash_main_view_body_chapter_files_item_text'}>
                                                                <a style={{maxWidth: '50%'}}>
                                                                    {
                                                                        this.state.AnswerView.ContentFiles[i].FileName.substr(0, this.state.AnswerView.ContentFiles[i].FileName.lastIndexOf('.') + 1)
                                                                    }

                                                                </a>
                                                                <a>
                                                                    .
                                                                    {
                                                                        this.state.AnswerView.ContentFiles[i].FileName.substr(this.state.AnswerView.ContentFiles[i].FileName.lastIndexOf('.') + 1, this.state.AnswerView.ContentFiles[i].FileName.length)
                                                                    }
                                                                </a>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                                return tab
                                            }
                                        )()}
                                    </div>
                                </div>
                            }
                            </div>
                        </SimpleBar>


                    <div className={'Answers_main_view_pop_view_buttons'}>
                        <button onClick={this.SeeAnswer.bind(this)}>
                            Anuluj
                        </button>
                        {
                            this.state.AnswerView.ContentState < 3 &&
                            <button onClick={this.SetState.bind(this, 1)}>
                                niezatwierdzaj
                            </button>
                        }
                        {

                            this.state.AnswerView.ContentState < 3 &&
                            <button onClick={this.SetState.bind(this, 3)}>
                                Zatwierdź
                            </button>
                        }
                    </div>
                </div>
            </div>
        )
    }

    renderData() {
        const tab = []
        for (let i = 0; i < this.state.Content.length; i++) {
            tab.push(
                <tr>
                    <th>
                        <a>
                            {
                                this.state.Content[i].ContentChapter
                            }
                        </a>
                    </th>
                    <th>
                        <div className={'User_list_view_mian_body_table_image_user'}>
                            <div className={'User_list_view_mian_body_table_image_user_img'}>
                                <img src={logo}/>
                            </div>
                            <a>
                                {
                                    this.state.Content[i].Name + ' ' + this.state.Content[i].Surrname
                                }
                            </a>
                        </div>
                    </th>
                    <th>
                        <a>
                            {
                                this.state.Content[i].ContentDate
                            }
                        </a>
                    </th>
                    <th>
                        <a>
                            {
                                this.StateNames[this.state.Content[i].ContentState]
                            }
                        </a>
                    </th>
                    <th>
                        {
                            this.state.Content[i].ContentState > 1 && <button onClick={this.GetAnswerData.bind(this, this.state.Content[i].ContentID)}>
                            Zobacz
                        </button>}
                    </th>
                </tr>
            )
        }
        return tab;
    }

    render() {
        return (
            <div className={'Answers_main_view'}>
                {
                    this.state.SeeAnswer && this.AnswerPop()
                }
                <div className={'Answers_main_view_headbar'}>
                    <h1>Odpowiedzi</h1>
                </div>
                <div className={'Answers_main_view_body'}>
                    <table className={'Answers_main_view_body_table'}>
                        <thead>
                        <tr >
                            <th style={{width: '5%', whiteSpace: 'nowrap'}} >Rozdział</th>
                            <th >Nazwa użytkownika</th>
                            <th style={{width: '200px'}}>Data</th>
                            <th style={{width: '250px'}}>Stan</th>
                            <th style={{width: '200px'}}/>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            this.state.Content.length > 0 && this.renderData()
                        }
                        {
                            this.state.Content.length === 0 &&
                            <tr>
                                <th colSpan={'5'}>
                                    <h1>
                                        Brak wyników
                                    </h1>
                                </th>
                            </tr>
                        }
                        </tbody>

                    </table>
                </div>
            </div>
        )
    }

}