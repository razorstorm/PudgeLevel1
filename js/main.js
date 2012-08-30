/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var GAME_WIDTH,GAME_HEIGHT;
var imageHeight;
var imageTop;
var ctx;
var pudge;
var currLevelId=0;
var levels=[];
var gCanvasElement;
var hasFocus=true;
var tutorial;
var dragging=false;
var imageResources={};
var GameStates=
{
    PAUSED:'paused',
    RUNNING:'running',
    MAIN_MENU:'mainMenu',
    TUTORIAL: 'tutorial',
    LEVEL_COMPLETE: 'levelComplete',
    LEVEL_FAILED: 'levelFailed'
}
var GAME_STATE=GameStates.MAIN_MENU;
var vignette;
var bg;
var lastTime;
var pudgeYLoc;
var needToRedraw=true;
var mouseX;
var mouseY;
$(document).ready(function(){
    init();
});

function initializeImage()
{
    
}
function init(){
    gCanvasElement=$('#mainScreen');
    ctx = gCanvasElement[0].getContext("2d");
      //    tutorial= new Tutorial();
    GAME_WIDTH=$('#mainScreen').attr('width');
    GAME_HEIGHT=$('#mainScreen').attr('height');
    imageHeight=GAME_WIDTH*0.1724429416737109;
    imageTop=GAME_HEIGHT-imageHeight;
    pudgeYLoc=GAME_HEIGHT*0.7;
    
    initializeImage();
    
    gCanvasElement.mouseout(function(){
        if(GAME_STATE==GameStates.RUNNING)
            GAME_STATE=GameStates.PAUSED;
    });
    gCanvasElement.mouseover(function(){
        if(GAME_STATE==GameStates.PAUSED && hasFocus)
            GAME_STATE=GameStates.RUNNING;
    });
    
    $(document).keyup(function(e){
        onKeyUp(e.keyCode);
    });

    $(function() {
        $(window).focus(function() {
            hasFocus=true;
        });

        $(window).blur(function() {
            hasFocus=false;
            if(GAME_STATE==GameStates.RUNNING)
                GAME_STATE=GameStates.PAUSED;
        });
    });

  
    
    $('#levelPickMenu button').each(function(){
        $(this).mouseup(function(){
            var levelId=parseInt($(this).attr('id').substr(5));
            $('#levelPickMenu').slideUp('fast',function(){
                currLevelId=levelId;
                GAME_STATE=GameStates.RUNNING;
                
            });
        });
    });
    
    $('#nextLevelButton').mouseup(function(){
        $('#levelAction').slideUp('fast',function()
        {
            if(GAME_STATE==GameStates.LEVEL_COMPLETE)
            {
                GAME_STATE = GameStates.RUNNING;
                currLevelId++;
                pudge.newLevel();
            }
        });
    });
    $('#levelFailedActionRetryLevelButton').mouseup(function(){
        $('#levelFailedAction').slideUp('fast',function()
        {
            if(GAME_STATE==GameStates.LEVEL_FAILED)
            {
                levels[currLevelId].reset();
                pudge.respawn();
                GAME_STATE = GameStates.RUNNING;
            }
        });
    });
    
    gCanvasElement.mousedown(function(e){
        if( e.button == 0 ) {
            dragging=true;
            setMouseXY(e);
        }
    });
    gCanvasElement.mouseup(function(e){
        if( e.button == 2 ) {
            handleClick(e,2);
        } 
        else
        {
            dragging=false;
        }
    });
    gCanvasElement.mousemove(function(e){
        setMouseXY(e);
    });

    gCanvasElement.bind("contextmenu",function(e){
        return false;
    }); 
    setupButtons();

    
    setupVignette();
    setupBackground();

}
function setupButtons()
{
    $('#newGameButton').mouseup(function (){
        $('#controls').slideUp('slow',function(){
            startNewGame();
        });
    });
}
function startNewGame()
{
    pudge = new Pudge();
    setupLevels();
    GAME_STATE=GameStates.PICK_A_LEVEL;
    $('#levelPickMenu').fadeIn();
}
function setupLevels()
{
    //TODO make this more sophisticated
    var level0Enemies=[];


//    level0Enemies.push(new SideMurlockTestEnemy(GAME_WIDTH+20));
//    level0Enemies.push(new SideMurlockTestEnemy(GAME_WIDTH+100));
//    level0Enemies.push(new SideMurlockTestEnemy(GAME_WIDTH+200));
//    level0Enemies.push(new SideMurlockTestEnemy(GAME_WIDTH+400));
    level0Enemies.push(new MurlockEnemy(-20));
    level0Enemies.push(new MurlockEnemy(-100));
    level0Enemies.push(new MurlockEnemy(-200));
    level0Enemies.push(new MurlockEnemy(-400));
//    level0Enemies.push(new MurlockEnemy(-10));
    var level0=new Level(pudge,level0Enemies);
    levels.push(level0);
    
    var enemies=[];
    enemies.push(new MurlockEnemy(-10));
    enemies.push(new MurlockEnemy(-100));
    enemies.push(new MurlockEnemy(-250));
    enemies.push(new MurlockEnemy(-500));
    enemies.push(new MurlockEnemy(-600));
    enemies.push(new MurlockEnemy(-800));
    enemies.push(new MurlockEnemy(-900));
    enemies.push(new MurlockEnemy(-1000));
    enemies.push(new MurlockEnemy(-1100));
    enemies.push(new MurlockEnemy(-1100));
    enemies.push(new MurlockEnemy(-1300));
    enemies.push(new MurlockEnemy(-1600));
    enemies.push(new MurlockEnemy(-1700));
    enemies.push(new MurlockEnemy(-1800));
    enemies.push(new MurlockEnemy(-2000));
    enemies.push(new MurlockEnemy(-2300));
    enemies.push(new MurlockEnemy(-2400));
    enemies.push(new MurlockEnemy(-2600));
    enemies.push(new MurlockEnemy(-2600));
    enemies.push(new MurlockEnemy(-2600));
    enemies.push(new MurlockEnemy(-2600));
    enemies.push(new MurlockEnemy(-2600));
    enemies.push(new MurlockEnemy(-2600));
    enemies.push(new MurlockEnemy(-2600));
    enemies.push(new MurlockEnemy(-2600));
    enemies.push(new MurlockEnemy(-2600));
    enemies.push(new MurlockEnemy(-2600));
    enemies.push(new MurlockEnemy(-2600));
    enemies.push(new MurlockEnemy(-2600));
    enemies.push(new MurlockEnemy(-2600));
    enemies.push(new MurlockEnemy(-2600));
    var level1=new Level(pudge,enemies);
    levels.push(level1);
}
function setMouseXY(e)
{
    if (e.pageX || e.pageY) { 
        mouseX = e.pageX;
        mouseY = e.pageY;
    }
    else { 
        mouseX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
        mouseY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
    } 
    
    
    mouseX -= gCanvasElement.offset().left;
    mouseY -= gCanvasElement.offset().top;
//    e.preventDefault();
}
function handleClick(e,button)
{
    setMouseXY(e)
    onClick(parseInt(mouseX),parseInt(mouseY),button);
}

