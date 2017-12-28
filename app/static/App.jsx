class App extends React.Component {
    constructor() {
        super()
        this.state = {
            inputs: [],
        }
    }

    render() {
        return (
            <div className="container">
                <h3 className="title">Equivtracker</h3>
                <p>Lorem ipsum dolor sit ahmet mehmet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <div className="has-text-centered" style={{padding: 20}}>
                    <span className="icon" style={{ marginRight: 20 }}><i className="fa fa-dollar-sign fa-2x"></i></span>
                    <span className="icon" style={{ marginRight: 20 }}><i className="fab fa-ethereum fa-2x"></i></span>
                    <span className="icon"><i className="fab fa-bitcoin fa-2x"></i></span>
                </div>
                <div className="columns">
                    <div className="column">
                        <table className="table is-fullwidth">
                            <thead>
                                <tr>
                                    <th><abbr title="Symbol of Crypto Currency">Currency</abbr></th>
                                    <th>Amount</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>

                            </tbody>
                        </table>
                    </div>
                    <div className="column">

                    </div>
                </div>
            </div>
        )
    }
}


ReactDOM.render(<App />, document.getElementById('app'))