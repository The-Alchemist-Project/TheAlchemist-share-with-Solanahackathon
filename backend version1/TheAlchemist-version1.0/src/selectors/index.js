import { createSelector } from 'reselect';
import { get } from 'lodash';

// Initial State include table setting and data passing by props
const initialState = {
  dataBE: []
}

export const stateSelector = state => state || initialState;

export const symbolSelector = state => get(state, 'symbol', 'BTCUSD');
export const dataBESelector = state => get(state, 'dataBE', []);

export const chartOptionSelector = createSelector(
  dataBESelector,
  symbolSelector,
  (dataBE, symbol) => {
    console.log('abc>>>>>>>>')
    const tooltip = {
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
    };

    const grid = {
      left: '0%',
      right: '5%',
      bottom: '9%',
      top: '2%'
    }

    const xAxis = {
      type: 'category',
      scale: true,
      splitNumber: 100,
      min: 'dataMin',
      triggerEvent: true,
      axisLine: {
        show: true,
        lineStyle: {
          width: 0.4,
          color: '#333'
        }
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
        formatter: params => {
          const candleObj = JSON.parse(params);
          const { model_name, open_time } = candleObj;
          const date = new Date(open_time);
          if (model_name !== '') {
            return `${date.getDate()}/${date.getMonth() + 1} \n ${model_name}`;
          } else {
            return `${date.getDate()}/${date.getMonth() + 1}`;
          }
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#f5f5f5',
        }
      },
    }

    const yAxis = {
      scale: true,
      splitArea: {
        show: true
      },
      onZero: false,
      position: 'right',
      axisLine: {
        show: true,
        lineStyle: {
          width: 0.4,
          color: '#333'
        }
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
        color: '#333'
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#f5f5f5',
        }
      },
      splitArea: {
        show: false
      }
    }

    const zoomData = {
      type: 'inside',
      start: 70,
      end: 100,
    }

    const oneSeriesConfig = {
      name: symbol,
      type: 'candlestick',
      data: [],
      itemStyle: {
        color: '#26A69A',
        color0: '#EF5350',
        borderColor: '#26A69A',
        borderColor0: '#EF5350'
      },
      markLine: {
        symbol: 'none',
        label: {
          show: true
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
    return {
      tooltip,
      grid,
      xAxis: {
        ...xAxis,
        data: dataBE.map(d => JSON.stringify(d))
      },
      yAxis,
      zoomData,
      series: [
        {
          ...oneSeriesConfig,
          data: dataBE.map(d => [d.open, d.close, d.low, d.high])
        }
      ]
    }
  }
)

const mapStateToProps = state => {
  return {
    symbol: symbolSelector(state),
    dataBE: dataBESelector(state),
    chartOption: chartOptionSelector(state)
  }
}

export {
  mapStateToProps
}