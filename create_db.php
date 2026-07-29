<?php
try {
    $pdo = new PDO('mysql:host=127.0.0.1;port=3306', 'root', '');
    $pdo->exec('CREATE DATABASE IF NOT EXISTS sivera_iv');
    echo 'DB created successfully.';
} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage();
}
