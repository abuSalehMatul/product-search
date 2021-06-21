<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use App\Service\Api as ApiService;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Throwable;

class ProductCollector implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $apiService;
    public $timeout = 3000;
    public $tries = 3;

    public function __construct(ApiService $apiService)
    {
       $this->apiService = $apiService;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $this->apiService->getShopifyProducts();
      
    }
    public function failed(Throwable $exception)
    {
        Log::channel('job')->info($exception->getMessage());
    }
}
