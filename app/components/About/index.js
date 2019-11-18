/**
 *
 * About
 *
 */

import { Row, Col } from 'antd';
import Title from 'antd/lib/typography/Title';
import React from 'react';
import { Link } from 'react-router-dom';
import HomeHeader from 'images/home_header.svg';
import LogoImage from 'images/logo.svg';
import { useMediaQuery } from 'react-responsive';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

function About() {
  const isDesktopOrLaptop = useMediaQuery({ query: '(min-width: 1224px)' });
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });

  return (
    <div>
      {isDesktopOrLaptop && (
        <Row>
          <Col span={6}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '0.7rem',
              }}
            >
              <Title
                level={1}
                style={{
                  color: '#707070',
                  fontSize: '60px',
                  alignItems: 'center',
                  marginLeft: '8rem',
                }}
              >
                <b>ABOUT</b>
              </Title>
              <img
                style={{
                  width: '8vw',
                  height: 'auto',
                  marginTop: '-2rem',
                  marginLeft: '2rem',
                }}
                src={LogoImage}
              />
              <div style={{ background: '#F9D835', height: '0.5rem', marginLeft: '2em', width: '35%', float: 'right' }} />
            </div>
          </Col>
          <Col span={12}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '3.5rem'
              }}
            >
              <p style={{ fontSize: '18px', alignItems: 'center' }}>
                Ora is a chat platform that connects you to
                <br />
                volunteers who aim to lend a listening ear and be your
                <br />
                temporary online emotional support.
              </p>
              <br />
              <p style={{ fontSize: '18px', alignItems: 'center' }}>
                Not everyone has people to turn to when they need to
                <br />
                get things off their chest. Thus, Ora aims to be there for
                <br />
                you when things get tough. During this pilot testing
                <br />
                phase, the developers of ORA will be acting as the
                <br />
                volunteers.
              </p>
              <br />
              <p style={{ fontSize: '18px', alignItems: 'center' }}>
                The purpose of this pilot test is to verify the need for
                <br />
                ORA as a platform to alleviate the pain that many of us
                <br />
                feel. As we are not professionally trained, we are by no
                <br />
                means a form of emotional therapy, we are just your
                <br />
                friends lending you an ear in your time of need.
                <br />
                <br />
                Thank you for trying Ora out!
              </p>
              <img style={{ width: '20vw', height: 'auto' }} src={HomeHeader} />
            </div>
          </Col>
          <Col span={6}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'right',
                alignItems: 'right',
                textAlign: 'right',
                marginTop: '20rem',
                marginRight: '9rem',
              }}
            >
              <Title
                level={1}
                style={{
                  color: '#707070',
                  fontSize: '30px',
                  alignItems: 'center',
                }}
              >
                <b>CONTACT US</b> <br />
                <div style={{ background: '#F9D835', height: '0.5rem', width: '40%', float: 'right' }} />
              </Title>
              <p style={{ fontSize: '18px', alignItems: 'right' }}>
                Feel free to contact us at
                <br />
                chatwithora@gmail.com
              </p>
              <Title
                level={1}
                style={{
                  color: '#707070',
                  fontSize: '30px',
                  alignItems: 'center',
                }}
              >
                <b>FEEDBACK</b> <br />
                <div style={{ background: '#F9D835', height: '0.5rem', width: '40%', float: 'right' }} />
              </Title>
              <p style={{ fontSize: '18px', alignItems: 'right' }}>
                I am a{' '}
                <a href="https://docs.google.com/forms/d/e/1FAIpQLSdOVG2I2y0iM6C19TSmFaKtrBr49FF2m9GIX3h0Jpr4IbPknQ/viewform?usp=sf_link">
                  volunteer
                </a>
                <br />I am a{' '}
                <a href="https://docs.google.com/forms/d/e/1FAIpQLSc_lS3dW5Mq2kZzJqstGaXSzWkTjFc6NbX_ieGg4_KCMBe6OQ/viewform?usp=sf_link">
                  visitor
                </a>
              </p>
            </div>
          </Col>
        </Row>
      )}
      {isTabletOrMobile && (
        <Row>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '0.7rem',
            }}
          >
            <Title
              level={1}
              style={{
                color: '#707070',
                fontSize: '60px',
                alignItems: 'center',
                marginLeft: '8rem',
              }}
            >
              <b>ABOUT</b>
            </Title>
            <img
              style={{
                width: '40vw',
                height: 'auto',
                marginTop: '-2rem',
                marginLeft: '2rem',
                maxWidth: '250px',
              }}
              src={LogoImage}
            />
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '3.5rem 2rem 0 2rem'
            }}
          >
            <p style={{ fontSize: '18px', alignItems: 'center' }}>
              Ora is a chat platform that connects you to
              volunteers who aim to lend a listening ear and be your
              temporary online emotional support.
            </p>
            <br />
            <p style={{ fontSize: '18px', alignItems: 'center' }}>
              Not everyone has people to turn to when they need to
              get things off their chest. Thus, Ora aims to be there for
              you when things get tough. During this pilot testing
              phase, the developers of ORA will be acting as the
              volunteers.
            </p>
            <br />
            <p style={{ fontSize: '18px', alignItems: 'center' }}>
              The purpose of this pilot test is to verify the need for
              ORA as a platform to alleviate the pain that many of us
              feel. As we are not professionally trained, we are by no
              means a form of emotional therapy, we are just your
              friends lending you an ear in your time of need.
              <br />
              <br />
              Thank you for trying Ora out!
            </p>
            <img style={{ width: '50vw', height: 'auto' }} src={HomeHeader} />
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'right',
              alignItems: 'right',
              textAlign: 'right',
              marginTop: '1rem',
              marginRight: '1rem',
              marginBottom: '1rem',
            }}
          >
            <Title
              level={1}
              style={{
                color: '#707070',
                fontSize: '30px',
                alignItems: 'center',
              }}
            >
              <b>CONTACT US</b>
            </Title>
            <p style={{ fontSize: '18px', alignItems: 'right' }}>
              Feel free to contact us at
              <br />
              chatwithora@gmail.com
            </p>
            <Title
              level={1}
              style={{
                color: '#707070',
                fontSize: '30px',
                alignItems: 'center',
              }}
            >
              <b>FEEDBACK</b>
            </Title>
            <p style={{ fontSize: '18px', alignItems: 'right' }}>
              I am a{' '}
              <a href="https://docs.google.com/forms/d/e/1FAIpQLSdOVG2I2y0iM6C19TSmFaKtrBr49FF2m9GIX3h0Jpr4IbPknQ/viewform?usp=sf_link">
                volunteer
              </a>
              <br />I am a{' '}
              <a href="https://docs.google.com/forms/d/e/1FAIpQLSc_lS3dW5Mq2kZzJqstGaXSzWkTjFc6NbX_ieGg4_KCMBe6OQ/viewform?usp=sf_link">
                visitor
              </a>
            </p>
          </div>
        </Row>
      )}
    </div>
  );
}

About.propTypes = {};

export default About;
