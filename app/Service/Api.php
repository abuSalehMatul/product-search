<?php

namespace App\Service;

use Exception;
use App\Modal\Plan;
use App\Modal\Shop;
use App\Traits\ShopManager;
use App\Jobs\ProductInserter;
use App\Modal\Product;
use App\Modal\ProductImportingInfo;
use Illuminate\Support\Facades\Log;

class Api extends ApiBase
{
    use ShopManager;
    public function __construct(Shop $shop)
    {
        parent::__construct($shop);
        $this->productManager  = new ProductManager($shop);
    }

    public function getShopifyProducts()
    {
        $url = "https://{$this->shop->my_shopify_domain}/admin/api/2020-10/graphql.json";
        $cursor = "";
        $alreadyDoneIttr =[];
        for ($i = 1;; $i++) {
            if ($cursor == "") {
                $combinator = "first:250";
            } else {
                $combinator = "first:250, after:\"$cursor\"";
            }

            $query = json_encode(
                [
                    "query" =>
                    "{
                        products($combinator) {
                          edges {
                            
                            node {
                              id
                              title
                              handle
                              status
                              onlineStorePreviewUrl
                              bodyHtml
                              createdAt
                              featuredImage {
                                id
                                originalSrc
                              }
                            }
                            cursor
                          }
                          pageInfo {
                            hasNextPage
                            hasPreviousPage
                          }
                        }
                    }"
                ]
            );
            $result = ApiBase::postOrPutRequest($url, $query, "POST", $this->token);
            $apiResutlt = json_decode($result);
            
            if(!isset($apiResutlt->errors)){
                if(!in_array($i, $alreadyDoneIttr)){
                    $products =  $apiResutlt->data->products;
                    $len = sizeof($products->edges);
                    $cursor = $products->edges[$len - 1]->cursor;
                    ProductInserter::dispatch($this->shop, $products);
                    array_push($alreadyDoneIttr, $i);
                    // $output = new \Symfony\Component\Console\Output\ConsoleOutput();
                    // $output->writeln($i);
                }
                
                if ($products->pageInfo->hasNextPage != 1) {
                    break;
                }
            }
           
        }
    }

    function getShopDetails()
    {
        $url = "https://{$this->shop->my_shopify_domain}/admin/api/2019-10/graphql.json";
        $query = json_encode(
            [
                "query" =>
                "{
                        shop {
                          name
                          url
                          billingAddress {
                            id
                            country
                            countryCodeV2
                            zip
                            city
                            address1
                            province
                            phone
                          } 
                          myshopifyDomain
                          timezoneAbbreviation  
                          currencyCode
                          contactEmail
                          email
                          description
                          primaryDomain {
                            url
                          }
                          plan {
                            displayName
                          }
                        }
                      }"
            ]
        );
        $result = ApiBase::postOrPutRequest($url, $query, "POST", $this->token);
        try {
            $result = json_decode($result);
            return $result;
        } catch (Exception $e) {
            Log::channel('exception')->info($e->getMessage());
            return "exception";
        }
    }


    function getAccesToken($code, $api_key, $secret, $myShopifyDomain)
    {
        $query = array(
            "client_id" => $api_key,
            "client_secret" => $secret,
            "code" => $code
        );
        $url = "https://" . $myShopifyDomain . "/admin/oauth/access_token";
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, count($query));
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($query));
        $result = curl_exec($ch);
        curl_close($ch);
        return $result;
    }

    function createWhook($address, $topic)
    {
        $url = "https://" . $this->shop->my_shopify_domain . "/admin/api/2020-04/webhooks.json";
        $address = "\"$address\"";
        $topic = "\"$topic\"";
        $query = '{"webhook": {"topic": ' . $topic . ', "address": ' . $address . ', "format": "json"}}';

        return ApiBase::postOrPutRequest($url, $query, "POST", $this->token);
    }



    public function getShopifyProductByHandle($handle)
    {
        $url = "https://" . $this->shop->my_shopify_domain . "/admin/api/2021-01/products.json?handle=$handle";
        $result = $this->getShopifyData($url);
        return $result['response'];
    }

    public function getProductCount()
    {
        $url = "https://" . $this->shop->my_shopify_domain . "/admin/api/2021-01/products/count.json";
        $result = $this->getShopifyData($url);
        $body = $result['response'];
        $count = json_decode($body);
        $count = $count->count;
        return $count;
    }

    public function uploadToAsset()
    {
        $allThemes = $this->getAllAsset();
        $mainThemeId = $this->findTheMainThemeId($allThemes);
        $this->createAssetFile($mainThemeId, 'assets/products_container_mat.js');
    }

    public function getAllAsset()
    {
        $url = "https://" . $this->shop->my_shopify_domain . '/admin/api/2021-01/themes.json';
        $result = $this->getShopifyData($url);
        $response = $result['response'];
        $response = json_decode($response);
        $themes = ($response->themes);
        if (is_array($themes)) {
            return $themes;
        }
        return false;
    }

    public function findTheMainThemeId($themes)
    {
        foreach ($themes as $theme) {
            if ($theme->role == 'main') { //only the main theme will have role main
                return $theme->id;
            }
        }
    }

    public function findSingleAssetByKey($themeId, $assetKey)
    {
        $url = "https://{$this->shop->my_shopify_domain}/admin/api/2020-04/themes/{$themeId}/assets.json?asset[key]={$assetKey}";
        //  print_r($url);
        $result = $this->apiService->getShopifyData($url);
        $body = $result['response'];
        return $body;
    }
    public function createAssetFile($themeId, $key)
    {
        $products = $this->getAllProducts();
        $products = "var matCustomAllProducts = ". $products;
        $url = "https://" . $this->shop->my_shopify_domain . '/admin/api/2020-04/themes/' . $themeId . '/assets.json';
        $data = [
            "asset" => [
                "key" => $key,
                "value" => $products
            ]
        ];
        // 
        $data = json_encode($data);
        return ApiBase::postOrPutRequest($url, $data, "PUT", $this->shop->access_token);
    }

    public function getAllProducts()
    {
        $products = Product::where("my_shopify_domain", $this->shop->my_shopify_domain)->get();
        return json_encode($products);
    }
}
