import { applyMiddleware, createStore } from "redux";
import createSagaMiddleware from 'redux-saga';
import rootReducer from "../reducers";
import rootSaga from "../sagas";
import stateSyncMiddleware from "./stateSyncMiddleware";

const sagaMiddleware = createSagaMiddleware()

const store = createStore(rootReducer, applyMiddleware(sagaMiddleware, stateSyncMiddleware))

sagaMiddleware.run(rootSaga)

export default store