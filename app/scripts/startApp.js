/**
 * Created by zhukm on 2016/2/29.
 */
angular.module('starterApp', ['ngMaterial'])
    .controller('tableUpdateCtr', function($scope){
        $scope.deleteCols = [];
        $scope.addCols = [];
        $scope.updateOp = [];
        $scope.colums = [{
            'id': 1,
            'isSelected': false,
            'columnName': 'id',
            'columnType': 'Int',
            'columnLength':32,
            'columnDecimal':0,
            'notNull':true,
            'isPK':true,
            'defaultValue':0,
            'remarks':'主键'
        },{
            'id': 2,
            'isSelected': false,
            'columnName': 'name',
            'columnType': 'varchar',
            'columnLength':4,
            'columnDecimal':0,
            'notNull':true,
            'isPK':false,
            'defaultValue':0,
            'remarks':'名字'
        },{
            'id': 3,
            'isSelected': false,
            'columnName': 'age',
            'columnType': 'Int',
            'columnLength':2,
            'columnDecimal':0,
            'notNull':true,
            'isPK':false,
            'defaultValue':0,
            'remarks':'年龄'
        }];
        $scope.addColumn = function(){
            console.log($scope.colums.length);
            var newColumn = {
                'id': new Date().getTime(),
                isNewCol: true,
                'columnName': '',
                'columnType': '',
                'columnLength':0,
                'columnDecimal':0,
                'notNull':false,
                'isPK':false,
                'defaultValue':0,
                'remarks':''
            }
            $scope.colums.push(newColumn);
            console.log('dsdfs');
        };
        $scope.oldColumn = angular.copy($scope.colums);
        $scope.save = function(){
            var updates = save($scope.colums,  $scope.oldColumn);
            updates.push.apply(updates,getDelUpdates($scope.deleteCols));
            console.log("dsds");
        }
        $scope.deleteColumn = function(){
            var indexes = [];
            for(var i = 0; i < $scope.colums.length; i++){
                if($scope.colums[i].isSelected){
                    indexes.push(i);
                    $scope.deleteCols.push($scope.colums[i]);
                }
            }
            for(var i = indexes.length - 1; i >= 0 ; i--){
                $scope.colums.splice(indexes[i], 1);
            }
        }
        $scope.saveUpdate = function(){

        };
        /*$scope.$watch('colums',function(newValue,oldValue){
            if(newValue.length != oldValue.length){
                return;
            }
            var arr = getOperList(newValue, oldValue);
            $scope.updateOp.push.apply($scope.updateOp,arr);
        },{deep:true});*/
    });


function getDelUpdates(delCols){
    var updates = [];
    delCols.forEach(function(col){
        updates.push({
            operaName: 'dropColumn',
            columnName: col.columnName
        });
    });
    return updates;
}

function save(newValue, oldValue){
    var result = [];
    for(var i = 0; i < newValue.length; i++){
        if(newValue[i].isNewCol){
            result.push.apply(result,addColumn(newValue[i]));
            newValue[i].isNewCol = false;
            /*result.push({
                operaName: 'addColumn',
                name: newValue[i].columnName,
                nullable: newValue[i].notNull,
                primaryKey: newValue[i].isPK
            })*/
        }else{
            for(var j = 0; j < oldValue.length; j++){
                if(newValue[i].id == oldValue[j].id){
                    result.push.apply(result,getOperList(newValue[i], oldValue[j]));
                }
            }
        }
    }
    return result;
}

function getOperList(newValue, oldValue){
    var result = [];
    for(var key in oldValue){
        if(newValue[key] != oldValue[key]){
            switch (key){
                case 'columnName':
                    result.push(renameColumn(newValue,oldValue));
                    break;
                case 'columnType':
                case 'columnLength':
                case 'columnDecimal':
                    result.push(modifyDataType(newValue));
                    /*result.push({
                        operaName:'modifyDataType',
                        columnName:newValue['columnName'],
                        columnLength: newValue['columnLength'],
                        columnDecimal: newValue['columnDecimal'],
                        newDataType:newValue['columnName']
                    });*/
                    break;
                case 'notNull':
                    result.push(nullConstraint(newValue))
                   /* result.push({
                        operaName:newValue[key] ? 'dropNotNullConstraint' : 'addNotNullConstraint',
                        columnName:newValue['columnName'],
                        columnLength: newValue['columnLength'],
                        columnDecimal: newValue['columnDecimal'],
                        newDataType:newValue['columnName']
                    });*/
            }
        }
    }
    return result;
}

/**
 * 添加字段
 * @param newValue
 * @returns {Array}
 */
function addColumn(newValue){
    var update = [];
    update.push({
        operaName: 'addColumn',
        name: newValue.columnName,
        nullable: newValue.notNull,
        primaryKey: newValue.isPK,
        remarks: newValue.remarks
    });
    if(newValue.defaultValue){
        update.push(addDefaultValue(newValue));
    }
    return update;
}

/**
 * 添加默认值
 * @param newValue
 * @returns {{operaName: string, columnName: (string|string|string|string|*), defaultValue: (number|*|string)}}
 */
function addDefaultValue(newValue){
    return {
        operaName: 'addDefaultValue',
        columnName: newValue.columnName,
        defaultValue: newValue.defaultValue
    }
}
/**
 * 重命名字段名
 * @param newValue
 * @param oldValue
 * @returns {{operaName: string, oldColumnName: (string|string|string|string|*), newColumnName: (string|string|string|string|*)}}
 */
function renameColumn(newValue, oldValue){
    return {
        operaName:'renameColumn',
        oldColumnName:oldValue.columnName,
        newColumnName:newValue.columnName,
        remarks: newValue.remarks
    };
}

/**
 * 修改数据类型
 * @param newValue
 * @returns {{operaName: string, columnName: *, columnLength: *, columnDecimal: *, newDataType: *}}
 */
function modifyDataType(newValue){
    return {
        operaName:'modifyDataType',
        columnName:newValue['columnName'],
        columnLength: newValue['columnLength'],
        columnDecimal: newValue['columnDecimal'],
        newDataType:newValue['columnName']
    }
}

/**
 * 添加非空约束
 * @param newValue
 * @returns {{operaName: string, columnName: *, columnLength: *, columnDecimal: *, newDataType: *}}
 */
function nullConstraint(newValue){
    return {
        operaName:newValue['notNull'] ? 'dropNotNullConstraint' : 'addNotNullConstraint',
        columnName:newValue['columnName'],
        columnLength: newValue['columnLength'],
        columnDecimal: newValue['columnDecimal'],
        newDataType:newValue['columnName']
    }
}

/*

for(var key in oldValue[j]){
    if(newValue[i][key] != oldValue[i][key]){
        switch (key){
            case 'columnName':
                result.push({
                    operaName:'renameColumn',
                    oldColumnName:oldValue[i][key],
                    newColumnName:newValue[i][key]
                });
                break;
            case 'columnType':
            case 'columnLength':
            case 'columnDecimal':
                result.push({
                    operaName:'modifyDataType',
                    columnName:newValue[i]['columnName'],
                    columnLength: newValue[i]['columnLength'],
                    columnDecimal: newValue[i]['columnDecimal'],
                    newDataType:newValue[i]['columnName']
                });
                break;
            case 'notNull':
                result.push({
                    operaName:newValue[i][key] ? 'dropNotNullConstraint' : 'addNotNullConstraint',
                    columnName:newValue[i]['columnName'],
                    columnLength: newValue[i]['columnLength'],
                    columnDecimal: newValue[i]['columnDecimal'],
                    newDataType:newValue[i]['columnName']
                });
        }
    }
}*/
