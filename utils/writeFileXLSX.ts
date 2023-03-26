/*

// 表格
import { table2excel } from '@/utils/writeFileXLSX';

<table ref={ref}></table>

const ref = useRef<HTMLTableElement>(null);
table2excel(ref.current);


// 数组
import { aoa2excel } from '@/utils/writeFileXLSX';

aoa2excel([
  ['A', 'B'],
  ['A1', 'B1'],
  ['A2', 'B2'],
]);

*/

// import XLSX from 'xlsx';
import XLSX from 'xlsx/dist/xlsx.full.min.js';

export function table2excel(table, name = 'workbook') {
  const fileName = `${name}.${Date.now()}.xlsx`;

  const workbook = XLSX.utils.table_to_book(table);
  XLSX.writeFileXLSX(workbook, fileName);
}

export function aoa2excel(aoa: any[][], name = 'workbook') {
  const fileName = `${name}.${Date.now()}.xlsx`;

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(aoa);

  XLSX.utils.book_append_sheet(workbook, worksheet);
  XLSX.writeFileXLSX(workbook, fileName);
}
