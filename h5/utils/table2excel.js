let uri = 'data:application/vnd.ms-excel;base64,';

let template = (table, tableName) => {
  `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>${tableName}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta charset="UTF-8"></head><body><table>${table}</table></body></html>`;
};

let base64 = (s) => {
  return window.btoa(unescape(encodeURIComponent(s)));
};

let tableToExcel = (table, tableName = 'WorkSheet', fileName = Date.now()) => {
  let dom = typeof table === 'string' ? document.getElementById(table) : table;

  let htm = template(dom.innerHTML, tableName);
  let excel = uri + base64(htm);

  let a = document.createElement('a');
  a.href = excel;
  a.download = fileName;

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

module.exports = tableToExcel;
