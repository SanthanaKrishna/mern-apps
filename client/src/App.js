import React from 'react';
// import { useDispatch } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { RootRouter } from './app/Router';
// import { autoSigninAsync } from './components/auth/AuthSlice';


export const App = () => {
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(autoSigninAsync());
  // }, []);

  return (
    <RootRouter />
  );

};
