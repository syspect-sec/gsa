/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import _ from 'gmp/locale';
import React from 'react';
import Badge from 'web/components/badge/badge';
import SeverityBar from 'web/components/bar/severitybar';
import CpeIcon from 'web/components/icon/cpeicon';
import DeleteIcon from 'web/components/icon/deleteicon';
import ExportIcon from 'web/components/icon/exporticon';
import HostIcon from 'web/components/icon/hosticon';
import ListIcon from 'web/components/icon/listicon';
import ManualIcon from 'web/components/icon/manualicon';
import OsSvgIcon from 'web/components/icon/ossvgicon';
import Divider from 'web/components/layout/divider';
import IconDivider from 'web/components/layout/icondivider';
import Layout from 'web/components/layout/layout';
import PageTitle from 'web/components/layout/pagetitle';
import Link from 'web/components/link/link';
import Tab from 'web/components/tab/tab';
import TabLayout from 'web/components/tab/tablayout';
import TabList from 'web/components/tab/tablist';
import TabPanel from 'web/components/tab/tabpanel';
import TabPanels from 'web/components/tab/tabpanels';
import Tabs from 'web/components/tab/tabs';
import TableBody from 'web/components/table/body';
import TableData from 'web/components/table/data';
import InfoTable from 'web/components/table/infotable';
import TableRow from 'web/components/table/row';
import {goToList} from 'web/entity/component';
import EntityPage, {Col} from 'web/entity/page';
import EntityPermissions from 'web/entity/permissions';
import EntitiesTab from 'web/entity/tab';
import EntityTags from 'web/entity/tags';
import withEntityContainer, {
  permissionsResourceFilter,
} from 'web/entity/withEntityContainer';
import {
  selector as osSelector,
  loadEntity,
} from 'web/store/entities/operatingsystems';
import {
  selector as permissionsSelector,
  loadEntities as loadPermissions,
} from 'web/store/entities/permissions';
import PropTypes from 'web/utils/proptypes';
import withCapabilities from 'web/utils/withCapabilities';

import OsComponent from './component';

let ToolBarIcons = ({
  capabilities,
  entity,
  links = true,
  onOperatingSystemDeleteClick,
  onOperatingSystemDownloadClick,
}) => {
  const {allHosts, hosts} = entity;
  return (
    <Divider margin="10px">
      <IconDivider>
        <ManualIcon
          anchor="managing-operating-systems"
          page="managing-assets"
          title={_('Help: Operating Systems')}
        />
        <ListIcon page="operatingsystems" title={_('Operating System List')} />
      </IconDivider>
      <IconDivider>
        {capabilities.mayDelete('os') &&
          (entity.isInUse() ? (
            <DeleteIcon
              active={false}
              title={_('Operating System is in use')}
            />
          ) : (
            <DeleteIcon
              title={_('Delete')}
              value={entity}
              onClick={onOperatingSystemDeleteClick}
            />
          ))}
        <ExportIcon
          title={_('Export Operating System')}
          value={entity}
          onClick={onOperatingSystemDownloadClick}
        />
      </IconDivider>
      <IconDivider>
        <Badge content={allHosts.length}>
          <Link
            filter={'os_id="' + entity.id + '"'}
            textOnly={!links}
            title={_('Hosts with Operating System {{- name}}', entity)}
            to="hosts"
          >
            <HostIcon />
          </Link>
        </Badge>
      </IconDivider>
      <IconDivider>
        <Badge content={hosts.length}>
          <Link
            filter={'best_os_cpe="' + entity.name + '"'}
            textOnly={!links}
            title={_(
              'Hosts with Operating System {{- name}} as the best match',
              entity,
            )}
            to="hosts"
          >
            <HostIcon />
          </Link>
        </Badge>
      </IconDivider>
    </Divider>
  );
};

ToolBarIcons.propTypes = {
  capabilities: PropTypes.capabilities.isRequired,
  entity: PropTypes.model.isRequired,
  links: PropTypes.bool,
  onOperatingSystemDeleteClick: PropTypes.func.isRequired,
  onOperatingSystemDownloadClick: PropTypes.func.isRequired,
};

ToolBarIcons = withCapabilities(ToolBarIcons);

