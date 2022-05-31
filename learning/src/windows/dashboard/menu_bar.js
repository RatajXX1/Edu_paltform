import React from "react";
import '../../styles/menu_bar.css';
import {Link} from "react-router-dom";
import serverPath from "../../utilis/server-path";
import SimpleBar from "simplebar-react";
import 'simplebar/dist/simplebar.min.css';

class Menu_bar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            mobile_view: false,
            Groups: [],
            PageGroups: 0,
            CanLoadGroups: false,
        }
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
        this.bindOpenMobile()
        window.addEventListener('resize', () => {
            if (this.state.mobile_view) {
                this.state.mobile_view = false
                this.forceUpdate()
            }
        })
        this.GetGroups()
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    async GetGroups() {
        try {
            const resp = await fetch(
                serverPath() + `api/Groups/Ugroup.php?page=${this.state.PageGroups}`,
                {
                    method: 'GET',
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    },
                    credentials: 'include'
                }
            ).then(sx => sx.json()).catch(null)

            if (resp !== null) {
                if (resp['CODE'] === 'OK') {
                    this.state.Groups = this.state.Groups.concat(resp['Groups'])
                    if (Object.entries(resp['Groups']).length >= 25) this.state.CanLoadGroups = true
                    this.forceUpdate()
                }
            }


        } catch (e) {

        }
    }

    renderGroups() {
        const tab = []
        // for (let i = 0; i < this.state.Groups.length; i++) {
        for (let i = 0; i < this.state.Groups.length; i++) {
            tab.push(
                <li className={'Menu_bar_main_item'}>
                    <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25"><path id="Group_People" data-name="Group People" d="M16.75,19H16v5.5a.5.5,0,0,1-.5.5h-6a.5.5,0,0,1-.5-.5V19H8.25A1.25,1.25,0,0,1,7,17.75v-3.5a4.25,4.25,0,0,1,3.23-4.11,3.5,3.5,0,1,1,4.55,0A4.25,4.25,0,0,1,18,14.25v3.5A1.25,1.25,0,0,1,16.75,19ZM6,17.75v-3.5A5.23,5.23,0,0,1,8.6,9.73a4.27,4.27,0,0,1-.41-3.45,4.39,4.39,0,0,0-.43-.14,3.5,3.5,0,1,0-4.55,0A4.25,4.25,0,0,0,0,10.25v3.5A1.25,1.25,0,0,0,1.24,15H2v5.5a.5.5,0,0,0,.5.5h5a.5.5,0,0,0,.5-.5V20A2.25,2.25,0,0,1,6,17.75ZM21.77,6.14a3.5,3.5,0,1,0-4.54,0,4.32,4.32,0,0,0-.42.14,4.27,4.27,0,0,1-.41,3.45A5.23,5.23,0,0,1,19,14.25v3.5A2.25,2.25,0,0,1,17,20v.51a.5.5,0,0,0,.5.5h5a.5.5,0,0,0,.5-.5V15h.75A1.25,1.25,0,0,0,25,13.75v-3.5A4.25,4.25,0,0,0,21.77,6.14Z"/></svg>
                    <div className={'Menu_bar_main_item_bts'}>
                        <Link to={'/main/lessonsGroup?ID=' + this.state.Groups[i].GID} >
                            {
                                this.state.Groups[i].Gname
                            }

                        </Link>
                    </div>
                </li>
            )
        }
        return tab
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target) && !document.querySelector('.head_bar_main').contains(event.target)) {
            if (this.state.mobile_view) {
                this.state.mobile_view = false
                this.forceUpdate()
            }
        }
    }

    bindOpenMobile() {
        if (this.props.mobileBt !== undefined) {
            document.querySelector(this.props.mobileBt)
                .addEventListener('click', () => {
                    if (this.state.mobile_view) {
                        this.state.mobile_view = false
                        this.forceUpdate()
                    } else {
                        this.state.mobile_view = true
                        this.forceUpdate()
                    }
                })
        }
    }

    show_options(id) {
        // console.log(id)
        if (document.querySelector(id).style.display == '') {
            document.querySelector(id).style.display = 'none'
            document.querySelector(id + '_button').style.transform = ''
            document.querySelector(id + '_button').style.top = ''
            document.querySelector(id + '_button').style.left = ''
        }
        else {
            document.querySelector(id).style.display = ''
            document.querySelector(id + '_button').style.transform = 'scale(-1)'
            document.querySelector(id + '_button').style.top = '-1px'
            document.querySelector(id + '_button').style.left = '-1px'
        }

    }

    render() {
        return (
            <div ref={this.setWrapperRef} className={this.state.mobile_view ? 'Menu_bar_main Menu_bar_mobile' : 'Menu_bar_main' } >
                <SimpleBar forceVisible="y" autoHide={false} style={{width: '99%', height: '99%'}}>
                    <ul>
                        <li className={'Menu_bar_main_item'} >
                            <div className={'Menu_bar_main_item_bts'}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                     className="bi bi-person-lines-fill" viewBox="0 0 16 16">
                                    <path
                                        d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2z"/>
                                </svg>
                                {/*<a>Dashboard</a>*/}
                                <Link to={"/main/dashboard"}>Dashboard</Link>
                            </div>

                        </li>
                        {
                            parseInt(this.props.User_data.Rank_type) >= 3 &&
                            <li className={'Menu_bar_main_item'}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                     className="bi bi-gear" viewBox="0 0 16 16">
                                    <path
                                        d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
                                    <path
                                        d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
                                </svg>
                                <div className={'Menu_bar_main_item_bts'}
                                     onClick={this.show_options.bind(this, '#Menage_select')}>
                                    <a>Zarządzaj</a>
                                    <button className={'Menu_bar_main_item_show_more'}>
                                        <svg id={'Menage_select_button'} xmlns="http://www.w3.org/2000/svg" width="16"
                                             height="16"
                                             viewBox="0 0 16 16">
                                            <path
                                                d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                                        </svg>
                                    </button>
                                </div>
                            </li>
                        }
                        {
                            parseInt(this.props.User_data.Rank_type) >= 3 &&
                            <ul id={'Menage_select'} className={'additional_list'} style={{display: 'none'}}>
                                <li>
                                    <Link to={'/admin/users'}>Użytkownicy</Link>
                                </li>
                                <li>
                                    <Link to={'/admin/groups'}>Grupy</Link>
                                </li>
                                {/*<li>*/}
                                {/*    <Link to={'/'}>Lekcje</Link>*/}
                                {/*</li>*/}
                            </ul>
                        }
                        {
                            parseInt(this.props.User_data.Rank_type) >= 2 &&
                            <li className={'Menu_bar_main_item'}>
                                <div className={'Menu_bar_main_item_bts'}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                         className="bi bi-file-earmark-plus" viewBox="0 0 16 16">
                                        <path
                                            d="M8 6.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V11a.5.5 0 0 1-1 0V9.5H6a.5.5 0 0 1 0-1h1.5V7a.5.5 0 0 1 .5-.5z"/>
                                        <path
                                            d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
                                    </svg>
                                    {/*<a>Wszystkie lekcje</a>*/}
                                    <Link to={'/main/createlesson'}>Stwórz lekcje</Link>
                                </div>
                            </li>
                        }
                        {
                            parseInt(this.props.User_data.Rank_type) >= 2 &&
                            <li className={'Menu_bar_main_item'}>
                                <div className={'Menu_bar_main_item_bts'}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                         className="bi bi-inboxes-fill" viewBox="0 0 16 16">
                                        <path
                                            d="M4.98 1a.5.5 0 0 0-.39.188L1.54 5H6a.5.5 0 0 1 .5.5 1.5 1.5 0 0 0 3 0A.5.5 0 0 1 10 5h4.46l-3.05-3.812A.5.5 0 0 0 11.02 1H4.98zM3.81.563A1.5 1.5 0 0 1 4.98 0h6.04a1.5 1.5 0 0 1 1.17.563l3.7 4.625a.5.5 0 0 1 .106.374l-.39 3.124A1.5 1.5 0 0 1 14.117 10H1.883A1.5 1.5 0 0 1 .394 8.686l-.39-3.124a.5.5 0 0 1 .106-.374L3.81.563zM.125 11.17A.5.5 0 0 1 .5 11H6a.5.5 0 0 1 .5.5 1.5 1.5 0 0 0 3 0 .5.5 0 0 1 .5-.5h5.5a.5.5 0 0 1 .496.562l-.39 3.124A1.5 1.5 0 0 1 14.117 16H1.883a1.5 1.5 0 0 1-1.489-1.314l-.39-3.124a.5.5 0 0 1 .121-.393z"/>
                                    </svg>
                                    {/*<a>Wszystkie lekcje</a>*/}
                                    <Link to={'/main/createdLesson'}>Stworzone lekcje</Link>
                                </div>
                            </li>
                        }
                        <li className={'Menu_bar_main_item'} >
                            <div className={'Menu_bar_main_item_bts'}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                     className="bi bi-mortarboard" viewBox="0 0 16 16">
                                    <path
                                        d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917l-7.5-3.5ZM8 8.46 1.758 5.965 8 3.052l6.242 2.913L8 8.46Z"/>
                                    <path
                                        d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466 4.176 9.032Zm-.068 1.873.22-.748 3.496 1.311a.5.5 0 0 0 .352 0l3.496-1.311.22.748L8 12.46l-3.892-1.556Z"/>
                                </svg>
                                {/*<a>Wszystkie lekcje</a>*/}
                                <Link to={'/main/lessons'}>Wszystkie lekcje</Link>
                            </div>

                        </li>
                        {
                            this.renderGroups()
                        }
                    </ul>
                </SimpleBar>
            </div>
        )
    }

}

export default Menu_bar;