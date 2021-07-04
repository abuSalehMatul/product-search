
{
  let inp = document.getElementById('mat_input');
  let finder = document.getElementById("mat-search-finder");
  let allVendors = [], totalSearchRes = [], finalResult;
  var matTakenInput = "", matTakenClick = 0, matAllSplitedValue;
  inp.addEventListener("keyup", function (e) {
    let  inputValue = e.target.value, splittedInpValue;
    if (e.keyCode == 32 || !inputValue || e.keyCode == 188) return false;
    if(inputValue == matTakenInput) return false;
    matTakenInput = inputValue;
    
    // splittedInpValue = inputValue.split(",");
    // splittedInpValue = splittedInpValue.map(split => split.trim())
    // matAllSplitedValue = splittedInpValue;
    // for (let ittr = 0; ittr < splittedInpValue.length; ittr++) {
    //   let val = splittedInpValue[ittr];
    //   if (!val) return false;

    //   if (typeof totalSearchRes[val] != "undefined") {
    //     let ind = splittedInpValue.indexOf(val);
    //     let modifiedVal = [];
    //     for(let k=0; k < splittedInpValue.length; k++){
    //       if(k <= ind){
    //           modifiedVal.push(splittedInpValue[k])
    //       }
    //     }
    //     finalResult = getFinalResult(totalSearchRes, modifiedVal);
    //     drawAutoComplete(finalResult, ittr);
    //   } else {
    //     $.ajax({
    //       url: "https://groceryfinder.myshopify.com/search",
    //       data: {
    //         q: val,
    //         type: "product",
    //         view: "json",
    //       },
    //       dataType: "json",
    //       success: function (data) {
    //         processor(data, ittr, val, splittedInpValue);
    //       }
    //     });
    //   }

    // }

  });

  // function processor(data, ittr, val, splittedInpValue) {
  //   let currentRes = []
  //   let vendors = [];
  //   //console.log(data);
  //   vendors = data.map(el => el.vendor);
  //   vendors = vendors.filter((v, i, a) => a.indexOf(v) === i);
  //   if (typeof allVendors[ittr] == "undefined") {
  //     allVendors.push(vendors);
  //   } else {
  //     allVendors[ittr] = vendors;
  //   }
  //   for (let i = 0; i < vendors.length; i++) {
  //     let tem = {};
  //     tem[vendors[i]] = [];
  //     currentRes.push(tem);
  //   }
  //   for (let i = 0; i < data.length; i++) {
  //     currentRes = buildCurrentRes(data[i].vendor, data[i], currentRes);
  //   }
  //   totalSearchRes[val] = currentRes;
  //   // console.log('toatla res ',  totalSearchRes[val]);
  //   finalResult = getFinalResult(totalSearchRes, splittedInpValue);
  //   removeDuplicate(finalResult);
  //   drawAutoComplete(finalResult, ittr);
  // }

  // function buildCurrentRes(vendor, productData, resArr) {
  //   for (let i = 0; i < resArr.length; i++) {
  //     if (Object.keys(resArr[i])[0] == vendor) {
  //       resArr[i][`${vendor}`].push(productData)
  //     }
  //   }
  //   return resArr;
  // }

  // function getFinalResult(allRes, splitedVal) {
  //   let mergedContainer = {};
  //   splitedVal.forEach(inputNo => {
  //     // console.log('matched res ',allRes[inputNo])
  //     for (let i = 0; i < allRes[inputNo].length; i++) {
  //       let sObj = Object.entries(allRes[inputNo][i]);
  //       if (typeof mergedContainer[`${sObj[0][0]}`] == "undefined") {
  //         mergedContainer[`${sObj[0][0]}`] = sObj[0][1]
        
  //       } else {
  //         mergedContainer[`${sObj[0][0]}`] = mergedContainer[`${sObj[0][0]}`].concat(sObj[0][1]);
  //       }
  //     }
  //   });
  //   return mergedContainer;
  // }

  // function removeDuplicate(results) {
  //   if (typeof results == "object") {
  //     let resultSeperated = Object.entries(results);
  //     resultSeperated.forEach(res => {
  //       let key = res[0];
  //       let values = res[1];
  //       let ids = values.map(obj => obj.id);
  //       let duplicates = [];
  //       ids.sort(function (a, b) { return a - b });
  //       for (let i = 0; i < ids.length - 1; i++) {
  //         if (ids[i] == ids[i + 1]) {
  //           duplicates.push(ids[i + 1])
  //         }
  //       }
  //       for (let i = values.length - 1; i >= 0; i--) {
  //         if (duplicates.includes(values[i].id)) {
  //           let temId = values[i].id;
  //           values.splice(i, 1);
  //           for (let j = 0; j < duplicates.length; j++) {
  //             if (duplicates[j] == temId) {
  //               duplicates.splice(j, 1);
  //             }
  //           }
  //         }
  //       }

  //       results[`${key}`] = values

  //     })
  //   }
  //   return results;
  // }

  function drawAutoComplete(results, currentSearchIndex) {
    closeAllLists();
    let currentFocus = -1, shopEl, container;
    container = document.createElement("DIV");
    container.id = inp.id + "-autocomplete-list";
    container.setAttribute("class", "autocomplete-items");
    inp.parentNode.appendChild(container);
    let vendorsAndProducts = Object.entries(results);
    console.log(vendorsAndProducts)
    for (let i = 0; i < vendorsAndProducts.length; i++) {
      let arrow = '<svg height="15px" version="1.1" id="mat-plus" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"><g><g><path d="M256,0C114.833,0,0,114.833,0,256s114.833,256,256,256s256-114.853,256-256S397.167,0,256,0z M256,472.341 c-119.275,0-216.341-97.046-216.341-216.341S136.725,39.659,256,39.659S472.341,136.705,472.341,256S375.295,472.341,256,472.341z"/></g></g><g><g><path d="M355.148,234.386H275.83v-79.318c0-10.946-8.864-19.83-19.83-19.83s-19.83,8.884-19.83,19.83v79.318h-79.318 c-10.966,0-19.83,8.884-19.83,19.83s8.864,19.83,19.83,19.83h79.318v79.318c0,10.946,8.864,19.83,19.83,19.83 s19.83-8.884,19.83-19.83v-79.318h79.318c10.966,0,19.83-8.884,19.83-19.83S366.114,234.386,355.148,234.386z"/></g></g></svg>';
      shopEl = document.createElement("DIV");
      shopEl.id = "mat-shop-" + i;
      shopEl.innerHTML = "<span class='mat-heighlight'>" + arrow + vendorsAndProducts[i][0] + "</span>";
      /*execute a function when someone clicks on the item value (DIV element):*/
      shopEl.addEventListener("click", function (e) {
        e.stopPropagation();
        if (document.getElementById("mat-product-container-" + i).style.display == "none") {
          $("#mat-product-container-" + i).show(300);
        } else {
          $("#mat-product-container-" + i).hide(500);
        }
      });
      container.appendChild(shopEl);

      let productContainer = document.createElement("div");
      productContainer.id = "mat-product-container-" + i;
      productContainer.style.display = "none";
      for (let j = 0; j < vendorsAndProducts[i][1].length; j++) {
        let productDiv = document.createElement('div');
        productDiv.classList.add("mat-product-insearch");
        let image = document.createElement('img');
        image.src = vendorsAndProducts[i][1][j].featured_image;
        productDiv.append(image);
        let title = document.createElement('span');
        title.innerHTML = vendorsAndProducts[i][1][j].title;
        productDiv.append(title);
        productDiv.addEventListener('click', (e)=>{
            e.stopPropagation();
            window.location.href = "https://groceryfinder.myshopify.com/products/"+ vendorsAndProducts[i][1][j].handle;
        })
        productContainer.append(productDiv);
      }
      shopEl.append(productContainer);

    }
  }

  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
      increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) { //up
      /*If the arrow UP key is pressed,
      decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }

  finder.addEventListener("click", (e)=>{
    e.stopPropagation();
    e.preventDefault();
    if(matTakenClick == 0){
      matTakenClick = 1;
    }else return "";
    matAllSplitedValue = JSON.stringify(matAllSplitedValue);
    console.log(matAllSplitedValue);
    let redirectionUrl = `https://${Shopify.shop}/pages/finder?search-result=${matTakenInput}`;
    console.log(redirectionUrl);
    //window.location.href = redirectionUrl;

  })
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  function matJsonToURI(json) { return encodeURIComponent(JSON.stringify(json)); }
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}