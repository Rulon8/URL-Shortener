import Api from 'services/api.js';
import ShortenForm from './components/ShortenForm';
import ShortenMessage from './components/ShortenMessage';
import Row from 'react-bootstrap/lib/Row.js';
import Col from 'react-bootstrap/lib/Col.js';
import React, { Component } from 'react';

/* Receives the user input through the Form component and calls the API using a POST request
 * with the input. If the API returns any error it displays an error message, otherwise
 * displays a message with the shortened URL.
 */
class Shortener extends Component {
  constructor(props) {
    super(props);
    this.state = {shortened: 'pending', message: '', long_url: '', short_url: ''};
  }
  
  submitListener = (event) => {
    event.preventDefault();
    let api = new Api();
    api.postUrl(this.state.long_url)
    .then((apiResponse) => {
      if (apiResponse.hasOwnProperty('errors')) {
        this.setState({shortened: 'failure', message: 'An error has occured, please try again', short_url: ''});
      } else {
        this.setState({shortened: 'success', message: 'Your short URL is: ', short_url: apiResponse.short_url});
      }
    });
  }
  
  textFieldListener = (event) => {
    this.setState({long_url: event.target.value});
  }
  
  render() {
    return (
      <div>
        <Row>
          <Col>
            <p className='text'>Create shorter versions of your URLs for easier sharing!</p>
          </Col>
        </Row>
        <Row>
          <Col md={{span: 6, offset: 3}}>
            <ShortenForm onSubmitFunction={this.submitListener} onChangeFunction={this.textFieldListener}/>
          </Col>
        </Row>
        <Row>
          <Col md={{span: 6, offset: 3}}>
            <ShortenMessage status={this.state.shortened} message={this.state.message} url={this.state.short_url}/>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Shortener;