<?php

namespace App\Jobs;

use App\Modal\Shop;
use App\Service\ProductManager;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Throwable;

class ProductInserter implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 100;
    public $timeout = 540;
    public $shop;
    public $productsFromShopify;

    public function __construct(Shop $shop, $result)
    {
        $this->productsFromShopify = $result;
        $this->shop = $shop;
    }


    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $productManager = new ProductManager($this->shop);
        $productManager->multipleUpload($this->productsFromShopify);
    }

    public function failed(Throwable $exception)
    {
        \Log::info($exception);
    }
}
