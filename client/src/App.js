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

/* When clicked calls function that displays 100 top URLs */
const TopButton = (props) => {
  return (
    <div>
     <button type='button' onClick={props.onClickFunction}>Top 100 URLs</button> 
    </div>
  )
}

/* Shows a table with the title, original URL, short URL and number if registered
 * visits of each of the top 100 URLs with most visits. If there are less than 100
 * URLs registered in the system shows them all, and if there are none shows a 'No
 * data available' message.
 */
const TopTable = (props) => {
  let content;
  if (props.status === 'success') {
    if (props.tableData.length == 0) {
      content = 'No data available';
    } else {
      content = <table>
         <thead>
          <tr>
            <th>Title</th>
            <th>Long URL</th>
            <th>Short URL</th>
            <th>Visit Count</th>
          </tr>
         </thead>
         <tbody>
           {props.tableData.map(function(url, index) {
             let href = "https://" + window.location.hostname + ":8081/";
             return <tr>
                      <td>{url.title}</td>
                      <td>{url.original_url}</td>
                      <td><a href={href + url.short_url}>{url.short_url}</a></td>
                      <td>{url.visit_count}</td>
                    </tr>;
           })}
         </tbody>
       </table>;
    }
  }
  return (
    <div>
     {content}
    </div>
  )
}

/* Detects if the user has asked for the top 100 URLs. If the button has been
 * clicked sends a GET request to the API's /top.json and sends the data to
 * the TopTable to be rendered.
 */
class Top extends Component {
  constructor(props) {
    super(props);
    this.state = {status: 'pending', data: []};
  }
  
  buttonClickListener = () => {
    fetch('/top.json')
    .then((response) => {
      return response.json();
    }).then((jsonResponse) => {
      console.log(jsonResponse);
      this.setState({status: 'success', data: jsonResponse})
    }).catch((error) => {
      console.log(error);
    });
  }
  
  render() {
    return (
      <div>
        <TopButton onClickFunction={this.buttonClickListener}/>
        <TopTable status={this.state.status} tableData={this.state.data}/>
      </div>
    );
  }
}

/* Main component of the App, contains the Shortener and Top URLs sections */
class App extends Component {
  render() {
    return (
      <div className="container">
        <Shortener />
        <Top />
      </div>
    );
  }
}

export default App;
