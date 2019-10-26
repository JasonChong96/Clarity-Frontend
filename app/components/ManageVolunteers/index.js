/**
 *
 * ManageVolunteers
 *
 */

import React, { memo, useState } from 'react';
import { Card, Input, List, Button, Col, Row } from 'antd';
import Title from 'antd/lib/typography/Title';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

const volunteers = [
  {
    name: 'Volunteer I',
  },
  {
    name: 'Volunteer II',
  },
  {
    name: 'Volunteer III',
  },
];

function ManageVolunteers() {
  const [filter, setFilter] = useState('');
  return (
    <Card style={{ height: '70vh' }}>
      <Input.Search
        allowClear
        placeholder="Search volunteer"
        onChange={e => setFilter(e.target.value)}
      />
      <div style={{ padding: '1em' }} />
      <List
        dataSource={volunteers.filter(volunteer =>
          volunteer.name.toLowerCase().includes(filter.toLowerCase()),
        )}
        style={{ paddingLeft: '1em' }}
        renderItem={item => (
          <List.Item>
            <Row gutter={24} style={{ width: '100%' }}>
              <Col xs={12} sm={10} md={8} lg={6}>
                <Title ellipsis level={4}>
                  {item.name}
                </Title>
              </Col>
              <Col>
                <a
                  style={{ display: 'table-cell' }}
                  href="/supervisor/manage/username"
                  target="_blank"
                >
                  <Button type="primary">View Chats</Button>
                </a>
              </Col>
            </Row>
          </List.Item>
        )}
      />
    </Card>
  );
}

ManageVolunteers.propTypes = {};

export default memo(ManageVolunteers);
