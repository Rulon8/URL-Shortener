import Button from 'react-bootstrap/lib/Button.js';
import Container from 'react-bootstrap/lib/Container.js';
import Row from 'react-bootstrap/lib/Row.js';
import Col from 'react-bootstrap/lib/Col.js';
import Form from 'react-bootstrap/lib/Form.js';
import Alert from 'react-bootstrap/lib/Alert.js';
import Table from 'react-bootstrap/lib/Table.js';
import React, { Component } from 'react';
import './App.css';

/* Manages user input through an HTML form. Calls props.onSubmitFunction
 * when submitted. Also calls props.onChangeFunction when the user types
 * in the textfield, in order to store the value typed. Validates that
 * the input is a valid URL.
 */
const ShortenForm = (props) => {
  return (
    <Form onSubmit={props.onSubmitFunction}>
      <Form.Row>
        <Col xs={9} md={10}>
          <Form.Control type='url' pattern='https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)' title='Please use a full URL, for example: https://google.com' onChange={props.onChangeFunction} required placeholder='Enter your URL here'/>
        </Col>
        <Col xs={3} md={2}>
          <Button variant='success' type="submit" className="btn">Shorten</Button>
        </Col>
      </Form.Row>
    </Form>
  );
};

/* Shows a status message with the style given by props.status depending
 * on whether URL shortening was a success or not.
 */
const Message = (props) => {
  let alert_type;
  if (props.status === 'success') {
    alert_type = 'success';
  } else if (props.status === 'failure') {
    alert_type = 'danger';
  }
  return (
    <Alert className='message' variant={alert_type}>
      {props.message}
      <Alert.Link href={props.url}>{props.url}</Alert.Link>
    </Alert>
  );
};

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
        this.setState({shortened: 'failure', message: 'An error has occured, please try again', short_url: ''});
      } else {
        this.setState({shortened: 'success', message: 'Your short URL is: ', short_url: jsonResponse.short_url});
      }
    }).catch((error) => {
      console.log(error);
      this.setState({shortened: 'failure', message: 'An error has occured, please try again', short_url: ''});
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
            <Message status={this.state.shortened} message={this.state.message} url={this.state.short_url}/>
          </Col>
        </Row>
      </div>
    );
  }
}

/* When clicked calls function that displays 100 top URLs */
const TopButton = (props) => {
  return (
    <div className='top-button'>
      <Button variant='success' type='button' onClick={props.onClickFunction}>Show top URLs</Button>
    </div>  
  );
};

/* Shows a table with the title, original URL, short URL and number if registered
 * visits of each of the top 100 URLs with most visits. If there are less than 100
 * URLs registered in the system shows them all, and if there are none shows a 'No
 * data available' message.
 */
const TopTable = (props) => {
  let content;
  if (props.status === 'success') {
    if (props.tableData.length === 0) {
      content = <p className='text top-table'>No data available</p>;
    } else {
      content = 
      <Table className='top-table' striped hover responsive bordered>
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
           return <tr>
                    <td>{url.title}</td>
                    <td>{url.original_url}</td>
                    <td><a href={url.short_url}>{url.short_url}</a></td>
                    <td>{url.visit_count}</td>
                  </tr>;
         })}
       </tbody>
     </Table>;
    }
  }
  return (
    <div>
     {content}
    </div>
  );
};

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
      this.setState({status: 'success', data: jsonResponse});
    }).catch((error) => {
      console.log(error);
    });
  }
  
  render() {
    return (
      <div className='top-section'>
        <Row>
          <Col>
            <p className='text'>Or look at the top 100 most used URLs</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <TopButton onClickFunction={this.buttonClickListener}/>
          </Col>
        </Row>
        <Row>
          <Col>
            <TopTable status={this.state.status} tableData={this.state.data}/>
          </Col>
        </Row>
      </div>
    );
  }
}

/* Main component of the App, contains the Shortener and Top URLs sections */
class App extends Component {
  render() {
    return (
      <Container>
        <Row>
          <Col>
            <h1 className='title'>URL Shortener</h1>
          </Col>
        </Row>
        <Shortener />
        <Top />
      </Container>
    );
  }
}

export default App;
