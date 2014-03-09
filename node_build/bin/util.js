#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


var argv = process.argv;

var actionArg = argv[2];

var colorMap = {
      'normal'      : ['\x1B[0m',  '\x1B[22m'],
      'bold'      : ['\x1B[1m',  '\x1B[22m'],
      'italic'    : ['\x1B[3m',  '\x1B[23m'],
      'underline' : ['\x1B[4m',  '\x1B[24m'],
      'inverse'   : ['\x1B[7m',  '\x1B[27m'],
      'strikethrough' : ['\x1B[9m',  '\x1B[29m'],
      'white'     : ['\x1B[37m', '\x1B[39m'],
      'grey'      : ['\x1B[90m', '\x1B[39m'],
      'black'     : ['\x1B[30m', '\x1B[39m'],
      'blue'      : ['\x1B[34m', '\x1B[39m'],
      'cyan'      : ['\x1B[36m', '\x1B[39m'],
      'green'     : ['\x1B[32m', '\x1B[39m'],
      'magenta'   : ['\x1B[35m', '\x1B[39m'],
      'red'       : ['\x1B[31m', '\x1B[39m'],
      'yellow'    : ['\x1B[33m', '\x1B[39m'],
      'whiteBG'     : ['\x1B[47m', '\x1B[49m'],
      'greyBG'      : ['\x1B[49;5;8m', '\x1B[49m'],
      'blackBG'     : ['\x1B[40m', '\x1B[49m'],
      'blueBG'      : ['\x1B[44m', '\x1B[49m'],
      'cyanBG'      : ['\x1B[46m', '\x1B[49m'],
      'greenBG'     : ['\x1B[42m', '\x1B[49m'],
      'magentaBG'   : ['\x1B[45m', '\x1B[49m'],
      'redBG'       : ['\x1B[41m', '\x1B[49m'],
      'yellowBG'    : ['\x1B[43m', '\x1B[49m']
};

for(var i in colorMap){
    String.prototype.__defineGetter__(i, function(i){
        return function(){
            return colorMap[i][0] + this + colorMap['white'][0] + colorMap['normal'][0];
        };
    }(i));
}

var ROOT_PATH = process.cwd();

var UTIL_ROOT_PATH = __dirname + "/../";

var SRC_PATH = UTIL_ROOT_PATH + "src/";

/*
var enPath = process.env.PATH.split(path.delimiter);
var npmReg = /npm/;
var utilNodePath;
enPath.map(function(item){
    if(npmReg.test(item)){
        utilNodePath = item;
    }
});

utilNodePath += "/util/";

SRC_PATH = utilNodePath + "/src/";
*/


if(! actionArg){
    console.log("Lack Of Arguments!\nPlease input the arguments\nOK".red);
    process.exit("");
}else{
    console.log("processing...\n".green);

    if(actionArg == 'init'){
        initFile();
    }else if(actionArg == "add"){
        if(! argv[3]){
            console.log("Please input the function name you want to add!".red);
            process.exit();
        }
        addFunc(argv[3]);
    }
}

function initFile(){
    var utilInitFilePath = SRC_PATH + "util-init.js";

    var initStr = fs.readFileSync(utilInitFilePath).toString();

    rl.question("without given file path, util.js will be created as " + 'js/util.js'.blue + ", OK?\nPlease type enter or " + "OK".cyan + " to " + "comfirm".green + ", type " + "NO".cyan + " to " + "cancel".red + ", OR type " + "filepath".bold + " to directly tell us where to create it.\n\n\n\n", function(answer){
        answer = answer.toLowerCase().trim();

        if(answer == "" || answer == "\n" || answer == "ok"){
            writeFile(initStr, "", function(filename){
                console.log(filename + " written\n" + "init util.js success!".green);
            });
        }else if(answer == "no"){
            console.log("User canceled");
            process.exit();
        }else{
            writeFile(initStr, answer, function(filename){
                console.log(filename + " written\n" + "util init success!".green);
            });
        }

        rl.close();
    });
}

function writeFile(str, path, callback){
    if(! path) path = "js/";

    var filePathReg = /[^\/\\]+\.js$/g;

    var filename = "util.js";

    var result;

    if(result = filePathReg.exec(path)){
        filename = result[0];

        path = path.replace(result[0], "");
    }


    if(/\/$/.test(path)){
    }else{
        path += "/";
    }

    if(! fs.existsSync(path)){
        console.log("making dir: " + path + "\n");
        if(fs.mkdirSync(path)){
            console.log("make dir error!".red);

            process.exit();
        };
    };

    var filepath = path + filename;
    fs.writeFile(filepath, str, function(err){
        if(err){
            throw err;
            console.log("writing file error!".red);

            process.exit();
        }

        process.myFile = filepath;

        callback && callback(filepath);

        writeConfig('util.js', filepath, function(err){
        });
    });
}

