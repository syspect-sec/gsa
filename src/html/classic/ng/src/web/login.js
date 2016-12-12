/* Greenbone Security Assistant
 *
 * Authors:
 * Björn Ricks <bjoern.ricks@greenbone.net>
 *
 * Copyright:
 * Copyright (C) 2016 Greenbone Networks GmbH
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 */

import React from 'react';

import _ from '../locale.js';
import {autobind, log} from '../utils.js';

import Header from './header.js';
import Footer from './footer.js';
import Icon from './icon.js';
import Layout from './layout.js';

import FormGroup from './form/formgroup.js';
import TextField from './form/textfield.js';
import PasswordField from './form/passwordfield.js';
import SubmitButton from './form/submitbutton.js';

import './css/login.css';

export class Login extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      error: false,
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(username, password) {
    let {router, gmp} = this.context;

    gmp.login(username, password).then(token => {
      window.gsa.token = token;

      let {location} = this.props;
      if (location && location.state && location.state.next &&
          location.state.next !== location.pathname) {
        router.replace(location.state.next);
      }
      else {
        router.replace('/ng');
      }
    }, err => {
      log.error(err);
      this.setState({error: true});
    });
  }

  componentWillMount() {
    // reset token
    let {gmp} = this.context;
    gmp.token = undefined;
  }

  render() {
    return (
      <div className="login flex column">
        <Header/>
        <main className="auto flex row wrap align-center justify-space-around">
          <LoginForm onSubmit={this.onSubmit} error={this.state.error}/>
          <LogoBox/>
        </main>
        <Footer className="none"/>
      </div>
    );
  }
}

Login.contextTypes = {
  router: React.PropTypes.object.isRequired,
  gmp: React.PropTypes.object.isRequired,
};


const LogoBox = () => {
  return (
    <Icon className="none greenbone-icon" size="default" img="greenbone.svg"/>
  );
};

class LoginForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {};

    autobind(this, 'on');
  }

  onSubmit(event) {
    event.preventDefault();

    if (!this.props.onSubmit) {
      return;
    }

    let {username, password} = this.state;
    this.props.onSubmit(username, password);
  }

  onUserNameChange(username) {
    this.setState({username});
  }

  onPasswordChange(password) {
    this.setState({password});
  }

  render() {
    let {error} = this.props;
    let {username, password} = this.state;
    return (
      <div className="none">
        {error &&
          <div className="box">
            <p className="error">{_('Bad login information')}</p>
          </div>
        }
        <Layout flex align="space-arround" className="box">
          <Icon img="login-label.png" className="none" size="default"/>
          <Layout float className="form-horizontal">
            <FormGroup title={_('Username')} titleSize="4">
              <TextField name="username" placeholder={_('e.g. johndoe')}
                value={username}
                autoFocus="autofocus"
                tabIndex="1"
                onChange={this.onUserNameChange}/>
            </FormGroup>
            <FormGroup title={_('Password')} titleSize="4">
              <PasswordField name="password" placeholder={_('Password')}
                value={password}
                onChange={this.onPasswordChange}/>
            </FormGroup>
            <FormGroup size="6" offset="6">
              <SubmitButton title={_('Login')} onClick={this.onSubmit}/>
            </FormGroup>
          </Layout>
        </Layout>
      </div>
    );
  }
}

LoginForm.propTypes = {
  onSubmit: React.PropTypes.func,
  error: React.PropTypes.bool,
};

export default Login;

// vim: set ts=2 sw=2 tw=80:
