import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Dialog } from '../../shared/components/Dialog';
import { BASE_URL } from '../../shared/service';
import { timeDifference } from '../../shared/ext';
import './WatchList.css';

function WatchList(props) {
  const [activeKey, setActiveKey] = useState('');
  const [watchList, setWatchList] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    getWatchList();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      getWatchList();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const getWatchList = async () => {
    const res = await axios.get(`${BASE_URL}/kline/now`);
    const { data } = await res;
    setWatchList(data.data || []);
  }

  const handleShowHistory = async (key) => {
    setActiveKey(key);
    const res = await axios.get(`${BASE_URL}/model/history?symbol=${key}`);
    const { data } = await res;
    const responseList = data.data || [];
    setHistory(responseList);
  }

  return <><div className="watch-list-full-wrapper">
    <div className="table-striped  pl-lg-0 pl-2 pr-lg-0 pr-2">
      <div className="watch-list-header d-flex justify-content-start align-items-center">
        <div className="first">Symbol</div>
        <div className="second">Price</div>
        <div className="last text-right">History</div>
      </div>
      <div className="watch-list-content">
        {watchList.map((d, idx) => {
          let status = 'no';
          if (d.open > d.close) status = 'down';
          if (d.open < d.close) status = 'up';
          const openMil = new Date(d.open_time).getTime();
          const findMil = new Date(d.find_time).getTime();
          const prevTime = timeDifference(openMil, findMil);

          return <div
            key={`${d.symbol}-${idx}`}
            className={`d-flex align-items-center watch-list-row ${d.symbol === props.symbol ? 'active-row' : ''} ${(idx % 2) === 0 ? 'even-row' : 'odd-row'}`}
          >
            <div
              className="align-middle first"
              onClick={() => props.updateSymbol(d.symbol)}>
              <span className={`crypt-${status}`}>{d.symbol}</span>
              {prevTime === 1 && <span className="badge badge-primary ml-1 ">New</span>}
              {prevTime !== 1 && <span className="ml-1 font-small">{prevTime}</span>}
            </div>
            <div
              className={`crypt-${status} align-middle font-bold second`}>
              <span className="pr-2" data-toggle="tooltip" data-placement="right">{d.close}</span>
            </div>
            <div
              className="last text-right"
              data-toggle="modal"
              data-target="#historyModal"
              onClick={() => handleShowHistory(d.symbol)}
            >
              <i className="fa fa-history" aria-hidden="true"></i>
            </div>
          </div>
        })}
      </div>
    </div>
  </div>
    <Dialog id="historyModal" title={activeKey} subTitle='History'>
      <div className="table-striped history-table">
        <div
          className="watch-list-header d-flex justify-content-start align-items-center">
          <div className="sm-col">Date</div>
          <div className="sm-col">Symbol</div>
          <div className="medium-col text-right">Model</div>
        </div>
        <div className="history-list-content">
          {history.map((d, idx) => {
            const date = new Date(d.open_time);
            return <div
              key={`${d.symbol}-${idx}`}
              className={`d-flex align-items-center watch-list-row ${(idx % 2) === 0 ? 'even-row' : 'odd-row'}`}>
              <div className="sm-col align-middle">
                {`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`}
              </div>
              <div className="sm-col">{d.symbol}</div>
              <div className="medium-col text-right">{d.model_name}</div>
            </div>
          })}
        </div>
      </div>
    </Dialog>
  </>
}

export default WatchList;
