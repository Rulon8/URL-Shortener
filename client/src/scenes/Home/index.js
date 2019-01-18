import Shortener from './components/Shortener';
import Top from './components/Top';
import Row from 'react-bootstrap/lib/Row.js';
import Col from 'react-bootstrap/lib/Col.js';
import React from 'react';
import './styles.css';

/* Home page, contains the Shortener and Top URLs sections */
const Home = () => {
  return (
    <div>  
      <Row>
        <Col>
          <h1 className='title'>URL Shortener</h1>
        </Col>
      </Row>
      <Shortener />
      <Top />
    </div>
  );
};

export default Home;
