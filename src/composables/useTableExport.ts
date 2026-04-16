import { ref } from 'vue';

export function useTableExport() {
    const dt = ref();

    const generateCSV = (
        data: any[],
        columns: any[],
        exportColumns: string[],
        filename: string
    ) => {
        const csvContent = [
            // Header
            exportColumns
                .map(col => {
                    const colDef = columns.find((c: any) => c.field === col);
                    return colDef ? colDef.header : col;
                })
                .join(','),
            // Data rows
            ...data.map((item: any) =>
                exportColumns
                    .map(col => {
                        const value = item[col];
                        // Handle tags array
                        if (col === 'tags' && Array.isArray(value)) {
                            return `"${value.join('; ')}"`;
                        }
                        // Escape quotes and wrap in quotes if contains comma
                        if (
                            typeof value === 'string' &&
                            (value.includes(',') || value.includes('"'))
                        ) {
                            return `"${value.replace(/"/g, '""')}"`;
                        }
                        return value || '';
                    })
                    .join(',')
            ),
        ].join('\n');

        // Download CSV
        const link = document.createElement('a');
        link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
        link.download = filename;
        link.click();
    };

    return {
        dt,
        generateCSV,
    };
}
