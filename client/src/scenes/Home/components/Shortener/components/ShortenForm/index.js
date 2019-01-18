import ButtonTemplate from 'components/ButtonTemplate';
import Col from 'react-bootstrap/lib/Col.js';
import Form from 'react-bootstrap/lib/Form.js';
import React from 'react';

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
          <ButtonTemplate variant='success' type='submit' className="btn" >Shorten</ButtonTemplate>
        </Col>
      </Form.Row>
    </Form>
  );
};

export default ShortenForm;