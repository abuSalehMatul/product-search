<?php 

namespace App\Service;

class WebhookManager{
    public static function updateWebhook(Api $aprService)
    {
        //webhook addresses ...................................................
        $uninstallationHookAddress = config('shopify.APP_URL') . "/uninstall";
        $productCreateHookAddress = config('shopify.APP_URL') . "/shopify-product-create";
        $productUpdateHookAddress = config('shopify.APP_URL') . "/shopify-product-update";
        $productDeleteHookAddress = config('shopify.APP_URL') . "/shopify-product-delete";
        $themePublishHookAddress = config('shopify.APP_URL') . "/shopify-theme-publish";
        //.................................................................................
       
        //created webhooks by a common function, passing webhook address and webhook topic...........
        $aprService->createWhook($uninstallationHookAddress, "app/uninstalled");
        $aprService->createWhook($productCreateHookAddress, "products/create");
        $aprService->createWhook($productUpdateHookAddress, "products/update");
        $aprService->createWhook($productDeleteHookAddress, "products/delete");
        $aprService->createWhook($themePublishHookAddress, "themes/publish");
    }
}