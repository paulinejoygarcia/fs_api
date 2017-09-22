import React, { Component } from 'react';
import Reactable from 'reactable';
import './stylesheets/reports.css';
const Table = Reactable.Table,
    Tr = Reactable.Tr,
    Td = Reactable.Td;
export default class Reports extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fromDate: moment().format("YYYY-MM-DD"),
            toDate: moment().format("YYYY-MM-DD"),
            search: "",
            loading: false,
            data: [{ id: 1, val: "test" }, { id: 2, val: "test2" }, { id: 3, val: "test", option: "equal" }],
        };
    }

    getData() {
        this.setState({ loading: true });
        let data = {
            from: this.state.fromDate,
            to: this.state.toDate,
            key: this.state.search,
        };
        console.log(data);
        //Todo Get data on server
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        let state = { [name]: value };
        if (name === "toDate")
            if (moment(this.state.fromDate).diff(moment(value), 'days') > 0)
                return Bert.alert("To Date must be greater than to From Date", "danger", "growl-top-right");
        if (name === "fromDate")
            if (moment().diff(moment(value), 'days') < 0)
                return Bert.alert("From Date must be not in future", "danger", "growl-top-right");
            else if (moment().diff(moment(value), 'days') >= 0 && moment(this.state.toDate).diff(moment(value), 'days') < 0)
                state["toDate"] = value;
        this.setState(state, () => {
            this.getData();
        });
    }

    renderDataItem(data) {
        return Object.keys(data).map((key, index) => {
            return (
                <Td key={index} column={key}>
                    {data[key]}
                </Td>
            );
        });
    }

    renderData() {
        return this.state.data.map((data, index) => {
            return (
                <Tr key={index}>
                    {this.renderDataItem(data)}
                </Tr>
            );
        });
    }

    render() {
        return (
            <div className="container">
                <div className="row mb10">
                    <h2>{this.props.title || "Reports"}</h2>
                </div>
                <div className="row reports-header mb10">
                    <form onSubmit={() => {
                        this.getData()
                    }} className="col-md-12">
                        <div className="col-md-3">
                            <div className="col-md-2 label-beside">
                                From:
                            </div>
                            <div className="col-md-10">
                                <input type="date" name="fromDate" onChange={this.handleChange.bind(this)}
                                       value={this.state.fromDate} className="form-control"/>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="col-md-2 label-beside">
                                To:
                            </div>
                            <div className="col-md-10">
                                <input type="date" name="toDate" onChange={this.handleChange.bind(this)}
                                       value={this.state.toDate} className="form-control"/>
                            </div>
                        </div>
                        <div className="col-md-3 col-md-offset-3">
                            <div className="input-group stylish-input-group">
                                <input type="text" value={this.state.search} name="search"
                                       onChange={this.handleChange.bind(this)} className="form-control"
                                       placeholder="Search"/>
                                <span className="input-group-addon">
                                <button type="submit">
                                    <span className="glyphicon glyphicon-search"/>
                                </button>
                            </span>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="row mb10">
                    {!this.state.loading ?
                        <Table className="table table-hover table-bordered table-responsive" itemsPerPage={20}
                               sortable={true} pageButtonLimit={5}>
                            {this.renderData()}
                        </Table> :
                        <div className="text-center mt20">
                            <i className="fa fa-2x fa-spin fa-circle-o-notch"/>
                        </div>
                    }
                </div>
            </div>
        );
    }
}