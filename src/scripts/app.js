var model = {
  containerTemplateBlockList: [],
  containerTemplateHeader: "",
  containerTemplateFooter: "",
  newTeplateBlock: "",
  newTemplateHeader: "",
  newTemplateFooter: ""
};

var controller = {

  init: function() {
    this.localStorageTemplates();
    this.localStorageList();
    // this.localStorage();
    this.getModel();
    this.sortadTmplList();
    this.sendRequestJSON("scripts/json/fonts.json", this.initSettingsFontsView);
    this.pageSaver();
  },
  getAllblocks: function(model) {
    var blocks = [];
    model.blocks.forEach(function(block) {
      blocks.push({
        id: block.id,
        imgSrc: block.imgSrc,
        subscription: block.subscription
      });
    });
    return blocks;
  },
  getAllFooters: function(model) {
    var footers = [];
    model.footers.forEach(function(footer) {
      footers.push({
        id: footer.id,
        imgSrc: footer.imgSrc,
        subscription: footer.subscription
      });
    });
    return footers;
  },
  getAllHeaders: function(model) {
    var headers = [];
    model.headers.forEach(function(header) {
      headers.push({
        id: header.id,
        imgSrc: header.imgSrc,
        subscription: header.subscription
      });
    });
    return headers;
  },
  localStorageTemplates: function() {
    this.$container = $("#build_wrap");
    var localTemplate = JSON.parse(localStorage.getItem("template"));
    this.$container.html(localTemplate);
    $("#undefined").remove();
  },
  localStorageList: function() {
    this.$container = $(".tmplsBlocksInMenu");
    var localList = JSON.parse(localStorage.getItem("listItem"));
    var localListHeader = JSON.parse(localStorage.getItem("listHeader"));
    var localListFooter = JSON.parse(localStorage.getItem("listFooter"));
    this.$container.html(localList);
    $(".tmplsHeaderInMenu").html(localListHeader);
    $(".tmplsFooterInMenu").html(localListFooter);
  },
  // localStorage: function() {
  //   var newContainerTemplateBlockList = [];
  //     $.each($(".tmplsBlocksInMenu").parent().find('li'), function(index, el) {
  //       var tmplId = $(el).find(".tmpl_id").html();
  //       newContainerTemplateBlockList.push("#" + tmplId);
  //     });
  //   model.containerTemplateBlockList = newContainerTemplateBlockList;
  //   localStorage.setItem('blockListModel',JSON.stringify(model.containerTemplateBlockList));
  // },
  getModel: function() {
    $.ajax({
      type: "GET",
      url: "scripts/model.json",
      async: true,
      dataType: "json",
      success: function(data) {
        
        blocksView.init();
        blocksView.render(data);

        footersView.init();
        footersView.render(data);

        headersView.init();
        headersView.render(data);

        tmplsOnPageBlockView.init();
        tmplsOnPageHeaderView.init();
        tmplsOnPageFooterView.init();
        tmplsBlocksInMenuView.init();
        tmplsHeaderInMenuView.init();
        tmplsFooterInMenuView.init();
      },
      error: function() {
        console.log("error");
      }
    });
  },
  getTemplate: function(id) {
    $.ajax({
      type: "GET",
      url: "scripts/template/tmpl.html",
      async: true,
      success: function(data) {
        var $templates = $(data);
        if (id) {
          var tmplsType = id.substr(1,1);
          switch (tmplsType) {
            case "b":
              model.containerTemplateBlockList.push(id);
              controller.setNewTemplateBlock($templates,id);
              tmplsBlocksInMenuView.render();
              tmplsOnPageBlockView.render();
              break;
            case "h":
              model.containerTemplateHeader = id;
              controller.setNewTemplateHeader($templates,id);
              tmplsHeaderInMenuView.render();
              tmplsOnPageHeaderView.render();
              break;
            case "f": 
              model.containerTemplateFooter = id;
              controller.setNewTemplateFooter($templates,id);
              tmplsFooterInMenuView.render();
              tmplsOnPageFooterView.render();
              break;
          }
        }
      },
      error: function() {
        console.log("error");
      }
    });
  },
  pageSaver: function() {
    $(window).bind('beforeunload', function(){
      var currentStatus = $("#build_wrap").html();
      var localSet = localStorage.setItem('template', JSON.stringify(currentStatus));
      var localGet = JSON.parse(localStorage.getItem("template"));
      var realStatus = $("#build_wrap").html(localGet);
      controller.localStorageList();
    });
  },
   sortadTmplList: function() {
    $(".tmplsBlocksInMenu").sortable({
      start: function(event, ui) {
          ui.item.startPos = ui.item.index();
      },
      stop: function(event, ui) {
        var start = ui.item.startPos;
        var end = ui.item.index();
        var $divs = $("#build_wrap > div");
        if ( start !== end) {
          var block = $divs.eq(start).clone();
          $divs.eq(start).remove();
          if (end) {
            $("#build_wrap > div").eq(end - 1).after(block);
          } else {
           $("#build_wrap > div").eq(0).before(block);
          }
        }


        var newContainerTemplateBlockList = [];
        $.each($(".tmplsBlocksInMenu")
          .find('li'), function(index, el) {
          var tmplId = $(el).find(".tmpl_id").html();
          newContainerTemplateBlockList.push("#" + tmplId);
        });
        model.containerTemplateBlockList = newContainerTemplateBlockList;
        // model.containerTemplateHeader = JSON.parse(localStorage.getItem("blockListModelHeader"));
        // model.containerTemplateFooter = JSON.parse(localStorage.getItem("blockListModelFooter"));
        // localStorage.setItem('blockListModel', JSON.stringify( model.containerTemplateBlockList ));
        localStorage.setItem('listItem', JSON.stringify($(".tmplsBlocksInMenu").html()));
      },
    });
    $(".tmplsBlocksInMenu").disableSelection();
  },
  initSettingsFontsView: function (data) {
    settingsFontsView.init();
    settingsFontsView.render(data);
  },
  sendRequestJSON: function(url, fun){
    $.ajax({
      type: "GET",
      url: url,
      async: true,
      dataType: "json",
      success: function(data) {
        fun(data);
      },
      error: function() {
        console.log("error");
      }
    });
  },
  sendRequest: function(url, fun){
    $.ajax({
      type: "GET",
      url: url,
      async: true,
      success: function(data) {
        fun(data);
      },
      error: function() {
        console.log("error");
      }
    });
  },
  getBlocksFromPage: function () {
    var $content = $("#build_wrap").clone();
    if ($content.find("header").length > 0) {
      $content.find("header").remove();
    }
    if ($content.find("footer").length > 0) {
      $content.find("footer").remove();
    }
    return $content.html();
  },
  getHeaderFromPage: function () {
    var $content = $("#build_wrap");
    var header = "";
    if ($content.find("header").length > 0) {
      header = "<header>" + $content.find("header").html() + "</header>";
    }
    return header;
  },
  getFooterFromPage: function () {
    var $content = $("#build_wrap");
    var footer = "";
    if ($content.find("footer").length > 0) {
      footer = "<footer>" + $content.find("footer").html() + "</footer>";
    }
    return footer;
  },
  setNewTemplateBlock: function (tmpls, id) {
    model.newTeplateBlock = tmpls.find(id).html();
  },
  setNewTemplateHeader: function (tmpls, id) {
    model.newTemplateHeader = tmpls.find(id).html();
  },
  setNewTemplateFooter: function (tmpls, id) {
    model.newTemplateFooter = tmpls.find(id).html();
  },
  deleteBlockOnPage: function (num) {
    $("#build_wrap > div").eq(num).remove();
  },
  deleteHeaderOrFooterOnPage: function (name) {
    $("#build_wrap").find(name).remove();
  }
};

