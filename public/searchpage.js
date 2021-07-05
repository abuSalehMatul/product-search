{
    var matulAllVendors = [], matulTotalSearchRes = [], matulFinalResult;
    let searchString = matulGetParameterByName('search-result'), splittedInpValue;

    splittedInpValue = searchString.split(",");
    splittedInpValue = splittedInpValue.map(split => split.trim());
    splittedInpValue = splittedInpValue.filter(split => split.length > 0);
    // console.log("original splited", splittedInpValue);
    //let ittr = 0;
    matGetSearch(0, splittedInpValue);

    function matGetSearch(ittr, splittedInpValue){
        let count = ittr;
        let val = splittedInpValue[ittr];
       // console.log("running for", ittr)
        $.ajax({
            url: "https://groceryfinder.myshopify.com/search",
            data: {
                q: val,
                type: "product",
                view: "json",
            },
            dataType: "json",
            success: function (data) {
               // console.log("running for", val);
                count++;
                processor(data, ittr, splittedInpValue);
                if(count != splittedInpValue.length){
                    matGetSearch(count, splittedInpValue);
                }
               
            }
        });
    }

    function processor(data, ittr, splited) {
        let currentRes = []
        let vendors = [];
        let val = splited[ittr];
        //console.log(data);
        vendors = data.map(el => el.vendor);
        vendors = vendors.filter((v, i, a) => a.indexOf(v) === i);
        if (typeof matulAllVendors[ittr] == "undefined") {
            matulAllVendors.push(vendors);
        } else {
            matulAllVendors[ittr] = vendors;
        }
        for (let i = 0; i < vendors.length; i++) {
            let tem = {};
            tem[vendors[i]] = [];
            currentRes.push(tem);
        }
        for (let i = 0; i < data.length; i++) {
            currentRes = buildCurrentRes(data[i].vendor, data[i], currentRes);
        }
        matulTotalSearchRes[val] = currentRes;


        let ind = splittedInpValue.indexOf(val);
        let modifiedVal = [];
        for (let k = 0; k < splittedInpValue.length; k++) {
            if (k <= ind) {
                modifiedVal.push(splittedInpValue[k])
            }
        }
        matulFinalResult = getFinalResult(matulTotalSearchRes, modifiedVal);
        removeDuplicate(matulFinalResult);
        //console.log("fi", matulFinalResult);
        matDrawSearchRes(matulFinalResult);
        // drawAutoComplete(matulFinalResult, ittr);
    }


    function buildCurrentRes(vendor, productData, resArr) {
        for (let i = 0; i < resArr.length; i++) {
            if (Object.keys(resArr[i])[0] == vendor) {
                resArr[i][`${vendor}`].push(productData)
            }
        }
        return resArr;
    }

    function getFinalResult(allRes, splitedVal) {
      //  console.log("all res" , allRes);
        //console.log('splited values', splitedVal)
        let mergedContainer = {};
        splitedVal.forEach(inputNo => {
            //console.log('matched res ', allRes[inputNo]);
           // console.log("getting matched for", inputNo)
            for (let i = 0; i < allRes[inputNo].length; i++) {
                let sObj = Object.entries(allRes[inputNo][i]);
                if (typeof mergedContainer[`${sObj[0][0]}`] == "undefined") {
                    mergedContainer[`${sObj[0][0]}`] = sObj[0][1]

                } else {
                    mergedContainer[`${sObj[0][0]}`] = mergedContainer[`${sObj[0][0]}`].concat(sObj[0][1]);
                }
            }
        });
        //console.log("final", mergedContainer)
        return mergedContainer;
    }

    function removeDuplicate(results) {
        if (typeof results == "object") {
            let resultSeperated = Object.entries(results);
            resultSeperated.forEach(res => {
                let key = res[0];
                let values = res[1];
                let ids = values.map(obj => obj.id);
                let duplicates = [];
                ids.sort(function (a, b) { return a - b });
                for (let i = 0; i < ids.length - 1; i++) {
                    if (ids[i] == ids[i + 1]) {
                        duplicates.push(ids[i + 1])
                    }
                }
                for (let i = values.length - 1; i >= 0; i--) {
                    if (duplicates.includes(values[i].id)) {
                        let temId = values[i].id;
                        values.splice(i, 1);
                        for (let j = 0; j < duplicates.length; j++) {
                            if (duplicates[j] == temId) {
                                duplicates.splice(j, 1);
                            }
                        }
                    }
                }

                results[`${key}`] = values

            })
        }
        return results;
    }

    function matDrawSearchRes(allResult){
        let vendorsAndProducts = Object.entries(allResult);
        console.log(vendorsAndProducts);
        for(let i=0 ; i<vendorsAndProducts.length; i++){
            let container = document.createElement("div");
            container.classList.add("grid-item");
            container.id = "mat-shop-"+i;
            let header = '<header class="section-header mat-shop-header" id="shop-name-"'+i+'> <h1 class="section-header--title section-header--left h1 mat-shop-name" id="">' + vendorsAndProducts[i][0] +'</h1> </header>';
            container.innerHTML = header;
            let allProducts = "";
            for(let j=0; j< vendorsAndProducts[i][1].length; j++){
                allProducts += `<div class="grid-item small--one-half medium--one-quarter large--one-quarter mat-shop-product">
                 <a href="${vendorsAndProducts[i][1][j].handle}" id="${vendorsAndProducts[i][1][j].id}" class="product-grid-item"> 
                    <div class="product-grid-image" > 
                        <div class="product-grid-image--centered"> 
                            <div class="lazyload__image-wrapper no-js"> 
                                <div style="padding-top:100.0%;"> 
                 <img class="no-js lazyautosizes lazyloaded" src="${vendorsAndProducts[i][1][j].featured_image}" alt="${vendorsAndProducts[i][1][j].title}" > 
                                </div>
                            </div>
                        </div>
                    </div>
                    <p>${vendorsAndProducts[i][1][j].title}</p>
                    <div class="product-item--price"> 
                        <span class="h1 medium--left"> 
                            <span class="visually-hidden">Regular price</span>
                                <small aria-hidden="true">Dhs. ${(vendorsAndProducts[i][1][j].price / 100).toFixed(2)}</small> 
                            <span class="visually-hidden">Dhs. ${vendorsAndProducts[i][1][j].price / 100}</span>
                         </span> 
                    </div>
                </a> 
            </div>`;
            }

            let gridUniform = document.createElement("div");
            gridUniform.classList.add("grid-uniform");
            gridUniform.id = "mat-uniform-"+i;
            gridUniform.innerHTML = allProducts;

            container.append(gridUniform);

           
            let parent = document.getElementById("mat-search-container");
            parent.append(container)
        }
    }

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


    function matulGetParameterByName(name, url = window.location.href) {
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
}
