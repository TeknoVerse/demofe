const hostanme = `${process.env.REACT_APP_URL}:${process.env.REACT_APP_DB_PORT}`;

export const getUrlTtransOperation = hostanme+'/trans_operation';
export const getUrlTtransOutput = hostanme+'/trans_output';
export const getUrlTtransStop = hostanme+'/trans_stop';
export const getUrlProduct = hostanme+'/product';
export const getUrlSloc = hostanme+'/sloc';
export const getUrlKanban = hostanme+'/kanban';
export const getUrlWarehouse = hostanme+'/warehouse';
export const getUrlDn = hostanme+'/dn';
