{
    let shopWithProducts = matulGetParameterByName('search-res');
    console.log(shopWithProducts);
    //get query string value
    
    var mSearchTemplate = '<div id="CollectionSection" data-section-id="collection-template" data-section-type="collection-template"> <div class="grid grid-border"> <div class="grid-item"> <header class="section-header"> <h1 class="section-header--title section-header--left h1">Fruits</h1> </header> <div class="grid-uniform"> <div class="grid-item small--one-half medium--one-quarter large--one-quarter"> <a href="/products/emirates-bio-farm-organic-beetroot" class="product-grid-item"> <div class="product-grid-image" style="height: 228px;"> <div class="product-grid-image--centered"> <div class="lazyload__image-wrapper no-js" style="max-width: 250px"> <div style="padding-top:100.0%;"> <img class="no-js lazyautosizes lazyloaded" src="//cdn.shopify.com/s/files/1/0543/3760/1723/products/Fff_Zing_O_Wings.jpg?v=1620624250" alt="Emirates Bio Farm Organic Beetroot" > </div></div></div></div><p>Emirates Bio Farm Organic Beetroot</p><h4>500g pack</h4> <div class="product-item--price"> <span class="h1 medium--left"> <span class="visually-hidden">Regular price</span> <small aria-hidden="true">Dhs. 13.00</small> <span class="visually-hidden">Dhs. 13.00</span> </span> </div></a> </div></div></div></div></div>';

    function matulGetParameterByName(name, url = window.location.href) {
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
}
