import React from 'react';
import { IntlProvider } from 'react-intl';
import { render } from 'react-testing-library';
import FeaturePage from '../index';


describe('<FeaturePage />', () => {
  it('should render its heading', () => {
    const {
      container: { firstChild },
    } = render(
      <IntlProvider locale="en">
        <FeaturePage />
      </IntlProvider>,
    );

    expect(firstChild).toMatchSnapshot();
  });
});
