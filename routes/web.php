<?php

use Illuminate\Support\Facades\Route;

Route::middleware(['cors'])->group(function (){
    Route::get('/home', 'HomeController@index');
    Route::get('shopify/auth/callback', 'HomeController@callback')->name('redirect_url');
    Route::any('uninstall', 'WebhookController@uninstall');
    Route::any('shopify-product-create', 'WebhookController@productCreate');
    Route::any('shopify-product-update', 'WebhookController@productUpdate');
    Route::any('shopify-product-delete', 'WebhookController@productDelete');
});


Route::get("test", "HomeController@test");