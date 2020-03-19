const fs = require('fs');
const path = require('path');

function load_models(temp_path){
    let models = {};
    fs.readdirSync(temp_path).forEach(function(name){
        let info = fs.statSync(path.join(temp_path, name));
        if(!info.isDirectory()){
            let ext = path.extname(name);
            let base = path.basename(name, ext);
            if (require.extensions[ext]) {
                models[base] = require(path.join(temp_path, name));
            } else {
                console.log('cannot require '+name);
            }
        }
    })
    return models;
}

module.exports = load_models(path.join(__dirname, '../models'));