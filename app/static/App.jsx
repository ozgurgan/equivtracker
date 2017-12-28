class App extends React.Component {
    constructor() {
        super()
        this.state = {
            loading: true,
            prices: [],
            symbols: [],
            inputs: []
        }
        this.onAddNewAsset = this.onAddNewAsset.bind(this)
    }
    onAddNewAsset() {
        this.setState({inputs: [...this.state.inputs,
        (<Row key={new Date().getTime()} prices={this.state.prices} symbols={this.state.symbols} />)]})
    }
    componentDidMount() {
        fetch('/_get_json')
            .then(resp => {
                return resp.json()
            })
            .then(data => {
                if (!data || data.length < 1) {
                    alert('Error while fetching currencies.')
                    return;
                }
                this.setState({
                    prices: data,
                    loading: false,
                    symbols: data.map(elm => { return elm.symbol })
                })
            })
    }

    render() {
        return (
            <div className="container">
                <h3 className="title">Equivtracker</h3>
                <p>Lorem ipsum dolor sit ahmet mehmet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <div className="has-text-centered" style={{ padding: 20 }}>
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
                                    <th>Current Value</th>
                                    <th>Amount</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.inputs}
                            </tbody>
                        </table>
                        <a className={"button is-small is-info " + (this.state.loading ? "is-loading is-disabled" : null)} onClick={this.onAddNewAsset}>
                            <span className="icon is-small">
                                <i className="fa fa-plus"></i>
                            </span>
                            <span>Add New Asset</span>
                        </a>
                    </div>
                    <div className="column">

                    </div>
                </div>
            </div>
        )
    }
}

class Row extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            symbol: '',
            currValue: 0.00,
            amount: 0.00,
        }
        this.onChange = this.onChange.bind(this)
        this.onChangeAmount = this.onChangeAmount.bind(this)
    }

    onChangeAmount(event) {
        if (!this.state.symbol) return false
        console.log('aaaa')
        const amount = event.target.value
        if (amount < 0 || isNaN(amount)) return false
        this.setState({
            amount: amount
        })
    }
    onChange(event) {
        const symbol = event.target.value;
        const val = this.props.prices.find(e => e.symbol === symbol)
        this.setState({
          symbol: symbol,
          currValue: val ? Number(val.price) : 0.00
        });
    }

    render() {
        return (
            <tr>
                <td><input style={{ width:100 }} type="text" onChange={this.onChange} value={this.state.symbol} /></td>
                <td>{this.state.currValue}</td>
                <td><input style={{ width:50 }}  type="text" value={this.state.amount} onChange={this.onChangeAmount} /></td>
                <td>{(this.state.currValue * Number(this.state.amount)).toFixed(6)}</td>
            </tr>
        )
    }
}


ReactDOM.render(<App />, document.getElementById('app'))