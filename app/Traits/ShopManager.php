<?php

namespace App\Traits;

use App\Modal\CommonImportSetting;
use App\Modal\Shop;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Service\CommonStoreService;

trait ShopManager
{

    public function getShopByMyDomain($myShopifyDomain)
    {
        return Shop::where('my_shopify_domain', $myShopifyDomain)->first();
    }

    public function createShop($myshopifydomain, $status)
    {
        $shop = new Shop;
        $shop->my_shopify_domain = $myshopifydomain;
        $shop->status = $status;
        $shop->state_token = Str::random(40). Str::random(15) .rand(10, 256);
        $shop->save();
        return $shop->refresh();
    }

    public function changeStatus($status, Shop $shop)
    {
        $shop->status = $status;
        $shop->save();
        return $shop->fresh();
    }

    public function getOrCreateShopByMyshopifydomain($myshopifydomain)
    {
        $shop= $this->getShopByMyDomain($myshopifydomain);
        if($shop){
            return $shop;
        }
        return $this->createShop($myshopifydomain, 'new');
    }

    public function saveDetails( Shop $shop, $shopDetails)
    {
        $shop->shop_details_json = json_encode($shopDetails);
        $shop->shop_url = $shopDetails->data->shop->url;
        $shop->access_token = $shopDetails->access_token;
        $shop->save();
        return $shop->fresh();
    }



    public function uninstallFromApp($myshopifydomain)
    {
        $shop = Shop::where('my_shopify_domain', $myshopifydomain)->first();
        $shop->status = "uninstall";
        $shop->save();
    }
}
