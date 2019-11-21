/**
 *
 * AdminToggle
 *
 */

import { Row, Col, Radio, Button, Select, Switch, InputNumber, Modal } from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { memo, useState } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

function showConfirmSave(newSettings, onSubmit) {
  Modal.confirm({
    title: 'Confirm changes?',
    onOk() {
      onSubmit(newSettings);
    },
    okText: 'Confirm',
  });
}

function AdminToggle({
  globalSettings,
  submitGlobalSettings,
}) {
  function checkChatAssignSettings() {
    return globalSettings.allow_claiming_chat == 0 && globalSettings.auto_assign > 0 
        ? 'auto'
        : 'claim';
  }
  function checkStaffNumberSettings() {
    return globalSettings.max_staffs_in_chat > 1 ? 'any' : 'single';
  }
  function convertHoursToDays(hours) {
    return Math.round(hours/24);
  }
  function convertDaysToHours(days) {
    return Math.round(days*24);
  }

  const light_grey = '#d3d3d3';
  const original_clr = '';
  const [chatAssign, setChatAssign] = useState(checkChatAssignSettings());
  const [loginOption, setLoginOption] = useState(globalSettings.login_type);
  const [staffNumber, setStaffNumber] = useState(checkStaffNumberSettings());
  const [maxStaffNumber, setMaxStaffNumber] = useState(globalSettings.max_staffs_in_chat);
  const [autoReassign, setAutoReassign] = useState(globalSettings.auto_reassign > 0);
  const [reassignDays, setReassignDays] = useState(convertHoursToDays(globalSettings.hours_to_auto_reassign));
  const [autoHeaderColor, setAutoHeaderColor] = useState(original_clr);
  const [autoDetailsColor, setAutoDetailsColor] = useState(light_grey);
  
  function disableAllAutoFields() {
    setAutoReassign(false);
    setAutoHeaderColor(light_grey);
    setAutoDetailsColor(light_grey);
  }

  function createSettingsObject() {
    var claimFlag = 0;
    var autoFlag = 1;
    var autoReassignFlag = 0;
    var hours = 24;
    var numberOfStaff = 1;
    if (chatAssign == 'claim') {
      claimFlag = 1;
      autoFlag = 0; 
    }
    if (autoReassign) {
      autoReassignFlag = 1;
      hours = convertDaysToHours(reassignDays);
    }
    if (staffNumber == 'any') {
      numberOfStaff = maxStaffNumber;
    }
    return {
      "login_type": loginOption, 
      "allow_claiming_chat": claimFlag,
      "max_staffs_in_chat": numberOfStaff,
      "auto_reassign": autoReassignFlag,
      "auto_assign": autoFlag,
      "hours_to_auto_reassign": hours,
    }; 
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
          <Radio value={1}><b>Login/Sign Up Only</b></Radio>
          <br />
          <Radio value={0} style = {{marginTop: '1rem'}}><b>Anonymous Login Only</b></Radio>
          <br />
          <Radio value={2} style = {{marginTop: '1rem'}}><b>Login/Sign Up & Anonymous Login</b></Radio>
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
            {(
              <Select.Option value={5}>
                5
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
    <div style={{ background: '#d3d3d3', height: '0.1rem', marginTop: '4rem', width: '75%' }} />
      <Button style={{
        marginTop: '2em',
        width: '10rem',
        margin: '2rem'
      }}
        type="primary"
        onClick={() => showConfirmSave(createSettingsObject(), submitGlobalSettings)}>
        Save Changes
      </Button>
    </div>
  </div>);
}

AdminToggle.propTypes = {};

export default memo(AdminToggle);
