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

import {extend} from '../../utils.js';

export class Chart extends React.Component {

  componentDidMount() {
    let {name, type, template, title} = this.props;
    let title_count = this.props['title-count'];
    let init_params = this.props['init-params'];
    let params = {extra: {}};

    params.extra = extend(params.extra, this.props['gen-params']);

    let ds = this.context.datasource;

    if (this.props['x-field']) {
      params.x_field = this.props['x-field'];
    }
    if (this.props['y-fields']) {
      params.y_fields = this.props['y-fields'];
    }
    if (this.props['z-fields']) {
      params.z_fields = this.props['z-fields'];
    }

    function chart_factory(for_display) {
      return new window.gsa.charts.ChartController(name, type, template, title,
        ds, for_display, title_count, params, init_params);
    }

    this.context.dashboard.addControllerFactory(name, chart_factory);
  }

  render() {
    return null;
  }
}

Chart.contextTypes = {
  dashboard: React.PropTypes.object.isRequired,
  datasource: React.PropTypes.object.isRequired,
};

Chart.propTypes = {
  name: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  template: React.PropTypes.string,
  'title-count': React.PropTypes.string,
  'x-field': React.PropTypes.string,
  'y-fields': React.PropTypes.array,
  'z-fields': React.PropTypes.array,
  'gen-params': React.PropTypes.object,
  'init-params': React.PropTypes.object,
};

export default Chart;

// vim: set ts=2 sw=2 tw=80:
