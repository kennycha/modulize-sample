import React, { memo } from 'react';
import { ControlPanel, LibraryPanel, RenderingPanel } from './panels';
import { FlexBox } from '../components';

const App = () => {

  return (
    <FlexBox flexDirection='column'>
      <FlexBox flexDirection='row'>
        <LibraryPanel />
        <ControlPanel />
      </FlexBox>
      <RenderingPanel />
    </FlexBox>
  );
}

export default memo(App);