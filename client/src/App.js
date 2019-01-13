import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

/* Manages user input through an HTML form. Calls props.onSubmitFunction
 * when submitted. Also calls props.onChangeFunction when the user types
 * in the textfield, in order to store the value typed.
 */
const Form = (props) => {
  return (
    <div>
      <form onSubmit={props.onSubmitFunction}>
        <input type="text" onChange={props.onChangeFunction} required/>
        <button type="submit" className="btn">GO</button>
      </form>
    </div>
  )
}

/* Shows props.message with the style given by props.class */
const Message = (props) => {
  return (
    <div className={props.class}>
      {props.message}
    </div>
  )
}

/* Receives the user input through the Form component and call the API using a POST request
 * with the input. If the API returns any error it displays an error message, otherwise
 * displays a message with the shortened URL.
 */
class Shortener extends Component {
  constructor(props) {
    super(props);
    this.state = {shortened: 'pending', message: '', url: ''};
  }
  
  submitListener = (event) => {
    console.log(this.state.url);
    event.preventDefault();
    fetch('/url.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({url: this.state.url})
    }).then((response) => {
      return response.json();
    }).then((jsonResponse) => {
      console.log(jsonResponse);
      console.log(JSON.stringify(jsonResponse));
      if (jsonResponse.hasOwnProperty('errors')) {
        this.setState({shortened: 'failure', message: 'ERROR: Please enter a valid URL'});
      } else {
        this.setState({shortened: 'success', message: 'Your short URL is: ' + jsonResponse.short_url});
      }
    }).catch((error) => {
      console.log(error);
      this.setState({shortened: 'failure', message: 'NETWORK ERROR: Please try again'});
    });
  }
  
  textFieldListener = (event) => {
    this.setState({url: event.target.value});
  }
  
  render() {
    return (
      <div>
        <Form onSubmitFunction={this.submitListener} onChangeFunction={this.textFieldListener}/>
        <Message class={this.state.shortened} message={this.state.message}/>
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
