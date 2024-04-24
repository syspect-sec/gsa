/* Copyright (C) 2019-2022 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License
 * as published by the Free Software Foundation, either version 3
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
import {describe, test, expect} from '@gsa/testing';

import {render} from 'web/utils/testing';

import Trend from '../trend';

describe('Task Trend tests', () => {
  test('should render', () => {
    const {element} = render(<Trend name="up" />);

    expect(element).toMatchSnapshot();
  });

  test('should render trend up icon', () => {
    const {element} = render(<Trend name="up" />);

    expect(element).toHaveAttribute('title', 'Severity increased');
  });

  test('should render trend down icon', () => {
    const {element} = render(<Trend name="down" />);

    expect(element).toHaveAttribute('title', 'Severity decreased');
  });

  test('should render trend less icon', () => {
    const {element} = render(<Trend name="less" />);

    expect(element).toHaveAttribute('title', 'Vulnerability count decreased');
  });

  test('should render trend more icon', () => {
    const {element} = render(<Trend name="more" />);

    expect(element).toHaveAttribute('title', 'Vulnerability count increased');
  });

  test('should render trend no change icon', () => {
    const {element} = render(<Trend name="same" />);

    expect(element).toHaveAttribute('title', 'Vulnerabilities did not change');
  });
});