var blocksView = {
  init: function() {
    this.$container = $(".block_template");
    this.handleClicks();
  },
  render: function(data) {
    var list = '';
    controller.getAllblocks(data).forEach(function(block) {
      list += '<li><img src="' + block.imgSrc + '" alt><span class="subscription">' +
        block.subscription + '</span><span class="hide">' + block.id + '</span></li>';
    });
    this.$container.html(list);
  },
  handleClicks: function() {
    this.$container.on("click", "li", function(e) {
      var templateId = "#" + $(e.target).find(".hide").html();
      controller.getTemplate(templateId);
    });
  }
};

var footersView = {
  init: function() {
    this.$container = $(".footer_template");
    this.handleClicks();
  },
  render: function(data) {
    var list = '';
    controller.getAllFooters(data).forEach(function(footer) {
      list += '<li><img src="' + footer.imgSrc + '" alt><span class="subscription">' +
        footer.subscription + '</span><span class="hide">' + footer.id + '</span></li>';
    });
    this.$container.html(list);
  },
  handleClicks: function() {
    this.$container.on("click", "li", function(e) {
      var templateId = "#" + $(e.target).find(".hide").html();
      controller.getTemplate(templateId);
    });
  }
};

var headersView = {
  init: function() {
    this.$container = $(".header_template");
    this.handleClicks();
  },
  render: function(data) {
    var list = '';
    controller.getAllHeaders(data).forEach(function(header) {
      list += '<li><img src="' + header.imgSrc + '" alt><span class="subscription">' +
        header.subscription + '</span><span class="hide">' + header.id + '</span></li>';
    });
    this.$container.html(list);
  },
  handleClicks: function() {
    this.$container.on("click", "li", function(e) {
      var templateId = "#" + $(e.target).find(".hide").html();
      controller.getTemplate(templateId);
    });
  }
};

