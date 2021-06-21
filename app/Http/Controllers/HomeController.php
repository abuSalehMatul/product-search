<?php

namespace App\Http\Controllers;
use App\Modal\Shop;
use App\Service\Api;
use \PHPShopify\AuthHelper;
use \PHPShopify\ShopifySDK;
use App\Traits\ShopManager;
use Illuminate\Http\Request;
use App\Jobs\ProductCollector;
use App\Service\ProductManager;
use App\Service\WebhookManager;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Redirect;

class HomeController extends Controller
{

    use ShopManager;

    public function __construct()
    {
        parent::__construct();
    }


    public function index(Request $request) // this is the starting point of app, here we will decide either send for installation or to embedded dashboard
    {
        $hmac =  $request->get('hmac');
        if (isset($hmac)) {
            $myShopifyDomain =  $request->get('shop');
            $timestamp =  $request->get('timestamp');
            $shop = $this->getOrCreateShopByMyshopifydomain($myShopifyDomain);
            $config = array(
                'ShopUrl' => $myShopifyDomain,
                'ApiKey' => $this->shopifyApiKey,
                'SharedSecret' => $this->shopifyApiSecret,
            );
            ShopifySDK::config($config);

            //verify if the request came form shopify....
            if (AuthHelper::verifyShopifyRequest()) {
                if ($shop->status == 'new' || $shop->status == 'uninstall') {
                    //shop isn't installed , so we need to redirect it to installation page..
                    $redirectUri = config('shopify.APP_URL') . "/shopify/auth/callback";
                    $scopes = "write_themes,write_products,write_orders,write_themes,write_customers";
                    $oauthUrl = "https://$myShopifyDomain/admin/oauth/authorize?"
                        . "client_id={$this->shopifyApiKey}"
                        . "&scope={$scopes}"
                        . "&redirect_uri={$redirectUri}"
                        . "&state={$shop->state_token}";

                    return Redirect::to($oauthUrl); //redirecting........
                } elseif ($shop->status == 'installed') {
                    //shop is installed so redirect it to embedded section.......
                    return "shop is installed";
                    return view('home', compact('myShopifyDomain')); //embedded page
                }
            }
        }
    }

    public function callback(Request $request)
    {
        $myShopifyDomain = $request->get('shop');
        $code = $request->get('code');
        $state = $request->get('state');

        if (!$this->isValidRequest($_GET)) {
            return "un-authorized request";
        }
        $shop = $this->getShopByMyDomain($myShopifyDomain);
        $apiService = new Api($shop);
        if (preg_match($this->UrlPattern, $myShopifyDomain)) {
            if ($shop->state_token != $state) {
                return "Not Authorized";
            }

            $accessTokenResult = json_decode($apiService->getAccesToken($code, $this->shopifyApiKey, $this->shopifyApiSecret, $myShopifyDomain), true);
            $accessToken = $accessTokenResult['access_token'];
            $receiveScope = $accessTokenResult['scope'];

            $apiService->token = $accessToken;
            //need to save it on shop
            Log::channel('developer')->info('access token '. $accessToken);
            $shop = $this->changeStatus('install', $shop);
            Shop::where("my_shopify_domain", $myShopifyDomain)->update(['access_token' => $accessToken]);
            $shopDetails = $apiService->getShopDetails();
            $shopDetails->access_token = $accessToken;
            $shop = $this->saveDetails($shop, $shopDetails);

            WebhookManager::updateWebhook($apiService);
            $productManager = new ProductManager($shop);
            $productManager->deleteAllProd();
            $key = $shop->my_shopify_domain;
            if (!Cache::get($key)) {
                ProductCollector::dispatch($apiService);
                Cache::put($key, 'my_shopify_domain', 10);
            } else {
                Log::info('shop cached for shopid: ' . $shop->id);
            }
            return "shop is installed";
            return view('home', compact('myShopifyDomain')); //embedded page
        }
    }



    public function getEmbedded(Request $request)
    {
        $shop = $request->get('shop');
        return view('home', compact('shop'));
    }

    public function test(Request $request)
    {
        $myShopifyDomain = $request->get('shop');
       $shop = $this->getShopByMyDomain($myShopifyDomain);
        $apiService = new Api($shop);
        ProductCollector::dispatch($apiService);
    //     $src = "https://review.ngrok.io/sartag.js";
    //    return  $apiService->createScriptTag($src);
    //     $key = $shop->my_shopify_domain;
    //     if (!Cache::get($key)) {
    //         ProductCollector::dispatch($apiService);
    //         Cache::put($key, $myShopifyDomain, 10);
    //     }
    }

}
