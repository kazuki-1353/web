export default (
  file: File,
  options?: {
    hasHeader?: boolean;
  },
): {
  toString: () => Promise<string>;

  toArray: () => Promise<{
    headers: string[];
    rows: string[][];
  }>;

  /** [ { [header]: cell } ] */
  toObjectArray: () => Promise<Record<string, string>[]>;

  /** { [row[0]]: { [header]: cell } } */
  toObject: () => Promise<Record<string, Record<string, string>>>;

  /** { [row[0]]: row[1...] } */
  toObjectWithoutHeader: () => Promise<Record<string, string[]>>;
} => {
  const { hasHeader = true } = options || {};

  const prom = new Promise<string>((resolve, reject) => {
    if (!file) return reject(new Error('Missing file'));
    if (file.type !== 'text/csv')
      return reject(new Error('The file is not a CSV file'));

    const reader = new FileReader();

    reader.addEventListener('load', (e) => {
      const csv = e.target?.result;
      if (typeof csv === 'string') {
        resolve(csv);
      } else {
        reject(new Error('Failed to load file'));
      }
    });

    reader.readAsText(file);
  });

  return {
    toString(): Promise<string> {
      return prom.then((csv) => {
        let csvString = csv;
        csvString = csvString.replace(/\r/g, ''); // Remove the \r of Windows
        csvString = csvString.replace(/\n$/, ''); // Remove the last empty line

        return csvString;
      });
    },

    toArray(): Promise<{
      headers: string[];
      rows: string[][];
    }> {
      return this.toString().then((csvString) => {
        const lines = csvString.split('\n');

        if (hasHeader) {
          return {
            headers: lines[0]
              .replace(/,$/, '') // Remove the last empty cell
              .split(',')
              .filter((i) => i !== ''), // Filter empty Header

            rows: lines.slice(1).map((line) =>
              line
                .replace(/,$/, '') // Remove the last empty cell
                .split(','),
            ),
          };
        } else {
          return {
            headers: [],
            rows: lines.map((line) => line.replace(/,$/, '').split(',')),
          };
        }
      });
    },

    toObjectArray(): Promise<Record<string, string>[]> {
      return this.toArray().then(({ headers, rows }) => {
        return rows.map((row) => {
          const arr = headers.map((header, index) => {
            const cell = row[index];
            return [header, cell];
          });
          return Object.fromEntries(arr);
        });
      });
    },

    toObject(): Promise<Record<string, Record<string, string>>> {
      return this.toArray().then(({ headers, rows }) => {
        const rowsMap = rows.map((row) => {
          const [title, ...values] = row;

          const headersMap = headers.slice(1).map((header, index) => {
            const cell = values[index];
            return [header, cell];
          });
          return [title, Object.fromEntries(headersMap)];
        });
        return Object.fromEntries(rowsMap);
      });
    },

    toObjectWithoutHeader(): Promise<Record<string, string[]>> {
      return this.toArray().then(({ rows }) => {
        const rowsMap = rows.map((row) => {
          const [title, ...values] = row;
          return [title, values];
        });
        return Object.fromEntries(rowsMap);
      });
    },
  };
};
