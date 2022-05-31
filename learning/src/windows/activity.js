import React from "react";
import '../styles/Activity.css';
import serverPath from "../utilis/server-path";

export default class Activity extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            items: []
        }

        //
        // 1 - avalibe new lesson
        // 2 - chapter veryfied sucsesfull
        // 3 - chapter not veryfied sucsesfull
        //

    }

    componentDidMount() {
        this.GetData()
        this.SetRead()
    }

    async SetRead() {
        try {
            fetch(serverPath() + 'api/Activity/readed.php',
                {
                    method: 'GET',
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    },
                    credentials: 'include'
                }).then(sx => sx.json()).catch(null)

        } catch (e) {

        }
    }

    async GetData() {
        try {
            const resp = await fetch(serverPath() + 'api/Activity/',
                {
                    method: 'GET',
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    },
                    credentials: 'include'
                }).then(sx => sx.json()).catch(null)

            if (resp !== null) {
                if (resp['CODE'] === 'OK') {
                    this.state.items = resp['Notfications']
                    this.forceUpdate()
                }
            }
        } catch (e) {

        }
    }

    renderData() {
        const tab  = []

        if (this.state.items.length > 0) for(let i = 0; i < this.state.items.length; i++)  {
            tab.push(
                <tr>
                    <th>
                        <div className={this.state.items[i].Read == 1 ? 'Main_view_activity_body_item' : 'Main_view_activity_body_item Main_view_activity_body_item_no_readed'}>
                            {
                                (
                                    ()=>{
                                        if (this.state.items[i].Type == 1) return <svg xmlns="http://www.w3.org/2000/svg"
                                             className="bi bi-node-plus" viewBox="0 0 16 16">
                                            <path fill-rule="evenodd"
                                                  d="M11 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM6.025 7.5a5 5 0 1 1 0 1H4A1.5 1.5 0 0 1 2.5 10h-1A1.5 1.5 0 0 1 0 8.5v-1A1.5 1.5 0 0 1 1.5 6h1A1.5 1.5 0 0 1 4 7.5h2.025zM11 5a.5.5 0 0 1 .5.5v2h2a.5.5 0 0 1 0 1h-2v2a.5.5 0 0 1-1 0v-2h-2a.5.5 0 0 1 0-1h2v-2A.5.5 0 0 1 11 5zM1.5 7a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1z"/>
                                        </svg>
                                        else if (this.state.items[i].Type == 2) return <svg xmlns="http://www.w3.org/2000/svg"
                                                                                            className="bi bi-patch-check" viewBox="0 0 16 16">
                                            <path fill-rule="evenodd"
                                                  d="M10.354 6.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                                            <path
                                                d="m10.273 2.513-.921-.944.715-.698.622.637.89-.011a2.89 2.89 0 0 1 2.924 2.924l-.01.89.636.622a2.89 2.89 0 0 1 0 4.134l-.637.622.011.89a2.89 2.89 0 0 1-2.924 2.924l-.89-.01-.622.636a2.89 2.89 0 0 1-4.134 0l-.622-.637-.89.011a2.89 2.89 0 0 1-2.924-2.924l.01-.89-.636-.622a2.89 2.89 0 0 1 0-4.134l.637-.622-.011-.89a2.89 2.89 0 0 1 2.924-2.924l.89.01.622-.636a2.89 2.89 0 0 1 4.134 0l-.715.698a1.89 1.89 0 0 0-2.704 0l-.92.944-1.32-.016a1.89 1.89 0 0 0-1.911 1.912l.016 1.318-.944.921a1.89 1.89 0 0 0 0 2.704l.944.92-.016 1.32a1.89 1.89 0 0 0 1.912 1.911l1.318-.016.921.944a1.89 1.89 0 0 0 2.704 0l.92-.944 1.32.016a1.89 1.89 0 0 0 1.911-1.912l-.016-1.318.944-.921a1.89 1.89 0 0 0 0-2.704l-.944-.92.016-1.32a1.89 1.89 0 0 0-1.912-1.911l-1.318.016z"/>
                                        </svg>
                                        else if (this.state.items[i].Type == 3) return <svg xmlns="http://www.w3.org/2000/svg"
                                                                                             className="bi bi-x-octagon" viewBox="0 0 16 16">
                                            <path
                                                d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353L4.54.146zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1H5.1z"/>
                                            <path
                                                d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                        </svg>
                                    }
                                )()

                            }
                            <h3>
                                {
                                    (
                                        ()=>{
                                            if (this.state.items[i].Type == 1) return 'Jest dostępna nowa lekcja'
                                            else if (this.state.items[i].Type == 2) return 'Rozdział zweryfikowany pomyślnie'
                                            else if (this.state.items[i].Type == 3) return 'Twoja odpowiedz nie została zawierdzona'
                                        }
                                    )()
                                }
                            </h3>
                            <a>
                                {
                                    this.state.items[i].Date
                                }
                            </a>
                        </div>
                    </th>
                </tr>
            )
        }
        else tab.push(
            <h1 style={{userSelect: 'none', width: '100%', textAlign: 'center'}}>Brak wyników</h1>
        )
        return tab
    }

    render() {
        return (
            <div className={'Main_view_activity'}>
                <div className={'Main_view_activity_headbar'}>
                    <h1>Ostania aktywność</h1>
                </div>
                <table className={'Main_view_activity_body'}>
                    <tbody>
                    {
                        this.renderData()
                    }
                    </tbody>
                </table>
            </div>
        )
    }

}