function writeConfig(pro, val, callback){
    var configPath = ROOT_PATH + "/util.json";
    var config = {};
    if(fs.existsSync(configPath)){
        var data = fs.readFileSync(configPath);
        config = JSON.parse(data);

    }else{
    }

    config[pro] = val;
    var configStr = JSON.stringify(config);

    fs.writeFile(configPath, configStr, function(err){
        if(err){
            throw err;
            
            process.exit();
        }
    });

}

function getConfig(){
    var configPath = ROOT_PATH + "/util.json";
    var config = {};
    if(fs.existsSync(configPath)){
        var data = fs.readFileSync(configPath);
        config = JSON.parse(data);

    }else{
    }

    return config;
}

function addFunc(funcName){
    var config = getConfig();
    var filepath = config['util.js'];

    if(! filepath){
        console.log("Please use " + "util init ".cyan + "to init a util.js file");

        process.exit();
    }

    //先写死文件为util.js
    var utilFilePath = SRC_PATH + "util.js";

    //检查文件中是否已经有方法存在
    var fileContent = fs.readFileSync(filepath).toString();

    if(getFunctionDefination(funcName, fileContent)){
        console.log("已有该方法".green);

        process.exit();
    };

    fs.readFile(utilFilePath, function(err, data){
        data = data.toString();

        var funcstr = getFunctionDefination(funcName, data);

        if(! funcstr){
            console.log("不存在的方法: ".red + funcName.cyan);
            console.log("请查阅我们的目录文档 ");

            process.exit();
        }

        funcstr += ";\n";
        
        var positionReg = /\/\/FUNCTIONS[^\n]*/m;

        fileContent = fileContent.replace(positionReg, function(result){
            return result + "\n" + funcstr;
        });

        //Util = {}定义reg
        var utilDefitionReg = /util\s*=\s*(\{[^\}]*?\})/g;

        fileContent = fileContent.replace(utilDefitionReg, function(result, $1){
            $1 = $1.replace(/:([^\n,\}]+)/g, ":\"$1\"");
            $1 = $1.replace(/([^\n,\{]+):/g, "\"$1\":");

            var util = JSON.parse($1);

            util[funcName] = funcName;

            var utilDefitionStr = "util = \n" + JSON.stringify(util).replace(/\"/g, "").replace(/,/g, ",\n");

            return utilDefitionStr;

        });

        if(! fs.writeFileSync(filepath, fileContent)){
            console.log("成功增加方法".green);
        }else{
            console.log("增加方法失败".red);
        }

        process.exit();
    });

    function getFunctionDefination(funcName, data){
        //取到方法函数体
        var argumentsReg, statements;
        var functionReg = new RegExp("\\/\\*\\*[\\s\\S]*?\\*\\/[\\s\\S]*?" + "(?:(var\\s+" + funcName + "\\s*=\\s*function\\s*\\()|(function\\s+" + funcName + "\\s*\\())", "m");
        var commonFunctionReg = new RegExp("\\/\\*\\*[\\s\\S]*?\\*\\/[\\s\\S]*?" + "(?:var\\s+([^=]+)\\s*=\\s*function\\s*\\(|function\\s+([^=]+)\\s*\\()", "m");

        var result;
        while(result = commonFunctionReg.exec(data)){
            if((result[1]).trim() == funcName){
                data = data.substring(result.index);
                break;
            }else{
                data = data.substring(result.index + result[0].length);
            }
        }


        var result = functionReg.exec(data);

        if(! result) return;
        var offset = result.index;

        var funcDefination = result[1];

        var str = data.substring(offset);

        var funcOffset = str.indexOf(funcDefination);

        var count = 0, stopEnable = 0;
        for(var i = funcOffset; i < str.length; i ++){
            if(str[i] == "{"){
                if(! stopEnable) stopEnable = 1;
                count ++;
            }else if(str[i] == "}"){
                count --;
            }

            if(count == 0 && stopEnable){
                break;
            }
        }

        var functionStr = str.substring(0, i + 1);

        return functionStr;
    }

}
