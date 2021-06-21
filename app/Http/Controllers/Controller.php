<?php

namespace App\Http\Controllers;

use App\Modal\Shop;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function __construct()
    {
        $this->shopifyApiKey = config('shopify.SHOPIFY_APP_KEY');
        $this->shopifyApiSecret = config('shopify.SHOPIFY_APP_SECRET');
        $this->UrlPattern = "/[a-zA-Z0-9][a-zA-Z0-9\-]*\.myshopify\.com[\/]?/";
    }

    public function getShopByMyshopifyDomain($myshopifyDomain)
    {
        return Shop::where('my_shopify_domain', $myshopifyDomain)->first();
    }

    protected function weebhookProcess($request)
    {
        //webhook verification and processing ........
        $this->hmac_header = $_SERVER['HTTP_X_SHOPIFY_HMAC_SHA256'];
        $this->data = file_get_contents('php://input');
        $verified = $this->verify_webhook($this->data, $this->hmac_header);
        $this->myShopifyDomain = $request->header('X-Shopify-Shop-Domain');
        return $verified;
    }

    protected function verify_webhook($data, $hmac_header)
    {
        $calculated_hmac = base64_encode(hash_hmac('sha256', $data, $this->shopifyApiSecret, true));
        return hash_equals($hmac_header, $calculated_hmac);
    }

    protected function isValidRequest($query)
    {
        $expectedHmac = $query['hmac'] ?? '';
        unset($query['hmac'], $query['signature']);
        ksort($query);
        $pairs = [];
        foreach ($query as $key => $value) {
            $key = strtr($key, ['&' => '%26', '%' => '%25', '=' => '%3D']);
            $value = strtr($value, ['&' => '%26', '%' => '%25']);
            $pairs[] = $key . '=' . $value;
        }
        $key = implode('&', $pairs);
        return (hash_equals($expectedHmac, hash_hmac('sha256', $key, $this->shopifyApiSecret)));
    }

    protected function formateMyShopifyDomainString($url) {
        $disallowed = array('http://', 'https://', ".myshopify.com", ".myshopify.com/");
        foreach($disallowed as $d) {
           if(strpos($url, $d) === 0) {
              return str_replace($d, '', $url);
           }
        }
        return $url;
    }
}
