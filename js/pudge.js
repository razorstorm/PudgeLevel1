

function Pudge()
{
    this.level=1;
    this.setStats();
    this.hp=this.hpMax;
    this.mp=this.mpMax;
    this.gold=800;
    this.imageRatio=0.8855421686746988;
    this.imageW= parseInt(GAME_WIDTH*0.20);
    this.imageH= this.imageW*this.imageRatio;
    this.imageLoaded=false;
    this.setImage();
    this.yLoc=pudgeYLoc;
    this.daggerCD=0;
    this.hookCD=0;
    this.daggers=[];
    this.setupDaggerImage();
    this.firingHook=false;
    this.statusPanel=new Status();
    this.maxLevelBeaten=0;
    this.gold=0;
    this.exp=0;
    this.savedState=undefined;
    this.isDead=false;
    this.saveState();
    this.skillsList=['hook'];
    this.rotting=false;
    this.threshold = GAME_HEIGHT*0.4
}

Pudge.prototype.getRotDamage = function()
{
    return 0.3;
//todo
}
Pudge.prototype.rot = function()
{
    this.rotting=!this.rotting;
}
Pudge.prototype.newLevel=function()
{
    this.maxLevelBeaten++;
    this.hp=this.hpMax;
    this.mp=this.mpMax;
    this.saveState();
}
//Pudge.prototype=new Entity();
Pudge.prototype.saveState=function()
{
 
    this.savedState={
        'level':this.level,
        'gold':this.gold,
        'exp':this.exp,
    };
}
Pudge.prototype.die = function()
{
    this.isDead=true;
}
Pudge.prototype.respawn= function()
{
    this.hp=this.hpMax;
    this.mp=this.mpMax;
    this.rotting=false;
    this.isDead=false;
    this.restoreState();
}
Pudge.prototype.restoreState=function()
{
    this.hookCD=0;
    this.daggerCD=0;
    this.daggers=[];
    this.firingHook=false;
    this.level=this.savedState['level'];
    this.gold=this.savedState['gold'];
    this.exp=this.savedState['exp'];
    this.setStats();
}
Pudge.prototype.setupDaggerImage= function()
{
    this.daggerImage = new Image();
    this.daggerImage.src=LINK;
}
Pudge.prototype.getGraphicalHookLocation=function()
{
    if(this.firingHook)
    {
        return this.hookChain.getGraphicalLocation();
    }
    return [-1,-1];
}
Pudge.prototype.getHookLocation= function()
{
    if(this.firingHook)
    {
        return this.hookChain.getLocation();
    }
    return [-1,-1];
}
Pudge.prototype.getHookAoe=function()
{
    return this.hookStats[3] + this.additionalHookAoe;
}
Pudge.prototype.getDamage = function()
{
    return Math.random()*(this.getMaxDamage()-this.getMinDamage()) + this.getMinDamage();
}
Pudge.prototype.getAoe=function()
{
    return this.weaponStats[4]+this.additionalAoe;
}
Pudge.prototype.setImage = function ()
{
    this.avatar = new Image();
    this.avatar.onload=function(){
        this.imageLoaded=true;
    };
    this.avatar.src=PUDGE;
}
Pudge.prototype.doArmorReductions=function(damage)
{
    if(this.getArmor()>0)
        return (1 - ( 1/ (1 + (this.getArmor() * 0.06)))) * damage;
    else
        return (1 - 0.94 ^ (-this.getArmor())) * damage;
}
Pudge.prototype.fire=function(x,y)
{
    if(this.daggerCD==0)
    {
        var dagger = new Dagger(GAME_WIDTH/2.0,this.yLoc,x,y,this.weaponStats[3],this.daggerImage);
        this.daggers.push(dagger);

        this.daggerCD=this.weaponStats[2];
    }
}
Pudge.prototype.hook=function(x,y)
{
    if(this.hookCD==0 && this.checkHookMP() && !this.firingHook)
    {
        this.firingHook=true;
        this.hookCD=this.hookStats[1];
        this.hookChain=new HookChain(GAME_WIDTH/2.0,this.yLoc,x,y,this.hookStats[2],this.daggerImage);
    }
}
Pudge.prototype.hasMPToHook=function()
{
    return this.mp>=this.getHookMpCost();
}
Pudge.prototype.checkHookMP=function()
{
    if(this.hasMPToHook())
    {
        this.mp-=this.getHookMpCost();
        return true;
    }
    return false
}
Pudge.prototype.getExp= function(exp)
{
    this.exp+=exp;
    this.checkLevelUp();
}
Pudge.prototype.getGold= function(gold)
{
    this.gold += gold;
}

