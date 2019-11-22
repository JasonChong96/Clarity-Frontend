import { takeLatest, put } from 'redux-saga/effects';
import { LOGIN_ANONYMOUSLY, LOAD_SETTINGS, SUBMIT_SETTINGS, LOAD_NOTIFICATION, UPDATE_NOTIFICATION_UNREAD } from './constants';
import { get, patch, put as apiPut } from 'utils/api';
import { userLoggedIn, setSettings, setError, setSuccess, addNotification, addNotificationUnread } from '../App/actions';
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

function* loadNotification() {
    const [success, response] = yield get('/users/notifications', response => response, e => e.response)
    if (success) {
        console.log(response.data);
        yield put(addNotification(response.data.data));
        console.log("unread: " + response.data.num_of_unread);
        yield put(addNotificationUnread(response.data.num_of_unread));
    } else {
        yield put(setError({
            title: "Failed to load notifications",
            description: ``,
        }));
    }
}

function* updateNotificationUnread() {
    const [success, response] = yield apiPut('/users/notifications', {}, response => response, e => e.response)
    if (success) {
        yield put(updateNotificationUnread());
        console.log("unread notifications updated");
    } else {
        console.log("unable to update unread notifications");
    }
}

// Individual exports for testing
export default function* homeSaga() {
    // See example in containers/HomePage/saga.js
    yield takeLatest(LOAD_SETTINGS, loadSettings);
    yield takeLatest(SUBMIT_SETTINGS, submitSettings);
    yield takeLatest(LOAD_NOTIFICATION, loadNotification);
    yield takeLatest(UPDATE_NOTIFICATION_UNREAD, updateNotificationUnread);
}
