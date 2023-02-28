import React, { useEffect, useState } from 'react';
import 'echarts-gl';
import ReactEcharts from 'echarts-for-react';
import axios from 'axios';
import { SCALE } from '../../shared/ext';
import { BASE_URL } from '../../shared/service';
import {
  DEFAULT_OPTION,
  getStartEndZoomValue,
  getBarWidthByDataZoom,
  getGridByWindowWidth
} from './option';
import { get } from 'lodash';
import './GenericChart.css';

function GenericChart(props) {
  const { symbol } = props;
  const [didMount, setDidmount] = useState(false);
  const [dataBE, setDataBE] = useState([]);
  const [loading, setLoading] = useState(false);

  const series = dataBE.map(d => [d.open, d.close, d.low, d.high]);
  const axes = dataBE.map(d => JSON.stringify(d));
  const dataZoom = JSON.parse(localStorage.getItem(SCALE));

  const { defaultMinScale, defaultMaxScale } = getStartEndZoomValue(series);
  const startDataZoom = get(dataZoom, `${symbol}.start`, defaultMinScale);
  const endDataZoom = get(dataZoom, `${symbol}.end`, defaultMaxScale);

  const barWidth = getBarWidthByDataZoom(startDataZoom, endDataZoom);
  const fromRight = getGridByWindowWidth(window.innerWidth);

  const currentOption = {
    ...DEFAULT_OPTION,
    title: {
      ...DEFAULT_OPTION.title,
      text: symbol
    },
    grid: {
      ...DEFAULT_OPTION.grid,
      right: `${fromRight}%`
    },
    dataZoom: {
      ...DEFAULT_OPTION.dataZoom,
      start: startDataZoom,
      end: endDataZoom
    },
    xAxis: {
      ...DEFAULT_OPTION.xAxis,
      data: axes
    },
    series: [
      {
        ...DEFAULT_OPTION.series[0],
        barWidth,
        data: series
      }
    ]
  }

  useEffect(() => {
    setDidmount(true);
    getData();
    setLoading(false);
  }, [symbol]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (didMount) {
        getCurrentData();
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [dataBE]);

  const getData = async () => {
    setLoading(true)
    const res = await axios.get(`${BASE_URL}/kline?symbol=${symbol}&limit=10000&offset=0`);
    const { data } = await res;
    const dataArray = data.data || [];
    setDataBE(dataArray);
  }

  const getCurrentData = async () => {
    const res = await axios.get(`${BASE_URL}/symbol?name=${symbol}`);
    const { data } = await res;
    const lastItem = dataBE[dataBE.length - 1];
    const openLastItem = new Date(lastItem.open_time);

    if (data.data && data.data.open_time) {
      const currentItem = new Date(data.data.open_time);
      const lastDate = `${openLastItem.getDate()}/${openLastItem.getMonth() + 1}/${openLastItem.getFullYear()}`;
      const currentDate = `${currentItem.getDate()}/${currentItem.getMonth() + 1}/${currentItem.getFullYear()}`;
      if (lastDate !== currentDate) {
        setDataBE([...dataBE, data.data])
      }
    }
  }

  const onEvents = {
    click: (event, abc) => handleClick(event, abc),
    datazoom: (event) => {
      handleDataZoom(event)
    },
  }

  const handleClick = (e, abc) => {
    if (e.targetType === 'axisLabel') {
      e.event.event.stopPropagation();
      e.event.event.preventDefault();
    }
    const itemInfo = JSON.parse(e.value);
    if (itemInfo.model_name !== '') {
      getModel(itemInfo.open_time);
    }
  }

  const handleDataZoom = e => {
    const start = e.batch[0].start;
    const end = e.batch[0].end;

    const symbolByKey = JSON.parse(localStorage.getItem(SCALE)) || {};
    const newSymbol = {
      ...symbolByKey,
      [symbol]: {
        start,
        end
      }
    }
    localStorage.setItem(SCALE, JSON.stringify(newSymbol))
  }

  const getModel = async (openTime) => {
    const res = await axios.get(`${BASE_URL}/model?symbol=${symbol}&open_time=${openTime}`);
    const { data } = await res;
    props.setModel(data.data)
  }
  return <div className="chart-full-container pr-lg-1 pr-2 pl-lg-0 pl-2 pb-lg-1 pb-2">
    <div className="chart-content" >
      <ReactEcharts
        option={currentOption}
        notMerge={false}
        lazyUpdate={true}
        style={{ height: '100%', width: '100%' }}
        onEvents={onEvents}
      />
    </div>
  </div>
}

export default GenericChart;