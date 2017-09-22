import React, { Component } from 'react';
import Reactable from 'reactable';
import './stylesheets/reports.css';
export default class Reports extends Component {
    render() {
        let Table = Reactable.Table,
            Tr = Reactable.Tr,
            Td = Reactable.Td;
        return (
            <div className="container">
                <div className="row mb10">
                    <h2>{this.props.title || "Reports"}</h2>
                </div>
                <div className="row reports-header mb10">
                    <div className="col-md-12">
                        <div className="col-md-3">
                            <div className="col-md-2 label-beside">
                                From:
                            </div>
                            <div className="col-md-10">
                                <input type="date" className="form-control"/>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="col-md-2 label-beside">
                                To:
                            </div>
                            <div className="col-md-10">
                                <input type="date" className="form-control"/>
                            </div>
                        </div>
                        <div className="col-md-3 col-md-offset-3">
                            <div className="input-group stylish-input-group">
                                <input type="text" className="form-control" placeholder="Search"/>
                                <span className="input-group-addon">
                                <button type="submit">
                                    <span className="glyphicon glyphicon-search"/>
                                </button>
                            </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mb10">
                    <Table className="table table-hover table-bordered table-responsive" itemsPerPage={20}
                           sortable={true} pageButtonLimit={5}>
                        <Tr>
                            <Td column="Td1">Tr1-1</Td>
                            <Td column="Td2">Tr1-2</Td>
                            <Td column="Td3">Tr1-3</Td>
                        </Tr>
                    </Table>
                </div>
            </div>
        );
    }
}