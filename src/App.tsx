import React from 'react';
import styled from 'styled-components';

function App() {
  return (
    <Container >
      <section className='controls'>
        <input accept='.glb' type='file' className='control' />
      </section>
      <canvas id='renderingCanvas' />
    </Container>
  );
}

export default App;

const Container = styled.div`
  width: 100%;
  height: 100%;

  .controls {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;

    .control {

    }
  }

  canvas {
    width: 100%;
    height: calc(100% - 40px);
    border: 1px dotted gray;
  }
`