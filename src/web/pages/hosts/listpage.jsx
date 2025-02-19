/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import _ from 'gmp/locale';
import Filter, {HOSTS_FILTER_FILTER} from 'gmp/models/filter';
import React from 'react';
import DashboardControls from 'web/components/dashboard/controls';
import HostIcon from 'web/components/icon/hosticon';
import ManualIcon from 'web/components/icon/manualicon';
import NewIcon from 'web/components/icon/newicon';
import IconDivider from 'web/components/layout/icondivider';
import PageTitle from 'web/components/layout/pagetitle';
import EntitiesPage from 'web/entities/page';
import withEntitiesContainer from 'web/entities/withEntitiesContainer';
import {goToDetails} from 'web/entity/component';
import {
  loadEntities,
  selector as entitiesSelector,
} from 'web/store/entities/hosts';
import PropTypes from 'web/utils/proptypes';
import withCapabilities from 'web/utils/withCapabilities';

import HostComponent from './component';
import HostsDashboard, {HOSTS_DASHBOARD_ID} from './dashboard';
import HostsFilterDialog from './filterdialog';
import HostsTable from './table';

export const ToolBarIcons = withCapabilities(
  ({capabilities, onHostCreateClick}) => (
    <IconDivider>
      <ManualIcon
        anchor="managing-hosts"
        page="managing-assets"
        title={_('Help: Hosts')}
      />
      {capabilities.mayCreate('host') && (
        <NewIcon title={_('New Host')} onClick={onHostCreateClick} />
      )}
    </IconDivider>
  ),
);

ToolBarIcons.propTypes = {
  capabilities: PropTypes.capabilities.isRequired,
  onHostCreateClick: PropTypes.func.isRequired,
};

const Page = ({
  entitiesCounts,
  filter,
  onChanged,
  onDownloaded,
  onError,
  onFilterChanged,
  onInteraction,
  ...props
}) => (
  <HostComponent
    entitiesCounts={entitiesCounts}
    onCreated={onChanged}
    onDeleted={onChanged}
    onDownloadError={onError}
    onDownloaded={onDownloaded}
    onInteraction={onInteraction}
    onSaved={onChanged}
    onTargetCreateError={onError}
    onTargetCreated={goToDetails('target', props)}
  >
    {({
      create,
      createtargetfromselection,
      createtargetfromhost,
      delete: delete_func,
      download,
      edit,
    }) => (
      <React.Fragment>
        <PageTitle title={_('Hosts')} />
        <EntitiesPage
          {...props}
          dashboard={() => (
            <HostsDashboard
              filter={filter}
              onFilterChanged={onFilterChanged}
              onInteraction={onInteraction}
            />
          )}
          dashboardControls={() => (
            <DashboardControls
              dashboardId={HOSTS_DASHBOARD_ID}
              onInteraction={onInteraction}
            />
          )}
          entitiesCounts={entitiesCounts}
          filter={filter}
          filterEditDialog={HostsFilterDialog}
          filtersFilter={HOSTS_FILTER_FILTER}
          sectionIcon={<HostIcon size="large" />}
          table={HostsTable}
          title={_('Hosts')}
          toolBarIcons={ToolBarIcons}
          onError={onError}
          onFilterChanged={onFilterChanged}
          onHostCreateClick={create}
          onHostDeleteClick={delete_func}
          onHostDownloadClick={download}
          onHostEditClick={edit}
          onInteraction={onInteraction}
          onTargetCreateFromHostClick={createtargetfromhost}
          onTargetCreateFromSelection={createtargetfromselection}
        />
      </React.Fragment>
    )}
  </HostComponent>
);

Page.propTypes = {
  entitiesCounts: PropTypes.counts,
  filter: PropTypes.filter,
  onChanged: PropTypes.func.isRequired,
  onDownloaded: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  onFilterChanged: PropTypes.func.isRequired,
  onInteraction: PropTypes.func.isRequired,
};

const FALLBACK_HOSTS_LIST_FILTER = Filter.fromString(
  'sort-reverse=severity first=1',
);

export default withEntitiesContainer('host', {
  fallbackFilter: FALLBACK_HOSTS_LIST_FILTER,
  entitiesSelector,
  loadEntities,
})(Page);
