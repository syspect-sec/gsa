/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import {_l} from 'gmp/locale/lang';
import {createEntitiesFooter} from 'web/entities/footer';
import {createEntitiesTable} from 'web/entities/table';
import withRowDetails from 'web/entities/withRowDetails';
import PolicyDetails from 'web/pages/policies/details';

import Header from './header';
import Row from './row';

export const SORT_FIELDS = [
  {
    name: 'name',
    displayName: _l('Name'),
  },
];

const PoliciesTable = createEntitiesTable({
  emptyTitle: _l('No Policies available'),
  header: Header,
  row: Row,
  rowDetails: withRowDetails('policy')(PolicyDetails),
  footer: createEntitiesFooter({
    download: 'policies.xml',
    span: 2,
    trash: true,
    tags: true,
  }),
});

export default PoliciesTable;
