/**
 *
 * AdminToggle
 *
 */

import { Row, Col, Radio, Button, Dropdown } from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { memo, useState } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

function AdminToggle() {
  const [chatAssign, setChatAssign] = useState('claim');
  const [loginOption, setLoginOption] = useState('both');
  const [staffNumber, setStaffNumber] = useState('single');
  return (
    <div>
      <Row>
        <Col span={8}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '2rem',
            }}
          >  
            <p style={{ fontSize: '24px', alignItems: 'center', marginTop: '7.6rem' }}>
              Visitor Login Page
            </p>
          </div>
          <Radio.Group 
            value={loginOption}
            onChange={e => setLoginOption(e.target.value)} 
            style={{ marginTop: '3rem', marginLeft: '10rem' }}>
            <Radio value="login"><b>Login/Sign Up Only</b></Radio>
            <br />
            <Radio value="anonymous" style = {{marginTop: '1rem'}}><b>Anonymous Login Only</b></Radio>
            <br />
            <Radio value="both" style = {{marginTop: '1rem'}}><b>Login/Sign Up & Anonymous Login</b></Radio>
          </Radio.Group>
        </Col>
        <Col span={8}>
         <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '2rem',
            }}
          >
            <Title
              level={2}
              style={{
                color: '#0EAFA7',
                fontSize: '26px',
                alignItems: 'center',
              }}
            >
              <b>Admin Toggles</b>
            </Title>
            <div style={{ background: '#0EAFA7', height: '0.2rem', marginTop: '0.5rem', width: '20%' }} />
            <p style={{ fontSize: '24px', alignItems: 'center', marginTop: '4rem' }}>
              How Volunteers Receive Chats
            </p>
            </div>
            <Radio.Group 
              value={chatAssign}
              onChange={e => setChatAssign(e.target.value)} 
              style={{ marginTop: '3rem', marginLeft: '5.9rem' }}>
              <Radio value="claim"><b>Claim Chats</b></Radio>
              <br />
              <Radio value="auto" style = {{marginTop: '1rem'}}><b>Auto-assign Chats</b></Radio>
            </Radio.Group>
        </Col>
        <Col span={8}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '2rem',
            }}
          >
            <p style={{ fontSize: '24px', alignItems: 'center', marginTop: '7.6rem' }}>
              Restrict Number of Staff in Chat
            </p>
          </div>
          <Radio.Group 
            value={staffNumber}
            onChange={e => setStaffNumber(e.target.value)} 
            style={{ marginTop: '3rem', marginLeft: '5.5rem' }}>
            <Radio value="single"><b>1 Staff talking to a visitor at any time</b></Radio>
            <br />
            <Radio value="any" style = {{marginTop: '1rem'}}><b>Max. number of Staff talking to a visitor at any time:</b></Radio>
          </Radio.Group>
        </Col>
      </Row>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '2rem',
      }}
      >
        <div style={{ background: '#d3d3d3', height: '0.1rem', marginTop: '8rem', width: '75%' }} />
        <Button style={{
          marginTop: '2em',
        }}
          type="primary">
          {/*onClick={() => setShowCreateUser(true)}>*/}
          Save Changes
        </Button>
      </div>
    </div>);
}

AdminToggle.propTypes = {};

export default memo(AdminToggle);
