/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import {_, _l} from 'gmp/locale/lang';

import {CERTBUND_FILTER_FILTER} from 'gmp/models/filter';

import CvssDisplay from 'web/components/dashboard/display/cvss/cvssdisplay';
import CvssTableDisplay from 'web/components/dashboard/display/cvss/cvsstabledisplay'; // eslint-disable-line max-len
import createDisplay from 'web/components/dashboard/display/createDisplay';
import {registerDisplay} from 'web/components/dashboard/registry';

import {CertBundSeverityLoader} from './loaders';

export const CertBundCvssDisplay = createDisplay({
  loaderComponent: CertBundSeverityLoader,
  displayComponent: CvssDisplay,
  yLabel: _l('# of CERT-Bund Advs'),
  title: ({data: tdata}) =>
    _('CERT-Bund Advisories by CVSS (Total: {{count}})', {count: tdata.total}),
  filtersFilter: CERTBUND_FILTER_FILTER,
  displayId: 'cert_bund_adv-by-cvss',
  displayName: 'CertBundCvssDisplay',
});

export const CertBundCvssTableDisplay = createDisplay({
  loaderComponent: CertBundSeverityLoader,
  displayComponent: CvssTableDisplay,
  dataTitles: [_l('Severity'), _l('# of CERT-Bund Advisories')],
  title: ({data: tdata}) =>
    _('CERT-Bund Advisories by CVSS (Total: {{count}})', {count: tdata.total}),
  filtersFilter: CERTBUND_FILTER_FILTER,
  displayId: 'cert_bund_adv-by-cvss-table',
  displayName: 'CertBundCvssTableDisplay',
});

registerDisplay(CertBundCvssDisplay.displayId, CertBundCvssDisplay, {
  title: _l('Chart: CERT-Bund Advisories by CVSS'),
});

registerDisplay(CertBundCvssTableDisplay.displayId, CertBundCvssTableDisplay, {
  title: _l('Table: CERT-Bund Advisories by CVSS'),
});

// vim: set ts=2 sw=2 tw=80:
