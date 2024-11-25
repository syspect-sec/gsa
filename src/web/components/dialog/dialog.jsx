/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import {Modal} from '@greenbone/opensight-ui-components-mantinev7';
import {isDefined, isFunction} from 'gmp/utils/identity';
import {useCallback, useEffect, useState} from 'react';
import styled from 'styled-components';
import PropTypes from 'web/utils/proptypes';

const INITIAL_POSITION_X = 0;
const INITIAL_POSITION_Y = 70;
const MODAL_Z_INDEX = 201;
const MODAL_HEIGHT = '250px';
const MODAL_WIDTH = '40vw';

const DialogTitleButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  outline: none;
  cursor: ${({isDragging}) => (isDragging ? 'grabbing' : 'grab')};
  display: flex;
  align-items: center;
  width: 100%;
`;

const StyledModal = styled(Modal)`
  .mantine-Modal-content {
    display: flex;
    flex-direction: column;
    position: relative;
    resize: both;
    max-height: 90vh;
    min-width: 500px;
    min-height: ${({height}) => height};
    width: ${({width}) => width};
  }

  .mantine-Modal-title {
    flex: 1;
  }
  .mantine-Modal-body {
    padding-bottom: 0px;
    margin-bottom: 15px;
    overflow-y: auto;
  }
  .mantine-Modal-close {
    width: 2rem;
    height: 2rem;
  }

  position: relative;
  left: ${({position}) => `${position.x}px`};
  z-index: ${MODAL_Z_INDEX};
  resize: both;
`;

const Dialog = ({
  children,
  title,
  height = MODAL_HEIGHT,
  width = MODAL_WIDTH,
  onClose,
}) => {
  const [isResizing, setIsResizing] = useState(false);

  const handleClose = useCallback(() => {
    if (isDefined(onClose)) {
      onClose();
    }
  }, [onClose]);

  const [position, setPosition] = useState({
    x: INITIAL_POSITION_X,
    y: INITIAL_POSITION_Y,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({x: 0, y: 0});

  useEffect(() => {
    if (isDragging) {
      document.body.style.cursor = 'grabbing';
    } else {
      document.body.style.cursor = 'default';
    }
  }, [isDragging]);

  const handleDragMouseDown = e => {
    if (
      e.target.closest('button') &&
      !e.target.closest('.dialog-title-button')
    ) {
      return;
    }
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = e => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    if (isResizing) {
      setIsResizing(false);
    }
    if (isDragging) {
      setIsDragging(false);
    }
  };

  return (
    <StyledModal
      opened={true}
      size="auto"
      yOffset={position.y}
      onClose={handleClose}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      width={width}
      title={
        <DialogTitleButton
          type="button"
          className="dialog-title-button"
          onMouseDown={handleDragMouseDown}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleDragMouseDown(e);
            }
          }}
          isDragging={isDragging}
        >
          {title}
        </DialogTitleButton>
      }
      centered={false}
      height={height}
      position={position}
    >
      {isFunction(children)
        ? children({
            close: handleClose,
          })
        : children}
    </StyledModal>
  );
};

Dialog.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  title: PropTypes.string,
  width: PropTypes.string,
  onClose: PropTypes.func,
  height: PropTypes.string,
};

export default Dialog;
