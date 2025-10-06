<?php

namespace Bocum\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class DefenseReportExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
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
            'Group Code',
            'Title',
            'Adviser',
            'Critic',
            'Panelists',
            'Room',
            'Start Date & Time',
            'End Date & Time',
            'Status',
            'Department',
            'Term',
        ];
    }

    /**
     * @param mixed $row
     * @return array
     */
    public function map($row): array
    {
        return [
            $row['group_code'] ?? '',
            $row['title'] ?? '',
            $row['adviser'] ?? '',
            $row['critic'] ?? '',
            is_array($row['panelists'] ?? null) ? implode(', ', $row['panelists']) : '',
            $row['room'] ?? '',
            $row['start_date_time'] ?? '',
            $row['end_date_time'] ?? '',
            ucfirst($row['status'] ?? ''),
            $row['department'] ?? '',
            $row['term'] ?? '',
        ];
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
