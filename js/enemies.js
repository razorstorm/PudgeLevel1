/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function copyPrototype(descendant, parent) 
{  
    var sConstructor = parent.toString();  
    var aMatch = sConstructor.match( /\s*function (.*)\(/ );  
    if ( aMatch != null ) 
    {
        descendant.prototype[aMatch[1]] = parent;
    }  
    for (var m in parent.prototype) 
    {  
        descendant.prototype[m] = parent.prototype[m];  
    }  
}


function AbstractEnemy(frameCount,folder,x,y,xVel,yVel,xRad,yRad,hp,hpMax,exp,type,damage,minGold,maxGold,attackCD,side)
{
    this.Entity(frameCount,folder)
    this.imageTick();
    this.x=x;
    this.y=y;
    this.xVel=xVel;
    this.yVel=yVel;
    this.xRad=xRad;
    this.yRad=yRad;
    this.hp=hp;
    this.hpMax=hpMax;
    this.exp=exp;
    this.type=type;
    this.damage=damage;
    this.alive=true;
    this.attacking=true;
    this.hooked=false;
    this.onScreen=false;
    this.minGold=minGold;
    this.maxGold=maxGold;
    this.dieCounter=0;
    this.gold=-1;
    this.rotted=false;
    this.hpGiven=0;
    this.fighting=false;
    this.maxAttackCD=attackCD;
    this.attackCD=attackCD;
    this.side=side;
    this.STATES={
        NORMAL:'NORMAL',
        DYING: 'DYING',
        ROTTING: 'ROTTING',
        HOOKED: 'HOOKED',
        FIGHTING: 'FIGHTING',
        FIGHTING_RECHARGING: 'FIGHTING_RECHARGING',
        SINGLE_ATTACKING: 'SINGLE_ATTACKING',
        DEAD: 'DEAD'
    }
}
copyPrototype(AbstractEnemy,Entity);

AbstractEnemy.prototype.hook = function(xHook,yHook,aoe)
{   
    if(!this.hooked)
    {
        if ( xHook + aoe > this.x - this.xRad * 1.2 && xHook - aoe < this.x + this.xRad * 1.2
            && yHook + aoe > this.y - this.yRad * 1.2 && yHook - aoe < this.y + this.yRad * 1.2 )
            {
            this.hpGiven=parseInt(this.hpMax*((pudgeYLoc-this.y) / pudgeYLoc));
            this.hooked = true;
            return true;
        }
    }
    return false;
}
AbstractEnemy.prototype.attack= function( blades, aoe, damage )
{
    if ( this.attacking && this.alive && !this.hooked )
    {
        for ( var index in blades )
        {
            var blade = blades[index];
            var xAttack = blade.x;
            var yAttack = blade.y;
            if ( !blade.dealtDamage && xAttack + aoe > this.x - this.xRad * 1.2
                && xAttack - aoe < this.x + this.xRad * 1.2
                && yAttack + aoe > this.y - this.yRad * 1.2
                && yAttack - aoe < this.y + this.yRad * 1.2 )
                {
                blade.damage( damage );
                this.hp -= damage;
            }
        }
    }
}
AbstractEnemy.prototype.startDying = function()
{
    this.xVel=0;
    this.yVel=0;
    this.alive=false;
}
AbstractEnemy.prototype.testMortality = function()
{
    if(this.alive)
    {
        if(this.hp<=0)
        {
            this.startDying();
        }
        else if ( this.hooked && (this.y > pudgeYLoc - this.yRad || this.y<0 || this.x<0 ))
        {
            this.startDying();
        }
        else if(!this.side && this.y>pudgeYLoc)
        {
            this.fighting=true;
        }
        
    }
}
AbstractEnemy.prototype.hookMove = function(xHook,yHook)
{
    if (this.hooked)
    {
        this.x=xHook;
        this.y=yHook;
    }
}
AbstractEnemy.prototype.move = function(scaleFactor)
{
    this.x+=this.xVel/(scaleFactor+0.0);
    this.y+=this.yVel/(scaleFactor+0.0);
}
AbstractEnemy.prototype.checkSpecialConditions=function(xHook,yHook)
{
    this.testMortality();
    if(!this.side && this.fighting)
    {
        this.testMortality();
        if(this.attackCD==0)
        {
            this.attackCD=this.maxAttackCD;
            return this.STATES.FIGHTING;
        }
        //cooldown is active for attack
        else
        {
            this.attackCD--;
            return this.STATES.FIGHTING_RECHARGING;
        }
    }
    //sideEnemy ran off the screen
    else if((this.side && this.xVel<0 && this.x <0) || (this.side && this.xVel> 0 && this.x > GAME_WIDTH))
    {
        //TODO fix
        this.alive=false;
        return this.STATES.SINGLE_ATTACKING;
    }
    //hooked
    else if(this.hooked)
    {
        this.hookMove(xHook,yHook);
        this.rotted=false;
        return this.STATES.HOOKED;
    }
    //rotted
    else if(this.rotted)
    {
        this.move(20);    
        return this.STATES.ROTTED;
    }
    //normal
    else
    {
        this.move(10);
        return this.STATES.NORMAL;
    }
}
AbstractEnemy.prototype.gameTick = function(xHook,yHook)
{
    var returnCode=this.STATES.NORMAL;
    this.imageTick();
    if(this.onScreen)
    {
        if(this.alive)
        {
            returnCode = this.checkSpecialConditions(xHook,yHook);
        }
        else
        {
            if(this.dieCounter<1)
            {
                this.dieCounter++;
                returnCode=this.STATES.DYING;
            }
            else
            {
                returnCode=this.STATES.DEAD;
            }
        }
    }
    else
    {
        this.x+=this.xVel/10.0;
        this.y+=this.yVel/10.0;
    
        if(this.y>0)
        {
            this.onScreen=true;
        }
    }
    return returnCode;
}
AbstractEnemy.prototype.abstractDraw= function(ctx,w,h)
{
    if(this.alive)
    {
        this.drawHPBar(ctx);
        this.drawAnimatedAvatar(ctx,this.x,this.y,w,h);  
    }
}
AbstractEnemy.prototype.drawHPBar = function(ctx)
{
    var percentage = this.hp/(this.hpMax+0.0);
    var length=this.xRad*2.7;
    
    
    ctx.fillStyle='rgb(0,0,0)';
    ctx.fillRect(this.x+this.xRad-length/2.0,this.y-this.yRad*0.23,length,GAME_HEIGHT*0.01);
    
    
    
    //    ctx.fillStyle='rgb('+red+','+green+',0)';
    ctx.fillStyle=getColor(percentage);
    
    
    length = this.xRad*2.65
    ctx.fillRect(this.x+this.xRad-length/2.0,this.y-this.yRad*0.2,length*percentage,GAME_HEIGHT*0.008);
    
    ctx.fillStyle='rgba(255,255,255,0.6)';
    ctx.fillRect(this.x+this.xRad-length/2.0,this.y-this.yRad*0.2,length*percentage,GAME_HEIGHT*0.002);
    ctx.fillStyle='rgba(0,0,0,0.4)';
    ctx.fillRect(this.x+this.xRad-length/2.0,this.y-this.yRad*0.2 + GAME_HEIGHT*0.005,length*percentage,GAME_HEIGHT*0.004);
//    ctx.fillRect(this.x-length/2.0,this.y-this.rad*1.2,le);
    
}
AbstractEnemy.prototype.getGold= function()
{
    if(this.gold==-1)
        this.gold = parseInt(this.minGold + Math.random()*(this.maxGold-this.minGold));
    return this.gold;
}
function getColor(percentage)
{
    var h=percentage*0.35;
    var s=1;
    var b=0.8;
    return hsvToRgb(h,s,b);
}
function hsvToRgb(h, s, v){
    var r, g, b;

    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    switch(i % 6){
        case 0:
            r = v, g = t, b = p;
            break;
        case 1:
            r = q, g = v, b = p;
            break;
        case 2:
            r = p, g = v, b = t;
            break;
        case 3:
            r = p, g = q, b = v;
            break;
        case 4:
            r = t, g = p, b = v;
            break;
        case 5:
            r = v, g = p, b = q;
            break;
    }

    return 'rgb('+parseInt(r * 255)+','+parseInt( g * 255)+','+ parseInt(b * 255)+')';
}

function MurlockEnemy(y)
{
    var xRad=25;
    //(frameCount,folder,x,y,xVel,yVel,xRad,yRad,hp,hpMax,exp,type,damage,minGold,maxGold)
    this.AbstractEnemy(9,MURLOCKBLUE, parseInt(xRad*1.5+Math.random() * (GAME_WIDTH-xRad*3)), y, 0,20,xRad,25,25,25,30,1,1,28,40,20);
}
copyPrototype(MurlockEnemy,AbstractEnemy);

MurlockEnemy.prototype.draw = function(ctx)
{
    this.abstractDraw(ctx,50,50);
}
function SideMurlockTestEnemy(x)
{
    var yRad=25
    //(frameCount,folder,x,y,xVel,yVel,xRad,yRad,hp,hpMax,exp,type,damage,minGold,maxGold)
    this.AbstractEnemy(9,SIDEMURLOCKTEST, x,parseInt(yRad*1.5+Math.random() * (pudgeYLoc-yRad*3)),  -20,0,yRad,yRad,25,25,30,1,1,28,40,20);
}
copyPrototype(SideMurlockTestEnemy,AbstractEnemy);

SideMurlockTestEnemy.prototype.draw = function(ctx)
{
    this.abstractDraw(ctx,50,50);
}


function CrazyMurlockEnemy(y)
{
    var xRad=25;
    this.AbstractFightingEnemy(9,MURLOCKBLUE, parseInt(xRad*1.5+Math.random() * (GAME_WIDTH-xRad*3)), y, 0,220,xRad,25,8,8,30,1,1000,28,40,20);
}
copyPrototype(CrazyMurlockEnemy,AbstractEnemy);

CrazyMurlockEnemy.prototype.draw = function(ctx)
{
    this.abstractDraw(ctx,50,50);
}


