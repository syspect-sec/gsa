/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import withSvgIcon from './withSvgIcon';

import {Clock3 as Icon} from 'lucide-react';

import IconWithStrokeWidth from 'web/components/icon/IconWithStrokeWidth';

const ScheduleIcon = withSvgIcon()(props => (
  <IconWithStrokeWidth IconComponent={Icon} {...props} />
));

export default ScheduleIcon;

// vim: set ts=2 sw=2 tw=80:
