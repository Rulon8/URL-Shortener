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

/* Shows a status message with the style given by props.status depending
 * on whether URL shortening was a success or not.
 */
const Message = (props) => {
  let url;
  if (props.status === 'success') {
    url = <a href={props.url}>{props.url}</a>;
  }
  return (
    <div className={props.status}>
      {props.message} {url}
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
    this.state = {shortened: 'pending', message: '', long_url: '', short_url: ''};
  }
  
  submitListener = (event) => {
    console.log(this.state.long_url);
    event.preventDefault();
    fetch('/url.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({url: this.state.long_url})
    }).then((response) => {
      return response.json();
    }).then((jsonResponse) => {
      console.log(jsonResponse);
      console.log(JSON.stringify(jsonResponse));
      if (jsonResponse.hasOwnProperty('errors')) {
        this.setState({shortened: 'failure', message: 'ERROR: Please enter a valid URL', short_url: ''});
      } else {
        this.setState({shortened: 'success', message: 'Your short URL is: ', short_url: jsonResponse.short_url});
      }
    }).catch((error) => {
      console.log(error);
      this.setState({shortened: 'failure', message: 'NETWORK ERROR: Please try again', short_url: ''});
    });
  }
  
  textFieldListener = (event) => {
    this.setState({long_url: event.target.value});
  }
  
  render() {
    return (
      <div>
        <Form onSubmitFunction={this.submitListener} onChangeFunction={this.textFieldListener}/>
        <Message status={this.state.shortened} message={this.state.message} url={this.state.short_url}/>
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
