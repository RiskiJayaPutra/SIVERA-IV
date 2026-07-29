<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class AssetExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles, WithTitle
{
    protected $assets;
    protected $schemaCols;
    protected $title;

    public function __construct($assets, $schemaCols, $title = 'Data Aset')
    {
        $this->assets = $assets;
        $this->schemaCols = $schemaCols;
        $this->title = $title;
    }

    public function title(): string
    {
        return $this->title;
    }

    public function collection()
    {
        return $this->assets;
    }

    public function headings(): array
    {
        $headers = ['No', 'Lokasi'];
        foreach ($this->schemaCols as $col) {
            if (($col['key'] ?? '') === '_no') continue;
            if (($col['type'] ?? '') === 'display') continue;
            
            if (($col['type'] ?? '') === 'group') {
                foreach ($col['subColumns'] ?? [] as $subCol) {
                    if (($subCol['type'] ?? '') === 'display') continue;
                    $headers[] = ($col['label'] ?? '') . ' - ' . ($subCol['label'] ?? $subCol['key']);
                }
            } else {
                $headers[] = $col['label'] ?? $col['key'];
            }
        }
        return $headers;
    }

    public function map($asset): array
    {
        static $rowNumber = 0;
        $rowNumber++;

        $row = [
            $rowNumber,
            $asset->location ? $asset->location->name : '-'
        ];

        $data = $asset->data ?? [];

        foreach ($this->schemaCols as $col) {
            if (($col['key'] ?? '') === '_no') continue;
            if (($col['type'] ?? '') === 'display') continue;
            
            if (($col['type'] ?? '') === 'group') {
                foreach ($col['subColumns'] ?? [] as $subCol) {
                    if (($subCol['type'] ?? '') === 'display') continue;
                    $dbKey = $subCol['radioGroupKey'] ?? $subCol['key'] ?? '';
                    $val = $data[$dbKey] ?? '';
                    if (is_bool($val)) {
                        $val = $val ? 'Ya' : 'Tidak';
                    }
                    $row[] = $val;
                }
            } else {
                $dbKey = $col['radioGroupKey'] ?? $col['key'] ?? '';
                $val = $data[$dbKey] ?? '';
                if (is_bool($val)) {
                    $val = $val ? 'Ya' : 'Tidak';
                }
                $row[] = $val;
            }
        }

        return $row;
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
