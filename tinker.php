<?php
use Illuminate\Support\Facades\DB;

DB::statement("ALTER TABLE locations MODIFY type ENUM('stasiun', 'unit', 'resort')");
echo "ENUM altered successfully.\n";
