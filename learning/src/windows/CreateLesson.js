import React, {memo, useMemo} from "react";
import '../styles/CreateLesson.css';
import Cropper from "react-cropper";
import 'cropperjs/dist/cropper.css';
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import Calendar_pop from "./calendar_pop";
import ShareLesson from "./ShareLesson";
import * as mime from 'react-native-mime-types';
import serverPath from "../utilis/server-path";
import {Report} from "notiflix/build/notiflix-report-aio";

import loading_lesson from '../images/loading_lesson.svg'
import {toast} from "react-toastify";

export default class CreateLesson extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            UrlPath: serverPath(),
            LoadingPop: false,
            LessonCreated: false,
            EditFile: false,
            CalendarOpen: false,
            BackgroundName: '',
            AdditionalImages: [],
            Content: {
                Subject: '',
                Image: '',
                Desc: '',
                Lesson: [
                    {
                        Text: '',
                        Answer: 1,
                        Files: [],
                    }
                ],
                EnableCode: 0,
                Code: '',
                CanExpire: 0,
                Expire: new Date().toLocaleDateString(),
                Users: [],
                Groups: []
            }
        }

        this.cropref = React.createRef()

        this.modules = {
            toolbar: {
                container: [
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    ['bold', 'italic', 'underline'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'align': [] }],
                    ['link', 'image'],
                    ['clean'],
                    [{ 'color': [] }]
                ],


                // handlers: {
                //     image: this.imageHandler,
                // },
            }
        }
    }


    CopyURL() {
        const copyied = this.state.UrlPath
        navigator.clipboard.writeText(this.state.UrlPath)
        this.state.UrlPath = 'skopiowano'
        this.forceUpdate()
        setTimeout(() => {
            this.state.UrlPath = copyied
            this.forceUpdate()
        }, 800)
    }

    CreateNext() {
        document.location.reload()
    }

    CreatingLessonPop() {
        return (
            <div className={'CreateLesson_creatingpop'}>
                {!this.state.LessonCreated && <h2>Tworzenie lekcji, prosze czekać!</h2>}
                {!this.state.LessonCreated && <img className={'CreateLesson_creatingpop_view_loading'} src={loading_lesson} alt={'loading'}/>}

                {
                    this.state.LessonCreated
                        &&
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                             className="CreateLesson_creatingpop_done_logo" viewBox="0 0 16 16">
                            <path
                                d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z"/>
                            <path
                                d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z"/>
                        </svg>
                        <h2>Lekcja została utworzona pomyślnie!</h2>
                        <fieldset onClick={this.CopyURL.bind(this)}>
                            <legend>Adres URL lekcji</legend>
                            <a>{this.state.UrlPath}</a>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                 className="bi bi-clipboard-check" viewBox="0 0 16 16">
                                <path fill-rule="evenodd"
                                      d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                                <path
                                    d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                                <path
                                    d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                            </svg>
                        </fieldset>
                        <button onClick={this.CreateNext.bind(this)}>Stwórz nową lekcje</button>
                    </div>
                }

            </div>
        )
    }

    onSelectedFIle(e) {
        if (e.target.files.length > 0) {
            this.state.BackgroundName = e.target.files[0].name
            this.setState({EditFile: true})
            const reader = new FileReader()
            reader.readAsDataURL(e.target.files[0])
            reader.onload = (d) => {
                const img = new Image()
                img.src = d.target.result
                img.onload = (c) => {
                    this.cropref?.current.cropper.replace(c.target.src)
                }
            }
        } else {
            this.setState({EditFile: false})
        }
    }

    ClickOnDate(time) {
        // console.log(time)
        time.setMonth(time.getMonth() + 1)
        document.querySelector('#CreateLesson_main_view_expire_date_input')
            .value = time.getFullYear() + '-' + (time.getMonth().toString().length === 1 ? '0' + time.getMonth() : time.getMonth()) + '-' + (time.getDate().toString().length === 1 ? '0' + time.getDate() : time.getDate())
    }

    RemoveChapter(id) {
        if (this.state.Content.Lesson[id] !== undefined) {
            this.state.Content.Lesson.splice(id , 1)
            this.forceUpdate()
        }
    }

    onCrop() {
        function blobToFile(theBlob, fileName){
            return new File([theBlob], fileName, { lastModified: new Date().getTime(), type: theBlob.type })
        }
        this.cropref.current.cropper.getCroppedCanvas().toBlob((e) => {this.state.Content.Image = blobToFile(e, this.state.BackgroundName);})
    }

    removeSelectedFile(chapter, ID) {
        if (this.state.Content.Lesson[chapter] !== undefined &&  this.state.Content.Lesson[chapter].Files[ID] !== undefined) {
            this.state.Content.Lesson[chapter].Files.splice(ID, 1)
            this.forceUpdate()
        }
    }

    renderFiles(id) {
        const tas = []
        for(let d = 0; d < this.state.Content.Lesson[id].Files.length; d++) {
            tas.push(<div onClick={this.removeSelectedFile.bind(this, id, d)} className={'Dash_main_view_body_chapter_files_item Dash_main_view_body_chapter_files_item_close_bt '}>
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
                            this.state.Content.Lesson[id].Files[d].name.substr(0, this.state.Content.Lesson[id].Files[d].name.lastIndexOf('.') + 1)
                        }
                    </a>
                    <a>
                        .
                        {
                            this.state.Content.Lesson[id].Files[d].name.substr(this.state.Content.Lesson[id].Files[d].name.lastIndexOf('.') + 1, this.state.Content.Lesson[id].Files[d].name.length)
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
        return tas
    }

    RenderChapters() {
        const tab = []
        for(let i = 0; i < this.state.Content.Lesson.length; i++) {
            tab.push(<div className={'CreateLesson_main_view_body_text'}>
                { (this.state.Content.Lesson.length > 1) && <h3>Rodział. {i + 1}</h3>}
                <ReactQuill modules={this.modules} className={'CreateLesson_main_view_editor'} placeholder={'Zawartość lekcji'} onChange={(html) => {this.state.Content.Lesson[i].Text = html}}/>

                {(this.state.Content.Lesson.length > 1) && <button className={'CreateLesson_main_view_body_remove_chapter'} onClick={this.RemoveChapter.bind(this, i)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                         className="bi bi-x" viewBox="0 0 16 16">
                        <path
                            d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                    Usuń rozdział
                </button>}

                <div className={'CreateLesson_main_view_body_text_answer'}>
                    <a style={{display: 'inline-block', marginTop: '15px'}}>Odpowiedz w formie:</a>
                    <select onChange={(e) => {this.state.Content.Lesson[i].Answer = e.target.value}}>
                        <option value={1}>tekstu</option>
                        <option value={2}>pliku/ów</option>
                        <option value={3}>pliku/ów i tekstu</option>
                    </select>
                    <label>
                        Załacz pliki
                        <input type={'file'} multiple style={{display: 'none'}} onChange={
                            (e) => {
                                this.state.Content.Lesson[i].Files = [...this.state.Content.Lesson[i].Files, ...e.target.files]
                                this.forceUpdate()
                            }
                        }/>
                    </label>
                    <div className={'CreateLesson_main_view_body_text_answer_files'}>
                        {
                           this.renderFiles(i)
                        }
                    </div>
                </div>
            </div>)
        }
        return tab
    }

    addChapter() {
        // console.log(this.state.Content.Lesson[0].Text)
        if (this.state.Content.Lesson.length < 11) {
            this.state.Content.Lesson.push({Text: '', Answer: 1, Files: []})
            this.forceUpdate()
        }
    }

    async sendFiles(index = 0) {
        // console.log("Zaczynam przesyłanie plików...")
        const form = new FormData()
        for (let i = 0; i < this.state.Content.Lesson[index].Files.length; i++) {
            form.append(this.state.Content.Lesson[index].Files[i].name, this.state.Content.Lesson[index].Files[i])
        }
        const resp = await fetch(serverPath() + "api/Files/files.php", {
            method:"POST",
            headers: {
                'Access-Control-Allow-Origin':'*',
                // 'Content-Type': 'multipart/form-data'
            },
            body: form,
            credentials: 'include'
        }).then(data => data.json()).catch(null)

        if (resp == null) {
            console.log('Błąd w przesyłaniu plików')
        } else {
            if (resp['CODE'] === 'OK') {
                this.state.Content.Lesson[index].Files = resp['Files'].join('|')
                console.log('Udało sie przesyłać pliki')
            } else {
                this.state.Content.Lesson[index].Files = ''
                console.log('Błąd w przesyłaniu plików')
            }
        }
    }

    async ImageFromEditor(index) {
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

        if (this.state.Content.Lesson[index].Text.replaceAll(" ", "") !== "") {
            const htmlParser = document.createElement('body')
            htmlParser.innerHTML = this.state.Content.Lesson[index].Text
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
                            this.state.Content.Lesson[index].Text = htmlParser.innerHTML
                        }
                    } else {
                        console.log("Cos nie poszło z tym edytorem!")
                    }
                }
            })
        }
    }

    async sendForm() {
        // if is ok when post data

        if (this.state.Content.Subject.replaceAll(" ", "") === '') {
            return toast.error('Lekcja musi zawierać temat!',{closeOnClick: true, theme: 'colored'})
        }

        if (this.state.Image === '') {
            return toast.error('Lekcja musi zawierać zdjecie!',{closeOnClick: true, theme: 'colored'})
        }

        for (let i = 0; i < this.state.Content.Lesson.length; i++) {
            if (this.state.Content.Lesson[i].Text.replaceAll(" ", '') === "") {
                return toast.error('Treść rodziału musi być uzupełniona!',{closeOnClick: true, theme: 'colored'})
            }
        }

        for (let i = 0; i < this.state.Content.Lesson.length; i++) {
            let size_Count = 0
            for (let d = 0; d < this.state.Content.Lesson[i].Files.length ; d++) {
                size_Count += this.state.Content.Lesson[i].Files[d].size
            }
            if (size_Count >= 10000000) {
                return toast.error('Załączone pliki nie mogą przekracząć 10Mb!',{closeOnClick: true, theme: 'colored'})
            }
        }

        if (this.state.Content.Users.length + this.state.Content.Groups.length === 0) {
            return toast.error('Trzeba wyznaczyć osoby/grupy które mogą mieć dostęp!',{closeOnClick: true, theme: 'colored'})
        }

        this.state.LoadingPop = true
        this.forceUpdate()
        if (this.state.Content.Image !== '') {
            const form = new FormData()
            form.append(this.state.Content.Image.name, this.state.Content.Image)
            const resp = await fetch( serverPath() + "api/Files/ImageContent.php", {
                method:"POST",
                headers: {
                    'Access-Control-Allow-Origin':'*',
                    // 'Content-Type': 'multipart/form-data'
                },
                body: form,
                credentials: 'include'
            }).then(data => data.json()).catch(null)
            if (resp == null) {
                console.log('Błąd w przesyłaniu plików')
            } else {
                if (resp['CODE'] === 'OK') {
                    this.state.Content.Image = resp['Files'][this.state.Content.Image.name]
                    console.log('Udało sie przesyłać pliki')
                } else {
                    console.log('Błąd w przesyłaniu plików')
                }
            }
        }
        for (let i = 0; i < this.state.Content.Lesson.length; i++) {
            if (this.state.Content.Lesson[i].Files.length > 0) await this.sendFiles(i)
            else this.state.Content.Lesson[i].Files = ''
            if (this.state.Content.Lesson[i].Text.length > 0) await this.ImageFromEditor(i)
        }
        try {
            const resp = await fetch(serverPath() + "api/Lessons/CreateLesson.php", {
                method: "POST",
                headers: {
                    'Access-Control-Allow-Origin':'*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.state.Content),
                credentials: 'include'
            }).then(data => data.json()).catch(null)

            if (resp !== null) {
                if (resp["CODE"] === 'OK') {
                    // window.sessionStorage.setItem('Token', resp['Token'])
                    this.state.LessonCreated = true
                    this.state.UrlPath = window.location.origin + '/main/lesson?ID=' + resp['ID']
                    this.forceUpdate()
                     return true
                } else {
                    Report.failure(
                        'Wystąpił błąd!',
                        'Wystapił niznany błąd podczas tworzenia leckji, spróbój ponownie później!',
                        'OK',
                        () => {
                            window.location.reload()
                        }
                    );
                    return false
                }
            } else return false;
        } catch (e) {
            Report.failure(
                'Wystąpił błąd!',
                'Wystapił niznany błąd podczas tworzenia leckji, spróbój ponownie później! <br>' + e.toString(),
                'OK',
                () => {
                    window.location.reload()
                }
            );
            return false
        }
    }

    test() {
        console.log(this.state.Content.Users, this.state.Content.Groups)
    }

    render() {
        if (this.state.LoadingPop) return (
            <div className={'CreateLesson_main_view'}>
                <div className={'CreateLesson_main_view_header'}>
                    <h1>Tworzenie lekcje</h1>
                </div>
                {this.CreatingLessonPop()}
            </div>
        )
        else return(
            <div className={'CreateLesson_main_view'}>
                <div className={'CreateLesson_main_view_header'}>
                    <h1>Tworzenie lekcje</h1>
                </div>
                <div className={'CreateLesson_main_view_body'}>
                    <div style={{borderBottom: '1px solid #282c34'}} onClick={() => {document.querySelector('#subject_input').focus()}} className={'CreateLesson_main_view_body_text'}>
                        <h2>Temat</h2>
                        <input id={'subject_input'} type={'text'}  onChange={(e) => { this.state.Content.Subject = e.target.value }}/>
                    </div>
                    <div className={'CreateLesson_main_view_body_seletct_background'}>
                        <a style={{display: 'inline-block', margin: '10px 0 0 0'}}>Ustaw zdjecie lekcji</a>
                        <label className={'CreateLesson_main_view_select_image'}>
                            <input type={'file'} style={{display: 'none'}} accept={'image/png, image/gif, image/jpeg'}
                                   onChange={(e) => {
                                       this.onSelectedFIle(e)
                                   }}/>
                            Wybierz
                        </label>

                        {this.state.EditFile &&
                            <Cropper src={'https://wallpaperaccess.com/full/1916098.jpg'}
                                  className={'CreateLesson_main_view_body_seletct_background_edit'}
                                  aspectRatio={16 / 9}
                                  guides={false}
                                  checkCrossOrigin={false}
                                  responsive={true}
                                  scaleX={1}
                                  viewMode={3}
                                  autoCropArea={1}
                                  minCropBoxHeight={100}
                                  minCropBoxWidth={250}
                                  crop={this.onCrop.bind(this)}
                                  ref={this.cropref }
                            />
                        }

                    </div>
                    <div className={'CreateLesson_main_view_body_text'}>
                        <a>Opis lekcji (Opcjonalne)</a>
                        <textarea placeholder={'Opis'} onChange={(e) => {this.state.Content.Desc = e.target.value}}></textarea>
                    </div>
                    <h2>Zawartość lekcji</h2>
                    {this.RenderChapters()}
                    { this.state.Content.Lesson.length < 10 && <button className={'CreateLesson_main_view_add_chapter'} onClick={this.addChapter.bind(this)}>Dodaj
                        rozdział</button>}
                    <h2>Dostępność lekcji</h2>
                    {/*<div className={'CreateLesson_main_view_body_text'}>*/}
                    {/*    <label className="container_lesson">*/}
                    {/*        <input type="checkbox" onChange={(e) => {this.state.Content.EnableCode = (e.target.value ? 1 : 0); this.forceUpdate()}} />*/}
                    {/*        <span className="checkmark_lesson"></span>*/}
                    {/*    </label>*/}
                    {/*    <a>Zabezpiecz dostęp do lekcje kodem</a>*/}
                    {/*    {*/}
                    {/*        this.state.Content.EnableCode === 1 &&*/}
                    {/*        <div className={'CreateLesson_main_view_PassCode'}>*/}
                    {/*            <a style={{display: 'block', margin: '0 10px 10px 10px', paddingLeft: '20px'}}>Aby wykonywać*/}
                    {/*                daną lekcja trzeba najpierw podać ten kod.</a>*/}
                    {/*            <input type={'text'} placeholder={'Kod'} onChange={(e) => {this.state.Content.Code = e.target.value} }/>*/}
                    {/*            <button>*/}
                    {/*                Generuj losowy kod*/}
                    {/*            </button>*/}
                    {/*        </div>*/}
                    {/*    }*/}
                    {/*</div>*/}
                    {/*<div className={'CreateLesson_main_view_body_text'}>*/}
                    {/*    <label className="container_lesson">*/}
                    {/*        <input type="checkbox" onChange={(e) => {this.state.Content.CanExpire = (e.target.value ? 1 : 0); this.forceUpdate()}} />*/}
                    {/*        <span className="checkmark_lesson"></span>*/}
                    {/*    </label>*/}
                    {/*    <a>Ogranicz czasowo widocznośc lekcji</a>*/}
                    {/*    {*/}
                    {/*        this.state.Content.CanExpire === 1 &&*/}
                    {/*        <div style={{width: 'fit-content'}} className={'CreateLesson_main_view_expire_date'}>*/}
                    {/*            <a>Data po której lekcja nie będzie już widoczna</a>*/}
                    {/*            <input*/}
                    {/*                id={'CreateLesson_main_view_expire_date_input'}*/}
                    {/*                onClick={() => {*/}
                    {/*                    {*/}
                    {/*                        this.setState({CalendarOpen: true})*/}
                    {/*                    }*/}
                    {/*                }}*/}
                    {/*                type={'button'}*/}
                    {/*                value={'2022-04-1'}*/}
                    {/*            />*/}
                    {/*            {this.state.CalendarOpen && <Calendar_pop onSelect={(e) => {*/}
                    {/*                this.ClickOnDate(e)*/}
                    {/*            }} close={() => {*/}
                    {/*                this.setState({CalendarOpen: false})*/}
                    {/*            }}/>}*/}
                    {/*        </div>*/}
                    {/*    }*/}
                    {/*</div>*/}
                    <div className={'CreateLesson_main_view_body_text'}>
                        <a>Przypisz użytkowników badź grupy do lekcji.</a>
                        <ShareLesson users={this.state.Content.Users} group={this.state.Content.Groups} />
                    </div>
                </div>

                <div className={'CreateLesson_main_view_summary'}>
                    {/*<button onClick={this.test.bind(this)}>Stwórz</button>*/}
                    <button onClick={this.sendForm.bind(this)}>Stwórz</button>
                </div>
            </div>
        )
    }

}