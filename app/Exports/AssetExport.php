<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class AssetExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    protected $assets;
    protected $schemaCols;

    public function __construct($assets, $schemaCols)
    {
        $this->assets = $assets;
        $this->schemaCols = $schemaCols;
    }

    public function collection()
    {
        return $this->assets;
    }

    public function headings(): array
    {
        $headers = ['No', 'Lokasi'];
        foreach ($this->schemaCols as $col) {
            if (($col['type'] ?? '') === 'display') continue;
            $headers[] = $col['label'] ?? $col['key'];
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
            if (($col['type'] ?? '') === 'display') continue;
            
            $val = $data[$col['key']] ?? '';
            if (is_bool($val)) {
                $val = $val ? 'Ya' : 'Tidak';
            }
            $row[] = $val;
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
