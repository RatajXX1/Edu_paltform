import React, {useEffect} from "react";
import '../styles/Lessons.css'
import Lesson_widget from "./lesson_widget";
import serverPath from "../utilis/server-path";

class Lessons extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            Content: [],
            page: 1,
            CanLoad: true
        }

        this.onBottom = this.onBottomEvent.bind(this)

    }


    componentDidMount() {
        this.getLesson()
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
                this.getLesson()
            }
        }
    }

    async getLesson() {
      try {

          const resp = await fetch(
               serverPath() + 'api/Lessons/AllLesson.php?page=' + this.state.page.toString(),
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
                    {/*<button>*/}
                    {/*    Sortuj*/}
                    {/*    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"*/}
                    {/*         className="bi bi-sort-down" viewBox="0 0 16 16">*/}
                    {/*        <path*/}
                    {/*            d="M3.5 2.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 11.293V2.5zm3.5 1a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z"/>*/}
                    {/*    </svg>*/}
                    {/*</button>*/}
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

export default Lessons;