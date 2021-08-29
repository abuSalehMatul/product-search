
//this piece of code will go under the snippet search-bar.liquid
//there should a minified file in that template of this.. 
{
  window.allInputBoxes = document.getElementsByClassName('mat_input_c');
  window.allmatFinder = document.getElementsByClassName("mat-search-finder_c");

  var matInpBox;
  window.addEventListener('orientationchange', function (event) {
    window.allInputBoxes = document.getElementsByClassName('mat_input_c');
    window.allmatFinder = document.getElementsByClassName("mat-search-finder_c");
    matInpBox = window.allInputBoxes[0]
    for (let i = 1; i < window.allInputBoxes.length; i++) {
      if (
        window.allInputBoxes[i].getBoundingClientRect().top >
        window.allInputBoxes[i - 1].getBoundingClientRect().top
      )
        matInpBox = window.allInputBoxes[i]
    }
    matInpBox.removeEventListener("keyup", () => { });
    matulAddEventKeyupListener();
  });
  window.addEventListener('resize', () => {
    window.allInputBoxes = document.getElementsByClassName('mat_input_c');
    window.allmatFinder = document.getElementsByClassName("mat-search-finder_c");
    matInpBox = window.allInputBoxes[0]
    for (let i = 1; i < window.allInputBoxes.length; i++) {
      if (
        window.allInputBoxes[i].getBoundingClientRect().top >
        window.allInputBoxes[i - 1].getBoundingClientRect().top
      )
        matInpBox = window.allInputBoxes[i]
    }
    matInpBox.removeEventListener("keyup", () => { });
    matulAddEventKeyupListener();
  });

  matInpBox = window.allInputBoxes[0]
  for (let i = 1; i < window.allInputBoxes.length; i++) {
    if (
      window.allInputBoxes[i].getBoundingClientRect().top >
      window.allInputBoxes[i - 1].getBoundingClientRect().top
    )
      matInpBox = window.allInputBoxes[i]
  }
  var matTakenInput = "", matTakenClick = 0, matAllSplitedValue, matSplittedInpValue, matTotalSearchRes = [];
  matulAddEventKeyupListener();
  function matulAddEventKeyupListener() {
    if (matInpBox) {
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
            url: window.location.origin + "/search",
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
    }
  }


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

  $(".mat-search-finder_c").on('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (matTakenClick == 0) {
      matTakenClick = 1;
    } else return "";
    let redirectionUrl = `https://${Shopify.shop}/pages/finder?search-result=${encodeURIComponent(matInpBox.value)}`;
    //console.log(redirectionUrl);
    window.location.href = redirectionUrl;
  });


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