import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { Layout } from './components/Layout';
import './custom.css';
import RegistrationPage from './components/RegistrationPage/RegistrationPage';

export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
      <Layout>
        {/* <RegistrationPage/> */}
        <Routes>
          {AppRoutes.map((route, index) => {
            const { element, ...rest } = route;
            return <Route key={index} {...rest} element={element} />;
          })}
        </Routes>
      </Layout>
    );
  }
}
