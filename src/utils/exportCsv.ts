export function exportCsv(filename: string, headers: string[], rows: (string | number | null | undefined)[][]) {
  const csvHeaders = headers.map((h) => `"${h}"`).join(',');
  const csvRows = rows.map((row) =>
    row.map((cell) => `"${cell ?? ''}"`).join(',')
  );
  const csv = [csvHeaders, ...csvRows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
