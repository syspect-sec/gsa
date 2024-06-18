/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */


import React from 'react';

import Filter from 'gmp/models/filter.js';

import {isDefined, isNumber} from 'gmp/utils/identity';

import SeverityBar from 'web/components/bar/severitybar';

import DateTime from 'web/components/date/datetime';

import SolutionTypeIcon from 'web/components/icon/solutiontypeicon';

import Divider from 'web/components/layout/divider';

import CveLink from 'web/components/link/cvelink';
import Link from 'web/components/link/link';

import TableRow from 'web/components/table/row';
import TableData from 'web/components/table/data';

import Qod from 'web/components/qod/qod';

import EntitiesActions from 'web/entities/actions';
import {RowDetailsToggle} from 'web/entities/row';

import PropTypes from 'web/utils/proptypes';
import useGmp from "web/utils/useGmp";
import {_} from "gmp/locale/lang.js";

const Row = ({
  actionsComponent: ActionsComponent = EntitiesActions,
  entity,
  links = true,
  onFilterChanged,
  onToggleDetailsClick,
  ...props
}) => {
  const gmp = useGmp();
  const handleFilterChanged = () => {
    const filter = Filter.fromString('family="' + entity.family + '"');
    onFilterChanged(filter);
  };
  const epssScore = entity?.epss?.max_severity?.score
  const epssPercentile = entity?.epss?.max_severity?.percentile

  return (
    <TableRow>
      <TableData>
        <span>
          <RowDetailsToggle name={entity.id} onClick={onToggleDetailsClick}>
            {entity.name}
          </RowDetailsToggle>
        </span>
      </TableData>
      <TableData>
        <span>
          <Link
            to="nvts"
            filter={'family="' + entity.family + '"'}
            textOnly={!links}
            onClick={handleFilterChanged}
          >
            {entity.family}
          </Link>
        </span>
      </TableData>
      <TableData>
        <DateTime date={entity.creationTime} />
      </TableData>
      <TableData>
        <DateTime date={entity.modificationTime} />
      </TableData>
      <TableData>
        <Divider wrap>
          {entity.cves.map(id => (
            <CveLink key={id} id={id} textOnly={!links} />
          ))}
        </Divider>
      </TableData>
      <TableData align="center">
        {isDefined(entity?.solution) && (
          <SolutionTypeIcon type={entity.solution.type} />
        )}
      </TableData>
      <TableData>
        <SeverityBar severity={entity.severity} />
      </TableData>
      <TableData align="end">
        {entity.qod && <Qod value={entity.qod.value} />}
      </TableData>
      {
        gmp.settings.enableEPSS &&
        <>
          <TableData>
            {isNumber(epssScore) ? epssScore.toFixed(5) : _("N/A")}
          </TableData>
          <TableData>
            {isNumber(epssPercentile) ? epssPercentile.toFixed(5) : _("N/A")}
          </TableData>
        </>
      }
      <ActionsComponent {...props} entity={entity} />
    </TableRow>
  );
};

Row.propTypes = {
  actionsComponent: PropTypes.component,
  entity: PropTypes.model.isRequired,
  links: PropTypes.bool,
  onFilterChanged: PropTypes.func.isRequired,
  onToggleDetailsClick: PropTypes.func.isRequired,
};

export default Row;

// vim: set ts=2 sw=2 tw=80:
