import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const Form = (props) => {
  return (
    <div>
      <form>
        <input type="text"/>
        <button type="submit" className="btn">GO</button>
      </form>
    </div>
  )
}

const Message = (props) => {
  return (
    <div className={props.class}>
      {props.message}
    </div>
  )
}

class Shortener extends Component {
  constructor(props) {
    super(props);
    this.state = {shortened: "pending"};
  }
  
  render() {
    return (
      <div>
        <Form/>
        <Message class={this.state.shortened} message="SHOW"/>
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="container">
        <Shortener />
      </div>
    );
  }
}

export default App;
