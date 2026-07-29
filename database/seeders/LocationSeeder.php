<?php

namespace Database\Seeders;

use App\Models\Location;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class LocationSeeder extends Seeder
{
    public function run(): void
    {
        $stations = [
            ['id' => 'st-tarahan', 'label' => 'TARAHAN'],
            ['id' => 'st-sukamenanti', 'label' => 'Sukamenanti'],
            ['id' => 'st-blokpos', 'label' => 'Blok Pos'],
            ['id' => 'st-garuntung', 'label' => 'Garuntung'],
            ['id' => 'st-tanjungkarang', 'label' => 'TANJUNGKARANG'],
            ['id' => 'st-labuanratu', 'label' => 'Labuan Ratu'],
            ['id' => 'st-gedungratu', 'label' => 'Gedung Ratu'],
            ['id' => 'st-rejosari', 'label' => 'Rejosari'],
            ['id' => 'st-branti', 'label' => 'Branti'],
            ['id' => 'st-tegineneng', 'label' => 'Tegineneng'],
            ['id' => 'st-rengas', 'label' => 'Rengas'],
            ['id' => 'st-bekri', 'label' => 'BEKRI'],
            ['id' => 'st-hajipemanggilan', 'label' => 'Haji Pemanggilan'],
            ['id' => 'st-sulusuban', 'label' => 'Sulusuban'],
            ['id' => 'st-bl-pagar', 'label' => 'Blambangan Pagar'],
            ['id' => 'st-kalibalangan', 'label' => 'Kalibalangan'],
            ['id' => 'st-candimas', 'label' => 'Candi Mas'],
            ['id' => 'st-kotabumi', 'label' => 'KOTA BUMI'],
            ['id' => 'st-cempaka', 'label' => 'Cempaka'],
            ['id' => 'st-ketapang', 'label' => 'KETAPANG'],
            ['id' => 'st-negararatu', 'label' => 'Negara Ratu'],
            ['id' => 'st-tulungbuyut', 'label' => 'Tulung Buyut'],
            ['id' => 'st-negriagung', 'label' => 'Negri Agung'],
            ['id' => 'st-blambanganumpu', 'label' => 'BLAMBANGAN UMPU'],
            ['id' => 'st-giham', 'label' => 'Giham'],
            ['id' => 'st-tanjungrajo', 'label' => 'Tanjung Rajo'],
            ['id' => 'st-waytuba', 'label' => 'Way Tuba'],
            ['id' => 'st-waypisang', 'label' => 'Way Pisang'],
            ['id' => 'st-martapura', 'label' => 'MARTAPURA'],
            ['id' => 'st-sungaituha', 'label' => 'Sungai Tuha'],
            ['id' => 'st-gilas', 'label' => 'Gilas'],
            ['id' => 'st-sepancar', 'label' => 'Sepancar'],
            ['id' => 'st-kemelak', 'label' => 'Kemelak'],
            ['id' => 'st-baturaja', 'label' => 'BATURAJA'],
            ['id' => 'st-tigagajah', 'label' => 'TIGAGAJAH'],
            ['id' => 'st-lubukbatang', 'label' => 'Lubuk Batang'],
            ['id' => 'st-belatung', 'label' => 'Belatung'],
            ['id' => 'st-kepayang', 'label' => 'Kepayang'],
            ['id' => 'st-belimbingairkaka', 'label' => 'Belimbing Airkaka'],
            ['id' => 'st-durian', 'label' => 'Durian'],
            ['id' => 'st-lubukrukam', 'label' => 'Lubuk Rukam'],
            ['id' => 'st-peninjawan', 'label' => 'PENINJAWAN'],
            ['id' => 'st-talangbaru', 'label' => 'Talang Baru'],
            ['id' => 'st-metur', 'label' => 'Metur'],
            ['id' => 'st-kotabaru', 'label' => 'KOTA BARU'],
            ['id' => 'st-pagargunung', 'label' => 'PAGAR GUNUNG'],
            ['id' => 'st-airasam', 'label' => 'Air Asam'],
            ['id' => 'st-sukamerindu', 'label' => 'Suka Merindu'],
            ['id' => 'st-tanjungrambang', 'label' => 'TANJUNGRAMBANG']
        ];

        // Insert Stations
        foreach ($stations as $st) {
            Location::updateOrCreate(
                ['id' => $st['id']],
                [
                    'name' => ucwords(strtolower($st['label'])),
                    'type' => 'stasiun',
                    'parent_id' => null,
                    'x' => 0,
                    'y' => 0,
                    'color' => '#94A3B8'
                ]
            );
        }

        $units = [
            ['parentId' => 'st-tarahan', 'items' => ['DIPO LOK', 'DIPO GRB', 'KRU KA THN', 'POSKES', 'TAKE OR PAY']],
            ['parentId' => 'st-tanjungkarang', 'items' => ['ST. TNK', 'KTR DIVRE 4', 'DIPO LOK', 'KRU KA', 'POSKES CREW KA', 'Resort JR Tnk', 'Resort STL Tnk']],
            ['parentId' => 'st-rejosari', 'items' => ['Resort JR Rjs', 'Resort STL Rjs']],
            ['parentId' => 'st-tegineneng', 'items' => ['Resort JR Tgi']],
            ['parentId' => 'st-bekri', 'items' => ['Resort JR Bkr', 'Resort Sintel KB', 'Resort KB']],
            ['parentId' => 'st-kotabumi', 'items' => ['Tower KTP', 'Kru KA KTP', 'Resort Sintel KB', 'Resort JR KB']],
            ['parentId' => 'st-ketapang', 'items' => ['Resort JR KTP', 'Kru KA KTP', 'Resort JR BEU']],
            ['parentId' => 'st-negriagung', 'items' => ['Resort JR TLY', 'Resort Sintel NRR']],
            ['parentId' => 'st-blambanganumpu', 'items' => ['Resort JR NGK']],
            ['parentId' => 'st-giham', 'items' => ['Resort JR KYG']],
            ['parentId' => 'st-waytuba', 'items' => ['Resort JR WAY']],
            ['parentId' => 'st-martapura', 'items' => ['Resort JR MP', 'Resort Sintel MP']],
            ['parentId' => 'st-sepancar', 'items' => ['Resort JR SPC']],
            ['parentId' => 'st-baturaja', 'items' => ['Resort JR BTA', 'Resort Sintel BTA', 'Resort JJ BTA', 'BP BTA']],
            ['parentId' => 'st-tigagajah', 'items' => ['Kru KA TJH']],
            ['parentId' => 'st-belimbingairkaka', 'items' => ['Resort JR BK']],
            ['parentId' => 'st-peninjawan', 'items' => ['Resort JR PNW', 'Resort Sintel PNW']],
            ['parentId' => 'st-pagargunung', 'items' => ['Resort JR PGG', 'Resort Sintel PGG']],
            ['parentId' => 'st-tanjungrambang', 'items' => ['Resort JR TJR']],
        ];

        // Insert Units/Resorts
        foreach ($units as $group) {
            foreach ($group['items'] as $item) {
                $type = str_contains(strtolower($item), 'resort') ? 'resort' : 'unit';
                $id = 'u-' . Str::slug($item . '-' . str_replace('st-', '', $group['parentId']));
                
                Location::updateOrCreate(
                    ['id' => $id],
                    [
                        'name' => ucwords(strtolower($item)),
                        'type' => $type,
                        'parent_id' => $group['parentId'],
                        'x' => 0,
                        'y' => 0,
                        'color' => '#94A3B8'
                    ]
                );
            }
        }
    }
}
