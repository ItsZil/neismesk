import React, { Component } from 'react';

export class DatabaseDemo extends Component {
    static displayName = DatabaseDemo.name;

    constructor(props) {
        super(props);
        this.state = { couriers: [], loading: true };
    }

    componentDidMount() {
        this.populateCourierData();
    }

    static renderCouriersTable(couriers) {
        return (
            <table className="table table-striped" aria-labelledby="tableLabel">
                <thead>
                    <tr>
                        <th>Courier ID</th>
                        <th>Delivery Price</th>
                    </tr>
                </thead>
                <tbody>
                    {couriers.map(courier =>
                        <tr key={courier.courier_id}>
                            <td>{courier.courier_id}</td>
                            <td>{courier.delivery_price}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : DatabaseDemo.renderCouriersTable(this.state.couriers);

        return (
            <div>
                <h1 id="tableLabel">Couriers</h1>
                <p>Database demo to load couriers:</p>
                {contents}
            </div>
        );
    }

    async populateCourierData() {
        const response = await fetch('databasedemo');
        const data = await response.json();
        this.setState({ couriers: data, loading: false });
    }
}
