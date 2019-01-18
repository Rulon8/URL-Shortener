import ButtonTemplate from 'components/ButtonTemplate';
import React from 'react';
import './styles.css';

/* When clicked calls function that displays 100 top URLs */
const TopButton = (props) => {
  return (
    <div className='top-button'>
      <ButtonTemplate variant='success' type='button' onClickFunction={props.onClickFunction} >Show top URLs</ButtonTemplate>
    </div>  
  );
};

export default TopButton;