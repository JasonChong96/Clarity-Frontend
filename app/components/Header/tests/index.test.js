import { ConnectedRouter } from 'connected-react-router/immutable';
import { createMemoryHistory } from 'history';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { render } from 'react-testing-library';
import configureStore from '../../../configureStore';
import Header from '../index';

describe('<Header />', () => {
  const history = createMemoryHistory();
  const store = configureStore({}, history);

  it('should render a div', () => {
    const { container } = render(
      <Provider store={store}>
        <IntlProvider locale="en">
          <ConnectedRouter history={history}>
            <Header />
          </ConnectedRouter>
        </IntlProvider>
      </Provider>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
