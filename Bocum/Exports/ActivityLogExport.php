<?php

namespace Bocum\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ActivityLogExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    protected $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return collect($this->data);
    }

    /**
     * @return array
     */
    public function headings(): array
    {
        return [
            'When',
            'Action',
            'By',
            'Subject',
            'Summary',
            'Department',
        ];
    }

    /**
     * @param mixed $row
     * @return array
     */
    public function map($row): array
    {
        return [
            $row['created_at'] ?? '',
            $this->formatAction($row['description'] ?? ''),
            $row['causer']['name'] ?? 'System',
            $row['subject']['group']['group_code'] ?? '—',
            $row['summary'] ?? '—',
            $row['causer']['department']['name'] ?? '—',
        ];
    }

    /**
     * Format action description for display
     */
    private function formatAction(string $action): string
    {
        $actionLabels = [
            'defense.proposed' => 'Proposed',
            'defense.approved' => 'Approved',
            'defense.rejected' => 'Rejected',
            'defense.cancelled' => 'Cancelled',
            'defense.panelists_assigned' => 'Panelists Assigned',
        ];

        return $actionLabels[$action] ?? $action;
    }

    /**
     * @param Worksheet $sheet
     * @return array
     */
    public function styles(Worksheet $sheet)
    {
        return [
            // Style the first row as bold
            1 => ['font' => ['bold' => true]],
        ];
    }
}
