/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


function Status()
{
    this.setupImage();
}
Status.prototype.setupImage = function()
{
    this.statusPanelImage = new Image();
    this.statusPanelImage.src='img/statspane.png';
    
    this.expBarImage = new Image();
    this.expBarImage.src='img/expBar.png';
}


Status.prototype.drawStatusPanel=function(ctx,pudge)
{
    
    ctx.drawImage(this.statusPanelImage,0,imageTop,GAME_WIDTH,imageHeight);
    
    this.drawMP(ctx,imageTop,pudge.getMP(),pudge.mpMax);
    this.drawHP(ctx,imageTop,pudge.getHP(),pudge.hpMax);
    this.drawAttackCD(ctx,imageTop, pudge.daggerCD,pudge.getDaggerTotalCD());
    this.drawHookCD(ctx,imageTop, pudge.hookCD,pudge.getHookTotalCD());
    this.disableHookDueToMana(ctx,imageTop,pudge.hasMPToHook());
    this.setupEXP(ctx,imageTop,pudge.level,pudge.exp,pudge.expRequirements);
    this.setupName(ctx,imageTop,pudge.level);
    this.setupArmor(ctx,imageTop,pudge.baseArmor,pudge.additionalArmor);
    this.setupStr(ctx,imageTop,pudge.baseStr,pudge.additionalStr);
    this.setupAgi(ctx,imageTop,pudge.baseAgi,pudge.additionalAgi);
    this.setupIntel(ctx,imageTop,pudge.baseIntel,pudge.additionalIntel);
    this.setupDamage(ctx,imageTop,pudge.weaponStats[0],pudge.weaponStats[1],pudge.additionalDamage);
    this.setupGold(ctx,imageTop,pudge.gold);
}

Status.prototype.setupDamage = function(ctx,imageHeight,minDamage,maxDamage,additionalDamage)
{
    ctx.save();
    ctx.textalign= 'center';
    ctx.font= 10 * GAME_WIDTH/800.0+'px Verdana';
    var textWidthMin = ctx.measureText(minDamage).width;
    drawShadedText(ctx,[200,200,200],minDamage,GAME_WIDTH*0.254,imageHeight+GAME_WIDTH*0.097);
    var textWidthMax = ctx.measureText(' - '+maxDamage).width;
    drawShadedText(ctx,[200,200,200],' - '+maxDamage,GAME_WIDTH*0.254+textWidthMin,imageHeight+GAME_WIDTH*0.097);
   
    if(additionalDamage >0)
        drawShadedText(ctx,[0,255,0],' +'+additionalDamage,GAME_WIDTH*0.254+textWidthMin+textWidthMax,imageHeight+GAME_WIDTH*0.097);
    
    ctx.restore();
}
Status.prototype.setupStr = function(ctx,imageHeight,baseStr,additionalStr)
{
    ctx.save();
    ctx.textalign= 'center';
    ctx.font= 9 * GAME_WIDTH/800.0+'px Verdana';
    var textWidthBase = ctx.measureText(baseStr).width;
    drawShadedText(ctx,[200,200,200],baseStr,GAME_WIDTH*0.398,imageHeight+GAME_WIDTH*0.092);
   
    if(additionalStr >0)
        drawShadedText(ctx,[0,255,0],' +'+additionalStr,GAME_WIDTH*0.398+textWidthBase,imageHeight+GAME_WIDTH*0.092);
    
    ctx.restore();
}
Status.prototype.setupAgi = function(ctx,imageHeight,baseAgi,additionalAgi)
{
    ctx.save();
    ctx.textalign= 'center';
    ctx.font= 9 * GAME_WIDTH/800.0+'px Verdana';
    var textWidthBase = ctx.measureText(baseAgi).width;
    drawShadedText(ctx,[200,200,200],baseAgi,GAME_WIDTH*0.398,imageHeight+GAME_WIDTH*0.12);
   
    if(additionalAgi >0)
        drawShadedText(ctx,[0,255,0],' +'+additionalAgi,GAME_WIDTH*0.398+textWidthBase,imageHeight+GAME_WIDTH*0.12);
    
    ctx.restore();
}
Status.prototype.setupIntel = function(ctx,imageHeight,baseIntel,additionalIntel)
{
    ctx.save();
    ctx.textalign= 'center';
    ctx.font= 9 * GAME_WIDTH/800.0+'px Verdana';
    var textWidthBase = ctx.measureText(baseIntel).width;
    drawShadedText(ctx,[200,200,200],baseIntel,GAME_WIDTH*0.398,imageHeight+GAME_WIDTH*0.145);
   
    if(additionalIntel >0)
        drawShadedText(ctx,[0,255,0],' +'+additionalIntel,GAME_WIDTH*0.398+textWidthBase,imageHeight+GAME_WIDTH*0.145);
    
    ctx.restore();
}
Status.prototype.setupGold = function(ctx,imageHeight, gold)
{
    ctx.save();
    ctx.textalign= 'center';
    ctx.font= 9 * GAME_WIDTH/800.0+'px Verdana';
    
    drawShadedText(ctx,[200,200,0],gold+' gold',GAME_WIDTH*0.398,imageHeight+GAME_WIDTH*0.16);
   
    ctx.restore();
}
Status.prototype.setupArmor = function(ctx,imageHeight,baseArmor,additionalArmor)
{
    ctx.save();
    ctx.textalign= 'center';
    ctx.font= 9 * GAME_WIDTH/800.0+'px Verdana';
    var textWidthBase = ctx.measureText(baseArmor).width;
    drawShadedText(ctx,[200,200,200],baseArmor,GAME_WIDTH*0.254,imageHeight+GAME_WIDTH*0.135);
   
    if(additionalArmor>0)
        drawShadedText(ctx,[0,255,0],' +'+additionalArmor,GAME_WIDTH*0.254+textWidthBase,imageHeight+GAME_WIDTH*0.135);
    
    ctx.restore();
}
Status.prototype.setupEXP = function(ctx,imageHeight,level,exp,expReqs)
{
    var percentage = Math.min(1,exp  / (0.0+expReqs[level]) );
    ctx.drawImage(this.expBarImage,GAME_WIDTH*0.205,imageHeight+GAME_WIDTH*0.049,GAME_WIDTH*0.266 * percentage,GAME_WIDTH*0.0165);
}

