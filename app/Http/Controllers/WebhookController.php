<?php

namespace App\Http\Controllers;

use App\Modal\Shop;
use Illuminate\Http\Request;
use App\Service\ProductManager;
use Illuminate\Support\Facades\Log;
use App\Traits\ShopManager;
use Exception;

class WebhookController extends Controller
{
    use ShopManager;

    public function __construct()
    {
        parent::__construct();
    }
    
    public function productCreate(Request $request)
    {
        //product create webhook
        if ($this->weebhookProcess($request)) {
            try{
                $productData = json_decode($this->data);
                $shop = Shop::where("my_shopify_domain", $this->myShopifyDomain)->first();
                $productManager = new ProductManager($shop);
                $productManager->batchUpload($productManager->buildProductData($productData));
            }
            catch(Exception $e){
                Log::channel('exception')->info("error in shop unisntallation " . $e->getMessage());
            }
           
        }
        return response()->json([], 200);
    }

    public function productDelete(Request $request)
    {
        try {
            if ($this->weebhookProcess($request)) {
                $productData = json_decode($this->data);
                $shop = Shop::where("my_shopify_domain", $this->myShopifyDomain)->first();
                $productManager = new ProductManager($shop);
                $productManager->deleteProduct($productData->id);
            }
        } catch (\Exception $e) {
            Log::channel('exception')->info("error in shop productDelete " . $e->getMessage());
        }

        return response()->json([], 200);
    }

    public function productUpdate(Request $request)
    {
        if ($this->weebhookProcess($request)) {
            try{
                $productData = json_decode($this->data);
                $shop = Shop::where("my_shopify_domain", $this->myShopifyDomain)->first();
                $productManager = new ProductManager($shop);
                $productData = $productManager->buildProductData($productData);
                $productManager->updateProduct($productData);
            }
            catch (\Exception $e) {
                Log::channel('exception')->info("error in shop productUpdate " . $e->getMessage());
            }
        }
        return response()->json([], 200);
    }

    public function uninstall(Request $request)
    {
        if ($this->weebhookProcess($request)) {
            $shopData = json_decode($this->data);
            try{
                $this->uninstallFromApp($shopData->domain);
            }
            catch (\Exception $e) {
                Log::channel('exception')->info("error in shop unisntallation " . $e->getMessage());
            }
        }
        return response()->json([], 200);
    }
}
