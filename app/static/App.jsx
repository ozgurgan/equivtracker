
// ==================================================
// Poor Man's Almost-Global State Manager Starts Here
// --------------------------------------------------
// Didn't want to use redux just for grand total calculation.
// Remember -> https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367
// ==================================================
class Store {
    constructor(app) {
        this.app = app
    }

    getPrices = () => {
        return this.app.state.prices
    }

    getSymbols = () => {
        if (!this.app.state.prices.length) return []
        return this.app.state.prices.map(elm => elm.symbol)
    }

    update = (id, value = 0.00) => {
        const existing = this.app.state.totals.filter(elm => elm.id == id)
        if (existing.length < 1) {
            this.app.setState({
                totals: [...this.app.state.totals, { id: id, value: value }]
            })
        } else {
            this.app.setState({
                totals: this.app.state.totals.map(elm => elm.id == id ? Object.assign({}, elm, { value: value }) : elm)
            }, () => {
                this.app.setState({ grandTotal: this.getTotal() })
            })
        }
    }

    remove = (id) => {
        const newTotals = this.app.state.totals.filter(elm => elm.id !== id)
        const newInputs = this.app.state.inputs.filter(e => e.props.id !== id)
        this.app.setState({
            totals: newTotals,
            inputs: newInputs
        }, () => { 
            this.app.setState({grandTotal: this.getTotal() })
        })
    }

    getTotal = () => {
        if (!this.app.state.totals.length) return 0.00
        const totals = this.app.state.totals.map(e => Number(e.value))
        return Number((totals.reduce((sum, x) => sum + x)).toFixed(3))
    }
}
// ==================================================
// Poor Man's Almost-Global State Manager Ends Here :o
// ==================================================

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            prices: [],
            inputs: [],
            totals: [],
            grandTotal: 0.00

        }
        this.store = new Store(this) // Initialise our global state here.
    }
    componentDidCatch(error, info) {
        console.log(error, info)
    }

    onAddNewAsset = () => {
        let time = new Date().getTime()
        this.setState({
            inputs: [...this.state.inputs,
            (<Row key={time} id={time} store={this.store} />)]
        })
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

                let time = new Date().getTime()
                this.setState({
                    prices: data,
                    loading: false,
                    inputs: [(<Row key={time} id={time} store={this.store} />)]
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
                {this.state.loading ?
                    (<div className="has-text-centered" style={{ padding: 50 }}>
                        <span className="icon"><i className="fas fa-crosshairs fa-7x fa-spin"></i></span>
                        <p style={{ marginTop: 20 }}>Currency Data Loading...</p>
                    </div>
                    )
                    :
                    (<div className="columns">

                        <div className="column">

                            <div>
                                <table className="table is-fullwidth">
                                    <thead>
                                        <tr>
                                            <th><abbr title="Symbol of Crypto Currency">Currency</abbr></th>
                                            <th>Current Value</th>
                                            <th>Amount</th>
                                            <th>Total</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.inputs}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td>Grand Total</td>
                                            <td className="is-warning"><b>{this.state.grandTotal || '-'}</b></td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>
                                <a className={"button is-small is-info " + (this.state.loading ? "is-disabled" : null)} onClick={this.onAddNewAsset}>
                                    <span className="icon is-small">
                                        <i className="fa fa-plus"></i>
                                    </span>
                                    <span>Add New Asset</span>
                                </a>
                            </div>
                        </div>
                        <div className="column">
                        </div>
                    </div>)}
            </div>
        )
    }
}



