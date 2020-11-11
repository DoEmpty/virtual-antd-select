import React, { useMemo } from 'react';
import { VSelect } from '../../src/index';

const App = (props:any) => {

  const onSelectChange = val => {
    console.log('onselectchange', val);
  }

  const list = useMemo(() => {
    let arr: Array<any> = [];
    for (let i=0;i<5000;i++) {
      arr.push({
        id: i,
        name: `${i}-${i}选项`,
      });
    }
    return arr;
  }, []);

  return <div style={{margin: 100}}>
    <VSelect 
      showSearch={true}
      onSelectChange={onSelectChange}  
      optionList={list}
      valueProp="id"
      displayProp="name"
    />
  </div>
}

export default App;
