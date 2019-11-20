import { takeLatest, put } from 'redux-saga/effects';
import { LOGIN_ANONYMOUSLY, LOAD_SETTINGS } from './constants';
import { get } from 'utils/api';
import { userLoggedIn, setSettings, setError } from '../App/actions';
import history from 'utils/history';

function* loadSettings() {
    const [success, response] = yield get('/settings', response => response, e => e.response)
    if (success) {
        yield put(setSettings(response.data.data))
    } else {
        setError({
            title: "Failed to load settings"
        });
    }
}

// Individual exports for testing
export default function* homeSaga() {
    // See example in containers/HomePage/saga.js
    yield takeLatest(LOAD_SETTINGS, loadSettings);
}
