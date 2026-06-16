export async function downloadReportExcel({ rows, columns, filename, sheetName = "Report" }) {
  const XLSX = await import("xlsx");
  const sheetRows = rows.map((row) => {
    const entry = {};
    columns.forEach((column) => {
      entry[column.header] = row[column.key] ?? "";
    });
    return entry;
  });

  const sheet = XLSX.utils.json_to_sheet(sheetRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, sheetName.slice(0, 31));
  XLSX.writeFile(workbook, filename);
}
