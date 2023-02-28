import React from 'react';

export function Dialog(props) {
  const { id = 'dialog', className = '', title = 'Dialog', subTitle = '', children } = props;
  return <section className={`modal fade cd-example-modal-sm  ${className}`} id={id} tabIndex={-1} role="dialog">
    <div className="modal-dialog modal-dialog-centered" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <span className="text-uppercase history-title"><span className="symbol-name">{title}</span> {subTitle}</span>
          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-content">
          <div className="modal-body">
            {children}
          </div>
        </div>
      </div>
    </div>
  </section>
}