/**
 *
 * AdminToggle
 *
 */

import { Row, Col, Radio, Button, Select, Switch, InputNumber } from 'antd';
import Title from 'antd/lib/typography/Title';
import { Link } from 'react-router-dom';
import React, { memo, useState } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

function AdminToggle({
  setMode,
}) {
  const light_grey = '#d3d3d3';
  const original_clr = '';
  const [chatAssign, setChatAssign] = useState('auto');
  const [loginOption, setLoginOption] = useState('both');
  const [staffNumber, setStaffNumber] = useState('single');
  const [maxStaffNumber, setMaxStaffNumber] = useState(2);
  const [autoReassign, setAutoReassign] = useState(false);
  const [reassignDays, setReassignDays] = useState(1);
  const [autoHeaderColor, setAutoHeaderColor] = useState(original_clr);
  const [autoDetailsColor, setAutoDetailsColor] = useState(light_grey);
  
  function disableAllAutoFields() {
    setAutoReassign(false);
    setAutoHeaderColor(light_grey);
    setAutoDetailsColor(light_grey);
  }

  return (
    <div>
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
        marginTop: '1.5rem',
      }}
    >
      <b>Admin Toggles</b>
    </Title>
    <div style={{ background: '#0EAFA7', height: '0.2rem', marginTop: '0.5rem', width: '7%' }} />
    </div>
    <Row>
      <Col span={8}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >  
          <p style={{ fontSize: '24px', alignItems: 'center', marginTop: '4rem' }}>
            Visitor Login Page
          </p>
        </div>
        <Radio.Group 
          value={loginOption}
          onChange={e => setLoginOption(e.target.value)} 
          style={{ marginTop: '2rem', marginLeft: '10rem' }}>
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
          }}
        >
          <p style={{ fontSize: '24px', alignItems: 'center', marginTop: '4rem' }}>
            How Volunteers Receive Chats
          </p>
        </div>
          <Radio.Group 
            value={chatAssign}
            onChange={e => {
              setChatAssign(e.target.value);
              if (e.target.value == 'claim') {
                disableAllAutoFields();
              } else {
                setAutoHeaderColor(original_clr);
              }
            }} 
            style={{ marginTop: '2rem', marginLeft: '5.8rem' }}>
            <Radio value="claim"><b>Claim Chats</b></Radio>
            <br />
            <Radio value="auto" style = {{marginTop: '1rem'}}><b>Auto-assign Chats</b></Radio>
          </Radio.Group>
          <div
            style={{ marginTop: '1rem' }}
          >
          <Switch 
            size="small" 
            checked={autoReassign}
            disabled={chatAssign == 'claim'}
            onChange={value => { 
              setAutoReassign(value);
              if (value) {
                setAutoDetailsColor(original_clr);
              } else {
                setAutoDetailsColor(light_grey);
              }
            }} 
            style={{marginLeft: '7.2rem'}}/>
          <b style={{marginLeft: '1.5rem', color: autoHeaderColor}}>Auto-reassign Chats</b>
          </div>
          <b style={{
            marginLeft: '10.5rem',
            marginTop: '0.5rem', 
            color: autoDetailsColor, 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'left',}}>Number of days a chat has not<br/> been replied before auto-reassigning:</b>
          <InputNumber
            min={1}
            max={99}
            defaultValue={reassignDays}
            onChange={value => setReassignDays(value)}
            disabled={!autoReassign}
            style={{width: '4rem', marginLeft: '10.5rem', marginTop: '0.5rem'}}
          />
      </Col>
      <Col span={8}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <p style={{ fontSize: '24px', alignItems: 'center', marginTop: '4rem' }}>
            Restrict Number of Staff in Chat
          </p>
        </div>
        <Radio.Group 
          value={staffNumber}
          onChange={e => setStaffNumber(e.target.value)} 
          style={{ marginTop: '2rem', marginLeft: '5.5rem' }}>
          <Radio value="single"><b>1 Staff talking to a visitor at any time</b></Radio>
          <br />
          <Radio value="any" style = {{marginTop: '1rem'}}><b>Max. number of Staff talking to a visitor at any time:</b></Radio>
        </Radio.Group>
        <br />
        <Select 
          defaultValue={maxStaffNumber} 
          style={{marginLeft: '7rem', marginTop: '1rem', width: '3rem'}}
          onChange={value => setMaxStaffNumber(value)}
          disabled={staffNumber == 'single'}>
            {(
              <Select.Option value={2}>
                2
              </Select.Option>
            )}
            {(
              <Select.Option value={3}>
                3
              </Select.Option>
            )}
            {(
              <Select.Option value={4}>
                4
              </Select.Option>
            )}
          </Select>
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
    <Row>
      <Col span={12}> 
        <Button type="primary" onClick={() => setMode(0)} style={{ marginTop: '2em', width: '10rem', margin: '2rem'}}>
          Back to Chat
        </Button>
      </Col>
      <Col span={12}>
        <Button style={{
          marginTop: '2em',
          width: '10rem',
          margin: '2rem'
        }}
          type="primary">
          {/*onClick={() => setShowCreateUser(true)}>*/}
          Save Changes
        </Button>
      </Col>
    </Row>
    </div>
    </div>);
}

AdminToggle.propTypes = {};

export default memo(AdminToggle);
