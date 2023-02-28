import React from 'react';
import moment from 'moment';
import './Model.css';

function AnalyzeModel(props) {
  const { model } = props;
  const modelType = model.model_type === 'UP' ? 'Buy/Long Zone' : 'Sell/Short Zone';
  const date = new Date(model.open_time);
  const time = moment(date).format("DD/MM/YYYY HH:mm");

  return <div className="model-content pr-lg-1 pr-2 pl-sm-2 pl-lg-0 pl-2 pb-lg-0 pb-2">
    <div className="d-flex flex-wrap model-flex-content">
      <div className="col-flex-img p-2">
        <img src={model.image_link} alt="" />
      </div>
      <div className="p-2 model-detail">
        <div className="title mb-2 text-center">
          {model.model_name}
          {model.model_type === 'UP' && <i className="fa fa-arrow-up ml-2" aria-hidden="true" style={{ color: '#26A69A' }}></i>}
          {model.model_type === 'DOWN' && <i className="fa fa-arrow-down ml-2" aria-hidden="true" style={{ color: '#EF5350' }}></i>}
        </div>
        <table className="table">
          <tbody>
            <tr>
              <td>{modelType}</td>
              <td>{model.buy_long_zone}</td>
            </tr>
            <tr>
              <td>Target 1</td>
              <td>{model.target_1}</td>
            </tr>
            <tr>
              <td>Target 1</td>
              <td>{model.target_1}</td>
            </tr>
            <tr>
              <td>Target 2</td>
              <td>{model.target_2}</td>
            </tr>
            <tr>
              <td>Target 3</td>
              <td>{model.target_3}</td>
            </tr>
            <tr>
              <td>Stop Lost</td>
              <td>{model.stop_lost}</td>
            </tr>
            <tr>
              <td>Reliable</td>
              <td>{model.reliable}</td>
            </tr>
            <tr>
              <td>Time</td>
              <td>{time}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
}

export default AnalyzeModel;