<?php

namespace App\Service;

use App\Modal\Shop;

abstract class ApiBase
{
    public $shop;
    public $token;

    public function __construct(Shop $shop)
    {
        $this->shop = $shop;
        $this->token = $shop->access_token ?? "";
    }

    public function getShopifyData($url)
    {
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-Type: application/json', 'X-Shopify-Access-Token:' . $this->token));
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "GET");
        curl_setopt($curl, CURLOPT_HEADERFUNCTION, function ($curl, $header) use (&$headers) {
            $len = strlen($header);
            $header = explode(':', $header, 2);
            if (count($header) >= 2) {
                $headers[strtolower(trim($header[0]))] = trim($header[1]);
            }
            return $len;
        });
        $response = curl_exec($curl);
        $header_size = curl_getinfo($curl, CURLINFO_HEADER_SIZE);
        $header = substr($response, 0, $header_size);
        $body = substr($response, $header_size);
        curl_close($curl);
        return [
            'response' => $response,
            'headers' => $headers ?? "",
            'body' => $body
        ];
    }


    public static function postOrPutRequest($url, $data, $type, $token = "")
    {
        $crl = curl_init();
        curl_setopt($crl, CURLOPT_URL, $url);
        curl_setopt($crl, CURLOPT_HTTPHEADER, array('Content-Type: application/json', 'X-Shopify-Access-Token: ' .  $token));
        curl_setopt($crl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($crl, CURLOPT_VERBOSE, 0);
        curl_setopt($crl, CURLOPT_HEADER, 1);
        curl_setopt($crl, CURLOPT_CUSTOMREQUEST, $type);
        curl_setopt($crl, CURLOPT_POSTFIELDS, $data);
        curl_setopt($crl, CURLOPT_SSL_VERIFYPEER, false);
        $response = curl_exec($crl);
        $header_size = curl_getinfo($crl, CURLINFO_HEADER_SIZE);
        $header = substr($response, 0, $header_size);
        $body = substr($response, $header_size);
        curl_close($crl);
        return $body;
    }
}
