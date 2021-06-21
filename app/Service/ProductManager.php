<?php

namespace App\Service;

use Carbon\Carbon;
use App\Modal\Shop;
use App\Modal\Product;
use App\Modal\ProductImportingInfo;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;

//save, update, delete product in our db..
class ProductManager{

    public function __construct(Shop $shop)
    {
        $this->shop = $shop;
    }

    public function getAllProducts()
    {
        $products = Product::where("my_shopify_domain", $this->shop->my_shopify_domain)->get();
        return json_encode($products);
    }


    public function updateProduct(array $productData)
    {
        $productId = $productData['product_id'];
        unset($productData['product_id']);
        unset($productData['my_shopify_domain']);
        Log::channel('developer')->info("after unset in update " . json_encode($productData));
        $product = Product::where('my_shopify_domain', $this->shop->my_shopify_domain)
        ->where('product_id', $productId)
        ->first();
        $product->title = $productData['title'];
        $product->status = $productData['status'];
        $product->images = $productData['images'];
        $product->handle = $productData['handle'];
        $product->save();
    }

    public function deleteProduct($id)
    {
        return Product::where('product_id', $id)->delete();
    }

    public function saveProduct()
    {

    }

    public function buildProductData($product)
    {
        //prepare products in a format to insert in db
        Log::channel('developer')->info("in builder ". json_encode($product));
        return [
            'product_id' => $product->id,
            'title' => $product->title ?? "",
            'handle' => $product->handle ?? "",
            'status' => $product->status ?? "",
            'images' => optional($product->image)->src ?? "",
            "my_shopify_domain" => $this->shop->my_shopify_domain,
            'created_at' => now(),
        ];
    }

    private function filterOutShopifyProductId($str){
        $res = explode("Product/", $str);
        return $res[1];
    }

    private function productDataBuilder($edges)
    {
        $productsData = [];
        foreach($edges as $edge){
            $productsData[]=[
                'product_id' =>$this->filterOutShopifyProductId($edge->node->id),
                "my_shopify_domain" => $this->shop->my_shopify_domain,
                'title' => $edge->node->title ?? "",
                "handle" => $edge->node->handle ?? "",
                "status" => $edge->node->status ?? "",
                'images' => optional($edge->node->featuredImage)->originalSrc ?? "",
                'created_at' => now()
            ];
        }
        return $productsData;
       
    }

    public function multipleUpload($products)
    {
        $allProductsData = $this->productDataBuilder($products->edges);
        $this->batchUpload($allProductsData); // batch upload of product into db
        $apiService = new Api($this->shop);
        $productCount = $apiService->getProductCount();
        $productImportedInDb = Product::where('my_shopify_domain', $this->shop->my_shopify_domain)->count();
        if($productCount == $productImportedInDb){
            $apiService->uploadToAsset();
        }
    }

    public function batchUpload($prodData)
    {
        return Product::insert($prodData);
    }

    public function deleteAllProd() //delete all products, we delete all products before inserting, so no duplicate occur
    {
        return Product::where('my_shopify_domain', $this->shop->my_shopify_domain)->delete();
    }

}