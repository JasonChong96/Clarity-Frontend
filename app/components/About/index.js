/**
 *
 * About
 *
 */

import { Card, Descriptions } from 'antd';
import Title from 'antd/lib/typography/Title';
import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

function About() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '2rem',
      }}>
      <Title level={3}>
        About ORA
      </Title>
        <b>
          Ora is a chat platform that connects you to trained volunteers who aim to lend
          <br />
          a listening ear and be your temporary online emotional support. 
          <br />
          Not everyone has people to turn to when they need to get things off their chest. 
          <br />
          Thus, Ora aims to be there for you when things get tough.   
          <br />
          <br />
          During this pilot testing phase, the developers of ORA will be acting as the volunteers.
          <br />
          The purpose of this pilot test is to verify the need for ORA as a platform 
          <br />
          to alleviate the pain that many of us feel. As we are not professionally trained,
          <br />
          we are by no means a form of emotional therapy, we are just your friends 
          <br />
          lending you an ear in your time of need.
          <br />
          <br />
          Thank you for trying Ora out! :)
          <br />
        </b>
    </div>
  );
}

About.propTypes = {};

export default About;
