/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import {describe, test, expect} from '@gsa/testing';

import {ALL_FILTER} from 'gmp/models/filter';

import {createHttp, createEntitiesResponse} from '../testing';
import {ReportsCommand} from '../reports';

describe('ReportsCommand tests', () => {
  test('should return all reports', () => {
    const response = createEntitiesResponse('report', [
      {
        _id: '1',
      },
      {
        _id: '2',
      },
    ]);

    const fakeHttp = createHttp(response);

    expect.hasAssertions();

    const cmd = new ReportsCommand(fakeHttp);
    return cmd.getAll().then(resp => {
      expect(fakeHttp.request).toHaveBeenCalledWith('get', {
        args: {
          cmd: 'get_reports',
          details: 0,
          filter: ALL_FILTER.toFilterString(),
        },
      });
      const {data} = resp;
      expect(data.length).toEqual(2);
    });
  });

  test('should return results', () => {
    const response = createEntitiesResponse('report', [
      {
        _id: '1',
      },
      {
        _id: '2',
      },
    ]);

    const fakeHttp = createHttp(response);

    expect.hasAssertions();

    const cmd = new ReportsCommand(fakeHttp);
    return cmd.get().then(resp => {
      expect(fakeHttp.request).toHaveBeenCalledWith('get', {
        args: {
          cmd: 'get_reports',
          details: 0,
        },
      });
      const {data} = resp;
      expect(data.length).toEqual(2);
    });
  });
});
