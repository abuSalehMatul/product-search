{
    let allVendors = [], totalSearchRes = [], finalResult;
    let searchString = matulGetParameterByName('search-result'), splittedInpValue;
    console.log(searchString);
    //get query string value

    splittedInpValue = searchString.split(",");
    splittedInpValue = splittedInpValue.map(split => split.trim())
    for (let ittr = 0; ittr < splittedInpValue.length; ittr++) {
        let val = splittedInpValue[ittr];
        if (!val) return false;

        if (typeof totalSearchRes[val] != "undefined") {
            let ind = splittedInpValue.indexOf(val);
            let modifiedVal = [];
            for (let k = 0; k < splittedInpValue.length; k++) {
                if (k <= ind) {
                    modifiedVal.push(splittedInpValue[k])
                }
            }
            finalResult = getFinalResult(totalSearchRes, modifiedVal);
            drawAutoComplete(finalResult, ittr);
        } else {
            $.ajax({
                url: "https://groceryfinder.myshopify.com/search",
                data: {
                    q: val,
                    type: "product",
                    view: "json",
                },
                dataType: "json",
                success: function (data) {
                    processor(data, ittr, val, splittedInpValue);
                }
            });
        }

    }

    function processor(data, ittr, val, splittedInpValue) {
        let currentRes = []
        let vendors = [];
        //console.log(data);
        vendors = data.map(el => el.vendor);
        vendors = vendors.filter((v, i, a) => a.indexOf(v) === i);
        if (typeof allVendors[ittr] == "undefined") {
            allVendors.push(vendors);
        } else {
            allVendors[ittr] = vendors;
        }
        for (let i = 0; i < vendors.length; i++) {
            let tem = {};
            tem[vendors[i]] = [];
            currentRes.push(tem);
        }
        for (let i = 0; i < data.length; i++) {
            currentRes = buildCurrentRes(data[i].vendor, data[i], currentRes);
        }
        totalSearchRes[val] = currentRes;
        // console.log('toatla res ',  totalSearchRes[val]);
        finalResult = getFinalResult(totalSearchRes, splittedInpValue);
        removeDuplicate(finalResult);
        drawAutoComplete(finalResult, ittr);
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
        let mergedContainer = {};
        splitedVal.forEach(inputNo => {
            // console.log('matched res ',allRes[inputNo])
            for (let i = 0; i < allRes[inputNo].length; i++) {
                let sObj = Object.entries(allRes[inputNo][i]);
                if (typeof mergedContainer[`${sObj[0][0]}`] == "undefined") {
                    mergedContainer[`${sObj[0][0]}`] = sObj[0][1]

                } else {
                    mergedContainer[`${sObj[0][0]}`] = mergedContainer[`${sObj[0][0]}`].concat(sObj[0][1]);
                }
            }
        });
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


    function matulGetParameterByName(name, url = window.location.href) {
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
}
