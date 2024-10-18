/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import {describe, test, expect, testing} from '@gsa/testing';

import Capabilities from 'gmp/capabilities/capabilities';

import Audit, {AUDIT_STATUS} from 'gmp/models/audit';
import Task, {TASK_STATUS} from 'gmp/models/task';
import Event from 'gmp/models/event';

import {rendererWith, fireEvent} from 'web/utils/testing';

import Theme from 'web/utils/theme';

import StartIcon from '../starticon';

describe('Task StartIcon component tests', () => {
  test('should render in active state with correct permissions', () => {
    const caps = new Capabilities(['everything']);
    const task = Task.fromElement({
      status: TASK_STATUS.new,
      target: {_id: '123'},
      permissions: {permission: [{name: 'everything'}]},
    });
    const clickHandler = testing.fn();

    const {render} = rendererWith({capabilities: caps});

    const {element} = render(<StartIcon task={task} onClick={clickHandler} />);

    expect(caps.mayOp('start_task')).toEqual(true);
    expect(task.userCapabilities.mayOp('start_task')).toEqual(true);

    fireEvent.click(element);

    expect(clickHandler).toHaveBeenCalled();
    expect(element).toHaveAttribute('title', 'Start');
    expect(element).not.toHaveStyleRule('fill', Theme.inputBorderGray, {
      modifier: 'svg path.gui_icon_class',
    });
  });

  test('should render in inactive state if wrong command level permissions are given', () => {
    const caps = new Capabilities(['everything']);
    const task = Task.fromElement({
      status: TASK_STATUS.new,
      target: {_id: '123'},
      permissions: {permission: [{name: 'get_task'}]},
    });
    const clickHandler = testing.fn();

    const {render} = rendererWith({capabilities: caps});

    const {element} = render(<StartIcon task={task} />);

    expect(caps.mayOp('start_task')).toEqual(true);
    expect(task.userCapabilities.mayOp('start_task')).toEqual(false);

    fireEvent.click(element);

    expect(clickHandler).not.toHaveBeenCalled();
    expect(element).toHaveAttribute('title', 'Permission to start task denied');
    expect(element).toHaveStyleRule('fill', Theme.inputBorderGray, {
      modifier: 'svg path.gui_icon_class',
    });
  });

  test('should render in inactive state if wrong command level permissions for audit are given', () => {
    const caps = new Capabilities(['everything']);
    const audit = Audit.fromElement({
      status: AUDIT_STATUS.new,
      target: {_id: '123'},
      permissions: {permission: [{name: 'get_task'}]},
      usage_type: 'audit',
    });
    const clickHandler = testing.fn();

    const {render} = rendererWith({capabilities: caps});

    const {element} = render(<StartIcon task={audit} usageType="audit" />);

    expect(caps.mayOp('start_task')).toEqual(true);
    expect(audit.userCapabilities.mayOp('start_task')).toEqual(false);

    fireEvent.click(element);

    expect(clickHandler).not.toHaveBeenCalled();
    expect(element).toHaveAttribute(
      'title',
      'Permission to start audit denied',
    );
    expect(element).toHaveStyleRule('fill', Theme.inputBorderGray, {
      modifier: 'svg path.gui_icon_class',
    });
  });

  test('should render in inactive state if task is scheduled with a duration limit', () => {
    const caps = new Capabilities(['everything']);
    const icalendar = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Greenbone.net//NONSGML Greenbone Security Manager 8.0.0//EN
BEGIN:VEVENT
UID:c35f82f1-7798-4b84-b2c4-761a33068956
DTSTAMP:20190715T124352Z
DTSTART:20190716T040000
DTEND:20190716T050000
END:VEVENT
END:VCALENDAR
`;

    const task = Task.fromElement({
      status: TASK_STATUS.new,
      target: {_id: '123'},
      permissions: {permission: [{name: 'everything'}]},
      schedule: {
        _id: 'schedule1',
        event: Event.fromIcal(icalendar, 'UTC'),
      },
    });
    const clickHandler = testing.fn();

    const {render} = rendererWith({capabilities: caps});

    const {element} = render(<StartIcon task={task} />);

    expect(caps.mayOp('start_task')).toEqual(true);
    expect(task.userCapabilities.mayOp('start_task')).toEqual(true);

    fireEvent.click(element);

    expect(clickHandler).not.toHaveBeenCalled();
    expect(element).toHaveAttribute(
      'title',
      'Task cannot be started manually because the assigned schedule has a duration limit',
    );
    expect(element).toHaveStyleRule('fill', Theme.inputBorderGray, {
      modifier: 'svg path.gui_icon_class',
    });
  });

  test('should render in inactive state if task is already active', () => {
    const caps = new Capabilities(['everything']);
    const task = Task.fromElement({
      status: TASK_STATUS.requested,
      target: {_id: '123'},
      permissions: {permission: [{name: 'everything'}]},
    });
    const clickHandler = testing.fn();

    const {render} = rendererWith({capabilities: caps});

    const {element} = render(<StartIcon task={task} />);

    expect(caps.mayOp('start_task')).toEqual(true);
    expect(task.userCapabilities.mayOp('start_task')).toEqual(true);

    fireEvent.click(element);

    expect(clickHandler).not.toHaveBeenCalled();
    expect(element).toHaveAttribute('title', 'Task is already active');
    expect(element).toHaveStyleRule('fill', Theme.inputBorderGray, {
      modifier: 'svg path.gui_icon_class',
    });
  });

  test('should render in inactive state if task is queued', () => {
    const caps = new Capabilities(['everything']);
    const task = Task.fromElement({
      status: TASK_STATUS.queued,
      target: {_id: '123'},
      permissions: {permission: [{name: 'everything'}]},
    });
    const clickHandler = testing.fn();

    const {render} = rendererWith({capabilities: caps});

    const {element} = render(<StartIcon task={task} />);

    expect(caps.mayOp('start_task')).toEqual(true);
    expect(task.userCapabilities.mayOp('start_task')).toEqual(true);

    fireEvent.click(element);

    expect(clickHandler).not.toHaveBeenCalled();
    expect(element).toHaveAttribute('title', 'Task is already active');
    expect(element).toHaveStyleRule('fill', Theme.inputBorderGray, {
      modifier: 'svg path.gui_icon_class',
    });
  });

  test('should not be rendered if task is running', () => {
    const caps = new Capabilities(['everything']);
    const task = Task.fromElement({
      status: TASK_STATUS.running,
      target: {_id: '123'},
      permissions: {permission: [{name: 'everything'}]},
    });

    const {render} = rendererWith({capabilities: caps});

    const {queryByTestId} = render(<StartIcon task={task} />);

    expect(caps.mayOp('start_task')).toEqual(true);
    expect(task.userCapabilities.mayOp('start_task')).toEqual(true);
    expect(queryByTestId('start-icon')).toEqual(null);
  });

  test('should not be rendered if task is a container', () => {
    const caps = new Capabilities(['everything']);
    const task = Task.fromElement({
      status: TASK_STATUS.new,
      permissions: {permission: [{name: 'everything'}]},
    });

    const {render} = rendererWith({capabilities: caps});

    const {queryByTestId} = render(<StartIcon task={task} />);

    expect(caps.mayOp('start_task')).toEqual(true);
    expect(task.userCapabilities.mayOp('start_task')).toEqual(true);
    expect(queryByTestId('start-icon')).toEqual(null);
  });
});

// vim: set ts=2 sw=2 tw=80:
