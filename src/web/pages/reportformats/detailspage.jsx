/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */


import React from 'react';

import _ from 'gmp/locale';

import CreateIcon from 'web/entity/icon/createicon';
import TrashIcon from 'web/entity/icon/trashicon';
import Divider from 'web/components/layout/divider';
import EditIcon from 'web/entity/icon/editicon';
import IconDivider from 'web/components/layout/icondivider';
import Layout from 'web/components/layout/layout';
import PageTitle from 'web/components/layout/pagetitle';
import ListIcon from 'web/components/icon/listicon';
import ManualIcon from 'web/components/icon/manualicon';
import ReportFormatIcon from 'web/components/icon/reportformaticon';

import Tab from 'web/components/tab/tab';
import TabLayout from 'web/components/tab/tablayout';
import TabList from 'web/components/tab/tablist';
import TabPanel from 'web/components/tab/tabpanel';
import TabPanels from 'web/components/tab/tabpanels';
import Tabs from 'web/components/tab/tabs';

import Table from 'web/components/table/stripedtable';
import TableBody from 'web/components/table/body';
import TableData, {TableDataAlignTop} from 'web/components/table/data';
import TableHeader from 'web/components/table/header';
import TableHead from 'web/components/table/head';
import TableRow from 'web/components/table/row';

import EntityPage from 'web/entity/page';
import {goto_details, goto_list} from 'web/entity/component';
import EntityPermissions from 'web/entity/permissions';
import EntitiesTab from 'web/entity/tab';
import EntityTags from 'web/entity/tags';
import withEntityContainer, {
  permissionsResourceFilter,
} from 'web/entity/withEntityContainer';

import {selector, loadEntity} from 'web/store/entities/reportformats';

import {
  selector as permissionsSelector,
  loadEntities as loadPermissions,
} from 'web/store/entities/permissions';

import PropTypes from 'web/utils/proptypes';
import withCapabilities from 'web/utils/withCapabilities';

import ReportFormatComponent from './component';
import ReportFormatDetails from './details';
import DetailsLink from 'web/components/link/detailslink';
import {map} from 'gmp/utils/array';
import {isDefined} from 'gmp/utils/identity';
import {renderYesNo} from 'web/utils/render';
import styled from 'styled-components';

const ToolBarIcons = withCapabilities(
  ({
    capabilities,
    entity,
    onReportFormatImportClick,
    onReportFormatDeleteClick,
    onReportFormatEditClick,
  }) => (
    <Divider margin="10px">
      <IconDivider>
        <ManualIcon
          page="reports"
          anchor="managing-report-formats"
          title={_('Help: Report Formats')}
        />
        <ListIcon title={_('Report Formats List')} page="reportformats" />
      </IconDivider>
      <IconDivider>
        <CreateIcon
          displayName={_('Report Format')}
          entity={entity}
          onClick={onReportFormatImportClick}
        />
        <EditIcon
          displayName={_('Report Format')}
          disabled={entity.predefined}
          entity={entity}
          onClick={onReportFormatEditClick}
        />
        <TrashIcon
          displayName={_('Report Format')}
          entity={entity}
          onClick={onReportFormatDeleteClick}
        />
      </IconDivider>
    </Divider>
  ),
);

ToolBarIcons.propTypes = {
  entity: PropTypes.model.isRequired,
  onReportFormatDeleteClick: PropTypes.func.isRequired,
  onReportFormatEditClick: PropTypes.func.isRequired,
  onReportFormatImportClick: PropTypes.func.isRequired,
};

const Details = ({entity, links = true}) => {
  return (
    <Layout flex="column">
      <ReportFormatDetails entity={entity} links={links} />
    </Layout>
  );
};

Details.propTypes = {
  entity: PropTypes.model.isRequired,
  links: PropTypes.bool,
};
const ReportFormatParamValue = ({
  param,
  value = param.value,
  value_labels = param.value_labels,
  links = true,
}) => {
  if (param.type === 'report_format_list') {
    return map(value, report_format_id => {
      const label = isDefined(value_labels[report_format_id])
        ? value_labels[report_format_id]
        : report_format_id;
      return (
        <DetailsLink
          type="reportformat"
          key={param.name + '_' + report_format_id}
          id={report_format_id}
          textOnly={!links}
        >
          {label}
        </DetailsLink>
      );
    });
  } else if (param.type === 'multi_selection') {
    const OptionsList = styled.ul`
      margin: 0;
      padding-left: 1em;
    `;
    return (
      <OptionsList>
        {param.value.map(option => (
          <li key={param.name + '=' + option}>{option}</li>
        ))}
      </OptionsList>
    );
  } else if (param.type === 'text') {
    return <pre>{value}</pre>;
  } else if (param.type === 'boolean') {
    return renderYesNo(value);
  }

  return value;
};

ReportFormatParamValue.propTypes = {
  links: PropTypes.bool,
  param: PropTypes.any.isRequired,
  value: PropTypes.any,
  value_labels: PropTypes.object,
};

const Parameters = ({entity}) => {
  const {params = []} = entity;

  return (
    <Layout>
      {params.length === 0 && _('No parameters available')}
      {params.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead width="30%">{_('Name')}</TableHead>
              <TableHead width="70%">{_('Value')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {params.map(param => (
              <TableRow key={param.name}>
                <TableDataAlignTop>{param.name}</TableDataAlignTop>
                <TableData>
                  <ReportFormatParamValue param={param} value={param.value} />
                </TableData>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Layout>
  );
};

Parameters.propTypes = {
  entity: PropTypes.model.isRequired,
};

const Page = ({
  entity,
  links = true,
  permissions = [],
  onChanged,
  onError,
  onInteraction,
  ...props
}) => (
  <ReportFormatComponent
    onDeleted={goto_list('reportformats', props)}
    onDeleteError={onError}
    onImported={goto_details('reportformat', props)}
    onInteraction={onInteraction}
    onSaved={onChanged}
  >
    {({delete: delete_func, edit, import: import_func, save}) => (
      <EntityPage
        {...props}
        entity={entity}
        sectionIcon={<ReportFormatIcon size="large" />}
        title={_('Report Format')}
        toolBarIcons={ToolBarIcons}
        onInteraction={onInteraction}
        onReportFormatImportClick={import_func}
        onReportFormatDeleteClick={delete_func}
        onReportFormatEditClick={edit}
        onReportFormatSaveClick={save}
      >
        {({activeTab = 0, onActivateTab}) => {
          return (
            <React.Fragment>
              <PageTitle
                title={_('Report Format: {{name}}', {name: entity.name})}
              />
              <Layout grow="1" flex="column">
                <TabLayout grow="1" align={['start', 'end']}>
                  <TabList
                    active={activeTab}
                    align={['start', 'stretch']}
                    onActivateTab={onActivateTab}
                  >
                    <Tab>{_('Information')}</Tab>
                    <EntitiesTab entities={entity.params}>
                      {_('Parameters')}
                    </EntitiesTab>
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
                      <Details entity={entity} links={links} />
                    </TabPanel>
                    <TabPanel>
                      <Parameters entity={entity} />
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
  </ReportFormatComponent>
);

Page.propTypes = {
  entity: PropTypes.model,
  links: PropTypes.bool,
  permissions: PropTypes.array,
  onChanged: PropTypes.func.isRequired,
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

export default withEntityContainer('reportformat', {
  entitySelector: selector,
  load,
  mapStateToProps,
})(Page);

// vim: set ts=2 sw=2 tw=80:
