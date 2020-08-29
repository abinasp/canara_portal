async function getTranslations(){
    let language = localStorage.getItem("rev_langauge");
    if(!language){
        return alert("Please select a language")
    }
    language=language.charAt(0).toLowerCase()+language.slice(1);
    const API_URL=`http://beta.auth.revup.reverieinc.com/apiman-gateway/Tinkutest/localization/1.0?target_lang=${language}&source_lang=english&convert_number=true&ignoreRosettaForMt=true&segmentation=false&domain=1`;
    const treeWalker = document.createTreeWalker(document, NodeFilter.SHOW_TEXT, {
        acceptNode: (n)=>{
            if(n.parentNode.nodeName !== 'SCRIPT' && n.parentNode.nodeName !== 'STYLE'){
                return (n.nodeValue.trim()) ? NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;
            }else{
                NodeFilter.FILTER_SKIP;
            }
        }
    });
    let i=100;
    let node;
    let texts = [];
    let currentNodeArr = [];
    while(node = treeWalker.nextNode()){
        if(treeWalker.currentNode.parentElement.className === "reverie_drop_down_vals"){
            continue;
        }
        const val = node.nodeValue.trim();
        texts.push(val);
        currentNodeArr.push(treeWalker.currentNode);
        i++;
    }
    const data = texts;
    const response = await fetch(API_URL, {
        method: "POST",
        headers:{
            "Content-Type": "application/json",
            "REV-API-KEY": "8bd8428f2451b42adf9117b0aef80e7d",
            "REV-APP-ID": "com.tinkutest"
        },
        body: JSON.stringify({data})
    });
    const final = await response.json();
    if(final && final.responseList && final.responseList.length>0){
        for(let i=0;i<currentNodeArr.length;i++){
            let filteredNode = final.responseList.filter(n=>n.inString===currentNodeArr[i].nodeValue.trim());
            if(filteredNode && filteredNode.length>0){
                currentNodeArr[i].nodeValue = filteredNode[0].outString;
            }
        }
    }
}