import React from "react";
import '../styles/calendar_po.css';

export default class Calendar_pop extends React.Component {

    constructor(props) {
        super(props);

        this.MonthNames = {
            0: 'Styczeń',
            1: 'Luty',
            2: 'Marzec',
            3: 'Kwiecień',
            4: 'Maj',
            5: 'Czerwiec',
            6: 'Lipiec',
            7: 'Sierpień',
            8: 'Wrzesień',
            9: 'Październik',
            10: 'Listopad',
            11: 'Grudzien',
        }

        this.state = {
            ActualDay: new Date(),
            SelectedDay: new Date()
        }
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.props.close()
        }
    }

    CallBack(time) {
        if (this.props.onSelect !== undefined) {
            this.props.onSelect(new Date(time.getTime()))
        }
        this.setState({SelectedDay: new Date(time.getTime()) , ActualDay: new Date(time.getTime())})
    }

    HeaderText() {
        return this.MonthNames[this.state.ActualDay.getMonth()] + ' ' + this.state.ActualDay.getFullYear()
    }

    ChangeMonth(direction) {
        // 1 to + al 2 to -

        if (direction === 1) {
            this.state.ActualDay.setMonth(this.state.ActualDay.getMonth() - 1)
        } else {
            this.state.ActualDay.setMonth(this.state.ActualDay.getMonth() + 1)

        }
        this.forceUpdate()
    }

    CreateCalendarDays() {
        const tab = []
        let maxDays = new Date(this.state.ActualDay.getFullYear(), this.state.ActualDay.getMonth() + 1 , 0)
        for(let i = 1; i <= maxDays.getDate(); i++) {
            if (i === 1) {
                let t2 = new Date(maxDays.getFullYear(), maxDays.getMonth() , i)
                for (let x = 1; x < (t2.getDay() === 0 ? 7 : t2.getDay()); x++) {
                    tab.push(<a className={'Calendar_pop_back_body_items Calendar_pop_back_body_items_hidden'}>0</a>)
                }
            }
            tab.push(<a onClick={this.CallBack.bind(this, new Date(maxDays.getFullYear(), maxDays.getMonth(), i))} className={'Calendar_pop_back_body_items'}>{i.toString()}</a>)
        }
        return tab
    }

    render() {
        return (
            <div ref={this.setWrapperRef} className={'Calendar_pop_back'}>
                <div className={'Calendar_pop_back_head'}>
                    <button onClick={this.ChangeMonth.bind(this, 1)} style={{float: 'left', marginLeft: '5px'}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                             className="bi bi-arrow-left-circle" viewBox="0 0 16 16">
                            <path
                                  d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
                        </svg>
                    </button>
                    <a>{this.HeaderText()}</a>
                    <button onClick={this.ChangeMonth.bind(this, 2)} style={{float: 'right', marginRight: '5px'}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                             className="bi bi-arrow-right-circle" viewBox="0 0 16 16">
                            <path
                                  d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
                        </svg>
                    </button>
                </div>
                
                <div className={'Calendar_pop_back_body'}>
                    <a className={'Calendar_pop_back_body_days'}>Pon</a>
                    <a className={'Calendar_pop_back_body_days'}>Wt</a>
                    <a className={'Calendar_pop_back_body_days'}>Śr</a>
                    <a className={'Calendar_pop_back_body_days'}>Czw</a>
                    <a className={'Calendar_pop_back_body_days'}>Pt</a>
                    <a className={'Calendar_pop_back_body_days'}>Sob</a>
                    <a className={'Calendar_pop_back_body_days'}>Nie</a>
                    {
                        this.CreateCalendarDays()
                    }
                </div>
            </div>
        )
    }

}