const Details = ({entity}) => {
  const {averageSeverity, highestSeverity, latestSeverity, name} = entity;
  return (
    <Layout flex="column">
      <InfoTable>
        <colgroup>
          <Col width="10%" />
          <Col width="90%" />
        </colgroup>
        <TableBody>
          <TableRow>
            <TableData>{_('Name')}</TableData>
            <TableData>
              <IconDivider align={['start', 'center']}>
                <CpeIcon name={name} />
                <span>{name}</span>
              </IconDivider>
            </TableData>
          </TableRow>

          <TableRow>
            <TableData>{_('Latest Severity')}</TableData>
            <TableData>
              <SeverityBar severity={latestSeverity} />
            </TableData>
          </TableRow>

          <TableRow>
            <TableData>{_('Highest Severity')}</TableData>
            <TableData>
              <SeverityBar severity={highestSeverity} />
            </TableData>
          </TableRow>

          <TableRow>
            <TableData>{_('Average Severity')}</TableData>
            <TableData>
              <SeverityBar severity={averageSeverity} />
            </TableData>
          </TableRow>
        </TableBody>
      </InfoTable>
    </Layout>
  );
};

Details.propTypes = {
  entity: PropTypes.model.isRequired,
};

const Page = ({
  entity,
  permissions = [],
  onDownloaded,
  onChanged,
  onError,
  onInteraction,
  ...props
}) => (
  <OsComponent
    onDeleteError={onError}
    onDeleted={goToList('operatingsystems', props)}
    onDownloadError={onError}
    onDownloaded={onDownloaded}
    onInteraction={onInteraction}
  >
    {({delete: delete_func, download}) => (
      <EntityPage
        {...props}
        entity={entity}
        sectionIcon={<OsSvgIcon size="large" />}
        title={_('Operating System')}
        toolBarIcons={ToolBarIcons}
        onInteraction={onInteraction}
        onOperatingSystemDeleteClick={delete_func}
        onOperatingSystemDownloadClick={download}
        onPermissionChanged={onChanged}
        onPermissionDownloadError={onError}
        onPermissionDownloaded={onDownloaded}
      >
        {({activeTab = 0, onActivateTab}) => {
          return (
            <React.Fragment>
              <PageTitle
                title={_('Operating System: {{name}}', {name: entity.name})}
              />
              <Layout flex="column" grow="1">
                <TabLayout align={['start', 'end']} grow="1">
                  <TabList
                    active={activeTab}
                    align={['start', 'stretch']}
                    onActivateTab={onActivateTab}
                  >
                    <Tab>{_('Information')}</Tab>
                    <EntitiesTab entities={entity.userTags}>
                      {_('User Tags')}
                    </EntitiesTab>
                    <EntitiesTab entities={permissions}>
                      {_('Permissions')}
                    </EntitiesTab>
                  </TabList>
                </TabLayout>

                <Tabs active={activeTab}>
                  <TabPanels>
                    <TabPanel>
                      <Details entity={entity} />
                    </TabPanel>
                    <TabPanel>
                      <EntityTags
                        entity={entity}
                        onChanged={onChanged}
                        onError={onError}
                        onInteraction={onInteraction}
                      />
                    </TabPanel>
                    <TabPanel>
                      <EntityPermissions
                        entity={entity}
                        permissions={permissions}
                        onChanged={onChanged}
                        onDownloaded={onDownloaded}
                        onError={onError}
                        onInteraction={onInteraction}
                      />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Layout>
            </React.Fragment>
          );
        }}
      </EntityPage>
    )}
  </OsComponent>
);

Page.propTypes = {
  entity: PropTypes.model,
  permissions: PropTypes.array,
  onChanged: PropTypes.func.isRequired,
  onDownloaded: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  onInteraction: PropTypes.func.isRequired,
};

const load = gmp => {
  const loadEntityFunc = loadEntity(gmp);
  const loadPermissionsFunc = loadPermissions(gmp);
  return id => dispatch =>
    Promise.all([
      dispatch(loadEntityFunc(id)),
      dispatch(loadPermissionsFunc(permissionsResourceFilter(id))),
    ]);
};

const mapStateToProps = (rootState, {id}) => {
  const permissionsSel = permissionsSelector(rootState);
  return {
    permissions: permissionsSel.getEntities(permissionsResourceFilter(id)),
  };
};

export default withEntityContainer('operatingsystem', {
  entitySelector: osSelector,
  load,
  mapStateToProps,
})(Page);