Status.prototype.setupName = function(ctx,imageHeight,level)
{
    var string = 'Level '+level+' Butcher';
    ctx.save();
    ctx.textalign= 'center';
    ctx.font= 9 * GAME_WIDTH/800.0+'px Verdana';
    var textWidth = ctx.measureText(string).width;
    drawShadedText(ctx,[200,200,200],string,GAME_WIDTH*0.338-textWidth/2.0,imageHeight+GAME_WIDTH*0.06);
    ctx.restore();
}
Status.prototype.disableHookDueToMana=function(ctx,imageHeight,canHook)
{
    if(!canHook)
    {
        ctx.save();
        ctx.fillStyle = "rgba(0,0,80,0.7)";  
        ctx.fillRect(GAME_WIDTH*0.6662,imageHeight+GAME_WIDTH*0.1167,GAME_WIDTH*0.056,GAME_WIDTH*0.047);
        ctx.restore();
    }
}
Status.prototype.drawHP= function(ctx,imageHeight,hp,hpMax)
{
    ctx.save();
    ctx.textalign= 'center';
    ctx.font= 12 * GAME_WIDTH/800.0+'px Verdana';
    var textWidth = ctx.measureText(hp+'/'+hpMax).width;
    drawShadedText(ctx,[0,255,0],hp+'/'+hpMax,GAME_WIDTH*0.11-textWidth/2.0,imageHeight+GAME_WIDTH*0.148);
    ctx.restore();
}


Status.prototype.drawMP= function(ctx,imageHeight,mp,mpMax)
{
    ctx.save();
    ctx.textalign= 'center';
    ctx.font= 12 * GAME_WIDTH/800.0+'px Verdana';
    var textWidth = ctx.measureText(mp+'/'+mpMax).width;
    drawShadedText(ctx,[220,220,220],mp+'/'+mpMax,GAME_WIDTH*0.11-textWidth/2.0,imageHeight+GAME_WIDTH*0.169);
    ctx.restore();
}


Status.prototype.drawHookCD = function(ctx,imageHeight, cd,total)
{
    var percentage=cd/(total+0.0);
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.6)";  
    ctx.fillRect(GAME_WIDTH*0.669,imageHeight+GAME_WIDTH*0.119,GAME_WIDTH*0.051,(GAME_WIDTH*0.042)*percentage);
    ctx.restore();
}
Status.prototype.drawAttackCD = function(ctx,imageHeight, cd,total)
{
    var percentage=cd/(total+0.0);
    
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.6)";  
    ctx.fillRect(GAME_WIDTH*0.669,imageHeight+GAME_WIDTH*0.011,GAME_WIDTH*0.051,(GAME_WIDTH*0.042)*percentage);
    ctx.restore();
}