import React, {useEffect, useState} from "react";
import '../styles/ShareLesson.css';
import SimpleBar from "simplebar-react";
import 'simplebar/dist/simplebar.min.css';
import serverPath from "../utilis/server-path";
import image from '../images/user.jpg'

const SerachInput = (callback) => {
    const [Query, SetQuery] = useState('')

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            callback.callback(Query)
            // Send Axios request here
        }, 1000)

        return () => clearTimeout(delayDebounceFn)
    }, [Query])

    return (
        <input id={'ShareLesson_search'} type={'text'} placeholder={'Szukaj'} onChange={(e) => SetQuery(e.target.value)}/>
    )

}

export default class ShareLesson extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            Mode: 1,
            UserPage: 1,
            GroupPage: 1,
            Users:[],
            Group:[],
            SelectedUsers:[],
            SelectedGroup:[],
            UserLoad: false,
            GroupLoad: false,
            SearchingMode: false,
            Query: ''
        }

        if (this.props.users !== undefined) {
            this.state.SelectedUsers = this.props.users
        }

        if (this.props.group !== undefined) {
            this.state.SelectedGroup = this.props.group
        }

        this.scroll = React.createRef()
    }

    SearchQuery(query) {
        if (!!query) {
            this.scroll.current.scrollTop = 0
            this.state.Query = query
            if (this.state.Mode === 1) {
                this.state.UserPage = 1
                this.state.UserLoad = false
                this.state.Users = []
                this.state.SearchingMode = true
                this.Searching()
            } else {
                this.state.GroupPage = 1
                this.state.GroupLoad = false
                this.state.Group = []
                this.state.SearchingMode = true
                this.Searching()
            }
        } else {
            if (this.state.SearchingMode) {
                this.state.SearchingMode = false
                this.state.GroupPage = 1
                this.state.GroupLoad = false
                this.state.Group = []
                this.state.UserPage = 1
                this.state.UserLoad = false
                this.state.Users = []
                if (this.state.Mode === 1) {
                    if (this.state.Group.length === 0) this.GetUsers()
                } else {
                    if (this.state.Users.length === 0) this.GetGroups()
                }
                this.scroll.current.scrollTop = 0
            }
        }
    }

    async Searching() {
        try {
            let resp
            if (this.state.Mode === 1)
            resp = await fetch(
                serverPath() + 'api/Users/Search.php?page=' + this.state.UserPage.toString() + '&query=' + encodeURIComponent(this.state.Query),
                {
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    },
                    credentials: 'include'
                }).then(res => res.json()).catch(null)
            else resp = await fetch(
                serverPath() + 'api/Groups/Search.php?page=' + this.state.UserPage.toString() + '&query=' + encodeURIComponent(this.state.Query),
                {
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    },
                    credentials: 'include'
                }).then(res => res.json()).catch(null)

            if (resp !== null) {
                if (resp['CODE'] === 'OK') {
                    if (Object.keys(this.state.Mode === 1 ? resp['Users'] : resp['Groups'] ).length > 0) {
                        if (this.state.Mode === 1) {
                            if (this.state.UserPage > 1) this.state.Users = this.state.Users.concat(resp['Users'])
                            else this.state.Users = resp['Users']
                        }
                        else {
                            if (this.state.GroupPage > 1) this.state.Users = this.state.Group.concat(resp['Groups'])
                            else this.state.Users = resp['Groups']
                        }
                    } else this.state.Mode === 1 ? this.state.UserLoad = true : this.state.GroupLoad = true
                } else this.state.Mode === 1 ? this.state.UserLoad = true : this.state.GroupLoad = true
                this.forceUpdate()
            }
        } catch (e) {

        }
    }

    componentDidMount() {
        this.GetUsers()
        this.scroll.current.addEventListener('scroll', (e) => {
            if (e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight)
            {
                if (this.state.Mode === 1) {
                    if (!this.state.UserLoad) {
                        this.state.UserPage += 1
                        if (!this.state.SearchingMode)
                            this.GetUsers()
                        else this.Searching()
                    }
                } else {
                    if (!this.state.GroupLoad) {
                        this.state.GroupPage += 1
                        if (!this.state.SearchingMode)
                            this.GetGroups()
                        else this.Searching()
                    }
                }
            }
        })
    }

    changeType() {
        if (this.state.SearchingMode) {
            this.state.SearchingMode = false
            this.state.GroupPage = 1
            this.state.GroupLoad = false
            this.state.Group = []
            this.state.UserPage = 1
            this.state.UserLoad = false
            this.state.Users = []
            document.querySelector('#ShareLesson_search').value = ''
        }
        if (this.state.Mode === 1) {
            if (this.state.Group.length === 0) this.GetGroups()
            this.setState({Mode: 2})
        } else {
            if (this.state.Users.length === 0) this.GetUsers()
            this.setState({Mode: 1})
        }
        this.scroll.current.scrollTop = 0
    }

    async GetUsers() {
        try {
            const resp = await fetch(
                serverPath() + 'api/Users/?page=' + this.state.UserPage.toString(),
                {
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    },
                    credentials: 'include'
                }).then(res => res.json()).catch(null)
            if (resp !== null) {
                if (resp['CODE'] === 'OK') {
                    if (Object.keys(resp['Users']).length > 0) {
                        this.state.Users = this.state.Users.concat(resp['Users'])
                        this.forceUpdate()
                    } else this.state.UserLoad = true
                } else this.state.UserLoad = true
            }else this.state.UserLoad = true
        } catch (e) {
            this.state.UserLoad = true
        }
    }

    async GetGroups() {
        try {
            const resp = await fetch(
                serverPath() + 'api/Groups/?page=' + this.state.GroupPage.toString(),
                {
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    },
                    credentials: 'include'
                }).then(res => res.json()).catch(null)
            if (resp !== null) {
                if (resp['CODE'] === 'OK') {
                    if (Object.keys(resp['Groups']).length > 0) {
                        this.state.Group = this.state.Group.concat(resp['Groups'])
                        this.forceUpdate()
                    } else this.state.GroupLoad = true
                } else this.state.GroupLoad = true
            }else this.state.GroupLoad = true
        } catch (e) {
            
        }
    }

    selectItem(id) {
        if (this.state.Mode === 1) {
            if (this.state.SelectedUsers.includes(id)) {
                this.state.SelectedUsers.splice(
                    this.state.SelectedUsers.indexOf(id),
                    1
                )
            } else {
                this.state.SelectedUsers.push(id)
            }
            this.forceUpdate()
        } else if (this.state.Mode === 2) {
            if (this.state.SelectedGroup.includes(id)) {
                this.state.SelectedGroup.splice(
                    this.state.SelectedGroup.indexOf(id),
                    1
                )
            } else {
                this.state.SelectedGroup.push(id)
            }
            this.forceUpdate()
        }
    }

    showItems() {
        const tab = []
        if (this.state.Mode === 1) {
            if (this.state.Users.length > 0)
            for(let i = 0; i < this.state.Users.length; i++) {
                tab.push(<tr>
                    <th>
                        <div className={'Sharelesson_main_view_table_user_item'}>
                            <div className={'Sharelesson_main_view_table_user_item_image'}>
                                <img src={
                                    this.state.Users[i].Image.replaceAll(" ", "") === '' ?
                                        image : this.state.Users[i].Image
                                }/>
                            </div>
                            <a>{this.state.Users[i].Name + ' ' + this.state.Users[i].Surrname}</a>
                        </div>
                    </th>
                    <th>
                        <label className="ShareLesson_container">
                            <input type="checkbox"  checked={this.state.SelectedUsers.includes(parseInt(this.state.Users[i].ID))}  onClick={(e) => this.selectItem(parseInt(this.state.Users[i].ID))  }/>
                            <span className="ShareLesson_checkmark"></span>
                        </label>
                    </th>
                </tr>)
            }
            else {
                tab.push(<tr colSpan={2}>
                    <th>
                        <div style={{width: "600px"}}  className={'Sharelesson_main_view_table_user_item'}>
                            <a  style={{width: 'fit-content', left: '50%', transform: 'translate(-50%, 0)', top: '0', padding: '0'}}>Brak danych</a>
                        </div>
                    </th>
                </tr>)
            }
        } else {
            if (this.state.Group.length > 0)
            for(let i = 0; i < this.state.Group.length; i++) {
                tab.push(<tr>
                    <th>
                        <div className={'Sharelesson_main_view_table_user_item'}>
                            <div className={'Sharelesson_main_view_table_user_item_image'}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                     className="bi bi-people" viewBox="0 0 16 16">
                                    <path
                                        d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
                                </svg>
                            </div>
                            <a>{this.state.Group[i].Name}</a>
                        </div>
                    </th>
                    <th>
                        <label className="ShareLesson_container">
                            <input type="checkbox"  checked={this.state.SelectedGroup.includes(parseInt(this.state.Group[i].ID))}  onClick={(e) => this.selectItem(parseInt(this.state.Group[i].ID))  }/>
                            <span className="ShareLesson_checkmark"></span>
                        </label>
                    </th>
                </tr>)
            }
            else {
                tab.push(<tr colSpan={2}>
                    <th>
                        <div style={{width: "600px"}}  className={'Sharelesson_main_view_table_user_item'}>
                            <a  style={{width: 'fit-content', left: '50%', transform: 'translate(-50%, 0)', top: '0', padding: '0'}}>Brak danych</a>
                        </div>
                    </th>
                </tr>)
            }
        }
        return tab
    }

    render() {
        return (
            <div className={'Sharelesson_main_view'}>
                <button className={this.state.Mode === 1 ? 'Sharelesson_main_view_bt_selected' : ''}  onClick={this.changeType.bind(this)}>Użytkownicy</button>
                <button className={this.state.Mode === 2 ? 'Sharelesson_main_view_bt_selected' : ''} onClick={this.changeType.bind(this)}>Grupy</button>
                <div className={'Sharelesson_main_view_search'}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                         className="bi bi-search" viewBox="0 0 16 16">
                        <path
                            d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                    </svg>
                    <SerachInput callback={(e) => this.SearchQuery(e)}/>
                </div>
                <table className={'Sharelesson_main_view_table'}>
                    <colgroup>
                        <col span="1" style={{width: "460px"}}/>
                        <col span="1" style={{width: "140px"}}/>
                    </colgroup>
                    <thead>
                        <tr style={{backgroundColor: '#282c34'}}>
                            <th style={{textAlign: 'center', color: 'white'}}>Nazwa</th>
                            <th style={{textAlign: 'center', color: 'white'}}>Dostęp</th>
                        </tr>
                    </thead>
                </table>
                <SimpleBar scrollableNodeProps={{ref:this.scroll}} forceVisible="y"  autoHide={false} style={{width: '100%', maxHeight: '500px', overflowX: 'hidden'}}>
                    {/*<table style={{overflowX: 'hidden'}} className={'Sharelesson_main_view_table'}>*/}
                    <table className={'Sharelesson_main_view_table'}>
                        <colgroup>
                            <col span="1" style={{width: "50%"}}/>
                            <col span="1" style={{width: "50%"}}/>
                        </colgroup>
                        <tbody>
                        {
                            this.showItems()
                        }
                        </tbody>
                    </table>
                </SimpleBar>
            </div>
        )
    }

}