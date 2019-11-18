/**
 *
 * StaffManage
 *
 */

import { Table, Tag, Card, Button, Input, Radio, Modal, Descriptions, Select } from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { memo, useState, useEffect } from 'react';
import { compose } from 'redux';
import CreateVolunteer from '../CreateVolunteer';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

const { Column } = Table;

function getRoleName(roleId) {
  return {
    3: 'Volunteer',
    2: 'Supervisor',
    1: 'Administrator',
  }[roleId];
}

function getEditButtonMargin(roleId) {
  return {
    3: '2.6em',
    2: '2.2em',
    1: '1em',
  }[roleId];
}

function showConfirmStatus(status, record, onSubmit) {
  var titleName = status ? "Confirm deactivate user?" : "Confirm reactivate user?";
  Modal.confirm({
    title: titleName,
    content: (
      <Descriptions>
        <Descriptions.Item label="Name" span={3}>
          {record['full_name']}
        </Descriptions.Item>
        <Descriptions.Item label="Email" span={3}>
          {record['email']}
        </Descriptions.Item>
        <Descriptions.Item label="Role" span={3}>
          {getRoleName(record['role_id'])}
        </Descriptions.Item>
      </Descriptions>
    ),
    onOk() {
      console.log("update user, status: " + status)
      onSubmit(record['full_name'], record['role_id'], status, record['id']);
    },
    okText: 'Confirm',
  });
}

function showConfirmRoleChange(record, onSubmit) {
  var new_role_id = record['role_id'];
  Modal.confirm({
    title: "Modify user role?",
    content: (
      <Card>
        <Descriptions>
          <Descriptions.Item label="Name" span={3}>
            {record['full_name']}
          </Descriptions.Item>
          <Descriptions.Item label="Email" span={3}>
            {record['email']}
          </Descriptions.Item>
        </Descriptions>
        <Select
          initialValue={record['role_id']}
          style={{ width: 200 }}
          onChange={value => new_role_id = value}>
          <Select.Option value={3}>
            {getRoleName(3)}
          </Select.Option>
          <Select.Option value={2}>
            {getRoleName(2)}
          </Select.Option>
        </Select>
      </Card>
    ),
    onOk() {
      if (new_role_id != record['role_id']) {
        onSubmit(record['full_name'], new_role_id, record['disabled'], record['id']);
      }
    },
    okText: 'Confirm',
  });
}

function StaffManage(
  { onRegister,
    user,
    registerStaffClearTrigger,
    registerStaffPending,
    volunteerList,
    loadAllVolunteers,
    supervisorList,
    loadAllSupervisors,
    updateUser,
  }
) {
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [filter, setFilter] = useState('');
  const listComparator = ((a, b) => a['full_name'] > b['full_name'] ? 1 : a['full_name'] < b['full_name'] ? -1 : 0);
  return <div style={{ padding: '2em' }}>
    <Card style={{ height: '80vh' }}>
      <Title level={3}>Staff</Title>
      <Button style={{
        marginBottom: '1em',
        marginRight: '1em'
      }}
        type="primary"
        onClick={() => setShowCreateUser(true)}>
        Add
      </Button>
      <Input.Search
        allowClear
        placeholder="Search volunteer"
        onChange={e => {
          setFilter(e.target.value)
        }}
        style={{ marginBottom: '1em' }}
      />
      <Table
        dataSource={
          volunteerList.filter(volunteerObj =>
            volunteerObj['full_name'].toLowerCase().includes(filter.toLowerCase()))
            .sort(listComparator)
        }
        rowKey='id'
        size='small'
        pagination={{ pageSize: 7 }}>
        <Column title="Name" dataIndex="full_name" key="full_name" />
        <Column title="Email" dataIndex="email" key="email" />
        <Column
          title="Role"
          dataIndex="role_id"
          key="role_id"
          render={(role, record) => (
            <span>
              {getRoleName(role)}
              <Button
                disabled={user.role_id >= role}
                style={{ marginLeft: getEditButtonMargin(role) }}
                icon='edit'
                type="primary"
                onClick={() => showConfirmRoleChange(record, updateUser)} />
            </span>
          )} />
        <Column
          title="Status"
          dataIndex="disabled"
          key="disabled"
          render={(status, record) => (
            <span>
              <Radio.Group
                value={status}
                buttonStyle="solid"
                onChange={e => showConfirmStatus(e.target.value, record, updateUser)}
              >
                <Radio.Button
                  disabled={user.role_id >= record.role_id} value={false}>Active</Radio.Button>
                <Radio.Button
                  disabled={user.role_id >= record.role_id} value={true}>Inactive</Radio.Button>
              </Radio.Group>
            </span>
          )}
        />
      </Table>
    </Card>
    <CreateVolunteer
      user={user}
      onRegister={onRegister}
      registerStaffClearTrigger={registerStaffClearTrigger}
      registerStaffPending={registerStaffPending}
      visible={showCreateUser}
      onCancel={() => {
        setShowCreateUser(false);
      }}
      onOk={() => {
        setShowCreateUser(false);
      }} />
  </div>;
}

StaffManage.propTypes = {};

export default memo(StaffManage);
