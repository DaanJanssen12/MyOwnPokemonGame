$(document).ready(async function(){
  if($("#HAS_LOADED").val() <= 0){
    $("#HAS_LOADED").val(1);

    $("#footer").load("./common/footer.html");
    $("#header").load("./common/header.html");
    if(window.location.search !== '') {
      var urlParams = new URLSearchParams(window.location.search);
      if(window.location.search.includes('id'))
      {
        $("#POKEMON_ID").val(urlParams.get('id'));
        insertParam('id', urlParams.get('id'), false);
      }
      if(window.location.search.includes('page')){
        var page = 'pages/' + urlParams.get('page') + '.html';
        load_page(null, page);
      }
      else {
        $("#main").load("./pages/pokedex-full.html");
      }
    }
    else {
      $("#main").load("./pages/pokedex-full.html");
    }
  }
});

async function load_page(menuItem, pageToLoad, menuParent) {
  await $("#main").load(pageToLoad);
  
  let pageResult = "?page="+pageToLoad.substring(pageToLoad.indexOf('/')+1, pageToLoad.indexOf('.'));
  await window.history.pushState("object or string", "Title", pageResult);
  
  $("#navbar .active").removeClass("active");
  if(menuItem !== undefined){
    $(menuItem).addClass("active");
  }
  if(menuParent !== undefined){
    $(menuParent).addClass("active");
  }
  
  if($(".back-to-top").length > 0){
    $(".back-to-top").trigger('click');
  }
  
  return false;
}

function insertParam(key, value, reload) {
  key = encodeURIComponent(key);
  value = encodeURIComponent(value);

  // kvp looks like ['key1=value1', 'key2=value2', ...]
  var kvp = document.location.search.substr(1).split('&');
  let i=0;

  for(; i<kvp.length; i++){
    if (kvp[i].startsWith(key + '=')) {
      let pair = kvp[i].split('=');
      pair[1] = value;
      kvp[i] = pair.join('=');
      break;
    }
  }

  if(i >= kvp.length){
    kvp[kvp.length] = [key,value].join('=');
  }

  // can return this or...
  let params = kvp.join('&');

  if(reload){
    // reload page with new params
    document.location.search = params;
  }
}

/**
   * Easy on scroll event listener 
   */
 const onscroll = (el, listener) => {
  el.addEventListener('scroll', listener)
}