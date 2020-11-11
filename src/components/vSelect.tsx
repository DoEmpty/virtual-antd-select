
import React, { useState, useEffect, useRef } from 'react';
import { Select } from 'antd';
import 'antd/lib/select/style';
import '../css/vSelect.css';

export interface VSelectProps {
  /**
   * Select的showSearch，是否可以输入检索
   */
  showSearch: boolean,
  /**
   * Select的placeholder，默认值为“请选择”
   */
  placeholder?: string,
  /**
   * 需要加载到Select的全量数据
   */
  optionList: Array<any>,
  /**
   * Option的Value属性名
   */
  valueProp: string,
  /**
   * Option展示的文本属性名
   */
  displayProp: string,
  /**
   * 真实加载到dom中的数据长度，默认值为20
   */
  viewListLength?: number,
  /**
   * Select下拉每一个选项的高度，默认值为32
   */
  optionHeight?: number,
  /**
   * Select的选中事件
   */
  onSelectChange: (value: any) => void,
}


const VSelect = (props: VSelectProps) => {
  const {
    showSearch = false,
    placeholder = '请选择',
    optionList,
    valueProp,
    displayProp,
    optionHeight = 32,
    onSelectChange,
  } = props;

  const viewListLength = !props.viewListLength || props.viewListLength < 20 ? 20 : props.viewListLength;

  const TopObsElId = 'top-obs-el', BottomoObsElId = 'bottom-obs-el';

  const [paddingTop, setPaddingTop] = useState(0);
  const [viewList, setViewList] = useState<any>(optionList.slice(0, viewListLength));
  const [topObserveEl, setTopObserveEl] = useState(null);
  const [bottomObserveEl, setBottomObserveEl] = useState(null);

  /**
   * Observe只需要创建一次，但是因为hooks的闭包特性，会造成Observer回调的viewList,paddingTop,filterList无法访问到最新的值，所以将其在ref中缓存一分
   */
  const observerRef = useRef<any>({
    paddingTop: 0,
    viewList: viewList,
    filterList: [],
    filterTimer: null,
    observer: new IntersectionObserver((entries: Array<IntersectionObserverEntry>) => {
      for (let i = 0; i < entries.length; i++) {
        const ent = entries[i];
        if (!ent.isIntersecting)
          return;
        let padList: Array<any> = [], padIndex = 0;
        let { paddingTop, viewList, filterList } = observerRef.current;
        //确定数据来源是props传进的全量列表还是用户发起了搜索后的过滤列表
        const baseList = filterList.length == 0 ? optionList : filterList;
        const isUp = ent.target.id == 'top-obs-el';
        if (isUp) {
          padIndex = baseList.indexOf(viewList[0]);
          if (padIndex == 0)
            return;
          //向前取10条数据
          padList = baseList.slice(padIndex - 10 < 0 ? 0 : padIndex - 10, padIndex);
          viewList = padList.concat(viewList.slice(0, viewList.length - padList.length));
          paddingTop = paddingTop - padList.length * optionHeight;
        } else {
          padIndex = baseList.indexOf(viewList[viewList.length - 1]);
          if (padIndex == baseList.length - 1)
            return;
          padList = baseList.slice(padIndex + 1, padIndex + 11);
          viewList = viewList.slice(padList.length).concat(padList);
          paddingTop = paddingTop + padList.length * optionHeight;
        }
        observerRef.current.paddingTop = paddingTop;
        observerRef.current.viewList = viewList;
        setPaddingTop(paddingTop);
        setViewList(viewList);
      }
    })
  })

  useEffect(() => {
    return () => {
      !!observerRef.current.filterTimer && clearTimeout(observerRef.current.filterTimer);
      //组件卸载的时候解除Observe，padding归零
      if (!!topObserveEl) {
        observerRef.current.observer.unobserve(topObserveEl);
        observerRef.current.observer.unobserve(bottomObserveEl);
        observerRef.current.observer.disconnect();
      }
    }
  }, []);

  const onSelectSearch = value => {
    !!observerRef.current.filterTimer && clearTimeout(observerRef.current.filterTimer);
    observerRef.current.filterTimer = setTimeout(() => {
      const val = value.trim();
      let baseList: Array<any> = []
      if (!val) {
        baseList = optionList;
        observerRef.current.filterList = [];
      } else {
        baseList = optionList.filter((item: any) => item[displayProp].includes(val));
        observerRef.current.filterList = baseList;
      }
      const viewList = baseList.slice(0, viewListLength);
      observerRef.current.paddingTop = 0;
      observerRef.current.viewList = viewList;
      setViewList(viewList);
      setPaddingTop(0);
    }, 500);
  }

  const mountElObserve = el => {
    if (!el)
      return;
    if (el.id == TopObsElId && !topObserveEl) {
      setTopObserveEl(el);
      observerRef.current.observer.observe(el);
    }
    if (el.id == BottomoObsElId && !bottomObserveEl) {
      setBottomObserveEl(el);
      observerRef.current.observer.observe(el);
    }
  }

  return (
    <Select
      className="vselect"
      dropdownMatchSelectWidth={false}
      placeholder={placeholder}
      showSearch={showSearch}
      onChange={onSelectChange}
      filterOption={false}
      onSearch={onSelectSearch}
      dropdownClassName="vselect-drop-down"
      dropdownMenuStyle={{ paddingTop: paddingTop }}
    >
      <Select.Option key={TopObsElId} value={TopObsElId} className="top-obs-el">
        <div id={TopObsElId} ref={mountElObserve}></div>
      </Select.Option>
      {
        viewList.map(item => (
          <Select.Option value={item[valueProp]} key={item[valueProp]}>
            {item[displayProp]}
          </Select.Option>
        ))
      }
      <Select.Option key={BottomoObsElId} value={BottomoObsElId} className="bottom-obs-el">
        <div id={BottomoObsElId} ref={mountElObserve}></div>
      </Select.Option>
    </Select>
  )
}

export default VSelect;