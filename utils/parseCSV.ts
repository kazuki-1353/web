export default (
  file: File,
): Promise<{
  headers: string[];
  rows: string[][];
}> => {
  return new Promise<string>((resolve, reject) => {
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
  }).then((csv) => {
    const lines = csv.replace(/\r/g, '').replace(/\n$/, '').split('\n');

    const headers = lines[0].split(',');
    const rows = lines.slice(1).map((line) => line.split(','));

    return {
      headers,
      rows,
    };
  });
};
