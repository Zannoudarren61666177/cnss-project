<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\Chatbot\ChatbotEngineInterface;
use App\Services\Chatbot\KeywordMatchEngine;
use App\Services\Search\SearchEngineInterface;
use App\Services\Search\KeywordSearchEngine;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
   public function register(): void
{
    $this->app->bind(ChatbotEngineInterface::class, KeywordMatchEngine::class);
    $this->app->bind(SearchEngineInterface::class, KeywordSearchEngine::class);
}

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
