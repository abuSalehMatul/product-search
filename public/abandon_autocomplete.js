    // function drawAutoComplete(results, currentSearchIndex) {
    //     closeAllLists();
    //     let currentFocus = -1, shopEl, container;
    //     container = document.createElement("DIV");
    //     container.id = matInpBox.id + "-autocomplete-list";
    //     container.setAttribute("class", "autocomplete-items");
    //     matInpBox.parentNode.appendChild(container);
    //     let vendorsAndProducts = Object.entries(results);
    //     console.log(vendorsAndProducts)
    //     for (let i = 0; i < vendorsAndProducts.length; i++) {
    //         let arrow = '<svg height="15px" version="1.1" id="mat-plus" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"><g><g><path d="M256,0C114.833,0,0,114.833,0,256s114.833,256,256,256s256-114.853,256-256S397.167,0,256,0z M256,472.341 c-119.275,0-216.341-97.046-216.341-216.341S136.725,39.659,256,39.659S472.341,136.705,472.341,256S375.295,472.341,256,472.341z"/></g></g><g><g><path d="M355.148,234.386H275.83v-79.318c0-10.946-8.864-19.83-19.83-19.83s-19.83,8.884-19.83,19.83v79.318h-79.318 c-10.966,0-19.83,8.884-19.83,19.83s8.864,19.83,19.83,19.83h79.318v79.318c0,10.946,8.864,19.83,19.83,19.83 s19.83-8.884,19.83-19.83v-79.318h79.318c10.966,0,19.83-8.884,19.83-19.83S366.114,234.386,355.148,234.386z"/></g></g></svg>';
    //         shopEl = document.createElement("DIV");
    //         shopEl.id = "mat-shop-" + i;
    //         shopEl.innerHTML = "<span class='mat-heighlight'>" + arrow + vendorsAndProducts[i][0] + "</span>";
    //         /*execute a function when someone clicks on the item value (DIV element):*/
    //         shopEl.addEventListener("click", function (e) {
    //             e.stopPropagation();
    //             if (document.getElementById("mat-product-container-" + i).style.display == "none") {
    //                 $("#mat-product-container-" + i).show(300);
    //             } else {
    //                 $("#mat-product-container-" + i).hide(500);
    //             }
    //         });
    //         container.appendChild(shopEl);

    //         let productContainer = document.createElement("div");
    //         productContainer.id = "mat-product-container-" + i;
    //         productContainer.style.display = "none";
    //         for (let j = 0; j < vendorsAndProducts[i][1].length; j++) {
    //             let productDiv = document.createElement('div');
    //             productDiv.classList.add("mat-product-insearch");
    //             let image = document.createElement('img');
    //             image.src = vendorsAndProducts[i][1][j].featured_image;
    //             productDiv.append(image);
    //             let title = document.createElement('span');
    //             title.innerHTML = vendorsAndProducts[i][1][j].title;
    //             productDiv.append(title);
    //             productDiv.addEventListener('click', (e) => {
    //                 e.stopPropagation();
    //                 window.location.href = "https://groceryfinder.myshopify.com/products/" + vendorsAndProducts[i][1][j].handle;
    //             })
    //             productContainer.append(productDiv);
    //         }
    //         shopEl.append(productContainer);

    //     }
    // }
