var filesystem = require('fs');
var Sequelize = require("sequelize");
var path = require('path');

var namespace = require("./namespace");

var models = {};
var relationships = {};

var singleton = function singleton() {
    Sequelize.useCLS = namespace.getNS();
    var sequelize = null;
    var modelsPath = null;
    var duplicateModelNames = ["Replacements"];
    this.setup = function (modelspath, database, username, password, options){
        modelsPath = modelspath;
        if(arguments.length == 3){
            sequelize = new Sequelize(database, username);
        }
        else if(arguments.length == 4){
            sequelize = new Sequelize(database, username, password);
        }
        else if(arguments.length == 5){
            sequelize = new Sequelize(database, username, password, options);
        }
        init();
    }

    this.model = function (name) {
        return models[name];
    }

    this.Seq = function (){
        return Sequelize;
    }

    this.getObj = function() {
        return sequelize;
    }

    function setAssociations() {
        models["User"].hasOne(models["Client"], { foreignKey : 'userId' , sourceKey : 'id'} );
        models["Client"].belongsTo(models["User"],{foreignKey: 'userId', targetKey: 'id'});

        models["User"].hasOne(models["Developer"], { foreignKey : 'userId' , sourceKey : 'id'} );
        models["Developer"].belongsTo(models["User"],{foreignKey: 'userId', targetKey: 'id'});

        models["Client"].hasMany(models["Project"], { foreignKey : 'clientId' , sourceKey : 'id'} );
        models["Project"].belongsTo(models["Client"],{foreignKey: 'clientId', targetKey: 'id'});

        models["Developer"].hasMany(models["Project"], { foreignKey : 'developerId' , sourceKey : 'id'} );
        models["Project"].belongsTo(models["Developer"],{foreignKey: 'developerId', targetKey: 'id'});

        models["Developer"].hasMany(models["AppliedProject"], { foreignKey : 'developerId' , sourceKey : 'id'} );
        models["AppliedProject"].belongsTo(models["Developer"],{foreignKey: 'developerId', targetKey: 'id'});

        models["Project"].hasMany(models["AppliedProject"], { foreignKey : 'projectId' , sourceKey : 'id'} );
        models["AppliedProject"].belongsTo(models["Project"],{foreignKey: 'projectId', targetKey: 'id'});

        models["Agreement"].belongsTo(models["Project"],{foreignKey: 'projectId', targetKey: 'id'});
        models["Project"].belongsTo(models["ProjectStatus"],{foreignKey: 'projectStatusId', targetKey: 'id'});

    }

    function getAllMethods(object) {
        return Object.getOwnPropertyNames(object).filter(function(property) {
            return typeof object[property] == 'function';
        });
    }

    function init() {
        filesystem.readdirSync(modelsPath).forEach(function(name) {
            if(name.indexOf(".swp") == -1) {
                var object = require(modelsPath + "/" + name);
                var options = object.options || {}
                var modelName = name.replace(/\.js$/i, "");
                models[modelName] = sequelize.define(modelName, object.model, options);
                if(duplicateModelNames.indexOf(modelName) >= 0) {
                    duplicateModelName = modelName + "1";
                    models[duplicateModelName] = sequelize.define(modelName, object.model, options);
                }
                if("relations" in object){
                    relationships[modelName] = object.relations;
                }
                // models[modelName].sync({});
            }
            else {
                console.info("Swap file : " + name);
            }
        });
        for(var name in relationships){
            var relation = relationships[name];
            for(var relName in relation){
                var related = relation[relName];
                models[name][relName](models[related]);
            }
        }
        setAssociations();
    }

    if(singleton.caller != singleton.getInstance) {
        throw new Error("This object cannot be instantiated");
    }
}

singleton.instance = null;

singleton.getInstance = function() {
    if(this.instance === null) {
        this.instance = new singleton();
    }
    return this.instance;
}

module.exports = singleton.getInstance();
