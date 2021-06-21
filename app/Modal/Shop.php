<?php
namespace App\Modal;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Traits\ShopManager;

class Shop extends Authenticatable{
    use ShopManager;

    protected $fillable =['shop_url', 'my_shopify_domain',  'status', 'shop_details_json', 
    'access_token', 'created_at'];

}