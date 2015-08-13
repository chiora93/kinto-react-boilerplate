import React from "react";


export class Form extends React.Component {

  onFormSubmit(event) {
    event.preventDefault();
    var record = {label: event.target.label.value};
    this.props.updateRecord(record);
  }

  render() {
    return (
      <form onSubmit={this.onFormSubmit.bind(this)}>
        <input name="label" type="text" />
        <button type="submit">Add</button>
      </form>
    );
  }
}


export class List extends React.Component {

  static get defaultProps() {
    return {items: []};
  }

  render() {
    return (
      <ul>{
        this.props.items.map((label, i) => {
          return <li key={i}>{label}</li>;
        })
      }</ul>
    );
  }
}


class SyncButton extends React.Component {
  render() {
    const user = this.props.user;
    if (user && user.uid) {
      return (
        <button onClick={this.props.onSync} disabled={this.props.disabled}>Sync!</button>
      );
    }
    return <a href={user.loginURI}>Sign in</a>;
  }
}


export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.props.store.state;
    this.props.store.on("change", state => {
      this.setState(Object.assign({busy: false}, state));
    });
    this.props.store.on("error", error => {
      this.setState({busy: false, error: error.message});
    });
    this.props.store.load();
  }

  updateRecord(record) {
    this.props.store.create(record);
  }

  syncRecords() {
    this.setState({busy: true, error: ""});
    this.props.store.sync();
  }

  render() {
    var disabled = this.state.busy ? "disabled" : "";
    return (
      <div className={disabled}>
        <Form updateRecord={this.updateRecord.bind(this)}/>
        <List items={this.state.items.map(item => item.label)}/>
        <SyncButton user={this.props.user} onSync={this.syncRecords.bind(this)} disabled={disabled}/>
        <div className="error">{this.state.error}</div>
      </div>
    );
  }
}
