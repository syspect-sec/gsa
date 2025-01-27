/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import _ from 'gmp/locale';
import {TARGET_CREDENTIAL_NAMES} from 'gmp/models/target';
import {isDefined} from 'gmp/utils/identity';
import React from 'react';
import ExportIcon from 'web/components/icon/exporticon';
import ListIcon from 'web/components/icon/listicon';
import ManualIcon from 'web/components/icon/manualicon';
import TargetIcon from 'web/components/icon/targeticon';
import Divider from 'web/components/layout/divider';
import IconDivider from 'web/components/layout/icondivider';
import Layout from 'web/components/layout/layout';
import PageTitle from 'web/components/layout/pagetitle';
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
import {goToDetails, goToList} from 'web/entity/component';
import CloneIcon from 'web/entity/icon/cloneicon';
import CreateIcon from 'web/entity/icon/createicon';
import EditIcon from 'web/entity/icon/editicon';
import TrashIcon from 'web/entity/icon/trashicon';
import EntityPage from 'web/entity/page';
import EntityPermissions from 'web/entity/permissions';
import EntitiesTab from 'web/entity/tab';
import EntityTags from 'web/entity/tags';
import withEntityContainer, {
  permissionsResourceFilter,
} from 'web/entity/withEntityContainer';
import {
  selector as permissionsSelector,
  loadEntities as loadPermissions,
} from 'web/store/entities/permissions';
import {selector, loadEntity} from 'web/store/entities/targets';
import PropTypes from 'web/utils/proptypes';
import withComponentDefaults from 'web/utils/withComponentDefaults';

import TargetComponent from './component';
import TargetDetails from './details';

export const ToolBarIcons = ({
  entity,
  onTargetCloneClick,
  onTargetCreateClick,
  onTargetDeleteClick,
  onTargetDownloadClick,
  onTargetEditClick,
}) => {
  return (
    <Divider margin="10px">
      <IconDivider>
        <ManualIcon
          anchor="managing-targets"
          page="scanning"
          title={_('Help: Targets')}
        />
        <ListIcon page="targets" title={_('Target List')} />
      </IconDivider>
      <IconDivider>
        <CreateIcon entity={entity} onClick={onTargetCreateClick} />
        <CloneIcon entity={entity} onClick={onTargetCloneClick} />
        <EditIcon entity={entity} onClick={onTargetEditClick} />
        <TrashIcon entity={entity} onClick={onTargetDeleteClick} />
        <ExportIcon
          title={_('Export Target as XML')}
          value={entity}
          onClick={onTargetDownloadClick}
        />
      </IconDivider>
    </Divider>
  );
};

ToolBarIcons.propTypes = {
  entity: PropTypes.model.isRequired,
  onTargetCloneClick: PropTypes.func.isRequired,
  onTargetCreateClick: PropTypes.func.isRequired,
  onTargetDeleteClick: PropTypes.func.isRequired,
  onTargetDownloadClick: PropTypes.func.isRequired,
  onTargetEditClick: PropTypes.func.isRequired,
};

const Details = ({entity, ...props}) => (
  <Layout flex="column">
    <InfoTable>
      <TableBody>
        <TableRow>
          <TableData>{_('Name')}</TableData>
          <TableData>{entity.name}</TableData>
        </TableRow>

        <TableRow>
          <TableData>{_('Comment')}</TableData>
          <TableData>{entity.comment}</TableData>
        </TableRow>
      </TableBody>
    </InfoTable>

    <TargetDetails entity={entity} {...props} />
  </Layout>
);

Details.propTypes = {
  entity: PropTypes.model.isRequired,
};

const Page = ({
  entity,
  permissions = [],
  onChanged,
  onDownloaded,
  onError,
  onInteraction,
  ...props
}) => {
  return (
    <TargetComponent
      onCloneError={onError}
      onCloned={goToDetails('target', props)}
      onCreated={goToDetails('target', props)}
      onDeleteError={onError}
      onDeleted={goToList('targets', props)}
      onDownloadError={onError}
      onDownloaded={onDownloaded}
      onInteraction={onInteraction}
      onSaved={onChanged}
    >
      {({clone, create, delete: delete_func, download, edit, save}) => (
        <EntityPage
          {...props}
          entity={entity}
          sectionIcon={<TargetIcon size="large" />}
          title={_('Target')}
          toolBarIcons={ToolBarIcons}
          onInteraction={onInteraction}
          onTargetCloneClick={clone}
          onTargetCreateClick={create}
          onTargetDeleteClick={delete_func}
          onTargetDownloadClick={download}
          onTargetEditClick={edit}
          onTargetSaveClick={save}
        >
          {({activeTab = 0, onActivateTab}) => {
            return (
              <React.Fragment>
                <PageTitle title={_('Target: {{name}}', {name: entity.name})} />
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
                        <TargetDetails entity={entity} />
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
                        <TargetPermissions
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
    </TargetComponent>
  );
};

Page.propTypes = {
  entity: PropTypes.model,
  permissions: PropTypes.array,
  onChanged: PropTypes.func.isRequired,
  onDownloaded: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  onInteraction: PropTypes.func.isRequired,
};

const TargetPermissions = withComponentDefaults({
  relatedResourcesLoaders: [
    ({entity}) => {
      const resources = [];
      for (const name of ['port_list', ...TARGET_CREDENTIAL_NAMES]) {
        const cred = entity[name];
        if (isDefined(cred)) {
          resources.push(cred);
        }
      }
      return Promise.resolve(resources);
    },
  ],
})(EntityPermissions);

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

export default withEntityContainer('target', {
  entitySelector: selector,
  load,
  mapStateToProps,
})(Page);
