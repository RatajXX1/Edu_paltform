import React from "react";
import '../styles/CreatedLessons.css';
import serverPath from "../utilis/server-path";
import {Link} from "react-router-dom";

export default class CreatedLessons extends React.Component {

    constructor() {
        super()
        this.state = {
            Content: [],
            page: 0,
        }
    }

    componentDidMount() {
        this.GetItems()
    }

    async GetItems() {
        try {
            const resp = await fetch(
                serverPath() + 'api/Lessons/CreatedLessons.php?page=' + this.state.page.toString(),
                {
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    },
                    credentials: 'include'
                }
            ).then(e => e.json()).catch(null)

            if (resp !== null) {
                if (resp['CODE'] === 'OK') {
                    this.state.Content = resp['Lessons']
                    this.forceUpdate()
                }
            }
        } catch (e) {

        }
    }

    RenderItems() {
        const tab = []
        if (this.state.Content.length > 0) for (let i = 0; i < this.state.Content.length; i++) {
            tab.push(<tr>
                <th>
                    {
                        this.state.Content[i].ID
                    }
                </th>
                <th>
                    {
                        this.state.Content[i].Subject
                    }
                </th>
                <th>
                    {
                        this.state.Content[i].Time
                    }
                </th>
                <th>
                    <a>Usun</a>
                    <Link to={'/main/Answers?id=' + this.state.Content[i].ID}>Odpowiedzi</Link>
                </th>
            </tr>)
        }
        else tab.push(<tr>
            <th colSpan={4}>
                <h1 style={{width: '100%', textAlign: 'center'}}>Brak wyników</h1>
            </th>
        </tr>)

        return tab
    }

    render() {
        return (
            <div className={'Created_lessons_view'}>
                <div className={'CreateLesson_main_view_header'}>
                    <h1>Stworzone lekcje</h1>
                </div>
                <table className={'Created_lessons_view_table'}>
                    {/*<colgroup>*/}
                    {/*    <col span="1" style={{minWidth: "fit-content"}}/>*/}
                    {/*    <col span="1" />*/}
                    {/*    <col span="1" />*/}
                    {/*    <col span="1" />*/}
                    {/*</colgroup>*/}
                    <thead>
                        <tr>
                            <th  style={{width: '5%', whiteSpace: 'nowrap'}}>
                                ID
                            </th>
                            <th>
                                Nazwa
                            </th>
                            <th style={{width: '200px'}}>
                                Data stworzenia
                            </th>
                            <th style={{width: '200px'}}></th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        this.RenderItems()
                    }
                    </tbody>
                </table>
            </div>
        )
    }


}