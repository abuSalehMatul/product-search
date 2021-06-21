<?php


namespace App\Modal;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $fillable = [
        'product_id', 'title', 'handle',
        'status', 'my_shopify_domain', 'images'
    ];
}
