var nodes=new Array();
var loosePoints=null;
var activeComponent=null;
var activePins=[];
var components=new Array(),compUniID=0;

//---test data
var comp={
    'W0000':{
        "ComponentID":"W0000",
        "name":"Wire",
        "pins":"2",
        "in":["0"],
        "out":["1"],
        "block":false,
        "pinFunctions":["function(input){return function(){return parseFloat(nodes[input[0][0]][input[0][1]].nodeCurrent?nodes[input[0][0]][input[0][1]].nodeCurrent:nodes[input[1][0]][input[1][1]].nodeCurrent)};}","function(input){return function(){return parseFloat(parseFloat(nodes[input[0][0]][input[0][1]].nodeCurrent?nodes[input[0][0]][input[0][1]].nodeCurrent:nodes[input[1][0]][input[1][1]].nodeCurrent));};}"]
    },
    'AND':{
        "ComponentID":"IC747",
        "name":"AND",
        "pins":"4",
        "in":["1",'2','3'],
        "out":["4"],
        "block":true,
        "pinFunctions":["function(input){return function(){return parseFloat(nodes[input[0][0]][input[0][1]].nodeCurrent)};}","function(input){return function(){return parseFloat(nodes[input[1][0]][input[1][1]].nodeCurrent)};}","function(input){return function(){return parseFloat(nodes[input[2][0]][input[2][1]].nodeCurrent)};}","function(input){return function(){return parseFloat(nodes[input[0][0]][input[0][1]].nodeCurrent)+parseFloat(nodes[input[1][0]][input[1][1]].nodeCurrent)+parseFloat(nodes[input[2][0]][input[2][1]].nodeCurrent);};}"]
    }
};

//---test data ends