class Row extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            symbol: '',
            suggestions: [],
            currValue: 0.00,
            amount: 1,
            total: 0.00,
            showInUSD: false
        }
        props.store.update(props.id)

        this.onChange = this.onChange.bind(this)
        this.onChangeAmount = this.onChangeAmount.bind(this)
    }
    componentDidCatch(error, info) {
        console.log(info)
    }

    remove = () => {
        const ask = confirm('This will delete this row. R u sure ?')
        if (!ask) return false
        this.props.store.remove(this.props.id)
    }

    reset = () => {
        this.setState({
            symbol: '',
            suggestions: [],
            currValue: 0.00,
            amount: 1,
            total: 0.00,
            showInUSD: false
        })
        this.props.store.update(this.props.id, 0.00)
    }

    onChangeAmount(event) {
        if (!this.state.symbol) return false
        const amount = event.target.value
        if (amount < 0 || isNaN(amount)) return false
        const totalVal = Number((this.state.currValue * amount).toFixed(4))
        this.setState({
            amount: amount,
            total: totalVal
        }, () => {
            this.props.store.update(this.props.id, totalVal)
        })

    }

    onResultCurrencyChange = (event) => {
        if (!this.state.symbol) return false
        const val = this.props.store.getPrices().find(e => e.symbol === this.state.symbol)
        if (!val) return false
        let last3Chars = val.symbol.substr(-3)
        let totalValue
        let showInUSD = !this.state.showInUSD

        if (last3Chars == 'BTC' && showInUSD) {
            const btcVal = this.props.store.getPrices().find(e => e.symbol === 'BTCUSDT')
            totalValue = Number((btcVal.price * this.state.total).toFixed(4))
        } else if (last3Chars == 'ETH' && showInUSD) {
            const ethVal = this.props.store.getPrices().find(e => e.symbol === 'ETHUSDT')
            totalValue = Number((ethVal.price * this.state.total).toFixed(4))
        } else {
            totalValue = Number((val.price * this.state.amount).toFixed(4))
            showInUSD = false
        }

        this.setState({ 
            showInUSD: showInUSD,
            total: totalValue
        }, () => this.props.store.update(this.props.id, totalValue) )
    }
    
    onChange(event, suggest ) {
        const symbol = event.target.value || suggest.newValue
        const val = this.props.store.getPrices().find(e => e.symbol === symbol)
        let totalValue
        if (!val || isNaN(this.state.amount)) {
            totalValue = 0.00
        } else {
            totalValue = Number((val.price * this.state.amount).toFixed(4))
        }
        this.setState({
            symbol: symbol,
            currValue: val ? Number(val.price) : 0.00,
            total: totalValue
        }, () => {
            if (!val) return false
            this.props.store.update(this.props.id, totalValue)
        })
    }
    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            suggestions: this.getSuggestions(value)
        });
    };

    // Teach Autosuggest how to calculate suggestions for any given input value.
    getSuggestions = value => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        return inputLength === 0 ? [] : this.props.store.getSymbols().filter(symbol =>
            symbol.toLowerCase().slice(0, inputLength) === inputValue
        );
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };
    render() {
        // Autosuggest will pass through all these props to the input.
        const inputProps = {
            placeholder: 'ETHUSDT',
            value: this.state.symbol,
            onChange: this.onChange
        };
        const renderSuggestion = (suggestion) => <div>{suggestion}</div>
        const getSuggestionValue = suggestion => suggestion;
        return (
            <tr>
                <td><Autosuggest
                    suggestions={this.state.suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                /></td>
                <td>{this.state.currValue}</td>
                <td><input style={{ width: 50, height: 30 }} type="text" value={this.state.amount} onChange={this.onChangeAmount} placeholder="0.5" /></td>
                <td>{this.state.total}</td>
                <td>
                    <button className={'icon ' + (this.state.showInUSD ? " has-text-success " : null)} onClick={this.onResultCurrencyChange}>
                        <i className="fas fa-dollar-sign fa-lg"></i>
                    </button>
                    <button className="icon has-text-danger"  onClick={this.remove}>
                        <i className="fas fa-times fa-lg"></i>
                    </button>
                    <button className="icon has-text-info" onClick={this.reset}>
                        <i className="fas fa-eraser fa-lg"></i>
                    </button>
                </td>
            </tr>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'))