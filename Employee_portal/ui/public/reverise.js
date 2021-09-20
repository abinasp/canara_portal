function reverise() {
    var nameDomains = ["shortname", "custname", "accttitle", "fullname", "midname", "firstname", "lastname", "accounttitle"];
    var addressDomains = ["brnname", "homebranch", "adrsline", "city", "state"];


    var myParent = document.body;
    var array = ["English", "Hindi", "Kannada", "Tamil"];

    //Create and append select list
    var selectList = document.createElement("select");
    selectList.style.position = "absolute";
    selectList.style.right = 0;
    selectList.style.top = 0;
    selectList.style.zIndex = 9999;
    selectList.style.maxWidth = "100px";
    selectList.id = "mySelect";
    selectList.classList.add("reverie_drop_down_vals");
    myParent.appendChild(selectList);
    //Create and append the options
    for (var i = 0; i < array.length; i++) {
        var option = document.createElement("option");
        option.value = array[i];
        option.text = array[i];
        option.classList.add("reverie_drop_down_vals");
        selectList.appendChild(option);
    }
    selectList.onchange = function () {
        var selectedString = selectList.options[selectList.selectedIndex].value;
        langSelect(selectedString)
    }
    let inputs = document.getElementsByTagName("input");
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].setAttribute("rev_input_data_source", inputs[i].value);
        inputObserver(inputs[i])
    }

    let g_language = "english";
    let style_string = `
    <style>
    #rev-loader {
        position:fixed;
        width:100%;
        left:0;right:0;top:0;bottom:0;
        background-color: rgba(255,255,255,0.7);
        z-index:9999;
        display:none;
    }
    #rev-loader::after {
        content:'';
        display:block;
        position:absolute;
        left:48%;
        top:40%;
        width:40px;height:40px;
        border-style:solid;
        border-color:black;
        border-top-color:transparent;
        border-width: 4px;
        border-radius:50%;
        -webkit-animation: spin .8s linear infinite;
        animation: spin .8s linear infinite;
    }
    </style>
`
    document.head.innerHTML = document.head.innerHTML + style_string;
    let loaderDiv = document.createElement("div");
    loaderDiv.setAttribute("id", "rev-loader");
    document.body.appendChild(loaderDiv);

    // Function to handle language select
    async function langSelect(data) {
        localStorage.setItem('rev_language', data);
        await getTranslations();
    }

    (function () {
        const treeWalker = document.createTreeWalker(document, NodeFilter.SHOW_TEXT, {
            acceptNode: (n) => {
                if (n.parentNode.nodeName !== 'SCRIPT' && n.parentNode.nodeName !== 'STYLE') {
                    return (n.nodeValue.trim()) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                } else {
                    NodeFilter.FILTER_SKIP;
                }
            }
        });
        let node;
        while (node = treeWalker.nextNode()) {
            if (treeWalker.currentNode.parentElement.className === "reverie_drop_down_vals") {
                continue;
            }
            node.parentElement.setAttribute("reverie-data-source", node.nodeValue.trim());
        }
    })();

    function createTree() {
        let texts = [];
        let currentNodeArr = [];
        const treeWalker = document.createTreeWalker(document, NodeFilter.SHOW_TEXT, {
            acceptNode: (n) => {
                if (n.parentElement.className !== "reverie_drop_down_vals" && n.parentNode.nodeName !== 'SCRIPT' && n.parentNode.nodeName !== 'STYLE') {
                    return (n.nodeValue.trim()) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                } else {
                    NodeFilter.FILTER_SKIP;
                }
            }
        });
        let node;
        while (node = treeWalker.nextNode()) {
            if (treeWalker.currentNode.parentElement.className === "reverie_drop_down_vals") {
                continue;
            }
            const val = node.parentNode.getAttribute("reverie-data-source");
            texts.push(val);
            currentNodeArr.push(treeWalker.currentNode);
        }
        texts = texts.filter(t => t);
        return { texts, currentNodeArr };
    }

    let revLang = localStorage.getItem("rev_language");
    if (revLang) {
        let lSelect = document.getElementById("mySelect");
        for (var i, j = 0; i = lSelect.options[j]; j++) {
            if (i.value === revLang) {
                lSelect.selectedIndex = j;
                break;
            }
        }
        getTranslations();
    }

    async function getTranslations() {
        document.getElementById("rev-loader").style.display = "block";
        let language = localStorage.getItem("rev_language");
        if (!language) {
            return alert("Please select a language");
        }
        language = language.charAt(0).toLowerCase() + language.slice(1);
        const result = createTree();
        let { texts, currentNodeArr } = result;
        let listOfinputs = document.getElementsByTagName("input");
        let nameArrs = [], addressArs = [], addressInputs = [], nameInputs = [];
        for (let i = 0; i < listOfinputs.length; i++) {
            let inputName = listOfinputs[i].name;
            if (addressDomains.filter(add => inputName.toLowerCase().includes(add)).length > 0) {
                addressArs.push(listOfinputs[i].getAttribute("rev_input_data_source"));
                addressInputs.push(listOfinputs[i]);
            } else if (nameDomains.filter(n => inputName.toLowerCase().includes(n)).length > 0) {
                nameArrs.push(listOfinputs[i].getAttribute("rev_input_data_source"));
                nameInputs.push(listOfinputs[i]);
            } else {
                texts.push(listOfinputs[i].getAttribute("rev_input_data_source"));
                currentNodeArr.push(listOfinputs[i]);
            }
        }
        texts = texts.filter(t => t);
        console.log(texts);
        if (language && language !== "english") {
            const API_URL = `http://172.20.1.9:8080/locman/v2/localization?domain=5&builtInPreProc=true&segmentation=false&source_lang=english&nmt=false&ignoreRosettaForMt=true&target_lang=${language}&dbLookup=true`;
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "REV-API-KEY": "99c07ef9fec7e48ed3de935c863370b2",
                    "REV-APP-ID": "com.canaraBank"
                },
                body: JSON.stringify({ data: texts })
            });
            const final = await response.json();
            console.log(final)
            if (final && final.responseList && final.responseList.length > 0) {
                for (let i = 0; i < currentNodeArr.length; i++) {
                    if (currentNodeArr[i] && currentNodeArr[i].nodeValue) {
                        let trimSource = currentNodeArr[i].nodeValue.trim();
                        let filteredNode = final.responseList.filter(n => currentNodeArr[i].parentNode && n.inString === currentNodeArr[i].parentNode.getAttribute("reverie-data-source"));
                        if (filteredNode && filteredNode.length > 0) {
                            currentNodeArr[i].nodeValue = currentNodeArr[i].nodeValue.replace(trimSource, filteredNode[0].outString);
                        }
                    } else {
                        let filteredNode = final.responseList.filter(n => currentNodeArr[i].getAttribute("rev_input_data_source") === n.inString);
                        if (filteredNode.length > 0) {
                            currentNodeArr[i].value = filteredNode[0].outString;
                        }
                    }
                }
            }
            if (nameArrs.length > 0) {
                console.log(nameArrs)
                const API_URL = `http://172.20.1.9:8080/locman/v2/transliteration?target_lang=${language}&source_lang=english&convert_number=true&nmt=false&ignore_rosetta=true&segmentation=false&domain=2&abbreviate=false`;
                const response = await fetch(API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "REV-API-KEY": "99c07ef9fec7e48ed3de935c863370b2",
                        "REV-APP-ID": "com.canaraBank"
                    },
                    body: JSON.stringify({ data: nameArrs })
                });
                const final = await response.json();
                console.log(final)
                if (final && final.responseList && final.responseList.length > 0) {
                    for (let i = 0; i < nameInputs.length; i++) {
                        let filteredNode = final.responseList.filter(n => nameInputs[i].getAttribute("rev_input_data_source") === n.inString);
                        if (filteredNode.length > 0) {
                            nameInputs[i].value = filteredNode[0].outString[0];
                        }
                    }
                }
            }
            if (addressArs.length > 0) {
                console.log(addressArs)
                const API_URL = `http://172.20.1.9:8080/locman/v2/transliteration?target_lang=${language}&nmt=false&source_lang=english&convert_number=true&ignore_rosetta=true&segmentation=false&domain=9`;
                const response = await fetch(API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "REV-API-KEY": "99c07ef9fec7e48ed3de935c863370b2",
                        "REV-APP-ID": "com.canaraBank"
                    },
                    body: JSON.stringify({ data: addressArs })
                });
                const final = await response.json();
                console.log(final)
                if (final && final.responseList && final.responseList.length > 0) {
                    for (let i = 0; i < addressInputs.length; i++) {
                        let filteredNode = final.responseList.filter(n => addressInputs[i].getAttribute("rev_input_data_source") === n.inString);
                        if (filteredNode.length > 0) {
                            addressInputs[i].value = filteredNode[0].outString[0];
                        }
                    }
                }
            }

        }
        else {
            for (let i = 0; i < currentNodeArr.length; i++) {
                if (currentNodeArr[i] && currentNodeArr[i].nodeValue) {
                    let trimSource = currentNodeArr[i].nodeValue.trim();
                    if (currentNodeArr[i].parentNode) {
                        currentNodeArr[i].nodeValue = currentNodeArr[i].nodeValue.replace(trimSource, currentNodeArr[i].parentNode.getAttribute("reverie-data-source"));
                    }
                } else {
                    currentNodeArr[i].value = currentNodeArr[i].getAttribute("rev_input_data_source");
                }
            }
            if (nameArrs.length > 0) {
                for (let i = 0; i < nameInputs.length; i++) {
                    nameInputs[i].value = nameInputs[i].getAttribute("rev_input_data_source");
                }
            }
            if (addressArs.length > 0) {
                for (let i = 0; i < addressInputs.length; i++) {
                    addressInputs[i].value = addressInputs[i].getAttribute("rev_input_data_source");
                }
            }
        }
        document.getElementById("rev-loader").style.display = "none";
    }


    function locamanApiCall(value, element) {
        let language = localStorage.getItem("rev_language");
        if (language && language !== "english") {
            language = language.charAt(0).toLowerCase() + language.slice(1);
            const API_URL = `http://172.20.1.9:8080/locman/v2/localization?domain=5&builtInPreProc=true&source_lang=english&nmt=false&ignoreRosettaForMt=true&target_lang=${language}&dbLookup=true`;
            fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "REV-API-KEY": "99c07ef9fec7e48ed3de935c863370b2",
                    "REV-APP-ID": "com.canaraBank"
                },
                body: JSON.stringify({ data: [value] })
            }).then(res => res.json())
                .then(response => {
                    if (response && response.responseList.length > 0) {
                        element.value = response.responseList[0].outString
                    }
                });
        }
    }

    function inputObserver(inputEl) {
        let inputBox = inputEl;

        observeElement(inputBox, "value", function (oldValue, newValue) {
            if (oldValue !== newValue) {
                let revLanguage = localStorage.getItem("rev_language");
                if ((!revLanguage || revLanguage === "English") && (!inputEl.getAttribute("rev_input_data_source"))) {
                    inputEl.setAttribute("rev_input_data_source", newValue);
                } else {
                    locamanApiCall(newValue, inputEl);
                }
            }
        });
    }

    function observeElement(element, property, callback, delay = 0) {
        let elementPrototype = Object.getPrototypeOf(element);
        if (elementPrototype.hasOwnProperty(property)) {
            let descriptor = Object.getOwnPropertyDescriptor(elementPrototype, property);
            Object.defineProperty(element, property, {
                configurable: true,
                get: function () {
                    return descriptor.get.apply(this, arguments);
                },
                set: function () {
                    let oldValue = this[property];
                    descriptor.set.apply(this, arguments);
                    let newValue = this[property];
                    if (typeof callback == "function") {
                        setTimeout(callback.bind(this, oldValue, newValue), delay);
                    }
                    return newValue;
                }
            });
        }
    }
}

window.onload = reverise;