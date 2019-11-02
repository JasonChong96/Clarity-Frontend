/**
 *
 * StaffManage
 *
 */

import { Table, Tag, Card, Button, Input, Radio  } from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { memo, useState, useEffect } from 'react';
import { compose } from 'redux';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

const { Column } = Table;

const data = [
  {
    key: '1',
    name: 'John',
    email: 'John@example.com',
    role: 'Volunteer',
    status: 'active',
  },
  {
    key: '2',
    name: 'John',
    email: 'John@example.com',
    role: 'Volunteer',
    status: 'inactive',
  },
  {
    key: '3',
    name: 'John',
    email: 'John@example.com',
    role: 'Volunteer',
    status: 'active',
  },
];

function StaffManage() {
  const [selectedRow, setSelectedRow] = useState({});
  return <div style={{ padding: '2em' }}>
    <Card style={{ height: '70vh' }}>
      <Title level={3}>Volunteers</Title>
      <Button style={{ marginBottom: '1em',
                       marginRight: '1em'}} 
              type="primary" 
              onClick={() => { return; }}>
        Add
      </Button>
      <Button style={{ marginBottom: '1em',
                       marginLeft: '1em',
                       marginRight: '1em' }} 
              type="primary" 
              onClick={() => { return; }}>
        Edit
      </Button>
      <Input.Search
              allowClear
              placeholder="Search volunteer"
              onChange={e => {
                //setFilter(e.target.value)
              }}
              style={{ marginBottom: '1em' }}
      />
      <Table 
        dataSource={data}
        onRow={(record, index) => {
          return {
            onClick: event => 
              setSelectedRow(record)
              // Suppose to change background color
          };
        }}>
        <Column title="Name" dataIndex="name" key="name" />      
        <Column title="Email" dataIndex="email" key="email" />
        <Column title="Role" dataIndex="role" key="role" />
        <Column
          title="Status"
          dataIndex="status"
          key="status"
          render={tag => (
            <span>
              <Radio.Group
                defaultValue={tag}
                buttonStyle="solid"
                onChange={e => setMode(e.target.value)}
              >
                <Radio.Button value={"active"}>Active</Radio.Button>
                <Radio.Button value={"inactive"}>Inactive</Radio.Button>
              </Radio.Group>
            </span>
          )}
         />
      </Table>
    </Card>
  </div>;
}

StaffManage.propTypes = {};

export default memo(StaffManage);
