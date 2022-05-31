import React from "react";
import '../styles/Lessons.css'
import Lesson_widget from "./lesson_widget";
import serverPath from "../utilis/server-path";


export default class LessonGroup extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            Content: [],
            page: 1,
            CanLoad: true,
            GroupID: 0,
        }

        this.onBottom = this.onBottomEvent.bind(this)

    }

    initilizeParams() {
        const params = new URLSearchParams(window.location.search)
        try {
            if (params.get("ID") !== undefined) {
                this.state.GroupID = parseInt(params.get('ID'))
                this.GetData()
            }
            else this.state.CanLoad = false
        } catch (e) {
            this.state.CanLoad = false
        }
    }

    componentDidMount() {
        this.initilizeParams()
        if (this.props.scroll !== undefined && this.props.scroll.current !== null) {
            this.props.scroll.current.addEventListener('scroll', this.onBottom)
        }
    }

    componentWillUnmount() {
        if (this.props.scroll !== undefined && this.props.scroll.current !== null) {
            // console.log('Unmount !!!!')
            this.props.scroll.current.removeEventListener('scroll', this.onBottom)

        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.scroll.current !== null
        ) {
            this.props.scroll.current.addEventListener('scroll', this.onBottom)
            this.props.scroll.current.addEventListener('scroll', this.onBottom)
            // this.forceUpdate()
        }

    }

    onBottomEvent(e) {
        if (e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight)
        {
            if (this.state.CanLoad) {
                this.state.page += 1
                this.GetData()
            }
        }
    }

    async GetData() {
        try {
            const resp = await fetch(
                serverPath() + `api/Lessons/?page=${this.state.page}&group=${this.state.GroupID}`,
                {
                    method: 'GET',
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    },
                    credentials: 'include'
                }
            ).then(e => e.json()).catch(null)

            if (resp !== null) {
                if (resp['CODE'] === 'OK') {
                    this.state.Content = this.state.Content.concat(resp['Lessons'])
                    this.forceUpdate()
                } else {
                    this.state.CanLoad = false
                }
            }
        } catch (e) {

        }
    }

    renderLessons() {
        const tab = []
        if (this.state.Content.length > 0) for (let i = 0; i < this.state.Content.length; i++) {
            tab.push(
                <Lesson_widget Image={this.state.Content[i].Image} Name={this.state.Content[i].Subject} ID={this.state.Content[i].ID}/>
            )
        }
        else tab.push(
            <h1 style={{userSelect: 'none'}}>Brak wyników</h1>
        )
        return tab
    }

    render() {
        return (
            <div className={'Dash_lessons_view'}>
                <div className={'Dash_lessons_view_header'}>
                    <h2>Wszystkie lekcje</h2>

                </div>
                <div className={'Dash_lessons_view_body'}>
                    {
                        this.renderLessons()
                    }
                </div>
            </div>
        )
    }

}