Pudge.prototype.checkLevelUp=function()
{
    if(this.exp>=this.expRequirements[this.level])
    {
        this.level++;
        this.exp=0;

        this.setStats();
        
        this.checkLevelUp();
    }
}
Pudge.prototype.addHp=function(hp)
{
    if(this.hp+hp <= this.hpMax)
    {
        this.hp+=hp;
    }
}
Pudge.prototype.takeDamage=function(damage)
{
    this.hp-=damage;
    this.checkDeath();
}
Pudge.prototype.checkDeath = function()
{
    if(this.hp<=0)
    {
        this.die();
    }
}
Pudge.prototype.drawIntro = function(ctx)
{
    var imageW=this.imageW*2;
    var imageH=this.imageH*2;
    var xLoc=GAME_WIDTH/2.0 - imageW/2.0;
    var yLoc=this.yLoc-imageH/2.0;
    ctx.drawImage(this.avatar,xLoc,yLoc,imageW,imageH);
}
Pudge.prototype.gameTick=function(ctx)
{
    if(this.isDead)
    {
        this.drawAvatar(ctx);   
        return true;
    }
    
    if(this.rotting)
    {
        this.takeDamage(this.getRotDamage());
    }
    
    if(this.daggerCD>0)
        this.daggerCD--;
    if(this.hookCD>0)
        this.hookCD--;
    if(this.mp<this.mpMax)
        this.mp+=this.mpRegen;
    if(this.hp<this.hpMax)
        this.hp+=this.hpRegen;
    
    if(this.firingHook)
    {
        this.firingHook=this.hookChain.gameTick();
    }
    else
    {
        this.hookChain=null;
    }
    
    for (var index in this.daggers)
    {
        dagger=this.daggers[index];
        var exists= dagger.gameTick();
        if(!exists)
        {
            //splice off the dagger
            this.daggers.splice(index,1);
        }
    }
    
    this.draw(ctx);
    
    return false;
}
Pudge.prototype.draw=function(ctx)
{
    if(this.firingHook)
        this.hookChain.draw(ctx);

    
    for (var index in this.daggers)
    {
        dagger=this.daggers[index];
        dagger.draw(ctx);
    }
    
    this.statusPanel.drawStatusPanel(ctx,this);
    this.drawAvatar(ctx);
    
    
}
Pudge.prototype.drawAvatar=function(ctx)
{
    var xLoc=GAME_WIDTH/2.0 - this.imageW/2.0;
    var yLoc=this.yLoc-this.imageH/2.0;
    var imageW=this.imageW;
    var imageH=this.imageH;
    ctx.drawImage(this.avatar,xLoc,yLoc,imageW,imageH);
}
Pudge.prototype.getHookMpCost=function()
{
    switch(this.hookStats[0])
    {
        case 1:
            return 140;
        default:
            return -1;
    }
}
Pudge.prototype.getArmor=function()
{
    return this.baseArmor + this.additionalArmor;
}
Pudge.prototype.getMP=function()
{
    return parseInt(this.mp);
}
Pudge.prototype.getHP=function()
{
    return parseInt(this.hp);
}
Pudge.prototype.getDaggerTotalCD=function()
{
    return this.weaponStats[2];
}
Pudge.prototype.getHookTotalCD=function()
{
    return this.hookStats[1];
}
Pudge.prototype.getStr=function()
{
    return this.baseStr+this.additionalStr;
}
Pudge.prototype.getIntel=function()
{
    return this.baseIntel+this.additionalIntel;
}
Pudge.prototype.getAgi=function()
{
    return this.baseAgi+this.additionalAgi;
}
Pudge.prototype.getMinDamage=function()
{
    return this.weaponStats[0]+this.additionalDamage;
}
Pudge.prototype.getMaxDamage=function()
{
    return this.weaponStats[1]+this.additionalDamage;
}
Pudge.prototype.setStats = function ()
{
    this.baseStr=3+this.level*2;
    this.baseAgi=1+this.level*1;
    this.baseIntel=2+this.level*1;
    this.additionalStr=0;
    this.additionalAgi=0;
    this.additionalIntel=0;
    
    this.baseWeaponStats = [ 2, 10, 10 ];
    // min damage, max damage, reload time, fire speed, aoe.
    this.weaponStats = [ 2, 10, 20, 30, 2 ];
    this.weaponStats[0] = parseInt(this.baseWeaponStats[0]+this.baseAgi);
    this.weaponStats[1] = parseInt(this.baseWeaponStats[1]+this.baseStr);
    this.weaponStats[2] = parseInt(this.baseWeaponStats[2]-this.getAgi()/20.0);
    
    this.additionalAoe=0;
    
    this.additionalDamage = this.additionalStr;
    
    // hook type, reload time, fire speed, aoe
    this.hookStats= [ 1, 100, 30, 10 ];
    this.additionalHookAoe=0;

    this.baseArmor=2+this.getAgi()*0.1;
    this.additionalArmor=this.additionalAgi*0.1;
    
    if(this.level>1)
    {
        var percentageHp = this.hp/(this.hpMax+0.0)
        var percentageMp = this.mp/(this.mpMax+0.0)
    }
        
    
    this.mpMax = parseInt(290+this.getIntel() * 20);
    this.mpRegen = 0.02 + this.getIntel()*0.02;
    this.hpMax = parseInt(200+this.getStr()*10);
    this.hpRegen = 0.001+ this.getStr()*0.002;
    
    if(this.level>1)
    {
        this.hp=this.hpMax*percentageHp;
        this.mp=this.mpMax*percentageMp;
    }
    else
    {
        this.hp=this.hpMax;
        this.mp=this.mpMax;
    }
    
    this.expRequirements=[];
    this.expRequirements[0]=0
    for ( var i = 1; i < 50; i++ )
    {
        this.expRequirements[i] = parseInt( 100 * Math.pow( 1.5, i-2 ) );
    }
};