$(function(){
    //Model
    var Node = function (nodeID, nodeDiv){
        this.nodeID=nodeID;
        this.nodeDiv=nodeDiv;
        this.nodeConnected=false;
        //connectedTo should have either node referance or ICpin
        this.nodeConnectedTo;
        this.wireTo=[];
        this.wireFrom=[];
        this.nodeVoltage=NaN;
        this.nodeCurrent=NaN;
        this.nodeFunction=null;

    };
    Node.prototype.nodeInfo=function(){
            console.log(this.nodeID);
    };

    var view={
        init: function(){
            //source nodes
            for (var i = 1; i <= 68; i++) {
                nodes[i]=new Array();
                var k=i<65?10:50;
                for (var j = 1; j <= k; j++) {
                    var nodeDiv=document.getElementById(""+((i*100)+j));
                    nodes[i][j]=new Node((i*100)+j,nodeDiv);    
                //NodeClick
                    nodeDiv.onclick=function(){
                        var x=Math.floor(this.id/100);
                        var y=this.id%100;
                        console.log("clicked : ("+x+","+y+")"); //click trigger

                        controller.nodeClick(x,y);
                    };
                };
            };
            

        },
        render: function(){
            for (var i = 1; i <= 68; i++) {
                var k=i<65?10:50;
                for (var j = 1; j <= k; j++) {
                    if (!isNaN(nodes[i][j].nodeCurrent)){
                        $(nodes[i][j].nodeDiv).children().first().css('background-color',"#B4F6B4");
                    }
                    else{
                        $(nodes[i][j].nodeDiv).children().first().css('background-color','white');
                    }
                }
            }
        },
        renderComponentInfo: function(){
            $('#component_info').html('Name : '+activeComponent.name+'</br>Number of Pins : '+activeComponent.pins);
        }

    }
    
    var controller={
        nodeClick: function(x,y){
            if(loosePoints){
                // block===true : auto assigning of pins once 1st pin is assigned
                if(activeComponent.block === true || activeComponent.block == 'true'){
                    var i=0;
                    while(i<parseInt(activeComponent.pins/2)){
                        activePins.push([x,y]);
                        console.log('blocked : ('+x+','+y+')');
                        $('#log').prepend('blocked : ('+x+','+y+')'+'</br>');
                        $(nodes[x][y].nodeDiv).css('background-color',"grey");// component view to be added separately
                        
                        x=x+1;
                        i=i+1;
                    }
                    x=x-1;
                    y=y+1;
                    i=0;
                    while(i<parseInt(activeComponent.pins/2)){
                        activePins.push([x,y]);
                        $('#log').prepend('blocked : ('+x+','+y+')'+'</br>');
                        $(nodes[x][y].nodeDiv).css('background-color',"grey");
                        
                        x=x-1;
                        i=i+1;
                    }
                    loosePoints=0;
                }else{
                    activePins.push([x,y]);
                    console.log('wired : ('+x+','+y+')');
                    $('#log').prepend('wired : ('+x+','+y+')'+'</br>');
            
                    loosePoints = loosePoints - 1;
                }
                if (loosePoints == 0)
                        panelController.addComponent();
            }
        },
        renderState: function(){
            for (var i = 1; i <= 68; i++) {
                var k=i<65?10:50;
                for (var j = 1; j <= k; j++) {
                    if(nodes[i][j].nodeFunction){
                        //change state
                        nodes[i][j].nodeCurrent=nodes[i][j].nodeFunction();
                        controller.changeRowState(i,j,nodes[i][j].nodeCurrent);
                    }
                }
            }
        },
        changeRowState: function(i,j,current){
            if (i <= 64) {
                if( j <= 5){
                    for( var k = 1; k <= 5; k++){
                        //change state
                        nodes[i][k].nodeCurrent=current;
                    }
                }else{
                    for( var k = 6; k <= 10; k++){
                        //change state
                        nodes[i][k].nodeCurrent=current;
                    }
                }
            }else{
                for( var j = 1 ; j <= 50 ; j++ ){
                    nodes[i][j].nodeCurrent=current;
                }
            }
        }
    }
    
    var panelView={
        init: function(){
            var wireURL = 'Components/Test/W0000.json';
            $('#component_button_1').click(function(){
                var path = $('#component_search_1').val();
                panelController.selectComponent(path);
            });
            $('#component_button_2').click(function(){
                var path = $('#component_search_2').val();
                panelController.selectComponent(path);
            });
            $('#W0000').click(function(){
                var path = wireURL;
                panelController.selectComponent(path);
            });
        },
        renderComponentInfo: function(){
            $('#component_info').html('Name : '+activeComponent.name+'</br>Number of Pins : '+activeComponent.pins);
        },
        addSelectedComponent: function (comp){
            $("#selectedComponents").append( '<li id='+comp.componentID+'>' + comp.component.name + '</li>' );
            $('#'+comp.componentID).click(function(){
                panelController.removeComponent(this.id);
            });
        },
        removeSelectedComponent: function(id){
            $('#'+id).remove();
        }

    }
    
    var panelController={
        
        selectComponent: function(id){
            //update log and component info column
            console.log(id);
            $('#log').prepend(id+' selected'+'</br>');
            panelController.parser(id);
            
        },
        parser: function(id){
            //parse the respective json to object(activeComponent)
            
            $.getJSON("/"+id,function(data){
                activeComponent=data;
                loosePoints=activeComponent.pins;
                panelView.renderComponentInfo();
            });
            //activeComponent=comp[id]; //for testing offline
            //loosePoints=activeComponent.pins;
            //panelView.renderComponentInfo();
            //console.log(new Function("return ("+activeComponent.pinFunctions[1]+")")()([1,2])());
        },
        addComponent: function(){
            for (var i = 0; i < activeComponent.pins; i++) {
                nodes[activePins[i][0]][activePins[i][1]].nodeFunction=new Function("return ("+activeComponent.pinFunctions[i]+")")()(activePins);  
            };
            components['CUID'+compUniID]={'component':activeComponent,'nodes':activePins};
            activePins=[];
            //call boardview.addSelectedComp >> which will change the css above nodes
            panelView.addSelectedComponent({'componentID':'CUID'+compUniID,'component':activeComponent,'nodes':activePins});
            compUniID = compUniID+1;
        },
        removeComponent: function(id){
            //reset the linked nodes-reset all nodes will happen at timeTrigger
            // reset ICs node display
            //TODO: nodes connectedTo array should be taken care of too
            for (var i = 0; i < components[id].component.pins; i++) {
                nodes[components[id].nodes[i][0]][components[id].nodes[i][1]].nodeFunction=null;
                controller.changeRowState(components[id].nodes[i][0],components[id].nodes[i][1],NaN);
            };

            delete components[id];
            panelView.removeSelectedComponent(id);
        }
        
    }
    
    var system = {
        init: function (){
            view.init();
            panelView.init();
            nodes[65][1].nodeFunction=function(){ return 5;};
        },
        render: function () {
            view.render();
            controller.renderState();
        },
        abortTimer: function () {
          clearInterval(tid);
        }
    }

    var tid = setInterval(system.render, 50);

    system.init();
    
});