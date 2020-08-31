(function(){
    const treeWalker = document.createTreeWalker(document, NodeFilter.SHOW_TEXT, {
        acceptNode: (n)=>{
            if(n.parentNode.nodeName !== 'SCRIPT' && n.parentNode.nodeName !== 'STYLE'){
                return (n.nodeValue.trim()) ? NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;
            }else{
                NodeFilter.FILTER_SKIP;
            }
        }
    });
    let node;
    while(node = treeWalker.nextNode()){
        if(treeWalker.currentNode.parentElement.className === "reverie_drop_down_vals"){
            continue;
        }
        node.parentElement.setAttribute("reverie-data-source", node.nodeValue.trim());
    }
})();

function createTree(){
    let texts = [];
    let currentNodeArr = [];
    const treeWalker = document.createTreeWalker(document, NodeFilter.SHOW_TEXT, {
        acceptNode: (n)=>{
            if(n.parentNode.nodeName !== 'SCRIPT' && n.parentNode.nodeName !== 'STYLE'){
                return (n.nodeValue.trim()) ? NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;
            }else{
                NodeFilter.FILTER_SKIP;
            }
        }
    });
    let node;
    while(node = treeWalker.nextNode()){
        if(treeWalker.currentNode.parentElement.className === "reverie_drop_down_vals"){
            continue;
        }
        const val = node.parentNode.getAttribute("reverie-data-source");
        texts.push(val);
        currentNodeArr.push(treeWalker.currentNode);
    }
    texts = texts.filter(t=>t);
    return {texts, currentNodeArr};
}

let revLang = localStorage.getItem("rev_langauge");
if(revLang){
    getTranslations();
}

async function getTranslations(){
    document.getElementById("rev-loader").style.display = "block";
    let language = localStorage.getItem("rev_langauge");
    if(!language){
        return alert("Please select a language")
    }
    language=language.charAt(0).toLowerCase()+language.slice(1);
    const API_URL=`http://172.20.1.9:8080/locman/v2/localization?domain=1&builtInPreProc=true&source_lang=english&nmt=true&ignoreRosettaForMt=true&target_lang=${language}&dbLookup=true`;
    
    const result = createTree();
    const { texts, currentNodeArr } = result;
    const response = await fetch(API_URL, {
        method: "POST",
        headers:{
            "Content-Type": "application/json",
            "REV-API-KEY": "canara_bank_api",
            "REV-APP-ID": "com.canara"
        },
        body: JSON.stringify({data: texts})
    });
    const final = await response.json();
    if(final && final.responseList && final.responseList.length>0){
        for(let i=0;i<currentNodeArr.length;i++){
            let trimSource = currentNodeArr[i].nodeValue.trim();
            let filteredNode = final.responseList.filter(n=>n.inString===currentNodeArr[i].parentNode.getAttribute("reverie-data-source"));
            if(filteredNode && filteredNode.length>0){
                currentNodeArr[i].nodeValue = currentNodeArr[i].nodeValue.replace(trimSource, filteredNode[0].outString);
            }
        }
    }
    document.getElementById("rev-loader").style.display = "none";
}