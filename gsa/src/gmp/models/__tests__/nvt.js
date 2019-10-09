/* Copyright (C) 2018 Greenbone Networks GmbH
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 */

/* eslint-disable max-len */

import Nvt from 'gmp/models/nvt';
import Info from 'gmp/models/info';
import {testModelFromElement, testModelMethods} from 'gmp/models/testing';

describe('nvt Model tests', () => {
  testModelFromElement(Nvt, 'nvt');
  testModelMethods(Nvt);

  test('should parse NVT oid as id', () => {
    const nvt1 = Nvt.fromElement({_oid: '42.1337'});
    const nvt2 = Nvt.fromElement({});
    const nvt3 = Nvt.fromElement({nvt: {_oid: '1.2.3'}});

    expect(nvt1.id).toEqual('42.1337');
    expect(nvt1.oid).toEqual('42.1337');
    expect(nvt2.id).toBeUndefined();
    expect(nvt2.oid).toBeUndefined();
    expect(nvt3.id).toEqual('1.2.3');
    expect(nvt3.oid).toEqual('1.2.3');
  });

  test('should not allow to overwrite id', () => {
    const nvt = Nvt.fromElement({_oid: 'foo'});

    expect(() => (nvt.id = 'bar')).toThrow();
  });

  test('should be instance of Info', () => {
    const nvt = new Nvt();
    const nvt2 = Nvt.fromElement({});

    expect(nvt).toBeInstanceOf(Info);
    expect(nvt2).toBeInstanceOf(Info);
  });

  test('should parse nvt_type', () => {
    const nvt = Nvt.fromElement({_type: 'foo'});

    expect(nvt.nvt_type).toEqual('foo');
  });

  test('should parse tags', () => {
    const nvt1 = Nvt.fromElement({tags: 'bv=/A:P|st=vf'});
    const nvt2 = Nvt.fromElement({});
    const nvt3 = Nvt.fromElement({nvt: {tags: 'bv=/A:P|st=vf'}});
    const res = {
      bv: '/A:P',
      st: 'vf',
    };

    expect(nvt1.tags).toEqual(res);
    expect(nvt2.tags).toEqual({});
    expect(nvt3.tags).toEqual(res);
  });

  test('should parse cve and cve_id', () => {
    const nvt1 = Nvt.fromElement({cve: '42', cve_id: '21'});
    const nvt2 = Nvt.fromElement({cve: '42, 21'});
    const nvt3 = Nvt.fromElement({cve: ''});
    const nvt4 = Nvt.fromElement({cve: 'NOCVE'});
    const nvt5 = Nvt.fromElement({});
    const nvt6 = Nvt.fromElement({nvt: {cve: '42', cve_id: '21'}});

    expect(nvt1.cves).toEqual(['42', '21']);
    expect(nvt1.cve).toBeUndefined();
    expect(nvt1.cve_id).toBeUndefined();
    expect(nvt2.cves).toEqual(['42', '21']);
    expect(nvt3.cves).toEqual([]);
    expect(nvt4.cves).toEqual([]);
    expect(nvt5.cves).toEqual([]);
    expect(nvt6.cves).toEqual(['42', '21']);
  });

  test('should parse bid and bugtraq_id', () => {
    const nvt1 = Nvt.fromElement({bid: '42', bugtraq_id: '21'});
    const nvt2 = Nvt.fromElement({bid: '42, 21'});
    const nvt3 = Nvt.fromElement({bid: ''});
    const nvt4 = Nvt.fromElement({bid: 'NOBID'});
    const nvt5 = Nvt.fromElement({});
    const nvt6 = Nvt.fromElement({nvt: {bid: '42', bugtraq_id: '21'}});

    expect(nvt1.bids).toEqual(['42', '21']);
    expect(nvt1.bid).toBeUndefined();
    expect(nvt1.bugtraq_id).toBeUndefined();
    expect(nvt2.bids).toEqual(['42', '21']);
    expect(nvt3.bids).toEqual([]);
    expect(nvt4.bids).toEqual([]);
    expect(nvt5.bids).toEqual([]);
    expect(nvt6.bids).toEqual(['42', '21']);
  });

  test('should parse severity', () => {
    const nvt1 = Nvt.fromElement({cvss_base: '8.5'});
    const nvt2 = Nvt.fromElement({cvss_base: ''});
    const nvt3 = Nvt.fromElement({nvt: {cvss_base: '8.5'}});

    expect(nvt1.severity).toEqual(8.5);
    expect(nvt1.cvss_base).toBeUndefined();
    expect(nvt2.severity).toBeUndefined();
    expect(nvt3.cvss_base).toBeUndefined();
    expect(nvt3.severity).toEqual(8.5);
  });

  test('should parse preferences', () => {
    const elem = {
      preferences: {
        preference: [
          {
            nvt: '123',
            foo: 'bar',
            lorem: 'ipsum',
          },
        ],
      },
    };
    const res = [
      {
        foo: 'bar',
        lorem: 'ipsum',
      },
    ];
    const nvt1 = Nvt.fromElement({});
    const nvt2 = Nvt.fromElement(elem);
    const nvt3 = Nvt.fromElement({nvt: elem});

    expect(nvt1.preferences).toEqual([]);
    expect(nvt2.preferences).toEqual(res);
    expect(nvt3.preferences).toEqual(res);
  });

  test('should parse cert and cert_refs', () => {
    const elem2 = {
      cert: {
        cert_ref: [
          {
            _id: '123',
            _type: 'foo',
          },
          {
            _id: '456',
            _type: 'bar',
          },
        ],
      },
    };
    const res2 = [
      {
        id: '123',
        type: 'foo',
      },
      {
        id: '456',
        type: 'bar',
      },
    ];
    const elem3 = {
      cert_refs: {
        cert_ref: [
          {
            _id: '123',
            _type: 'foo',
          },
        ],
      },
    };
    const res3 = [
      {
        id: '123',
        type: 'foo',
      },
    ];
    const elem4 = {
      cert: {
        cert_ref: [
          {
            _id: '1',
            _type: 'foo',
          },
        ],
      },
      cert_refs: {
        cert_ref: [
          {
            _id: '2',
            _type: 'bar',
          },
        ],
      },
    };
    const res4 = [
      {
        id: '1',
        type: 'foo',
      },
      {
        id: '2',
        type: 'bar',
      },
    ];

    const nvt1 = Nvt.fromElement({});
    const nvt2 = Nvt.fromElement(elem2);
    const nvt3 = Nvt.fromElement(elem3);
    const nvt4 = Nvt.fromElement(elem4);
    const nvt5 = Nvt.fromElement({nvt: elem4});

    expect(nvt1.certs).toEqual([]);
    expect(nvt2.cert).toBeUndefined();
    expect(nvt2.certs).toEqual(res2);
    expect(nvt3.certs).toEqual(res3);
    expect(nvt3.cert_refs).toBeUndefined();
    expect(nvt4.certs).toEqual(res4);
    expect(nvt5.certs).toEqual(res4);
  });

  test('should parse xrefs with correct protocol', () => {
    const nvt1 = Nvt.fromElement({xrefs: '42'});
    const nvt2 = Nvt.fromElement({xrefs: '42, 21'});
    const nvt3 = Nvt.fromElement({xrefs: 'URL:42'});
    const nvt4 = Nvt.fromElement({xrefs: 'URL:http://42'});
    const nvt5 = Nvt.fromElement({xrefs: 'URL:https://42'});
    const nvt6 = Nvt.fromElement({xrefs: 'URL:ftp://42'});
    const nvt7 = Nvt.fromElement({xrefs: 'URL:ftps://42'});
    const nvt8 = Nvt.fromElement({xrefs: 'ftps://42'});
    const nvt9 = Nvt.fromElement({nvt: {xrefs: 'URL:https://42'}});

    expect(nvt1.xrefs).toEqual([{ref: '42', type: 'other'}]);
    expect(nvt2.xrefs).toEqual([
      {ref: '42', type: 'other'},
      {ref: '21', type: 'other'},
    ]);
    expect(nvt3.xrefs).toEqual([{ref: 'http://42', type: 'URL'}]);
    expect(nvt4.xrefs).toEqual([{ref: 'http://42', type: 'URL'}]);
    expect(nvt5.xrefs).toEqual([{ref: 'https://42', type: 'URL'}]);
    expect(nvt6.xrefs).toEqual([{ref: 'ftp://42', type: 'URL'}]);
    expect(nvt7.xrefs).toEqual([{ref: 'ftps://42', type: 'URL'}]);
    expect(nvt8.xrefs).toEqual([{ref: 'ftps://42', type: 'other'}]);
    expect(nvt8.xref).toBeUndefined();
    expect(nvt9.xrefs).toEqual([{ref: 'https://42', type: 'URL'}]);
  });

  test('should parse qod', () => {
    const nvt1 = Nvt.fromElement({});
    const nvt2 = Nvt.fromElement({qod: {value: ''}});
    const nvt3 = Nvt.fromElement({qod: {value: '75.5'}});
    const nvt4 = Nvt.fromElement({qod: {type: ''}});
    const nvt5 = Nvt.fromElement({qod: {type: 'foo'}});
    const nvt6 = Nvt.fromElement({qod: {value: '75.5', type: 'foo'}});
    const nvt7 = Nvt.fromElement({nvt: {qod: {value: '75.5', type: 'foo'}}});

    expect(nvt1.qod).toBeUndefined();
    expect(nvt2.qod.value).toBeUndefined();
    expect(nvt3.qod.value).toEqual(75.5);
    expect(nvt4.qod.type).toBeUndefined();
    expect(nvt5.qod.type).toEqual('foo');
    expect(nvt6.qod).toEqual({value: 75.5, type: 'foo'});
    expect(nvt7.qod).toEqual({value: 75.5, type: 'foo'});
  });

  test('should parse default_timeout', () => {
    const nvt1 = Nvt.fromElement({});
    const nvt2 = Nvt.fromElement({default_timeout: ''});
    const nvt3 = Nvt.fromElement({default_timeout: '123'});
    const nvt4 = Nvt.fromElement({nvt: {default_timeout: '123'}});

    expect(nvt1.default_timeout).toBeUndefined();
    expect(nvt2.default_timeout).toBeUndefined();
    expect(nvt3.default_timeout).toEqual(123);
    expect(nvt4.default_timeout).toEqual(123);
  });

  test('should parse timeout', () => {
    const nvt1 = Nvt.fromElement({});
    const nvt2 = Nvt.fromElement({timeout: ''});
    const nvt3 = Nvt.fromElement({timeout: '123'});
    const nvt4 = Nvt.fromElement({nvt: {timeout: '123'}});

    expect(nvt1.timeout).toBeUndefined();
    expect(nvt2.timeout).toBeUndefined();
    expect(nvt3.timeout).toEqual(123);
    expect(nvt4.timeout).toEqual(123);
  });

  test('should parse nvt type', () => {
    const nvt1 = Nvt.fromElement({});
    const nvt2 = Nvt.fromElement({_type: 'foo'});
    const nvt3 = Nvt.fromElement({nvt: {_type: 'foo'}});

    expect(nvt1.nvt_type).toBeUndefined();
    expect(nvt2.nvt_type).toEqual('foo');
    expect(nvt3.nvt_type).toEqual('foo');
  });
});
