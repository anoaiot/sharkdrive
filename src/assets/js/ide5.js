"use strict"; 

var filename = 'blank.txt';
var fontsize = '14';
var state = true;
var editor = ace.edit('editor');
var fs = ign.filesystem();
var sys = ign.sys();
var pathProject;
var index_file;

$(function() {
  //shortcut
  $("textarea").bind('keydown', 'Ctrl+s',function(){
    window["saveProject"]();
  });
  // dropdown menu handler
  $('.bar').on('click', function() {
    $('.menu ul').hide();
    $(this).next().css('display', 'block');
    $(this).next().css('z-index', '1000');
    $(this).next().on('mouseleave', '', function() {
      $(this).hide();
    });
  });
  // action handler
  $('.action').on('click', function() {
    var action = $(this).data('action');
    $(this).parent().parent().hide();
    window[action]();
  });

  // popup handler
  $('[data-popup-target]').on('click', function () {
    $('html').addClass('overlay');
    var popup = $(this).data('popup-target');
    $(popup).addClass('visible');
  });
  $('.popup-exit').click(function () {
    closepopup();
  });
  // get font size
  fontsize = parseInt($('.editor').css('font-size'));
  // line number
  editor.setTheme('ace/theme/twilight');
  editor.setShowPrintMargin(false);
  $('#editor').css('font-size', '14px');
  // trigger file state
  $('.editor').keyup(function() {
    state = false;
  });
  // status bar
  var statusbar = ace.require('ace/ext/statusbar').StatusBar;
  var status = new statusbar(editor, document.getElementById('statusbar'));
});

var closepopup = function() {
  $('.popup.visible').addClass('transitioning').removeClass('visible');
  $('html').removeClass('overlay');
  setTimeout(function() {
    $('.popup').removeClass('transitioning');
  }, 200);
}

var blank = function() {
  var save = true;
  if (!state) {
    save = confirm('The file is not saved. Are you sure want to create a new file?');
  }
  if (save) {
    editor.setValue('', 1);
    state = true;
  }
}

var open = function() {
  var save = true;
  if (!state) {
    save = confirm('The file is not saved. Are you sure want to open a new file?');
  }
  if (save) {
    $('.file').click();
    $('.file').change(function() {
      var filetemp = $('.file')[0].files[0];
      filename = filetemp.name;
      var filereader = new FileReader();
      filereader.onload = function(evt) {
        var filebuffer = evt.target.result;
        // write content to editor
        editor.setValue(filebuffer, 1);
        $('.file').replaceWith($('.file').val('').clone(true));
        // set file mode
        var modelist = ace.require('ace/ext/modelist');
        var mode = modelist.getModeForPath(filename).mode;
        editor.session.setMode(mode);
      };
      filereader.readAsText(filetemp, 'UTF-8');
    });
    state = true;
  }
}

var download = function() {
  filename = prompt('Download as', filename);
  if (filename) {
    var text = $('.ace_text').text();
    var textfile = new Blob([text], {type:'text/plain'});
    var downloadlink = document.createElement('a');
    downloadlink.download = filename;
    downloadlink.innerHTML = 'Download File';
    downloadlink.href = window.webkitURL.createObjectURL(textfile);
    downloadlink.click();
    state = true;
  }
};

var openProject = function(){
  pathProject = fs.openDirDialog();
  index_file = pathProject+"/index.html"
  if(fs.info(index_file).exists){
    var fileBuffer = fs.fileRead(index_file);
    editor.setValue(fileBuffer, 1);
    var modelist = ace.require('ace/ext/modelist');
    var mode = modelist.getModeForPath("index.html").mode;
    editor.session.setMode(mode);
  }
  else{
    alert("ERR : index.html not found!");
  }
}

var undo = function() {
  editor.undo();
}

var redo = function() {
  editor.redo();
}

var all = function() {
  editor.selectAll();
}

var plus = function() {
  fontsize = fontsize + 2;
  $('.editor').css('font-size', fontsize + 'px');
}

var minus = function() {
  fontsize = fontsize - 2;
  $('.editor').css('font-size', fontsize + 'px');
}

var normal = function() {
  $('.editor').css('font-size', '14px');
}

var about = function() {
  alert('IDE5' + "\n" + 'Simple, pure HTML5 IDE' + "\n" + 'Author: fitra@gpl' + "\n" + 'License: GPL Version 3');
}

var run = function(){
  sys.exec("ignsdk -p "+pathProject);
}

var saveProject = function(){
  var text = editor.getSession().getValue();
  fs.fileWrite(index_file,text);
}