function onClick(x,y,button)
{
    if(inShootZone(x,y))
    {
        switch(button)
        {
            //            case 1:
            //                pudge.fire(x,y);
            //                break;
            case 2:
                pudge.hook(x,y);
                break;
        }
    }
}

function onKeyUp(keyCode)
{
    //R is pressed
    if(keyCode==82)
    {
        if(GAME_STATE==GameStates.RUNNING)
        {
            this.pudge.rot();
        }
    }
}

function inShootZone(x,y)
{
    return y<pudge.yLoc;
}
function pauseTick()
{
    if(GAME_STATE==GameStates.PAUSED)
        setTimeout(pauseTick,50);
    else   
        setTimeout(gameTick,50);
    
}
function gameTick()
{
    switch(GAME_STATE)
    {
        case GameStates.PAUSED:
            if(needToRedraw)
            {
                needToRedraw=false;
                ctx.save();
                ctx.fillStyle='rgba(0,0,0,0.5)';
                ctx.fillRect(0,0,GAME_WIDTH,GAME_HEIGHT);
                ctx.textalign= 'center';
                ctx.font= 50 * GAME_WIDTH/800.0+'px Verdana';
                var textWidth = ctx.measureText('GAME PAUSED').width;
                drawShadedText(ctx,[220,220,220],'GAME PAUSED',GAME_WIDTH*0.5-textWidth/2.0,GAME_HEIGHT*0.3);
                ctx.restore();
            }
            pauseTick();
            break;
        case GameStates.TUTORIAL:
            drawBackground();
            ctx.save();
            ctx.fillStyle='rgba(255,255,255,0.2)';
            ctx.fillRect(0,0,GAME_WIDTH,GAME_HEIGHT);
            ctx.restore();
            tutorial.gameTick(ctx);
            setTimeout(gameTick,50);
            break;
        case GameStates.PICK_A_LEVEL:
            pudge.drawIntro(ctx);
            setTimeout(gameTick,50);
            break;
        case GameStates.LEVEL_FAILED:
            drawBackground();
            ctx.drawImage(vignette,0,0,GAME_WIDTH,GAME_HEIGHT);
                        
            ctx.save();
            ctx.textalign= 'center';
            ctx.font= 30 * GAME_WIDTH/800.0+'px Verdana';
            var deadText='You are deaded, forsooth';
            var levelFailedWidth = ctx.measureText(deadText).width;
            drawShadedText(ctx,[200,20,20],deadText,GAME_WIDTH*0.5-levelFailedWidth/2.0,GAME_HEIGHT*0.08);
            ctx.restore();
            
            pudge.drawIntro(ctx);
            
            setTimeout(gameTick,50);
            break;
        case GameStates.LEVEL_COMPLETE:
            drawBackground();
            ctx.drawImage(vignette,0,0,GAME_WIDTH,GAME_HEIGHT);
                        
            ctx.save();
            ctx.textalign= 'center';
            ctx.font= 30 * GAME_WIDTH/800.0+'px Verdana';
            var text='Congradulations you beat level '+currLevelId+ '!';
            var levelBeatenWidth = ctx.measureText(text).width;
            drawShadedText(ctx,[20,20,200],text,GAME_WIDTH*0.5-levelBeatenWidth/2.0,GAME_HEIGHT*0.08);
            ctx.restore();
            
            pudge.drawIntro(ctx);
            
            setTimeout(gameTick,50);
            break;
        case GameStates.RUNNING:
            needToRedraw=true;
            if(dragging)
            {
                pudge.fire(mouseX,mouseY);
            }
            drawBackground();

            if(pudge.gameTick(ctx))
            {
                levelFailed();   
            }
            if(levels[currLevelId].gameTick(ctx))
            {
                levelComplete();
            }
            setTimeout(gameTick,50);
            break;
        case GameStates.MAIN_MENU:
            drawBackground();
            ctx.drawImage(vignette,0,0,GAME_WIDTH,GAME_HEIGHT);
            setTimeout(gameTick,50);
            break;
    }
}
function levelComplete()
{
    GAME_STATE=GameStates.LEVEL_COMPLETE;
    $('#levelAction').fadeIn('fast');
}
function levelFailed()
{
    GAME_STATE=GameStates.LEVEL_FAILED;
    $('#levelFailedAction').fadeIn('fast');
}
function setupVignette()
{
    vignette = new Image();
    vignette.src=VIGNETTE;
}
function setupBackground()
{
    bg = new Image();
    bg.onload=function(){
        gameTick();
    }
    bg.src=BACKGROUND;
}
function drawBackground()
{
    ctx.drawImage(bg,0,0,GAME_WIDTH,GAME_HEIGHT);
}
function clearScreen()
{
    ctx.clearRect(0,0,GAME_WIDTH,GAME_HEIGHT);
}