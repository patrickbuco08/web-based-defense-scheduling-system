<?php

namespace Bocum\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;

class DefenseReportExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize, WithColumnFormatting
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
            $this->formatDateTime($row['start_date_time'] ?? null),
            $this->formatDateTime($row['end_date_time'] ?? null),
            ucfirst($row['status'] ?? ''),
            $row['department'] ?? '',
            $row['term'] ?? '',
        ];
    }

    /**
     * Format datetime for Excel
     * 
     * @param string|null $dateTime
     * @return string
     */
    private function formatDateTime($dateTime)
    {
        if (!$dateTime) {
            return '';
        }

        try {
            // Parse the datetime and format it for Excel compatibility
            $date = \Carbon\Carbon::parse($dateTime);
            return $date->format('m/d/Y h:i A');
        } catch (\Exception $e) {
            return $dateTime; // Fallback to original if parsing fails
        }
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
            
            // Set minimum column widths for datetime columns
            'H' => ['width' => 20], // Start Date & Time
            'I' => ['width' => 20], // End Date & Time
        ];
    }

    /**
     * @return array
     */
    public function columnFormats(): array
    {
        return [
            // Format datetime columns (H = Start, I = End)
            'H' => NumberFormat::FORMAT_DATE_DATETIME,
            'I' => NumberFormat::FORMAT_DATE_DATETIME,
        ];
    }
}
