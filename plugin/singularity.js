function SingularityCompiler() {
}

SingularityCompiler.prototype.processFilesForTarget = function(files) {
  files.forEach(handleBlzFile);
};

var handleBlzFile = function(file) {

  var fileContents = file.getContentsAsString();
  var arch = file.getArch();
  if (/^os/.test(arch))
    arch = 'server';
  if (/^web/.test(arch))
    arch = 'client';

  var templateName = fileContents.match(/name="(.*?)"/)[1];

  // XXX: only match <script> as direct children of <singularity>
  // use html_scanner as of 1.2
  var reg = new RegExp(/<script(\swhere="(.*)")?>([\s\S]+?)<\/script>/g);

  if (arch == 'client') {
    var content = fileContents.match(/<content>([\s\S]+)<\/content>/)[1];
    if (content) {
      templateName = fileContents.match(/name="(.*?)"/)[1];

      if (SpacebarsCompiler.isReservedName(templateName))
        throwParseError("Template can't be named \"" + templateName + "\"");

      var renderFuncCode = SpacebarsCompiler.compile(content, {
        isTemplate: true,
        sourceName: 'Template "' + templateName + '"'
      });

      var nameLiteral = JSON.stringify(templateName);
      var templateDotNameLiteral = JSON.stringify("Template." + templateName);

      var templateContent = "\nTemplate.__checkName(" + nameLiteral + ");\n" +
              "Template[" + nameLiteral + "] = new Template(" +
              templateDotNameLiteral + ", " + renderFuncCode + ");\n";

      file.addJavaScript({
        path: "/singularity/template.js",
        data: templateContent,
        sourcePath: "/singularity/template.js"
      });
    }

    var style = fileContents.match(/<style>([\s\S]+)<\/style>/)[1];
    if (style) {
      file.addStylesheet({
        path: "/singularity/style.css",
        data: style
      });
    }
  }

  var result;
  while((result = reg.exec(fileContents)) !== null) {
    var type = result[2] || "anywhere";
    var code = result[3];
    handleScript(code, templateName, type);
  }

  function wrapCode(code, templateName) {
    return '(function(){' + code + '}).bind(Template["' +
           templateName + '"])();';
  }

  function handleScript(code, templateName, type) {
    if (arch == 'client' && type == "client") {
      addJavascript(wrapCode(code, templateName), type);
    }
    else if (arch == 'server' && type == "server") {
      addJavascript(code, type);
    }
    else if (type === "anywhere") {
      addJavascript(code, 'anywhere');
    }
  }
  function addJavascript(code, where) {
    file.addJavaScript({
      path: "/singularity/script-" + where + ".js",
      data: code
    });
  }
};

Plugin.registerCompiler({
  extensions: ["blz"]
}, function () {
  return new SingularityCompiler();
});
