<?php
namespace App\Services\Search;

interface SearchEngineInterface
{
    /**
     * @return array<int, array{type: string, title: string, excerpt: string, url: ?string}>
     */
    public function rechercher(string $requete): array;
}