/* Copyright (C) 2021-2022 Greenbone AG
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
import {describe, test, expect, testing} from '@gsa/testing';

import Capabilities from 'gmp/capabilities/capabilities';
import CollectionCounts from 'gmp/collection/collectioncounts';

import Credential from 'gmp/models/credential';
import Filter from 'gmp/models/filter';

import {entityLoadingActions} from 'web/store/entities/credentials';
import {setTimezone, setUsername} from 'web/store/usersettings/actions';

import {rendererWith, screen, fireEvent} from 'web/utils/testing';

import Detailspage, {ToolBarIcons} from '../detailspage';

let getCredential;
let getEntities;
let currentSettings;
let renewSession;

beforeEach(() => {
  getCredential = testing.fn().mockResolvedValue({
    data: credential,
  });
  getEntities = testing.fn().mockResolvedValue({
    data: [],
    meta: {
      filter: Filter.fromString(),
      counts: new CollectionCounts(),
    },
  });
  currentSettings = testing.fn().mockResolvedValue({
    foo: 'bar',
  });
  renewSession = testing.fn().mockResolvedValue({
    foo: 'bar',
  });
});

const caps = new Capabilities(['everything']);

const reloadInterval = -1;
const manualUrl = 'test/';

const credential = Credential.fromElement({
  _id: '6575',
  allow_insecure: 1,
  creation_time: '2020-12-16T15:23:59Z',
  comment: 'blah',
  full_type: 'Username + SSH Key',
  in_use: 0,
  login: '',
  modification_time: '2021-03-02T10:28:15Z',
  name: 'credential 1',
  owner: {name: 'admin'},
  permissions: {permission: {name: 'Everything'}},
  type: 'usk',
  writable: 1,
});

const noPermCredential = Credential.fromElement({
  _id: '6575',
  allow_insecure: 1,
  creation_time: '2020-12-16T15:23:59Z',
  comment: 'blah',
  full_type: 'Username + SSH Key',
  in_use: 0,
  login: '',
  modification_time: '2021-03-02T10:28:15Z',
  name: 'credential 1',
  owner: {name: 'admin'},
  permissions: {permission: {name: 'get_credentials'}},
  type: 'usk',
  writable: 1,
});

const credentialInUse = Credential.fromElement({
  _id: '6575',
  allow_insecure: 1,
  creation_time: '2020-12-16T15:23:59Z',
  comment: 'blah',
  full_type: 'Username + SSH Key',
  in_use: 1,
  login: '',
  modification_time: '2021-03-02T10:28:15Z',
  name: 'credential 1',
  owner: {name: 'admin'},
  permissions: {permission: {name: 'Everything'}},
  type: 'usk',
  writable: 1,
});

describe('Credential Detailspage tests', () => {
  test('should render full Detailspage', () => {
    const gmp = {
      credential: {
        get: getCredential,
      },
      permissions: {
        get: getEntities,
      },
      settings: {manualUrl, reloadInterval},
      user: {
        currentSettings,
      },
    };

    const {render, store} = rendererWith({
      capabilities: caps,
      gmp,
      router: true,
      store: true,
    });

    store.dispatch(setTimezone('CET'));
    store.dispatch(setUsername('admin'));

    store.dispatch(entityLoadingActions.success('6575', credential));

    const {baseElement, element} = render(<Detailspage id="6575" />);

    const links = baseElement.querySelectorAll('a');

    expect(screen.getAllByTitle('Help: Credentials')[0]).toBeInTheDocument();
    expect(links[0]).toHaveAttribute(
      'href',
      'test/en/scanning.html#managing-credentials',
    );

    expect(screen.getAllByTitle('Credential List')[0]).toBeInTheDocument();
    expect(links[1]).toHaveAttribute('href', '/credentials');

    expect(element).toHaveTextContent('ID:6575');
    expect(element).toHaveTextContent('Created:Wed, Dec 16, 2020 4:23 PM CET');
    expect(element).toHaveTextContent('Modified:Tue, Mar 2, 2021 11:28 AM CET');
    expect(element).toHaveTextContent('Owner:admin');

    const spans = baseElement.querySelectorAll('span');
    expect(spans[12]).toHaveTextContent('User Tags');
    expect(spans[14]).toHaveTextContent('Permissions');

    expect(element).toHaveTextContent('Comment');
    expect(element).toHaveTextContent('blah');

    expect(element).toHaveTextContent('Type');
    expect(element).toHaveTextContent('Username + SSH Key');

    expect(element).toHaveTextContent('Allow Insecure Use');
    expect(element).toHaveTextContent('Yes');

    expect(element).toHaveTextContent('Login');
  });

  test('should render user tags tab', () => {
    const gmp = {
      credential: {
        get: getCredential,
      },
      permissions: {
        get: getEntities,
      },
      settings: {manualUrl, reloadInterval},
      user: {
        currentSettings,
        renewSession,
      },
    };

    const {render, store} = rendererWith({
      capabilities: caps,
      gmp,
      router: true,
      store: true,
    });

    store.dispatch(setTimezone('CET'));
    store.dispatch(setUsername('admin'));

    store.dispatch(entityLoadingActions.success('6575', credential));

    const {baseElement} = render(<Detailspage id="6575" />);

    const spans = baseElement.querySelectorAll('span');
    expect(spans[12]).toHaveTextContent('User Tags');

    fireEvent.click(spans[12]);

    expect(baseElement).toHaveTextContent('No user tags available');
  });

  test('should render permissions tab', () => {
    const gmp = {
      credential: {
        get: getCredential,
      },
      permissions: {
        get: getEntities,
      },
      settings: {manualUrl, reloadInterval},
      user: {
        currentSettings,
        renewSession,
      },
    };

    const {render, store} = rendererWith({
      capabilities: caps,
      gmp,
      router: true,
      store: true,
    });

    store.dispatch(setTimezone('CET'));
    store.dispatch(setUsername('admin'));

    store.dispatch(entityLoadingActions.success('6575', credential));

    const {baseElement} = render(<Detailspage id="6575" />);

    const spans = baseElement.querySelectorAll('span');
    expect(spans[14]).toHaveTextContent('Permissions');

    fireEvent.click(spans[14]);

    expect(baseElement).toHaveTextContent('No permissions available');
  });

  test('should call commands', () => {
    const clone = testing.fn().mockResolvedValue({
      data: {id: 'foo'},
    });

    const deleteFunc = testing.fn().mockResolvedValue({
      foo: 'bar',
    });

    const exportFunc = testing.fn().mockResolvedValue({
      foo: 'bar',
    });

    const gmp = {
      credential: {
        get: getCredential,
        clone,
        delete: deleteFunc,
        export: exportFunc,
      },
      permissions: {
        get: getEntities,
      },
      settings: {manualUrl, reloadInterval},
      user: {
        currentSettings,
        renewSession,
      },
    };

    const {render, store} = rendererWith({
      capabilities: caps,
      gmp,
      router: true,
      store: true,
    });

    store.dispatch(setTimezone('CET'));
    store.dispatch(setUsername('admin'));

    store.dispatch(entityLoadingActions.success('6575', credential));

    render(<Detailspage id="6575" />);

    const cloneIcon = screen.getAllByTitle('Clone Credential');
    expect(cloneIcon[0]).toBeInTheDocument();
    fireEvent.click(cloneIcon[0]);

    expect(clone).toHaveBeenCalledWith(credential);

    const exportIcon = screen.getAllByTitle('Export Credential as XML');
    expect(exportIcon[0]).toBeInTheDocument();
    fireEvent.click(exportIcon[0]);

    expect(exportFunc).toHaveBeenCalledWith(credential);

    const deleteIcon = screen.getAllByTitle('Move Credential to trashcan');
    expect(deleteIcon[0]).toBeInTheDocument();
    fireEvent.click(deleteIcon[0]);

    expect(deleteFunc).toHaveBeenCalledWith({id: credential.id});
  });
});

describe('Credential ToolBarIcons tests', () => {
  test('should render', () => {
    const handleCredentialCloneClick = testing.fn();
    const handleCredentialDeleteClick = testing.fn();
    const handleCredentialDownloadClick = testing.fn();
    const handleCredentialEditClick = testing.fn();
    const handleCredentialCreateClick = testing.fn();
    const handleCredentialInstallerDownloadClick = testing.fn();

    const gmp = {settings: {manualUrl}};

    const {render} = rendererWith({
      gmp,
      capabilities: caps,
      router: true,
    });

    const {element} = render(
      <ToolBarIcons
        entity={credential}
        onCredentialCloneClick={handleCredentialCloneClick}
        onCredentialDeleteClick={handleCredentialDeleteClick}
        onCredentialDownloadClick={handleCredentialDownloadClick}
        onCredentialEditClick={handleCredentialEditClick}
        onCredentialCreateClick={handleCredentialCreateClick}
        onCredentialInstallerDownloadClick={
          handleCredentialInstallerDownloadClick
        }
      />,
    );

    const links = element.querySelectorAll('a');

    expect(links[0]).toHaveAttribute(
      'href',
      'test/en/scanning.html#managing-credentials',
    );
    expect(screen.getAllByTitle('Help: Credentials')[0]).toBeInTheDocument();

    expect(links[1]).toHaveAttribute('href', '/credentials');
    expect(screen.getAllByTitle('Credential List')[0]).toBeInTheDocument();
  });

  test('should call click handlers', () => {
    const handleCredentialCloneClick = testing.fn();
    const handleCredentialDeleteClick = testing.fn();
    const handleCredentialDownloadClick = testing.fn();
    const handleCredentialEditClick = testing.fn();
    const handleCredentialCreateClick = testing.fn();
    const handleCredentialInstallerDownloadClick = testing.fn();

    const gmp = {settings: {manualUrl}};

    const {render} = rendererWith({
      gmp,
      capabilities: caps,
      router: true,
    });

    render(
      <ToolBarIcons
        entity={credential}
        onCredentialCloneClick={handleCredentialCloneClick}
        onCredentialDeleteClick={handleCredentialDeleteClick}
        onCredentialDownloadClick={handleCredentialDownloadClick}
        onCredentialEditClick={handleCredentialEditClick}
        onCredentialCreateClick={handleCredentialCreateClick}
        onCredentialInstallerDownloadClick={
          handleCredentialInstallerDownloadClick
        }
      />,
    );

    const cloneIcon = screen.getAllByTitle('Clone Credential')[0];
    const editIcon = screen.getAllByTitle('Edit Credential')[0];
    const deleteIcon = screen.getAllByTitle('Move Credential to trashcan')[0];
    const exportIcon = screen.getAllByTitle('Export Credential as XML')[0];
    const downloadPublicKeyIcon = screen.getAllByTitle(
      'Download Public Key',
    )[0];

    expect(cloneIcon).toBeInTheDocument();
    fireEvent.click(cloneIcon);
    expect(handleCredentialCloneClick).toHaveBeenCalledWith(credential);

    expect(editIcon).toBeInTheDocument();
    fireEvent.click(editIcon);
    expect(handleCredentialEditClick).toHaveBeenCalledWith(credential);

    expect(deleteIcon).toBeInTheDocument();
    fireEvent.click(deleteIcon);
    expect(handleCredentialDeleteClick).toHaveBeenCalledWith(credential);

    expect(exportIcon).toBeInTheDocument();
    fireEvent.click(exportIcon);
    expect(handleCredentialDownloadClick).toHaveBeenCalledWith(credential);

    expect(downloadPublicKeyIcon).toBeInTheDocument();
    fireEvent.click(downloadPublicKeyIcon);
    expect(handleCredentialInstallerDownloadClick).toHaveBeenCalledWith(
      credential,
      'key',
    );
  });

  test('should not call click handlers without permission', () => {
    const handleCredentialCloneClick = testing.fn();
    const handleCredentialDeleteClick = testing.fn();
    const handleCredentialDownloadClick = testing.fn();
    const handleCredentialEditClick = testing.fn();
    const handleCredentialCreateClick = testing.fn();
    const handleCredentialInstallerDownloadClick = testing.fn();

    const gmp = {settings: {manualUrl}};

    const {render} = rendererWith({
      gmp,
      capabilities: caps,
      router: true,
    });

    render(
      <ToolBarIcons
        entity={noPermCredential}
        onCredentialCloneClick={handleCredentialCloneClick}
        onCredentialDeleteClick={handleCredentialDeleteClick}
        onCredentialDownloadClick={handleCredentialDownloadClick}
        onCredentialEditClick={handleCredentialEditClick}
        onCredentialCreateClick={handleCredentialCreateClick}
        onCredentialInstallerDownloadClick={
          handleCredentialInstallerDownloadClick
        }
      />,
    );

    const cloneIcon = screen.getAllByTitle('Clone Credential')[0];
    const editIcon = screen.getAllByTitle(
      'Permission to edit Credential denied',
    )[0];
    const deleteIcon = screen.getAllByTitle(
      'Permission to move Credential to trashcan denied',
    )[0];
    const exportIcon = screen.getAllByTitle('Export Credential as XML')[0];

    expect(cloneIcon).toBeInTheDocument();
    fireEvent.click(cloneIcon);
    expect(handleCredentialCloneClick).toHaveBeenCalledWith(noPermCredential);

    expect(editIcon).toBeInTheDocument();
    fireEvent.click(editIcon);
    expect(handleCredentialEditClick).not.toHaveBeenCalled();

    expect(deleteIcon).toBeInTheDocument();
    fireEvent.click(deleteIcon);
    expect(handleCredentialDeleteClick).not.toHaveBeenCalled();

    expect(exportIcon).toBeInTheDocument();
    fireEvent.click(exportIcon);

    expect(handleCredentialDownloadClick).toHaveBeenCalledWith(
      noPermCredential,
    );
  });

  test('should (not) call click handlers for credential in use', () => {
    const handleCredentialCloneClick = testing.fn();
    const handleCredentialDeleteClick = testing.fn();
    const handleCredentialDownloadClick = testing.fn();
    const handleCredentialEditClick = testing.fn();
    const handleCredentialCreateClick = testing.fn();
    const handleCredentialInstallerDownloadClick = testing.fn();

    const gmp = {settings: {manualUrl}};

    const {render} = rendererWith({
      gmp,
      capabilities: caps,
      router: true,
    });

    render(
      <ToolBarIcons
        entity={credentialInUse}
        onCredentialCloneClick={handleCredentialCloneClick}
        onCredentialDeleteClick={handleCredentialDeleteClick}
        onCredentialDownloadClick={handleCredentialDownloadClick}
        onCredentialEditClick={handleCredentialEditClick}
        onCredentialCreateClick={handleCredentialCreateClick}
        onCredentialInstallerDownloadClick={
          handleCredentialInstallerDownloadClick
        }
      />,
    );
    const cloneIcon = screen.getAllByTitle('Clone Credential')[0];
    const editIcon = screen.getAllByTitle('Edit Credential')[0];
    const deleteIcon = screen.getAllByTitle('Credential is still in use')[0];
    const exportIcon = screen.getAllByTitle('Export Credential as XML')[0];

    expect(cloneIcon).toBeInTheDocument();
    fireEvent.click(cloneIcon);
    expect(handleCredentialCloneClick).toHaveBeenCalledWith(credentialInUse);

    expect(editIcon).toBeInTheDocument();
    fireEvent.click(editIcon);
    expect(handleCredentialEditClick).toHaveBeenCalled();

    expect(deleteIcon).toBeInTheDocument();
    fireEvent.click(deleteIcon);
    expect(handleCredentialDeleteClick).not.toHaveBeenCalled();

    expect(exportIcon).toBeInTheDocument();
    fireEvent.click(exportIcon);
    expect(handleCredentialDownloadClick).toHaveBeenCalledWith(credentialInUse);
  });
});
