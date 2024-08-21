/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import {_l} from 'gmp/locale/lang';

import {createEntitiesFooter} from 'web/entities/footer';
import {createEntitiesHeader} from 'web/entities/header';
import {createEntitiesTable} from 'web/entities/table';
import withRowDetails from 'web/entities/withRowDetails';

import ReportConfigDetails from './details';
import Row from './row';

export const SORT_FIELDS = [
  {
    name: 'name',
    displayName: _l('Name'),
    width: '25%',
  },
  {
    name: 'report_format',
    displayName: _l('Report Format'),
    width: '50%',
  },
];

const ReportConfigsTable = createEntitiesTable({
  emptyTitle: _l('No report configs available'),
  header: createEntitiesHeader(SORT_FIELDS),
  row: Row,
  rowDetails: withRowDetails('reportconfig', 3)(ReportConfigDetails),
  footer: createEntitiesFooter({
    span: 3,
    trash: true,
  }),
});

export default ReportConfigsTable;

// vim: set ts=2 sw=2 tw=80:
