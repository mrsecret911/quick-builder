var model = {
  containerTemplateBlockList: [],
  containerTemplateHeader: "",
  containerTemplateFooter: "",
  newTeplateBlock: "",
  newTemplateHeader: "",
  newTemplateFooter: "",
  buildWrapContent: "",
  newFontName: "",
  newLineHeight: "",
  newFontLinkTag: "",
  styleTemplate: {},
  styleInRow: ""
};

var controller = {

  init: function() {
    this.localStorageTemplates();
    this.localStorageList();
    this.localStorage();
    this.getModel();
    this.sortadTmplList();
    this.sendRequestJSON("scripts/json/fonts.json", this.initSettingsFontsView);
    this.pageSaver();
    settingsLineHeightView.init();
    settingsTabletView.init();
    settingsMobileView.init();
  },
  getAllblocks: function(model) {
    var blocks = [];
    model.blocks.forEach(function(block) {
      blocks.push({
        id: block.id,
        imgSrc: block.imgSrc,
        subscription: block.subscription,
        events: block.events
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
        subscription: footer.subscription,
        events: footer.events
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
        subscription: header.subscription,
        events: header.events
      });
    });
    return headers;
  },
  localStorageTemplates: function() {
    var localLinkGet = JSON.parse(localStorage.getItem("link"));
    $("head").append(localLinkGet);
    model.newFontLinkTag = localLinkGet;
    model.newFontName = JSON.parse(localStorage.getItem("newFontName"));

    model.newLineHeight = JSON.parse(localStorage.getItem("newLineHeight"));

    this.$container = $("#build_wrap");
    var localTemplate = JSON.parse(localStorage.getItem("template"));
    this.$container.html(localTemplate);
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
  localStorage: function() {
    var newContainerTemplateBlockList = [];
    $.each($(".tmplsBlocksInMenu").find('li'), function(index, el) {
      var tmplId = $(el).find(".tmpl_id").html();
      newContainerTemplateBlockList.push("#" + tmplId);
    });
    model.containerTemplateBlockList = newContainerTemplateBlockList;
    localStorage.setItem('blockListModel', JSON.stringify(model.containerTemplateBlockList));
  },
  getModel: function() {
    $.ajax({
      type: "GET",
      url: "scripts/model.json",
      async: true,
      dataType: "json",
      success: function(data) {

        blocksView.init();
        //console.log(data);
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
  getTemplate: function(id, type, templatEvents) {
    
    $.ajax({
      type: "GET",
      url: "scripts/template/tmpl.html",
      async: true,
      success: function(data) {
        var $templates = $(data);
        if (id) {
          switch (type) {
            case "block":
              model.containerTemplateBlockList.push(id);
              controller.setNewTemplateBlock($templates, id);
              tmplsBlocksInMenuView.render();
              tmplsOnPageBlockView.render(templatEvents);
              break;
            case "header":
              model.containerTemplateHeader = id;
              controller.setNewTemplateHeader($templates, id);
              tmplsHeaderInMenuView.render();
              tmplsOnPageHeaderView.render();
              break;
            case "footer":
              model.containerTemplateFooter = id;
              controller.setNewTemplateFooter($templates, id);
              tmplsFooterInMenuView.render();
              tmplsOnPageFooterView.render();
              break;
          }
          controller.makeStyleChange(model.newFontName, model.newLineHeight);
        }
      },
      error: function() {
        console.log("error");
      }
    });
  },
  pageSaver: function() {
    $(window).bind('beforeunload', function() {
      var currentStatus = $("#build_wrap").html();
      if ($("#build_wrap").find(".iframe_device").length > 0) {
        currentStatus = model.buildWrapContent;
      }
      localStorage.setItem('template', JSON.stringify(currentStatus));
      var localGet = JSON.parse(localStorage.getItem("template"));
      localStorage.setItem('link', JSON.stringify(model.newFontLinkTag));
      localStorage.setItem('newFontName', JSON.stringify(model.newFontName));
      localStorage.setItem('newLineHeight', JSON.stringify(model.newLineHeight));
      $("#build_wrap").html(localGet);

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
        if (start !== end) {
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
        localStorage.setItem('listItem', JSON.stringify($(".tmplsBlocksInMenu").html()));
      },
    });
    $(".tmplsBlocksInMenu").disableSelection();
  },
  initSettingsFontsView: function(data) {
    settingsFontsView.init();
    settingsFontsView.render(data);
  },
  sendRequestJSON: function(url, fun) {
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
  sendRequest: function(url, fun, id) {
    $.ajax({
      type: "GET",
      url: url,
      async: true,
      success: function(data) {
        fun(data, id);
      },
      error: function() {
        console.log("error");
      }
    });
  },
  getBlocksFromPage: function() {
    var $content = $("#build_wrap").clone();
    if ($content.find("header").length > 0) {
      $content.find("header").remove();
    }
    if ($content.find("footer").length > 0) {
      $content.find("footer").remove();
    }
    return $content.html();
  },
  getHeaderFromPage: function() {
    var $content = $("#build_wrap");
    var header = "";
    if ($content.find("header").length > 0) {
      header = "<header>" + $content.find("header").html() + "</header>";
    }
    return header;
  },
  getFooterFromPage: function() {
    var $content = $("#build_wrap");
    var footer = "";
    if ($content.find("footer").length > 0) {
      footer = "<footer>" + $content.find("footer").html() + "</footer>";
    }
    return footer;
  },
  setNewTemplateBlock: function(tmpls, id) {
    model.newTeplateBlock = tmpls.filter(id).html();
  },
  setNewTemplateHeader: function(tmpls, id) {
    model.newTemplateHeader = tmpls.filter(id).html();
  },
  setNewTemplateFooter: function(tmpls, id) {
    model.newTemplateFooter = tmpls.filter(id).html();
  },
  deleteBlockOnPage: function(num) {
    $("#build_wrap > div").eq(num).remove();
  },
  deleteHeaderOrFooterOnPage: function(name) {
    $("#build_wrap").find(name).remove();
  },
  makeStyleChange: function(font, lineHeight) {
    font = font || "";
    lineHeight = lineHeight || "";
    if (font.length) {
      $("#build_wrap > div, header, footer").css('font-family', font);
    } else if (lineHeight.length) {
      $("#build_wrap p").css("line-height", lineHeight + "px");
    }
  },
  turnOnModeView: function() {
    var $clickOffSetEl = $(".settings_text-font,.settings_text-line-height");
    $clickOffSetEl.css("pointer-events", "none");
    var $clickOffEl = $(".main_nav a:not([href$='#build_settings'])");
    $.each($clickOffEl, function(index, el) {
      $(el).one("click.delete", function() {
        $("#cmn-toggle1").prop('checked', false);
        $("#build_wrap").html(model.buildWrapContent);
        $("body").removeClass("backgroundStyle");
        $clickOffEl.off("click.delete");
        $clickOffSetEl.css("pointer-events", "all");
      });
      var eventList = $._data($(el)[0], "events");
      eventList.click.unshift(eventList.click.pop());
    });
  },
  turnOffModeView: function() {
    var $clickOffSetEl = $(".settings_text-font,.settings_text-line-height");
    $clickOffSetEl.css("pointer-events", "all");
    var $clickOffEl = $(".main_nav a:not([href$='#build_settings'])");
    $.each($clickOffEl, function(index, el) {
      $(el).off("click.delete");
    });
  },
  addContentsToIframe: function() {
    var headContent = $("head").html();
    var $frameFromPage = $("iframe");
    setTimeout(function() {
      $frameFromPage.contents().find('head').html(headContent);
      $frameFromPage.contents().find('body').html(model.buildWrapContent);
      $frameFromPage.contents().find('body').css("pointer-events", "none");
      var contenteditableList = $frameFromPage.contents().find("[contenteditable=true]");
      $.each(contenteditableList, function(index, el) {
        $(el).removeAttr("contenteditable");
      });
      $("body").addClass("backgroundStyle");
    }, 1);
  },
  setStyle: function (data,id) {
    var styleForTmpl = $(data).filter(id).html();
    var $styleForTmpl = $(styleForTmpl).filter("style");
    model.styleTemplate[id] = $styleForTmpl.html();
    controller.setStyleInRow();
  },
  setStyleInRow: function () {
    var styleArr = [];
    for (var tmpl in model.styleTemplate) {
      styleArr.push(model.styleTemplate[tmpl]);
    }
    model.styleInRow = styleArr.join(" ");
    console.log(model.styleInRow);
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
      list += '<li data-type="block" data-events="' + block.events + '" data-id="#' + block.id + '"><img src="' + block.imgSrc + '" alt><span class="subscription">' +
        block.subscription + '</span></li>';
    }); 
    this.$container.html(list);
  },
  handleClicks: function() {
    this.$container.on("click", "li", function(e) {
      var element = $(e.target);
      controller.getTemplate(element.attr("data-id"), element.attr("data-type"), element.attr("data-events"));
      // controller.sendRequest("scripts/template/style.html", controller.setStyle, templateId);
    });
  },
};

var footersView = {
  init: function() {
    this.$container = $(".footer_template");
    this.handleClicks();
  },
  render: function(data) {
    var list = '';
    controller.getAllFooters(data).forEach(function(footer) {
      list += '<li data-type="footer" data-id="#' + footer.id + '"><img src="' + footer.imgSrc + '" alt><span class="subscription">' +
        footer.subscription + '</span></li>';
    });
    this.$container.html(list);
  },
  handleClicks: function() {
    this.$container.on("click", "li", function(e) {
      var element = $(e.target);
      controller.getTemplate(element.attr("data-id"), element.attr("data-type"));
      // controller.sendRequest("scripts/template/style.html", controller.setStyle, templateId);
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
      list += '<li data-type="header" data-id="#' + header.id + '"><img src="' + header.imgSrc + '" alt><span class="subscription">' +
        header.subscription + '</span></li>';
    });
    this.$container.html(list);
  },
  handleClicks: function() {
    this.$container.on("click", "li", function(e) {
      var element = $(e.target);
      controller.getTemplate(element.attr("data-id"), element.attr("data-type"));
      // controller.sendRequest("scripts/template/style.html", controller.setStyle, templateId);
    });
  }
};

var tmplsOnPageBlockView = {
  init: function() {
    this.$container = $("#build_wrap");
  },
  render: function(events) {
    var list = "";
    list += controller.getHeaderFromPage();
    list += controller.getBlocksFromPage() + model.newTeplateBlock;
    list += controller.getFooterFromPage();
    var element = $.parseHTML(list);
    events.split(",").forEach(function (fn){
      if (fn === "dragAndDrop") {
        $(element).dragAndDrop({draggable:".draggable"});
      }
    });
    this.$container.append(element);
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
      list += '<li class="ui-state-default"><span class="tmpl_id">' + tmplId.substr(1) + '</span> <span class="tmpl_delete">x</span></li>';
    });
    this.$container.html(list);

    localStorage.setItem('listItem', JSON.stringify(list));
    var localGet = JSON.parse(localStorage.getItem("listItem"));

    list += localGet;
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
    if (model.containerTemplateHeader) {
      list += '<li><span class="tmpl_id">' + model.containerTemplateHeader.substr(1) + '</span> <span class="tmpl_delete">x</span></li>';
    }

    this.$container.html(list);

    localStorage.setItem('listHeader', JSON.stringify(list));
    var localGet = JSON.parse(localStorage.getItem("listHeader"));

    list += localGet;
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
    if (model.containerTemplateFooter) {
      list += '<li><span class="tmpl_id">' + model.containerTemplateFooter.substr(1) + '</span> <span class="tmpl_delete">x</span></li>';
    }
    this.$container.html(list);

    localStorage.setItem('listFooter', JSON.stringify(list));
    var localGet = JSON.parse(localStorage.getItem("listFooter"));

    list += localGet;
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
  init: function() {
    this.$container = $(".settings_text-font");
    this.handleClicks();
  },
  render: function(data) {
    var list = "";
    data.fonts.forEach(function(font) {
      list += '<li><img src="' + font.img + '" alt data-link="' + font.link + '" data-name="' + font.name + '"></li>';
    });
    this.$container.find("ul").html(list);
  },
  handleClicks: function() {
    this.$container.on("click", "span", function() {
      settingsFontsView.$container.find("ul").slideToggle();
    });
    this.$container.find("ul").on("click", "img", function(e) {
      var newFontLink = ($(e.target).attr("data-link"));
      model.newFontName = ($(e.target).attr("data-name"));
      var newFontElHref = $(".newFont").attr("href");
      model.newFontLinkTag = '<link class="newFont" rel="stylesheet" href="' + newFontLink + '">';
      if (!newFontElHref) {
        $("head").append(model.newFontLinkTag);
      } else {
        $(".newFont").attr("href", newFontLink);
      }
      controller.makeStyleChange(model.newFontName);
      localStorage.setItem('link', JSON.stringify(model.newFontLinkTag));
      localStorage.setItem('newFontName', JSON.stringify(model.newFontName));
    });
  }
};

var settingsLineHeightView = {
  init: function() {
    this.$container = $(".settings_text-line-height");
    this.setDefaultValueInput();
    this.handleClicks();
  },
  handleClicks: function() {
    this.$container.on("change", "input", function() {
      model.newLineHeight = settingsLineHeightView.$container.find("input").val();
      controller.makeStyleChange(undefined, model.newLineHeight);
    });
  },
  setDefaultValueInput: function() {
    if (oldLineHeught) {
      var oldLineHeught = $("#build_wrap p").css("line-height");
      oldLineHeught = oldLineHeught.substr(0, oldLineHeught.length - 2);
      this.$container.find("input").val(oldLineHeught);
    }
  }
};

var settingsTabletView = {
  init: function() {
    this.$container = $(".settings_tablet-view");
    this.handleClicks();
  },
  handleClicks: function() {
    this.$container.on("change", "input", function(e) {
      var $currentEl = $(e.target);
      if ($currentEl.prop('checked')) {
        if (!$("#cmn-toggle2").prop('checked')) {
          model.buildWrapContent = $("#build_wrap").html();
        }
        $("#build_wrap").empty();
        $("#cmn-toggle2").prop('checked', false);
        var pageHeight = $(window).innerHeight() - 80;
        var $frame = $('<div class="iframe-tablet"><iframe class="iframe_device" src="" style="width: inherit;height:' + pageHeight + 'px">your browser needs to be updated.</iframe></div>');
        $("#build_wrap").html($frame);
        controller.addContentsToIframe();
        controller.turnOnModeView();
      } else {
        controller.turnOffModeView();
        $('#build_wrap').html(model.buildWrapContent);
        $("body").removeClass("backgroundStyle");
      }
    });
  },
};

var settingsMobileView = {
  init: function() {
    this.$container = $(".settings_mobile-view");
    this.handleClicks();
  },
  handleClicks: function() {
    this.$container.on("change", "input", function(e) {
      var $currentEl = $(e.target);
      if ($currentEl.prop('checked')) {
        if (!$("#cmn-toggle1").prop('checked')) {
          model.buildWrapContent = $("#build_wrap").html();
        }
        $("#build_wrap").empty();
        $("#cmn-toggle1").prop('checked', false);
        var pageHeight = $(window).innerHeight() - 80;
        var $frame = $('<div class="iframe-mobile"><iframe class="iframe_device" src="" style="width: inherit;height:' + pageHeight + 'px">your browser needs to be updated.</iframe></div>');
        $("#build_wrap").html($frame);
        controller.addContentsToIframe();
        controller.turnOnModeView();
      } else {
        controller.turnOffModeView();
        $('#build_wrap').html(model.buildWrapContent);
        $("body").removeClass("backgroundStyle");
      }
    });
  },
};

controller.init();