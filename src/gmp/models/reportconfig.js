/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import {isDefined, isObject} from 'gmp/utils/identity';
import {forEach, map} from 'gmp/utils/array';

import {parseBoolean} from 'gmp/parser';

import Model, {parseModelFromElement} from 'gmp/model';

const get_value = val => {
  return isObject(val) ? val.__text : val;
};

class Param {
  constructor({name, type, value, options, _using_default, ...other}) {
    this.name = name;
    this.max = type.max;
    this.min = type.min;
    this.type = get_value(type);
    this.value_using_default = parseBoolean(value?._using_default);

    if (isObject(options)) {
      this.options = map(options.option, opt => {
        return {
          value: opt,
          name: opt,
        };
      });
    } else {
      this.options = [];
    }

    if (this.type === 'report_format_list') {
      this.value = map(value.report_format, format => format._id);
      this.default = map(other.default.report_format, format => format._id);
      this.value_labels = {};
      this.default_labels = {};
      forEach(value.report_format, format => {
        this.value_labels[format._id] = format.name;
      });
      forEach(other.default.report_format, format => {
        this.default_labels[format._id] = format.name;
      });
    } else if (this.type === 'multi_selection') {
      this.value = JSON.parse(get_value(value));
      this.default = JSON.parse(get_value(other.default));
    } else if (this.type === 'integer') {
      this.value = parseInt(get_value(value));
      this.default = parseInt(get_value(other.default));
    } else if (this.type === 'boolean') {
      this.value = parseBoolean(get_value(value));
      this.default = parseBoolean(get_value(other.default));
    } else {
      this.value = get_value(value);
      this.default = get_value(other.default);
    }
  }
}

class ReportConfig extends Model {
  static entityType = 'reportconfig';

  static parseElement(element) {
    const ret = super.parseElement(element);

    if (isDefined(ret.report_format)) {
      ret.report_format = {
        id: ret.report_format._id,
        name: ret.report_format.name,
      };
    } else {
      ret.report_format = {};
    }

    ret.params = map(ret.param, param => {
      return new Param(param);
    });

    delete ret.param;

    if (isDefined(ret.alerts)) {
      ret.alerts = map(ret.alerts.alert, alert =>
        parseModelFromElement(alert, 'alert'),
      );
    } else {
      ret.alerts = [];
    }

    return ret;
  }
}

export default ReportConfig;

// vim: set ts=2 sw=2 tw=80:
