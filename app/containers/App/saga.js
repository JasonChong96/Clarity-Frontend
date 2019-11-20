import { takeLatest, put } from 'redux-saga/effects';
import { LOGIN_ANONYMOUSLY, LOAD_SETTINGS, SUBMIT_SETTINGS } from './constants';
import { get, patch } from 'utils/api';
import { userLoggedIn, setSettings, setError, setSuccess} from '../App/actions';
import history from 'utils/history';

function* loadSettings() {
    const [success, response] = yield get('/settings', response => response, e => e.response)
    if (success) {
        yield put(setSettings(response.data.data))
    } else {
        yield put(setError({
            title: "Failed to load settings",
            description: ``,
        }));
    }
}

function* submitSettings({settings}) {
    const [success, response] = yield patch('/settings', settings, response => response, e => e.response)
    if (success) {
        yield put(setSettings(settings))
        yield put(
            setSuccess({
                title: 'Settings changed successfully!',
                description: ``,
            }),
        );
    } else {
        yield put(setError({
            title: "Failed to submit settings",
            description: ``,
        }));
    }
}

// Individual exports for testing
export default function* homeSaga() {
    // See example in containers/HomePage/saga.js
    yield takeLatest(LOAD_SETTINGS, loadSettings);
    yield takeLatest(SUBMIT_SETTINGS, submitSettings);
}
