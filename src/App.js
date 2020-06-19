import React, { Component, Fragment } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button, Modal, Form, Input, TextArea, Select, Dropdown } from 'semantic-ui-react';
var transactionOptions = [
  { value: 'Debit' },
  { value: 'Credit' }
];
transactionOptions = transactionOptions.map(t => { return { ...t, key: t.value, text: t.value } });
function Header({ showForm }) {
  return (<Fragment>
    <tr>
      <th>Office Transaction</th>
      <th></th>
      <th></th>
      <th></th>
      <th onClick={showForm} title="Add transaction" className="add-btn">+Add Transaction</th>
    </tr>
    <tr style={{ height: "30px" }}>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
    <tr>
      <th>Date</th>
      <th>Description</th>
      <th>Credit</th>
      <th>Debit</th>
      <th>Running Balance</th>
    </tr>
  </Fragment>)
}

class App extends Component {
  state = {
    formData: {
      transaction_type: "Credit",
      amount: 0,
      description: ""
    },
    show_form: false,
    transactions: [],
    running_balance: 50000
  }
  cancelForm = () => {
    this.setState({ show_form: false })
  }
  drpChange = (e, { value: transaction_type }) => {
    this.setState({
      formData: { ...this.state.formData, transaction_type }
    })
  }
  amountChage = (e, { value: amount }) => {
    console.log(amount)

    this.setState({
      formData: { ...this.state.formData, amount }
    })
  }
  dscrChange = (e, { value: description }) => {
    console.log(description)
    this.setState({
      formData: { ...this.state.formData, description }
    })
  }
  newTransactionForm = () => {
    const { formData: { transaction_type, amount, description } } = this.state;
    console.log(transaction_type, amount, description)
    return (<Form>
      <div className="field-group">
        <div className="label">Transaction Type</div>
        <div className="field"><Dropdown placeholder='Select Friend'
          fluid
          value={transaction_type}
          selection
          options={transactionOptions}
          onChange={this.drpChange} />
        </div>
      </div>
      <div className="field-group">
        <div className="label">Amount</div>
        <div className="field"><Input placeholder='Select Friend'
          type="number"
          value={amount}
          onChange={this.amountChage} />
        </div>
      </div>
      <div className="field-group">
        <div className="label">Description</div>
        <div className="field"><TextArea
          value={description}
          onChange={this.dscrChange} />
        </div>
      </div>
      <div className="button-area">
        <Button onClick={this.addTransaction} className="save">Save</Button>
        <Button className="cancel" onClick={this.cancelForm}>Cancel</Button>
      </div>
    </Form>)
  }
  showForm = () => {
    this.setState({
      show_form: true
    })
  }
  addTransaction = () => {
    var { formData: { transaction_type, amount, description }, running_balance } = this.state;
    if (!description) {
      return alert("description is required")
    }
    amount = parseInt(amount)
    if (amount == 0) {
      return alert("amount sould be greater than 0")
    }
    var today = new Date();
    var date = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
    var record = { date, amount, description };
    if (transaction_type == "Credit") {
      running_balance = running_balance + amount;
      record.credit = amount;

    }
    else {
      if (running_balance < amount) {
        return alert(`Cant debit more that your current balance, Current balance is ${running_balance}`)
      }
      running_balance = running_balance - amount;
      record.debit = amount;
    }
    record.running_balance = running_balance;
    this.setState({
      transactions: [record, ...this.state.transactions],
      show_form: false,
      running_balance,
      formData: {
        transaction_type: "Credit",
        amount: 0,
        description: ""
      },
    })
  }

  render() {
    console.log(this.state.formData)
    const { transactions, show_form } = this.state;
    return (<div className="main">
      <table>
        <body>
          <Header showForm={this.showForm} />
          {transactions.map(t => <tr>
            <td>{t.date}</td>
            <td>{t.description}</td>
            <td>{t.credit ? t.credit : null}</td>
            <td>{t.debit ? t.debit : null}</td>
            <td>{t.running_balance}</td>
          </tr>)}
        </body>
      </table>
      {show_form && <div className="form-container">{this.newTransactionForm()}</div>}
    </div>)
  }
}

export default App;
