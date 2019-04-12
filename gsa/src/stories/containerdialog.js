/* Copyright (C) 2019 Greenbone Networks GmbH
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
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

/* eslint-disable react/prop-types */

import React from 'react';
import {storiesOf} from '@storybook/react';
import ContainerTaskDialog from '../web/pages/tasks/containerdialog';
import Button from '../web/components/form/button';

class SaveButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'Create New Task',
      dialog: false,
      result: '',
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClick(value, name) {
    this.setState({
      dialog: true,
    });
  }

  handleSave(value, name) {
    const result = 'Created new Task: ' + value.name;
    this.setState({
      dialog: false,
      result: result,
    });
  }

  handleClose(value, name) {
    this.setState({
      dialog: false,
    });
  }

  render() {
    let dialog;
    if (this.state.dialog === true) {
      dialog = (
        <ContainerTaskDialog
          comment=""
          name=""
          onSave={this.handleSave}
          onClose={this.handleClose}
        />
      );
    } else {
      dialog = '';
    }
    return (
      <div>
        <Button title={this.state.title} onClick={this.handleClick} />
        <p>{this.state.result}</p>
        {dialog}
      </div>
    );
  }
}

storiesOf('ContainerDialog', module).add('default', () => <SaveButton />);
