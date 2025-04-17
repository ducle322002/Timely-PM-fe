import React, { useState } from "react";
import { Button, message, Tooltip } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";

function ExcelExportButton({
  data,
  filename = "export.xlsx",
  sheetName = "Sheet1",
  buttonText = "Export to Excel",
  buttonType = "primary",
  buttonSize = "middle",
  showIcon = true,
  className = "",
}) {
  const [loading, setLoading] = useState(false);

  const exportToExcel = () => {
    try {
      setLoading(true);

      // Validate data
      if (!data || data.length === 0) {
        message.error("No data available to export");
        setLoading(false);
        return;
      }

      // Create a new workbook
      const wb = XLSX.utils.book_new();

      // Convert your data to a worksheet
      const ws = XLSX.utils.json_to_sheet(data);

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, sheetName);

      // Generate the Excel file and trigger download
      XLSX.writeFile(wb, filename);

      message.success(`Successfully exported ${filename}`);
    } catch (error) {
      console.error("Export failed:", error);
      message.error("Failed to export data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tooltip title={`Download as Excel file (${filename})`}>
      <Button
        type={buttonType}
        size={buttonSize}
        onClick={exportToExcel}
        loading={loading}
        icon={showIcon ? <DownloadOutlined /> : null}
        className={`flex items-center ${className}`}
      >
        {buttonText}
      </Button>
    </Tooltip>
  );
}

// Example usage component to demonstrate different button styles
function ExcelExportExample() {
  const sampleData = [
    { name: "John Doe", age: 30, city: "New York" },
    { name: "Jane Smith", age: 25, city: "Boston" },
    { name: "Bob Johnson", age: 40, city: "Chicago" },
  ];

  return (
    <div className="space-y-6 p-6 bg-gray-50 rounded-lg">
      <h2 className="text-lg font-semibold">Excel Export Options</h2>

      <div className="flex flex-wrap gap-4">
        {/* Default button */}
        <ExcelExportButton
          data={sampleData}
          filename="users.xlsx"
          sheetName="Users"
        />

        {/* Alternative style - ghost button */}
        <ExcelExportButton
          data={sampleData}
          buttonType="default"
          buttonText="Download Excel"
          className="border border-green-500 text-green-500 hover:text-green-700 hover:border-green-700"
        />

        {/* Icon only button */}
        <ExcelExportButton
          data={sampleData}
          buttonText=""
          buttonType="primary"
          className="bg-green-500 hover:bg-green-600"
        />

        {/* Large button with custom text */}
        <ExcelExportButton
          data={sampleData}
          buttonText="Save as Excel"
          buttonSize="large"
          className="bg-blue-600 hover:bg-blue-700"
        />
      </div>
    </div>
  );
}

export default ExcelExportButton;
export { ExcelExportExample };
