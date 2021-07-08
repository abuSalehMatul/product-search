
{
  var matInpBox = document.getElementById('mat_input');
  let matFinder = document.getElementById("mat-search-finder");
  var matTakenInput = "", matTakenClick = 0, matAllSplitedValue, matSplittedInpValue, matTotalSearchRes = [];
  matInpBox.addEventListener("keyup", function (e) {
    let inputValue = e.target.value;
    if (e.keyCode == 32 || !inputValue || e.keyCode == 188) {
      matCloseAllLists();
      return false;
    };
    if (inputValue == matTakenInput) return false;
    matTakenInput = inputValue;

    matSplittedInpValue = inputValue.split(",");
    matSplittedInpValue = matSplittedInpValue.map(split => split.trim())
    let val = matSplittedInpValue[matSplittedInpValue.length - 1];
    if (!val) return false;
    if (typeof matTotalSearchRes[val] != "undefined") {
      matDrawAutoComplete(matTotalSearchRes, val)
    } else {
      $.ajax({
        url: "https://groceryfinder.myshopify.com/search",
        data: {
          q: val + "*",
          type: "product",
          view: "json",
        },
        dataType: "json",
        success: function (data) {
          matTotalSearchRes[val] = data;
          matDrawAutoComplete(matTotalSearchRes, val)
        }
      });
    }


  });

  function matDrawAutoComplete(finalResult, val) {
    matCloseAllLists();
    let container = document.createElement("DIV"), matchingEl;
    container.id = matInpBox.id + "autocomplete-list";
    container.setAttribute("class", "autocomplete-items");
    matInpBox.parentNode.appendChild(container);
    let productsObj = finalResult[val];
    //  console.log("res", productsObj)
    for (let i = 0; i < productsObj.length; i++) {
      matchingEl = document.createElement("DIV");
      matchingEl.classList.add("mat-product-insearch");
      let image = document.createElement("img");
      image.src = productsObj[i].featured_image;
      matchingEl.append(image);
      let title = document.createElement("span");
      title.innerHTML = productsObj[i].title;
      matchingEl.append(title);
      // matchingEl.innerHTML = productsObj[i].title;
      matchingEl.addEventListener("click", function (e) {
        let valueOnBox = "";
        for (let i = 0; i < matSplittedInpValue.length - 1; i++) {
          valueOnBox += matSplittedInpValue[i] + ",";
        }
        valueOnBox += productsObj[i].title + ",";
        matInpBox.value = valueOnBox;
        matCloseAllLists();
        matInpBox.focus();
      });
      container.appendChild(matchingEl);
    }
  }

  matFinder.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (matTakenClick == 0) {
      matTakenClick = 1;
    } else return "";
    let redirectionUrl = `https://${Shopify.shop}/pages/finder?search-result=${encodeURIComponent(matInpBox.value)}`;
    //console.log(redirectionUrl);
    window.location.href = redirectionUrl;

  })
  function matCloseAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != matInpBox) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }

  document.addEventListener("click", function (e) {
    matCloseAllLists(e.target);
  });
}