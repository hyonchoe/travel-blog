import React from 'react'
import { Button, Input, Typography, DatePicker } from 'antd'

class EditTrip extends React.Component {
    initialState = {
        title: '',
        startDate: null,
        endDate: null,
        details: '',
    }
    state = (this.props.editTrip) ? this.props.editTrip : this.initialState

    handleFieldsChanged = event => {
        const { name, value } = event.target
        this.setState({
            [name]: value,
        })
    }
    handleDateFieldsChanged = (dates, datesStrings) => {
        this.setState({
            startDate: dates[0],
            endDate: dates[1],
        })
    }
    submitTrip = () => {
        if (this.props.editTrip){
            this.props.handleUpdate(this.state, this.props.editTripIndex)
            this.setState(this.initialState)
        }
        else{
            this.props.handleSubmit(this.state)
            this.setState(this.initialState)
        }
        
    }

    render() {
        const btnName = (this.props.editTrip) ? "Update" : "Submit"
        
        return (
            <form>
                <Typography.Title>Enter new trip</Typography.Title>
                <EditTripTitle 
                    value={this.state.title}
                    onChange={this.handleFieldsChanged} />
                <EditTripDate
                    startDateValue={this.state.startDate}
                    endDateValue={this.state.endDate}
                    onChange={this.handleDateFieldsChanged} />
                <EditTripDetails
                    value={this.state.details}
                    onChange={this.handleFieldsChanged} />
                <Button type="primary" onClick={this.submitTrip}>{btnName}</Button>
            </form>
        )
    }
}

const EditTripTitle = props => {
    return (
        <div className="titleContainer">
            <label htmlFor="title">Trip Title</label>
            <Input
                type="text"
                name="title"
                id="title"
                value={props.value}
                onChange={props.onChange}/>
        </div>
    )
}
const EditTripDate = props => {    
    return (
        <div className="dateContainer">
            <label htmlFor="date">Date of Trip</label>
            <DatePicker.RangePicker
                name="date"
                id="date"
                allowClear={true}
                value={[props.startDateValue, props.endDateValue]}
                onChange={props.onChange}    
            />
        </div>
    )
}
const EditTripDetails = props => {
    return (
        <div className="detailsContainer">
            <label htmlFor="details">Details</label>
            <Input.TextArea
                name="details"
                id="details"
                value={props.value}
                autoSize={ {minRows:4, maxRows:20} }
                onChange={props.onChange}/>
        </div>
    )
}

export default EditTrip