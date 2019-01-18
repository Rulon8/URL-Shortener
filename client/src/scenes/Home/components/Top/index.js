import TopButton from './components/TopButton';
import TopTable from './components/TopTable';
import Row from 'react-bootstrap/lib/Row.js';
import Col from 'react-bootstrap/lib/Col.js';
import React, { Component } from 'react';
import './styles.css';

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

export default Top;