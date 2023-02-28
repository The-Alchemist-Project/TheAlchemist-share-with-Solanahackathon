import { get } from 'lodash';
const DEFAULT_OPTION = {
  tooltip: {
    trigger: 'axis',
    formatter: params => {
      const { axisValue } = params[0];
      const { open_time, open, close, low, high } = JSON.parse(axisValue);
      const date = new Date(open_time);
      const xAxis = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      return `${xAxis}
      <br>Open: ${open}
      <br>Close: ${close}
      <br>Low: ${low}
      <br>High: ${high}`
    }
  },
  title: {
    textStyle: {
      fontWeight: 500,
      fontFamily: 'monospace',
      fontSize: 15
    }
  },
  grid: {
    left: '0%',
    right: '8%',
    bottom: '20%',
    top: '2%'
  },
  xAxis: {
    scale: false,
    onZero: true,
    type: 'category',
    splitNumber: 100,
    min: 'dataMin',
    triggerEvent: true,
    axisLine: {
      show: true,
      lineStyle: {
        width: 0.4,
        color: '#333'
      },
      onZero: true,
    },
    axisTick: {
      show: true,
      alignWithLabel: true,
      lineStyle: {
        color: '#333',
        width: 0.5
      }
    },
    axisLabel: {
      show: true,
      color: '#333',
      fontSize: 10,
      formatter: params => {
        const candleObj = JSON.parse(params);
        const { model_name, open_time } = candleObj;
        const date = new Date(open_time);
        if (model_name !== '') {
          const modelName = model_name.split(' ');
          let newModelName = "";
          let limitChar = 8;
          let line = 1;

          for (let i = 0; i < modelName.length; i++) {
            newModelName += modelName[i] + ' ';
            if (newModelName.length > limitChar * line) {
              newModelName += "\n";
              line++;
            }
          }
          return `${date.getDate()}/${date.getMonth() + 1} \n ${newModelName}`;
        } else {
          return `${date.getDate()}/${date.getMonth() + 1}`;
        }
      },
      showMinLabel: false
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: '#f5f5f5',
        type: 'dotted'
      }
    },
  },
  yAxis: {
    scale: true,
    onZero: true,
    position: 'right',
    axisLine: {
      show: true,
      lineStyle: {
        width: 0.4,
        color: '#333'
      },
      onZero: true,
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: '#333',
        width: 0.5
      }
    },
    axisLabel: {
      show: true,
      color: '#333',
      fontSize: 10
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: '#f5f5f5',
        type: 'dotted'
      }
    },
    splitArea: {
      show: false
    }
  },
  dataZoom: {
    type: 'inside',
    start: 90,
    end: 100
  },
  series: [
    {
      name: 'BTCUSD',
      type: 'candlestick',
      barWidth: 28,
      data: [],
      layout: 'vertical',
      itemStyle: {
        color: '#26A69A',
        color0: '#EF5350',
        borderColor: '#26A69A',
        borderColor0: '#EF5350'
      },
      markLine: {
        symbol: 'none',
        label: {
          show: true,
          fontSize: 10
        },
        lineStyle: {
          width: 0.7,
          type: 'dotted'
        },
        data: [
          {
            name: 'min line on close',
            type: 'min',
            valueDim: 'close'
          }

        ]
      },
    }
  ]
}

const getStartEndZoomValue = series => {
  let defaultMinScale = 0;
  const defaultMaxScale = 100;

  if (series.length < 50) {
    defaultMinScale = 50;
  } else if (series.length >= 50 && series.length < 100) {
    defaultMinScale = 60;
  } else if (series.length >= 100 && series.length < 150) {
    defaultMinScale = 70;
  } else if (series.length >= 150 && series.length < 200) {
    defaultMinScale = 80;
  } else {
    defaultMinScale = 90;
  }
  return {
    defaultMinScale,
    defaultMaxScale
  }
}

const getBarWidthByDataZoom = (startValue, endValue) => {
  let barWidth = 28;
  if (endValue - startValue < 25) {
    barWidth = 26;
  } else if (endValue - startValue >= 25 && endValue - startValue < 50) {
    barWidth = 28;
  } else if (endValue - startValue >= 50 && endValue - startValue < 75) {
    barWidth = 30;
  } else {
    barWidth = 32;
  }
  return barWidth;
}

const getGridByWindowWidth = windowWidth => {
  let fromRight = 0;
  if (windowWidth >= 200 && windowWidth <= 560) {
    fromRight = 14;
  } else if (windowWidth > 560 && windowWidth <= 680) {
    fromRight = 11;
  } else if (windowWidth > 680 && windowWidth <= 860) {
    fromRight = 9;
  } else if (windowWidth > 860 && windowWidth <= 960) {
    fromRight = 9;
  } else if (windowWidth > 960 && windowWidth <= 1024) {
    fromRight = 7;
  } else {
    fromRight = 6;
  }
  return fromRight;
}

export {
  DEFAULT_OPTION,
  getStartEndZoomValue,
  getBarWidthByDataZoom,
  getGridByWindowWidth
}