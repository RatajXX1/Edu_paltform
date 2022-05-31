import React from "react";
import '../styles/lesson_view.css';
import 'react-quill/dist/quill.snow.css';
import serverPath from "../utilis/server-path";
import parse from 'html-react-parser';
import ReactQuill from "react-quill";

import loading_img from '../images/Double Ring-1s-200px.svg';
import error_img from  '../images/bug-fill.svg';
import * as mime from "react-native-mime-types";
import {toast} from "react-toastify";


export default class Lesson extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            proceed: false,
            proceedState: 1,
            ActiveIndex: 0,
            ID: 0,
            Error: false,
            Content: {
                Content: []
            },
            Output: [

            ]
        }
        this.initilizeParams()
    }

    initilizeParams() {
        const params = new URLSearchParams(window.location.search)
        try {
            if (params.get("ID") !== undefined) this.state.ID = parseInt(params.get('ID'))
            else this.state.Error = true
        } catch (e) {
            this.state.Error = true
        }
    }

    componentDidMount() {
        this.GetDataContnet()
    }

    async GetDataContnet() {
        try {
            const resp = await fetch(
                serverPath() + 'api/Lessons/Lesson.php?ID=' + this.state.ID.toString(), {
                    method: 'GET',
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    },
                    credentials: 'include'
                }
            ).then(c => c.json()).catch(null)
            if (resp !== null) {
                if (resp['CODE'] === 'OK') {
                    this.state.Content = resp['Content']
                    this.forceUpdate()
                }
            }
        } catch (e) {

        }
    }

    removeSelectedFile(index, ID) {
        if (this.state.Output[index] !== undefined &&  this.state.Output[index].Files[ID] !== undefined) {
            this.state.Output[index].Files.splice(ID, 1)
            this.forceUpdate()
        }
    }

    renderChapters() {
        const Answer = (index) => {
            if (this.state.Content.Content[index].Answer == '1') {
                // text
                return (
                    <div className={'Dash_lesson_view_summary'}>
                        <ReactQuill className={"Dash_lesson_view_summary_editor"} defaultValue={this.state.Content.Content[index].UText}  onChange={(html) => {this.state.Output[index].Text = html}}/>
                        <button onClick={this.sendbt.bind(this)}>Wyślij</button>
                    </div>
                )
            }
            else if (this.state.Content.Content[index].Answer == '2') {
                // files
                return  (
                    <div className={'Dash_lesson_view_summary'}>
                    {/*<ReactQuill className={"Dash_lesson_view_summary_editor"}/>*/}
                    <div className={'Dash_lesson_view_summary_addFiles'}>
                        <label>
                            <input type={'file'} multiple onChange={(e) => {
                                this.state.Output[index].Files = [...this.state.Output[index].Files, ...e.target.files]
                                this.forceUpdate()
                            }}/>
                            Załącz pliki
                        </label>
                        {
                            this.state.Output[index].Files.length > 0 &&
                            <b style={{display: "block", marginTop: '20px', marginBottom: '10px'}}>Dołączone już
                                pliki:</b>
                        }
                        <div className={'Dash_lesson_view_summary_addFiles_list'}>
                            {
                                (() => {
                                    const tab = []
                                    for (let d = 0; d < this.state.Output[index].Files.length; d++) {
                                        tab.push(<div onClick={this.removeSelectedFile.bind(this,index,d)}  className={'Dash_main_view_body_chapter_files_item Dash_main_view_body_chapter_files_item_close_bt '}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                 className="bi bi-file-arrow-down" viewBox="0 0 16 16">
                                                <path
                                                    d="M8 5a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5A.5.5 0 0 1 8 5z"/>
                                                <path
                                                    d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
                                            </svg>
                                            <div className={'Dash_main_view_body_chapter_files_item_text'}>
                                                <a style={{maxWidth: '50%'}}>
                                                    {
                                                        this.state.Output[index].Files[d].name.substr(0, this.state.Output[index].Files[d].name.lastIndexOf('.') + 1)
                                                    }

                                                </a>
                                                <a>
                                                    {
                                                        this.state.Output[index].Files[d].name.substr(this.state.Output[index].Files[d].name.lastIndexOf('.') + 1, this.state.Output[index].Files[d].name.length)
                                                    }
                                                </a>
                                            </div>

                                            <svg className={'Dash_main_view_body_chapter_files_item_close'} xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                 viewBox="0 0 16 16">
                                                <path
                                                    d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                            </svg>
                                        </div>)
                                    }
                                    return tab
                                })()
                            }
                        </div>
                    </div>
                    <button onClick={this.sendbt.bind(this)}>Wyślij</button>
                </div>)
            }
            else {
                // Files and text
                return (
                    <div className={'Dash_lesson_view_summary'}>
                        <ReactQuill className={"Dash_lesson_view_summary_editor"} defaultValue={this.state.Content.Content[index].UText} onChange={(html) => {this.state.Output[index].Text = html}}/>
                        <div className={'Dash_lesson_view_summary_addFiles'}>
                            <label>
                                <input type={'file'} multiple onChange={(e) => {
                                    this.state.Output[index].Files = [...this.state.Output[index].Files, ...e.target.files]
                                    this.forceUpdate()
                                }}/>
                                Załącz pliki
                            </label>
                            {
                                this.state.Output[index].Files.length > 0 &&
                                <b style={{display: "block", marginTop: '20px', marginBottom: '10px'}}>Dołączone już
                                pliki:</b>
                            }
                            <div className={'Dash_lesson_view_summary_addFiles_list'}>
                                {
                                    (()=>
                                    {
                                        const tab = []
                                        for (let d = 0; d < this.state.Output[index].Files.length; d++) {
                                            tab.push(<div onClick={this.removeSelectedFile.bind(this,index,d)} className={'Dash_main_view_body_chapter_files_item Dash_main_view_body_chapter_files_item_close_bt '}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                     className="bi bi-file-arrow-down" viewBox="0 0 16 16">
                                                    <path
                                                        d="M8 5a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5A.5.5 0 0 1 8 5z"/>
                                                    <path
                                                        d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
                                                </svg>
                                                <div className={'Dash_main_view_body_chapter_files_item_text'}>
                                                    <a style={{maxWidth: '50%'}}>
                                                        {
                                                            this.state.Output[index].Files[d].name.substr(0, this.state.Output[index].Files[d].name.lastIndexOf('.') + 1)
                                                        }
                                                    </a>
                                                    <a>
                                                        {
                                                            this.state.Output[index].Files[d].name.substr(this.state.Output[index].Files[d].name.lastIndexOf('.') + 1, this.state.Output[index].Files[d].name.length)
                                                        }
                                                    </a>
                                                </div>

                                                <svg className={'Dash_main_view_body_chapter_files_item_close'} xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                     viewBox="0 0 16 16">
                                                    <path
                                                        d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                                </svg>
                                            </div>)
                                        }
                                        return tab
                                    })()
                                }
                            </div>
                        </div>
                        <button onClick={this.sendbt.bind(this)}>Wyślij</button>
                    </div>
                )
            }
        }
        const doneAnswer = (index) => {
            if (this.state.Content.Content[index].Answer == '1') {
                // text
                return (
                    <div className={'Dash_lesson_view_summary'}>
                        <div style={{marginTop: '0', height: 'fit-content'}} className={"Dash_lesson_view_summary_editor"}>
                            <b>Załaczony tekst do odpowiedzi</b>
                            {
                                parse(this.state.Content.Content[index].UText)
                            }
                        </div>
                    </div>
                )
            }
            else if (this.state.Content.Content[index].Answer == '2') {
                // files
                return  (
                    <div className={'Dash_lesson_view_summary'}>
                        {/*<ReactQuill className={"Dash_lesson_view_summary_editor"}/>*/}
                        <div className={'Dash_lesson_view_summary_addFiles'}>
                            {/*<label>*/}
                            {/*    <input type={'file'} multiple onChange={(e) => {*/}
                            {/*        this.state.Output[index].Files = [...this.state.Output[index].Files, ...e.target.files]*/}
                            {/*        this.forceUpdate()*/}
                            {/*    }}/>*/}
                            {/*    Załącz pliki*/}
                            {/*</label>*/}
                            {
                                this.state.Content.Content[index].UFiles.length > 0 &&
                                <b style={{display: "block", marginTop: '20px', marginBottom: '10px'}}>Dołączone już
                                    pliki:</b>
                            }
                            <div className={'Dash_lesson_view_summary_addFiles_list'}>
                                {
                                    (() => {
                                        const tab = []
                                        for (let d = 0; d < this.state.Content.Content[index].UFiles.length; d++) {
                                            tab.push(<div   className={'Dash_main_view_body_chapter_files_item Dash_main_view_body_chapter_files_item_close_bt '}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                     className="bi bi-file-arrow-down" viewBox="0 0 16 16">
                                                    <path
                                                        d="M8 5a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5A.5.5 0 0 1 8 5z"/>
                                                    <path
                                                        d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
                                                </svg>
                                                <div className={'Dash_main_view_body_chapter_files_item_text'}>
                                                    <a style={{maxWidth: '50%'}}>
                                                        {
                                                            this.state.Content.Content[index].UFiles[d].FileName.substr(0, this.state.Content.Content[index].UFiles[d].FileName.lastIndexOf('.') + 1)
                                                        }

                                                    </a>
                                                    <a>
                                                        .
                                                        {
                                                            this.state.Content.Content[index].UFiles[d].FileName.substr(this.state.Content.Content[index].UFiles[d].FileName.lastIndexOf('.') + 1, this.state.Content.Content[index].UFiles[d].FileName.length)
                                                        }
                                                    </a>
                                                </div>

                                                {/*<svg className={'Dash_main_view_body_chapter_files_item_close'} xmlns="http://www.w3.org/2000/svg" width="16" height="16"*/}
                                                {/*     viewBox="0 0 16 16">*/}
                                                {/*    <path*/}
                                                {/*        d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>*/}
                                                {/*</svg>*/}
                                            </div>)
                                        }
                                        return tab
                                    })()
                                }
                            </div>
                        </div>
                        {/*<button onClick={this.sendbt.bind(this)}>Wyślij</button>*/}
                    </div>)
            }
            else {
                // Files and text
                return (
                    <div className={'Dash_lesson_view_summary'}>
                        {/*<ReactQuill className={"Dash_lesson_view_summary_editor"} onChange={(html) => {this.state.Output[index].Text = html}}/>*/}
                        <div style={{marginTop: '0', height: 'fit-content'}} className={"Dash_lesson_view_summary_editor"}>
                            <b>Załaczony tekst do odpowiedzi</b>
                            {
                                parse(this.state.Content.Content[index].UText)
                            }
                        </div>
                        <div className={'Dash_lesson_view_summary_addFiles'}>
                            {/*<label>*/}
                            {/*    <input type={'file'} multiple onChange={(e) => {*/}
                            {/*        this.state.Output[index].Files = [...this.state.Output[index].Files, ...e.target.files]*/}
                            {/*        this.forceUpdate()*/}
                            {/*    }}/>*/}
                            {/*    Załącz pliki*/}
                            {/*</label>*/}
                            {
                                this.state.Content.Content[index].UFiles.length > 0 &&
                                <b style={{display: "block", marginTop: '20px', marginBottom: '10px'}}>Dołączone już
                                    pliki:</b>
                            }
                            <div className={'Dash_lesson_view_summary_addFiles_list'}>
                                {
                                    (()=>
                                    {
                                        const tab = []
                                        for (let d = 0; d < this.state.Content.Content[index].UFiles.length; d++) {
                                            tab.push(<div className={'Dash_main_view_body_chapter_files_item Dash_main_view_body_chapter_files_item_close_bt '}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                     className="bi bi-file-arrow-down" viewBox="0 0 16 16">
                                                    <path
                                                        d="M8 5a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5A.5.5 0 0 1 8 5z"/>
                                                    <path
                                                        d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
                                                </svg>
                                                <div className={'Dash_main_view_body_chapter_files_item_text'}>
                                                    <a style={{maxWidth: '50%'}}>
                                                        {
                                                            this.state.Content.Content[index].UFiles[d].FileName.substr(0, this.state.Content.Content[index].UFiles[d].FileName.lastIndexOf('.') + 1)
                                                        }

                                                    </a>
                                                    <a>
                                                        .
                                                        {
                                                            this.state.Content.Content[index].UFiles[d].FileName.substr(this.state.Content.Content[index].UFiles[d].FileName.lastIndexOf('.') + 1, this.state.Content.Content[index].UFiles[d].FileName.length)
                                                        }
                                                    </a>
                                                </div>

                                                {/*<svg className={'Dash_main_view_body_chapter_files_item_close'} xmlns="http://www.w3.org/2000/svg" width="16" height="16"*/}
                                                {/*     viewBox="0 0 16 16">*/}
                                                {/*    <path*/}
                                                {/*        d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>*/}
                                                {/*</svg>*/}
                                            </div>)
                                        }
                                        return tab
                                    })()
                                }
                            </div>
                        </div>
                        {/*<button>Wyślij</button>*/}
                    </div>
                )
            }
        }
        const createSave = (index) => {
            if (this.state.Output[index] === undefined) {
                if (this.state.ActiveIndex === 0) {
                    this.state.ActiveIndex = index
                    console.log('active', this.state.ActiveIndex)
                }
                this.state.Output.push({
                    Text: '',
                    Files: []
                })
            }
        }
        const tab = []
        for (let i = 0; i < this.state.Content.Content.length; i++) {
            createSave(i)
            tab.push(
                <div className={'Dash_main_view_body_chapter_additionals'}>
                    <div className={'Dash_main_view_body_chapter_additionals_header'}>
                        <h2>
                            {
                                (() => {
                                    if (this.state.Content.Content[i].More)
                                        return 'Rozdział ' + (i + 1).toString()
                                    else return 'Podsumowanie'
                                })()
                            }
                        </h2>
                        {
                            (
                                () => {
                                    if (this.state.Content.Content[i].State == 3)
                                        return (<b style={{color: "#fa4d4d"}}>Zrealizowany rozdział</b>)
                                    else if (this.state.Content.Content[i].State == 2)
                                        return <b >Rodział w trakcie sprawdzania</b>
                                }
                            )()
                        }
                    </div>
                    {

                        parse(this.state.Content.Content[i].Content)
                    }

                    {
                        this.state.Content.Content[i].Files.length > 0 && <b style={{marginBottom: '10px', display: 'block'}}>Załączone pliki do lekcji:</b>
                    }
                    <div style={{marginBottom: '20px'}} className={'Dash_main_view_body_chapter_files'}>
                    {
                        // this.state.Content.Content[i].Files.length > 0 &&

                        (
                            () => {
                                const tab = []
                                for (let d = 0; d < this.state.Content.Content[i].Files.length; d++) {
                                    tab.push(
                                            <div  className={'Dash_main_view_body_chapter_files_item Dash_main_view_body_chapter_files_item_close_bt '}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                     className="bi bi-file-arrow-down" viewBox="0 0 16 16">
                                                    <path
                                                        d="M8 5a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5A.5.5 0 0 1 8 5z"/>
                                                    <path
                                                        d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
                                                </svg>
                                                <div className={'Dash_main_view_body_chapter_files_item_text'}>
                                                    <a style={{maxWidth: '50%'}}>
                                                        {
                                                            this.state.Content.Content[i].Files[d].FileName.substr(0, this.state.Content.Content[i].Files[d].FileName.lastIndexOf('.') + 1)
                                                        }
                                                    </a>
                                                    <a>
                                                        .
                                                        {
                                                            this.state.Content.Content[i].Files[d].FileName.substr(this.state.Content.Content[i].Files[d].FileName.lastIndexOf('.') + 1, this.state.Content.Content[i].Files[d].FileName.length)
                                                        }
                                                    </a>
                                                </div>

                                                <svg className={'Dash_main_view_body_chapter_files_item_close'} xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                     viewBox="0 0 16 16">
                                                    <path
                                                        d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                                </svg>
                                            </div>
                                    )
                                }
                                return tab
                            }
                        )()
                    }
                    </div>

                    {
                        this.state.Content.Content[i].State >= 2 ? doneAnswer(i) : Answer(i)
                    }

                </div>
            )
        }
        return tab
    }

    proceedPop() {
        return (
            <div className={'Dash_lesson_view_proceed_pop_back'}>
                <div className={'Dash_lesson_view_proceed_pop'} style={{height: this.state.proceedState >= 2 ? '250px' : null}}>
                    {

                        (() => {
                            if (this.state.proceedState === 1)
                                return (
                                    <h2>Czy na pewno chcesz wysłać tą lekcje?</h2>
                                )
                            else if (this.state.proceedState === 2)
                                return (
                                    <h2>Wysyłanie lekcji!</h2>
                                )
                            else if (this.state.proceedState === 3)
                                return (
                                    <h2>Lekcja wysłana!</h2>
                                )
                            else if (this.state.proceedState === 4)
                                return (
                                    <h2>Wystąpił błąd, sprobój pózniej!</h2>
                                )
                        })()
                    }
                    {
                        this.state.proceedState === 1 &&
                        <div className={'Dash_lesson_view_proceed_pop_buttons'}>
                        <button
                            id={'Dash_lesson_view_proceed_pop_buttons_No'}
                            onClick={() => {
                                this.state.proceed = false
                                this.forceUpdate()
                            }}>
                            Nie
                        </button>
                        <button
                            id={'Dash_lesson_view_proceed_pop_buttons_Yes'}
                            onClick={this.sendbt.bind(this)}
                        >
                            Tak
                        </button>
                        </div>
                    }
                    {
                        this.state.proceedState === 2 &&
                        <div className={'Dash_lesson_view_proceed_pop_body'}>
                            <img src={loading_img}/>
                        </div>
                    }
                    {
                        this.state.proceedState === 3 &&
                        <div className={'Dash_lesson_view_proceed_pop_body'}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                 className="CreateLesson_creatingpop_done_logo" viewBox="0 0 16 16">
                                <path
                                    d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z"/>
                                <path
                                    d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z"/>
                            </svg>
                            <button onClick={this.sendbt.bind(this)}>Zamknij</button>
                        </div>
                    }
                    {
                        this.state.proceedState === 4 &&
                        <div className={'Dash_lesson_view_proceed_pop_body'}>
                            <img style={{width: '100px'}} src={error_img}/>
                            <button onClick={this.sendbt.bind(this)}>Zamknij</button>
                        </div>
                    }
                </div>
            </div>
        )
    }

    sendbt() {

        if (!this.state.proceed) {
            this.state.proceed = true
            this.state.proceedState = 1
            this.forceUpdate()
        } else {
            if (this.state.proceedState === 1) {
                this.state.proceedState = 2
                this.state.Content.Content[this.state.ActiveIndex].State = 1
                this.forceUpdate()

                this.SendLesData().then((ret) => {
                    if (ret === true) {
                        this.state.proceedState = 3
                        this.forceUpdate()
                    }
                    else {
                        this.state.proceed = false
                        this.state.proceedState = 0
                        this.forceUpdate()
                    }
                })
            }
            else if (this.state.proceedState === 2) {
                this.state.proceedState = 3
            }
            else if (this.state.proceedState === 3) {
                // this.state.proceedState = 1
                this.state.proceed = false
                this.forceUpdate()
            } else {

            }
        }
    }

    async SendLesData() {

        let files = ""

        const dataURItoBlob = (dataURI) => {
            // convert base64 to raw binary data held in a string
            // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
            var byteString = atob(dataURI.split(',')[1]);

            // separate out the mime component
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

            // write the bytes of the string to an ArrayBuffer
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            return new Blob([ab], {type: mimeString});
        }

        const blobToFile = (theBlob, fileName) => {
            return new File([theBlob], fileName, { lastModified: new Date().getTime(), type: theBlob.type })
        }

        const sendData = async (Data) => {
            return await fetch(serverPath() + "/api/Files/ImageContent.php", {
                method:"POST",
                headers: {
                    'Access-Control-Allow-Origin':'*',
                    // 'Content-Type': 'multipart/form-data'
                },
                body: Data,
                credentials: 'include'
            }).then(data => data.json()).catch(null)
        }

        const sendAdded = async (index) => {
            console.log("Zaczynam przesyłanie plików... ver", this.state.Output[index].Files)
            const form = new FormData()
            for (let i = 0; i < this.state.Output[index].Files.length; i++) {
                form.append(this.state.Output[index].Files[i].name, this.state.Output[index].Files[i])
            }

            const resp = await fetch(serverPath() + "api/Files/files.php", {
                method:"POST",
                headers: {
                    'Access-Control-Allow-Origin':'*',
                    // 'Content-Type': 'multipart/form-data'
                },
                body: form,
                credentials: 'include'
            }).then(ss => ss.json()).catch(null)

            if (resp == null) {
                console.log('Błąd w przesyłaniu plików')
            } else {
                if (resp['CODE'] === 'OK') {
                    files = resp['Files'].join('|')
                    console.log('Udało sie przesyłać pliki')
                } else {
                    console.log('Błąd w przesyłaniu plików')
                }
            }
        }

        const ImageFromEditor = async (index) => {
            if (this.state.Output[index].Text.replaceAll(" ", "") !== "") {
                const htmlParser = document.createElement('body')
                htmlParser.innerHTML = this.state.Output[index].Text
                const form = new FormData()
                let iterator = 1
                htmlParser.querySelectorAll('img').forEach((e) => {
                    e.id = iterator.toString() + '_image_' + new Date().getTime()
                    const file = dataURItoBlob(e.src)
                    form.append(e.id + '.' + mime.extension(file.type), blobToFile(file, e.id + '.' + mime.extension(file.type)))
                    e.id = e.id + '.' + mime.extension(file.type)
                    iterator += 1
                })
                await sendData(form).then((resp) => {
                    if (resp !== null) {
                        if (resp['CODE'] === 'OK') {
                            if (Object.keys(resp['Files']).length > 0) {
                                htmlParser.querySelectorAll('img')
                                    .forEach((e) => {
                                            e.src = serverPath() + 'api/Files' + resp['Files'][e.id]
                                        }
                                    )
                                this.state.Output[index].Text = htmlParser.innerHTML
                            }
                        } else {
                            console.log("Cos nie poszło z tym edytorem!")
                        }
                    }
                })
            }
        }

        let size_Count = 0
        for (let d = 0; d < this.state.Output[this.state.ActiveIndex].Files.length ; d++) {
            size_Count += this.state.Output[this.state.ActiveIndex].Files[d].size
        }
        if (size_Count >= 10000000) {
            return toast.error('Załączone pliki nie mogą przekracząć 10Mb!',{closeOnClick: true, theme: 'colored'})
        }

        // for(let i = 0; i < this.state.Output.length; i++) {
        if (this.state.Output[this.state.ActiveIndex].Files.length > 0) await sendAdded(this.state.ActiveIndex)
        if (this.state.Output[this.state.ActiveIndex].Text.length > 0) await ImageFromEditor(this.state.ActiveIndex)
        // }

        try {
            const resp = await fetch(serverPath() + 'api/Lessons/SaveLesson.php', {
                method:"POST",
                headers: {
                    'Access-Control-Allow-Origin':'*',
                    // 'Content-Type': 'multipart/form-data'
                },
                body: JSON.stringify({
                        Les_ID: this.state.ID,
                        Con_ID : this.state.ActiveIndex + 1,
                        Text: this.state.Output[this.state.ActiveIndex].Text,
                        Files: files
                    }),
                credentials: 'include'
            }).then(xs => xs.json()).catch(null)

            if (resp !== null) {
                if (resp['CODE'] === 'OK') {
                    toast.success('Odpowiedz wysłana!',{closeOnClick: true, theme: 'colored'})
                    window.location.reload()
                    return true
                }
            }

        } catch (e) {
            console.log(e, 1)
        }

    }

    render() {
        return(
            <div className={'Dash_lesson_view'}>
                {
                    this.state.proceed && this.proceedPop()
                }
                <div className={'Dash_lesson_view_header'}>
                    <div className={'Dash_lesson_view_header_background'}>
                        <img src={serverPath()+ 'api/Files' + this.state.Content.Image}/>
                    </div>
                    <h1>{this.state.Content.Subject}</h1>
                </div>
                <div className={'Dash_main_view_body'}>
                    <div className={'Dash_main_view_body_chapter_main'}>
                        {/*<p>*/}
                        {/*    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Faucibus in ornare quam viverra. Ultricies tristique nulla aliquet enim tortor at. Ante in nibh mauris cursus mattis. Nisl tincidunt eget nullam non. Turpis egestas maecenas pharetra convallis posuere morbi leo urna molestie. Mauris in aliquam sem fringilla ut morbi. Arcu bibendum at varius vel. Quam nulla porttitor massa id neque aliquam vestibulum. Eros donec ac odio tempor. Sit amet massa vitae tortor condimentum. Vel risus commodo viverra maecenas accumsan lacus vel facilisis volutpat. Sit amet consectetur adipiscing elit pellentesque habitant. Maecenas ultricies mi eget mauris pharetra et ultrices neque ornare. Ipsum faucibus vitae aliquet nec ullamcorper. Feugiat vivamus at augue eget arcu*/}
                        {/*</p>*/}
                        {this.state.Content.Desc}
                    </div>
                    {
                         this.renderChapters()
                    }
                    {/*<div className={'Dash_main_view_body_chapter_additionals'}>*/}
                    {/*    <div className={'Dash_main_view_body_chapter_additionals_header'}>*/}
                    {/*        <h2>Rozdział 1</h2>*/}
                    {/*        <a>Test SQL </a>*/}
                    {/*    </div>*/}

                    {/*    <p>*/}
                    {/*        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Faucibus in ornare quam viverra. Ultricies tristique nulla aliquet enim tortor at. Ante in nibh mauris cursus mattis. Nisl tincidunt eget nullam non. Turpis egestas maecenas pharetra convallis posuere morbi leo urna molestie. Mauris in aliquam sem fringilla ut morbi. Arcu bibendum at varius vel. Quam nulla porttitor massa id neque aliquam vestibulum. Eros donec ac odio tempor. Sit amet massa vitae tortor condimentum. Vel risus commodo viverra maecenas accumsan lacus vel facilisis volutpat. Sit amet consectetur adipiscing elit pellentesque habitant. Maecenas ultricies mi eget mauris pharetra et ultrices neque ornare. Ipsum faucibus vitae aliquet nec ullamcorper. Feugiat vivamus at augue eget arcu*/}
                    {/*    </p>*/}
                    {/*    <b style={{marginBottom: '10px', display: 'block'}}>Załączone pliki:</b>*/}
                    {/*    <div className={'Dash_main_view_body_chapter_files'}>*/}
                    {/*        <div className={'Dash_main_view_body_chapter_files_item'}>*/}
                    {/*            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"*/}
                    {/*                 className="bi bi-file-arrow-down" viewBox="0 0 16 16">*/}
                    {/*                <path*/}
                    {/*                    d="M8 5a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5A.5.5 0 0 1 8 5z"/>*/}
                    {/*                <path*/}
                    {/*                    d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>*/}
                    {/*            </svg>*/}
                    {/*            <a>Plika.pdf</a>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    <div className={'Dash_main_view_body_chapter_additionals'}>
                        {/*<div className={'Dash_main_view_body_chapter_additionals_header'}>*/}
                        {/*    <h2>Podsumowanie</h2>*/}
                        {/*    /!*<a>Test SQL </a>*!/*/}
                        {/*</div>*/}
                        {/*<p>*/}
                        {/*    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Faucibus in ornare quam viverra. Ultricies tristique nulla aliquet enim tortor at. Ante in nibh mauris cursus mattis. Nisl tincidunt eget nullam non. Turpis egestas maecenas pharetra convallis posuere morbi leo urna molestie. Mauris in aliquam sem fringilla ut morbi. Arcu bibendum at varius vel. Quam nulla porttitor massa id neque aliquam vestibulum. Eros donec ac odio tempor. Sit amet massa vitae tortor condimentum. Vel risus commodo viverra maecenas accumsan lacus vel facilisis volutpat. Sit amet consectetur adipiscing elit pellentesque habitant. Maecenas ultricies mi eget mauris pharetra et ultrices neque ornare. Ipsum faucibus vitae aliquet nec ullamcorper. Feugiat vivamus at augue eget arcu*/}
                        {/*</p>*/}

                    </div>
                </div>
            </div>
        )
    }
}
