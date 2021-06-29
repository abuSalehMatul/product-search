
{
  let inp = document.getElementById('mat_input');
  let currentFocus, allVendors = [], processedVal = [], totalSearchRes = [], finalResult;

  inp.addEventListener("keyup", function (e) {
    //console.log('take one');
    let container, matchingEl, currentSearchIndex, currentRes = [],
      inputValue = e.target.value, splittedInpValue;
    if (e.keyCode == 32 || !inputValue || e.keyCode == 188) return false;
    splittedInpValue = inputValue.split(",");
    splittedInpValue = splittedInpValue.map(splic=> splic.trim())
    for(let ittr =0 ; ittr < splittedInpValue.length ; ittr++) {
      let val = splittedInpValue[ittr];
      if (!val) return false;
      if(processedVal.includes(val)) continue; //will contain only 2+ value... one before comma other after comma
      else processedVal.push(val);
      closeAllLists();
      currentSearchIndex = ittr;
      currentFocus = -1;
      /*append the DIV element as a child of the autocomplete container:*/
      container = document.createElement("DIV");
      container.id = e.target.id + "autocomplete-list";
      container.setAttribute("class", "autocomplete-items");
      e.target.parentNode.appendChild(container);
      //.................................................................
      $.ajax({
        url: "https://groceryfinder.myshopify.com/search",
        data: {
          q:  val,
          type: "product",
          view: "json",
        },
        dataType: "json",
        success: function (data) {
          let vendors = [];
          //console.log(data);
          vendors = data.map(el => el.vendor);
          vendors = vendors.filter((v, i, a) => a.indexOf(v) === i);
          if (typeof allVendors[currentSearchIndex] == "undefined") {
            allVendors.push(vendors);
          } else {
            allVendors[currentSearchIndex] = vendors;
          }
         // console.log('all vendores ', allVendors)
          currentRes = [];
          for (let i = 0; i < vendors.length; i++) {
            let tem = {};
            tem[vendors[i]] = [];
            currentRes.push(tem);
          }
          // for (let i = 0; i < productsObj.length; i++) {
          //     /*create a DIV element for each matching element:*/
          //     matchingEl = document.createElement("DIV");
          //     /*make the matching letters bold:*/
          //     matchingEl.innerHTML = "<span class='mat-heighlight'>" + productsObj[i].title.substr(0, val.length) + "</span>";
          //     matchingEl.innerHTML += productsObj[i].title.substr(val.length);
          //     /*insert a input field that will hold the current array item's value:*/
          //     matchingEl.innerHTML += "<input type='hidden' value='" + productsObj[i].handle + "'>";
          //     /*execute a function when someone clicks on the item value (DIV element):*/
          //     matchingEl.addEventListener("click", function (e) {
          //       /*insert the value for the autocomplete text field:*/
          //       inp.value += this.getElementsByTagName("input")[0].value;
          //       closeAllLists();
          //       inp.focus();
          //     });
          //     container.appendChild(matchingEl);

          // }
          for (let i = 0; i < data.length; i++) {
            currentRes = buildCurrentRes(data[i].vendor, data[i], currentRes);
          }
          totalSearchRes[val] = currentRes;
          //console.log(val, totalSearchRes);
         // console.log('current res ', currentRes);
          finalResult = getFinalResult(totalSearchRes, splittedInpValue); 
          removeDuplicate(finalResult);
        }
      });
    }

  });

  function buildCurrentRes(vendor, productData, resArr) {
    for (let i = 0; i < resArr.length; i++) {
      if (Object.keys(resArr[i])[0] == vendor) {
        resArr[i][`${vendor}`].push(productData)
      }
    }
    return resArr;
  }

  function getFinalResult(allRes, splitedVal){
    let mergedContainer = {};
    splitedVal.forEach(inputNo => {
       // console.log('matched res ',allRes[inputNo])
        for(let i=0; i< allRes[inputNo].length; i++){
          let sObj = Object.entries(allRes[inputNo][i]);
          if(typeof mergedContainer[`${sObj[0][0]}`] == "undefined"){
            mergedContainer[`${sObj[0][0]}`] = sObj[0][1]
            // console.log(mergedContainer)
          }else{
            mergedContainer[`${sObj[0][0]}`] =  mergedContainer[`${sObj[0][0]}`].concat(sObj[0][1]);
          }
        }
    });
    return mergedContainer;
  }

  function removeDuplicate(results){
     if(typeof results == "object"){
       let resultSeperated = Object.entries(results);
       resultSeperated.forEach(res =>{
          let key = res[0];
          let values = res[1];
          let ids = values.map(obj => obj.id);
          let duplicates =[];
          ids.sort(function(a, b){return a - b});
          for(let i =0 ;i<ids.length - 1; i++){
            if(ids[i] == ids[i+1]){
              duplicates.push(ids[i+1])
            }
          }
          for(let i= values.length - 1; i >=0 ; i--){
             if(duplicates.includes(values[i].id)){
                let temId = values[i].id;
                values.splice(i, 1);
                for(let j=0; j < duplicates.length; j++){
                  if(duplicates[j]== temId){
                     duplicates.splice(j,1);
                  }
                }
             }
          }

         results[`${key}`] = values

       })
     }
     return results;
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
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}