var tmplsOnPageBlockView = {
  init: function() {
    this.$container = $("#build_wrap");
  },
  render: function() {
    var list = "";
    list += controller.getHeaderFromPage();
    list += controller.getBlocksFromPage() + model.newTeplateBlock;
    list += controller.getFooterFromPage();
    this.$container.html(list);
  },
};

var tmplsOnPageHeaderView = {
  init: function() {
    this.$container = $("#build_wrap");
  },
  render: function() {
    var list = "";
    list += model.newTemplateHeader;
    list += controller.getBlocksFromPage();
    list += controller.getFooterFromPage();
    this.$container.html(list);
  },
};

var tmplsOnPageFooterView = {
  init: function() {
    this.$container = $("#build_wrap");
  },
  render: function() {
    var list = "";
    list += controller.getHeaderFromPage();
    list += controller.getBlocksFromPage();
    list += model.newTemplateFooter;
    this.$container.html(list);
  }
};

var tmplsBlocksInMenuView = {
  init: function() {
    this.$container = $(".tmplsBlocksInMenu");
    this.handleClicks();
  },
  render: function() {
    var list = "";
    model.containerTemplateBlockList.forEach(function(tmplId) {
      list += '<li class="ui-state-default"><span class="tmpl_id">'
           + tmplId.substr(1)
           + '</span> <span class="tmpl_delete">x</span></li>';
    });
    this.$container.html(list);

    var localSet = localStorage.setItem('listItem', JSON.stringify(list));
    var localGet = JSON.parse(localStorage.getItem("listItem"));

    list+=localGet;
  },
  handleClicks: function() {
    this.$container.on("click", ".tmpl_delete", function(e) {
      var currentSpan = $(e.target);
      var currentLi = currentSpan.parent();
      var currentIndex = currentLi.index();
      model.containerTemplateBlockList.splice(currentIndex, 1);
      tmplsBlocksInMenuView.render();
      controller.deleteBlockOnPage(currentIndex);
      localStorage.setItem('listItem', JSON.stringify($(".tmplsBlocksInMenu").html()));
    });
  }
};

var tmplsHeaderInMenuView = {
  init: function() {
    this.$container = $(".tmplsHeaderInMenu");
    this.handleClicks();
  },
  render: function() {
    var list = "";
    if (model.containerTemplateHeader){
      list += '<li><span class="tmpl_id">'
           + model.containerTemplateHeader.substr(1)
           + '</span> <span class="tmpl_delete">x</span></li>';
    }

    this.$container.html(list);

    var localSet = localStorage.setItem('listHeader', JSON.stringify(list));
    var localGet = JSON.parse(localStorage.getItem("listHeader"));

    list+=localGet;
  },
  handleClicks: function() {
    this.$container.on("click", ".tmpl_delete", function() {
      model.containerTemplateHeader = "";
      tmplsHeaderInMenuView.render();
      controller.deleteHeaderOrFooterOnPage("header");
    });
  }
};

var tmplsFooterInMenuView = {
  init: function() {
    this.$container = $(".tmplsFooterInMenu");
    this.handleClicks();
  },
  render: function() {
    var list = "";
    if (model.containerTemplateFooter){
      list += '<li><span class="tmpl_id">'
           + model.containerTemplateFooter.substr(1)
           + '</span> <span class="tmpl_delete">x</span></li>';
    }
    this.$container.html(list);

    var localSet = localStorage.setItem('listFooter', JSON.stringify(list));
    var localGet = JSON.parse(localStorage.getItem("listFooter"));

    list+=localGet;
  },
  handleClicks: function() {
    this.$container.on("click", ".tmpl_delete", function() {
      model.containerTemplateFooter = "";
      tmplsFooterInMenuView.render();
      controller.deleteHeaderOrFooterOnPage("footer");
    });
  }
};

var settingsFontsView = {
  init: function () {
    this.$container = $(".settings_text-font");
    this.handleClicks();
  },
  render: function (data) {
    var list = "";
    data.fonts.forEach(function (font) {
      list += '<li><img src="' + font.img + '" alt data-link="' + font.link + '" data-name="' + font.name + '"></li>';
    });
    this.$container.find("ul").html(list);
  },
  handleClicks: function(){
    this.$container.on("click", "span", function(){
      settingsFontsView.$container.find("ul"). slideToggle();
    });
    this.$container.find("ul").on("click", "img", function(e){
      var newFontLink = ($(e.target).attr("data-link"));
      var newFontName = ($(e.target).attr("data-name"));
      var newFontElHref = $(".newFont").attr("href");
      if (!newFontElHref) {
        $("head").append('<link class="newFont" rel="stylesheet" href="' + newFontLink + '">');
      } else {
        $(".newFont").attr("href", newFontLink);
      }
      $("body").css('font-family', newFontName);
    });
  }
};


controller.init();