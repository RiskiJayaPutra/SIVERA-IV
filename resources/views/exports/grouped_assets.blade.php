<table>
    <!-- Laporan Header -->
    <tr>
        <td colspan="5" style="font-weight: bold; font-size: 14px;">PT KERETA API INDONESIA (PERSERO) DIVRE IV</td>
    </tr>
    <tr>
        <td colspan="5" style="font-weight: bold; font-size: 14px;">SISTEM INVENTARIS DAN VERIFIKASI ASET (SIVERA IV)</td>
    </tr>
    <tr>
        <td colspan="5"></td>
    </tr>
    <tr>
        <td colspan="2" style="font-weight: bold;">Kategori Laporan:</td>
        <td colspan="3">{{ $category->name }}</td>
    </tr>
    <tr>
        <td colspan="2" style="font-weight: bold;">Waktu Export:</td>
        <td colspan="3">{{ date('d F Y, H:i') }} WIB</td>
    </tr>
    <tr>
        <td colspan="2" style="font-weight: bold;">Diekspor Oleh:</td>
        <td colspan="3">{{ auth()->user()->name ?? 'System' }}</td>
    </tr>
    <tr>
        <td colspan="5"></td>
    </tr>

    <!-- Data Grouped by Location -->
    @foreach($locations as $loc)
        @php
            $locAssets = isset($assetsGrouped[$loc->id]) ? $assetsGrouped[$loc->id] : collect();
        @endphp

        <!-- Spacing between groups -->
        @if(!$loop->first)
            <tr>
                <td colspan="5"></td>
            </tr>
            <tr>
                <td colspan="5"></td>
            </tr>
        @endif

        <tr>
            <td colspan="5" style="font-weight: bold; font-size: 12px; background-color: #f1f5f9;">
                MASTER ASSET {{ strtoupper($category->name) }} DI {{ strtoupper($loc->name) }}
            </td>
        </tr>
        <tr>
            <td colspan="5" style="font-weight: bold;">
                Jumlah Data : {{ $locAssets->count() }}
            </td>
        </tr>

        @if($locAssets->isEmpty())
            <tr>
                <td colspan="5" style="font-style: italic; color: #64748b;">
                    Belum ada Master Asset {{ $category->name }} di lokasi ini.
                </td>
            </tr>
        @else
            <!-- Table Headers -->
            <tr>
                <td style="font-weight: bold; border: 1px solid #cbd5e1; background-color: #e2e8f0; text-align: center;">No</td>
                @foreach($schemaCols as $col)
                    @if(($col['key'] ?? '') === '_no') @continue @endif
                    @if(($col['type'] ?? '') === 'display') @continue @endif

                    @if(($col['type'] ?? '') === 'group')
                        @foreach($col['subColumns'] ?? [] as $subCol)
                            @if(($subCol['type'] ?? '') === 'display') @continue @endif
                            <td style="font-weight: bold; border: 1px solid #cbd5e1; background-color: #e2e8f0;">
                                {{ ($col['label'] ?? '') . ' - ' . ($subCol['label'] ?? $subCol['key']) }}
                            </td>
                        @endforeach
                    @else
                        <td style="font-weight: bold; border: 1px solid #cbd5e1; background-color: #e2e8f0;">
                            {{ $col['label'] ?? $col['key'] }}
                        </td>
                    @endif
                @endforeach
            </tr>

            <!-- Table Rows -->
            @foreach($locAssets as $index => $asset)
                @php
                    $data = $asset->data ?? [];
                @endphp
                <tr>
                    <td style="border: 1px solid #cbd5e1; text-align: center;">{{ $index + 1 }}</td>
                    @foreach($schemaCols as $col)
                        @if(($col['key'] ?? '') === '_no') @continue @endif
                        @if(($col['type'] ?? '') === 'display') @continue @endif

                        @if(($col['type'] ?? '') === 'group')
                            @foreach($col['subColumns'] ?? [] as $subCol)
                                @if(($subCol['type'] ?? '') === 'display') @continue @endif
                                @php
                                    $dbKey = $subCol['radioGroupKey'] ?? $subCol['key'] ?? '';
                                    $val = $data[$dbKey] ?? '';
                                    if(is_bool($val)) $val = $val ? 'Ya' : 'Tidak';
                                @endphp
                                <td style="border: 1px solid #cbd5e1;">{{ $val }}</td>
                            @endforeach
                        @else
                            @php
                                $dbKey = $col['radioGroupKey'] ?? $col['key'] ?? '';
                                $val = $data[$dbKey] ?? '';
                                if(is_bool($val)) $val = $val ? 'Ya' : 'Tidak';
                            @endphp
                            <td style="border: 1px solid #cbd5e1;">{{ $val }}</td>
                        @endif
                    @endforeach
                </tr>
            @endforeach
        @endif
    @endforeach
</table>
