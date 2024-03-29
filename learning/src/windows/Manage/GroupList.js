import React, {useEffect, useState} from "react";
import '../../styles/Manage/UsersList.css';
import logo from '../../images/user.jpg';
import serverPath from "../../utilis/server-path";
import SelectUsers from "./SelectUsers";

import { toast } from 'react-toastify';


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
        <input id={'ListUsers_search'} type={'text'} placeholder={'Szukaj'} onChange={(e) => SetQuery(e.target.value)}/>
    )

}

export default class GroupList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            UserLoad: false,
            Users: [],
            PopState: 0,
            query_serach: '',
            SearchingMode: false,
            PageLoad: 1,
            SelectedID: 0,
            loadedValues: {
                Name: '',
                Users: []
            },
            Output: {
                Name: '',
                Users: []
            }
        }


        this.onBottom = this.onBottomEvent.bind(this)

    }

    refreshData() {
        this.setState({
            UserLoad: false,
            Users: [],
            PopState: 0,
            query_serach: '',
            SearchingMode: false,
            PageLoad: 1,
            SelectedID: 0,
            loadedValues: {
                Name: '',
                Users: []
            },
            Output: {
                Name: '',
                Users: []
            }
        })
        this.getData()
    }

    componentDidMount() {
        this.getData()
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

    onBottomEvent(e) {
        if (e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight)
        {
            if (!this.state.UserLoad) {
                this.state.PageLoad += 1
                if (!this.state.SearchingMode)
                    this.getData()
                else this.Searching()
            }
        }
    }

    SearchQuery(query) {
        if (!!query) {
            this.state.PageLoad = 1
            this.state.query_serach = query
            this.state.Users = []
            this.state.UserLoad = false
            this.state.SearchingMode = true
            this.Searching()
        } else {
            this.state.SearchingMode = false
            this.state.PageLoad = 1
            this.state.Users = []
            this.state.UserLoad = false
            this.getData()
        }
    }

    async Searching() {
        try {
            const resp = await fetch(serverPath() + 'api/Groups/Search.php?page='+ this.state.PageLoad.toString() +'&query=' + encodeURIComponent(this.state.query_serach)
                , {
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    },
                    credentials: 'include'
                }).then(e => e.json()).catch(null)

            if (resp !== null) {
                if (resp['CODE'] === 'OK') {
                    if (Object.keys(resp['Groups'] ).length > 0) {
                        this.state.Users = this.state.Users.concat(resp['Groups'])
                    } else this.state.UserLoad = true
                } else this.state.UserLoad = true
                this.forceUpdate()
            }
        }
        catch (e) {

        }
    }

    async getData() {
        try {
            const resp = await fetch(serverPath() + 'api/Groups/?page=' + this.state.PageLoad.toString(), {
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                credentials: 'include'
            }).then(e => e.json()).catch(null)

            if (resp !== null) {
                if (resp['CODE'] === 'OK') {
                    if (Object.keys(resp['Groups']).length > 0) {
                        this.state.Users = this.state.Users.concat(resp['Groups'])
                        // this.state.PageLoad += 1
                        this.forceUpdate()
                    } else this.state.UserLoad = true
                } else this.state.UserLoad = true
            }else this.state.UserLoad = true
        } catch (e) {
            this.state.UserLoad  = true
        }
    }

    closePop() {
        if (this.state.PopState > 0) {
            this.state.PopState = 0
            this.forceUpdate()
        }
    }

    editUser(id, name) {
        this.state.SelectedID = id
        this.state.loadedValues.Name = name
        const getInfoUser = async (id) => {
            try {
                const resp = await fetch(serverPath() + 'api/Groups/manage.php?ID=' + id.toString(), {
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    },
                    credentials: 'include'
                }).then(e => e.json()).catch(null)

                if (resp !== null) {
                    if (resp['CODE'] === 'OK') {
                        if (Object.keys(resp['Users']).length > 0) {
                            this.state.loadedValues.Users = resp['Users']
                            return true
                        } else return false
                    } else return false
                }else return false
            } catch (e) {
                return false
            }
        }

        if (this.state.PopState === 0) {
            getInfoUser(id).then((resp) => {
                if (resp) {
                    this.state.PopState = 2
                    this.forceUpdate()
                }
            })
        }
    }

    async removeUser() {
        try {

            const resp = await fetch(
                serverPath() + 'api/Groups/remove.php?ID=' + this.state.SelectedID.toString(),
                {
                    method:"GET",
                    headers: {
                        'Access-Control-Allow-Origin':'*',
                        // 'Content-Type': 'multipart/form-data'
                    },
                    credentials: 'include'
                }
            ).then(se => se.json()).catch(null)

            if (resp !== null && resp['CODE'] === 'OK') {
                toast.success('Pomyślnie usunięto grupę!', {closeOnClick: true, theme: 'colored'})
                // this.state.PopState = 1
                this.refreshData()
                this.forceUpdate()
            } else {
                toast.error('Wystąpił błąd!', {closeOnClick: true, theme: 'colored'})
                this.refreshData()
                this.forceUpdate()
            }


        } catch (e) {
            toast.error('Wystąpił błąd!', {closeOnClick: true, theme: 'colored'})
            this.refreshData()
            this.forceUpdate()
        }
    }

    remove_User(id) {
        if (this.state.PopState === 0) {
            this.state.SelectedID = id
            this.state.PopState = 1
            this.forceUpdate()
        }

    }

    openPop() {
        if (this.state.PopState === 0) {
            this.state.PopState = 3
            this.forceUpdate()
        }
    }

    renderData() {
        const tab = []
        if (this.state.Users.length > 0) for (let i = 0; i < this.state.Users.length; i++) {
            tab.push(
                <tr>
                    <th>
                        <a>{this.state.Users[i].ID}</a>
                    </th>
                    <th>
                        <div className={'User_list_view_mian_body_table_image_user'}>
                            {/*<div className={'User_list_view_mian_body_table_image_user_img'}>*/}
                            {/*    <img src={logo}/>*/}
                            {/*</div>*/}
                            <a>{this.state.Users[i].Name }</a>
                        </div>
                    </th>
                    {/*<th>*/}
                    {/*    <a>{this.ranks[this.state.Users[i].Type]}</a>*/}
                    {/*</th>*/}
                    <th>
                        <button onClick={this.editUser.bind(this, this.state.Users[i].ID, this.state.Users[i].Name)}>
                            Edytuj
                        </button>
                        <button onClick={this.remove_User.bind(this,this.state.Users[i].ID)}>
                            Usuń
                        </button>
                    </th>
                </tr>
            )
        }
        else tab.push(
            <tr>
                <th colSpan={'3'}>
                    <h2>
                        Brak wyników!
                    </h2>
                </th>
            </tr>
        )
        return tab
    }

    async CreateUser() {
        try {
            const resp = await fetch(
                serverPath() + 'api/Groups/create.php',
                {
                    method:"POST",
                    headers: {
                        'Access-Control-Allow-Origin':'*',
                        // 'Content-Type': 'multipart/form-data'
                    },
                    body: JSON.stringify(this.state.Output),
                    credentials: 'include'
                }
            ).then(se => se.json()).catch(null)
            if (resp !== null) {
                if (resp['CODE'] === 'OK') {
                    toast.success('Pomyślnie stworzono nową grupę', {closeOnClick: true, theme: 'colored'})
                } else {
                    toast.error('Wystąpił błąd podczas tworzenia grupy', {closeOnClick: true, theme: 'colored'})
                }
                this.refreshData()
                this.closePop()
            } else {
                toast.error('Wystąpił błąd podczas tworzenia grupy', {closeOnClick: true, theme: 'colored'})
                this.refreshData()
                this.closePop()
            }
        } catch (e) {
            toast.error('Wystąpił błąd podczas tworzenia grupy', {closeOnClick: true, theme: 'colored'})
            this.refreshData()
            this.closePop()
        }
    }

    async UpdateUser() {
        try {
            const resp = await fetch(
                serverPath() + 'api/Groups/edit.php',
                {
                    method:"POST",
                    headers: {
                        'Access-Control-Allow-Origin':'*',
                        // 'Content-Type': 'multipart/form-data'
                    },
                    body: JSON.stringify({...this.state.loadedValues, ID: this.state.SelectedID}),
                    credentials: 'include'
                }
            ).then(se => se.json()).catch(null)
            if (resp !== null) {
                if (resp['CODE'] === 'OK') {
                    toast.success('Pomyślnie zakutalizowano grupę', {closeOnClick: true, theme: 'colored'})
                } else {
                    toast.error('Wystąpił błąd podczas aktualizacjii grupy', {closeOnClick: true, theme: 'colored'})
                }
                this.refreshData()
                this.closePop()
            } else {
                toast.error('Wystąpił błąd podczas aktualizacjii grupy', {closeOnClick: true, theme: 'colored'})
                this.refreshData()
                this.closePop()
            }
        } catch (e) {
            toast.error('Wystąpił błąd podczas aktualizacjii grupy', {closeOnClick: true, theme: 'colored'})
            this.refreshData()
            this.closePop()
        }
    }

    PopWindows() {
        if (this.state.PopState === 1) {
            return (
                <div className={'User_list_view_mian_pop_back'}>
                    <div className={'User_list_view_mian_pop'} style={{height: '200px'}}>
                        <h2>Czy na pewno chcesz usunąć tą grupę?</h2>
                        <div className={'User_list_view_mian_pop_buttons'}>
                            <button onClick={this.closePop.bind(this)}>Nie</button>
                            <button onClick={this.removeUser.bind(this)}>Tak</button>
                        </div>
                    </div>
                </div>
            )
        }
        else if (this.state.PopState === 2) {
            return (
                <div className={'User_list_view_mian_pop_back'}>
                    <div className={'User_list_view_mian_pop'} style={{height: '500px' }}>
                        <h2>Edycja grupy</h2>
                        <div className={'User_list_view_mian_pop_body'}>
                            <label>
                                Nazwa grupy
                            </label>
                            <input type={"text"} defaultValue={this.state.loadedValues.Name} onChange={e => {
                                this.state.loadedValues.Name = e.target.value
                            }}/>
                            <SelectUsers users={this.state.loadedValues.Users} style={{width: 'unset'}}/>
                        </div>
                        <div className={'User_list_view_mian_pop_buttons'}>
                            <button onClick={this.closePop.bind(this)}>zamknij</button>
                            <button onClick={this.UpdateUser.bind(this)}>zapisz</button>
                        </div>
                    </div>
                </div>
            )
        }
        else if (this.state.PopState === 3) {
            return (
                <div className={'User_list_view_mian_pop_back'}>
                    <div className={'User_list_view_mian_pop'} style={{height: '500px' }}>
                        <h2>Stwórz grupę</h2>
                        <div className={'User_list_view_mian_pop_body'}>
                            <label>
                                Nazwa grupy
                            </label>
                            <input type={"text"} placeholder={'Imie'} onChange={e => this.state.Output.Name = e.target.value}/>
                            <SelectUsers users={this.state.Output.Users} style={{width: 'unset'}}/>

                        </div>
                        <div className={'User_list_view_mian_pop_buttons'}>
                            <button onClick={this.closePop.bind(this)}>zamknij</button>
                            <button onClick={this.CreateUser.bind(this)}>stwórz</button>
                        </div>
                    </div>
                </div>
            )
        }
    }

    render() {
        return (
            <div className={'User_list_view_mian'}>

                {
                    this.state.PopState > 0 && this.PopWindows()
                }
                <div className={'User_list_view_headbar'}>
                    <h1>Grupy</h1>
                    <button id={'User_list_view_headbar_add_user'} onClick={this.openPop.bind(this)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             className="bi bi-person-plus-fill" viewBox="0 0 16 16">
                            <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                            <path fill-rule="evenodd"
                                  d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"/>
                        </svg>
                        Dodaj grupę
                    </button>
                    <div className={'UserList_main_view_search'}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                             className="bi bi-search" viewBox="0 0 16 16">
                            <path
                                d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                        </svg>
                        <SerachInput callback={(e) => this.SearchQuery(e)}/>
                    </div>
                </div>
                <div className={'User_list_view_mian_body'}>
                    <table className={'User_list_view_mian_body_table'}>
                        <thead>
                        <tr >
                            <th style={{width: '5%', whiteSpace: 'nowrap'}} >ID</th>
                            <th>Nazwa</th>
                            {/*<th style={{width: '200px'}}>Typ</th>*/}
                            <th style={{width: '300px'}}/>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            this.renderData()
                        }
                        </tbody>

                    </table>
                    <div id={'User_list_view_mian_body_end'}>

                    </div>
                </div>
            </div>
        )
    }

}