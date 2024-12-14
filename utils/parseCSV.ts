export default (
  file: File,
  options?: {
    hasHeader?: boolean;
    hasBlankLines?: boolean;
    hasSpaceSell?: boolean;
  },
): {
  toString: () => Promise<string>;

  toArray: (opt?: { distinct?: boolean }) => Promise<{
    headers: string[];
    rows: string[][];
  }>;

  /** [ { [header]: cell } ] */
  toObjectArray: (opt?: {
    distinct?: boolean;
  }) => Promise<Record<string, string>[]>;

  /** { [row[0]]: { [header]: cell } } */
  toObject: () => Promise<Record<string, Record<string, string>>>;

  /** { [row[0]]: row[1...] } */
  toObjectWithoutHeader: () => Promise<Record<string, string[]>>;
} => {
  const {
    hasHeader = true,
    hasBlankLines = true,
    hasSpaceSell = true,
  } = options || {};

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

        // eslint-disable-next-line no-irregular-whitespace
        if (!hasSpaceSell) csvString = csvString.replace(/,[ 　]+/g, ','); // Clear all space sell
        if (!hasBlankLines) csvString = csvString.replace(/\n,*\n/g, '\n'); // Remove all blank line

        csvString = csvString.replace(/\n$/, ''); // Remove the last blank line
        return csvString;
      });
    },

    toArray(opt): Promise<{
      headers: string[];
      rows: string[][];
    }> {
      const { distinct = false } = opt || {};

      return this.toString().then((csvString) => {
        let lines = csvString.split('\n');

        if (distinct) {
          lines = lines.filter(
            (item, index, source) => index === source.indexOf(item),
          );
        }

        const line2array = (line: string): string[] => {
          const _line = line.replace(/,$/, ''); // Remove the last blank cell
          const arr = _line.split(',');
          return arr;
        };

        if (hasHeader) {
          return {
            headers: line2array(lines[0]).filter((i) => i !== ''), // Filter blank header
            rows: lines.slice(1).map(line2array),
          };
        } else {
          return {
            headers: [],
            rows: lines.map(line2array),
          };
        }
      });
    },

    toObjectArray(opt): Promise<Record<string, string>[]> {
      return this.toArray(opt).then(({ headers, rows }) => {
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
