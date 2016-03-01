/**
 * Created by zhukm on 2016/2/29.
 */
angular.module('starterApp', ['ngMaterial'])
    .controller('tableUpdateCtr', function($scope){
        $scope.deleteCols = [];
        $scope.addCols = [];
        $scope.updateOp = [];
        $scope.colums = [{
            'isSelected': false,
            'columnName': 'id',
            'columnType': 'Int',
            'columnLength':32,
            'columnDecimal':0,
            'notNull':true,
            'isPK':true,
            'defaultValue':0,
            'description':'主键'
        },{
            'isSelected': false,
            'columnName': 'name',
            'columnType': 'varchar',
            'columnLength':4,
            'columnDecimal':0,
            'notNull':true,
            'isPK':false,
            'defaultValue':0,
            'description':'名字'
        },{
            'isSelected': false,
            'columnName': 'age',
            'columnType': 'Int',
            'columnLength':2,
            'columnDecimal':0,
            'notNull':true,
            'isPK':false,
            'defaultValue':0,
            'description':'年龄'
        }];
        $scope.addColumn = function(){
            console.log($scope.colums.length);
            var newColumn = {
                isNewCol: true,
                'columnName': '',
                'columnType': '',
                'columnLength':0,
                'columnDecimal':0,
                'notNull':false,
                'isPK':false,
                'defaultValue':0,
                'description':''
            }
            $scope.colums.push(newColumn);
            console.log('dsdfs');
        };
        $scope.oldColumn = angular.copy($scope.colums);
        $scope.deleteColumn = function(){
            var indexes = [];
            for(var i = 0; i < $scope.colums.length; i++){
                if($scope.colums[i].isSelected){
                    indexes.push(i);
                    $scope.deleteCols.push($scope.colums[i]);
                }
            }
            indexs.forEach(function(index){
                $scope.colums.splice(index, 1);
            });
        }
        $scope.saveUpdate = function(){

        };
        $scope.$watch('colums',function(newValue,oldValue){
            if(newValue.length != oldValue.length){
                return;
            }
            var arr = getOperList(newValue, oldValue);
            $scope.updateOp.push.apply($scope.updateOp,arr);
        },{deep:true});
    });


function save(newValue, oldValue, delCols){
    var operaArr = [];
    for(var i = 0; i < newValue.length; i++){
        if(newValue[i].isNewCol){
            operaArr.push({
                operaName: 'addColumn',
                name: newValue[i].columnName,
                nullable: newValue[i].notNull,
                primaryKey: newValue[i].isPK
            })
        }else{

        }
    }
}

function getOperList(newValue, oldValue){
    var result = [];
    for(var i = 0; i < oldValue.length; i++){
        for(var key in oldValue[i]){
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
        }
    }
    return result;
}
