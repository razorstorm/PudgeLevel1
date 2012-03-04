/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function Level(pudge,enemies)
{
    this.pudge=pudge;
    this.originalEnemies=enemies;
    this.enemies=this.cloneEnemies(enemies);
    this.onScreenEnemies=[];
    this.levelEndCounter=0;
    this.levelEnded=false;
    this.animatedDrawers=[];
}
Level.prototype.cloneEnemies=function(enemiesList)
{
    var newEnemiesList=[];
    for ( var i in enemiesList)
    {
        var enemy={};
        $.extend(true, enemy,enemiesList[i]);
        newEnemiesList.push(enemy);
    }
    return newEnemiesList;
}
Level.prototype.reset=function()
{
    this.onScreenEnemies=[];
    this.levelEnded=false;
    this.levelEndCounter=0;
    this.enemies=this.cloneEnemies(this.originalEnemies);
}
Level.prototype.processOnScreenEnemy = function(ctx,enemy,i)
{
    var x=-1,y=-1;
    if(this.pudge.firingHook)
    {
        var hookLoc=this.pudge.getHookLocation();
        x=hookLoc[0];
        y=hookLoc[1];
        if(!enemy.hooked)
        {
            enemy.hook(x,y,this.pudge.getHookAoe());
        }
        else
        {
            hookLoc=this.pudge.getGraphicalHookLocation();
            x=hookLoc[0];
            y=hookLoc[1];
        }
    }
    //pudge is firing some daggers
    if(this.pudge.daggers.length>0)
    {
        if(!enemy.hooked)
        {
            enemy.attack(this.pudge.daggers,this.pudge.getAoe(),this.pudge.getDamage());
        }
    }
            
    enemy.rotted=false;
    if(this.pudge.rotting)
    {
        if(enemy.y>= (pudgeYLoc - this.pudge.threshold ))
        {
            enemy.rotted=true;
        }
    }
            
    var enemyStatus = enemy.gameTick(x,y);
            
    switch(enemyStatus)
    {
        case enemy.STATES.DYING:
            this.doEnemyDeathTimeDown(enemy);
        case enemy.STATES.ROTTING:
            enemy.hp-=this.pudge.getRotDamage();
            break;
        case enemy.STATES.DEAD:
            this.pudge.getExp(enemy.exp);
            this.pudge.getGold(enemy.getGold());
            if(enemy.hooked)
            {
                this.pudge.addHp(enemy.hpGiven);
            }
            this.onScreenEnemies.splice(i,1);
            break;
        case enemy.STATES.FIGHTING:
            this.pudgeTakeDamage(enemy.damage);
            break;
        case enemy.STATES.FIGHTING_RECHARGING:
            break;
        case enemy.STATES.SINGLE_ATTACKING:
            this.pudgeTakeDamage(enemy.damage);
            this.onScreenEnemies.splice(i,1);
            break;
    }
}
Level.prototype.gameTick=function(ctx)
{
    if(this.levelEnded)
    {
        if(this.levelEndCounter<20)
            this.levelEndCounter++;
        else
            return true;
    }
    else
    {
        if(this.enemies.length==0 && this.onScreenEnemies.length==0)
        {
            this.levelEnded=true;
        }
        for (var i in this.enemies)
        {
            var enemy=this.enemies[i];
            enemy.gameTick();
            if(enemy.onScreen)
            {
                this.enemies.splice(i,1);
                this.onScreenEnemies.push(enemy);
            }
        }
        for(i in this.onScreenEnemies)
        {
            enemy=this.onScreenEnemies[i];
            this.processOnScreenEnemy(ctx,enemy,i);
        }
        this.draw(ctx);
    }
    return false;
}
Level.prototype.pudgeTakeDamage = function(damage)
{
    var damageDrawer = new AnimatedDrawer(20,3, 
        GAME_WIDTH*0.11,
        imageTop+GAME_WIDTH*0.14,
        '- '+damage+' hp!',
        [200,0,0],
        15 * GAME_WIDTH/800.0+'px Verdana');             
    this.animatedDrawers.push(damageDrawer);
    
    this.pudge.takeDamage(damage);
}
Level.prototype.doEnemyDeathTimeDown=function(enemy)
{
    var expDrawer = new AnimatedDrawer(20,3, 
        GAME_WIDTH/2.0,
        pudgeYLoc,
        '+ '+enemy.exp+' EXP!'
        ,[200,150,0],
        20 * GAME_WIDTH/800.0+'px Verdana');
    this.animatedDrawers.push(expDrawer);
                    
                    
    var goldDrawer = new AnimatedDrawer(20,3, 
        GAME_WIDTH/0.11,
        imageTop+GAME_WIDTH*0.04,
        '+ '+enemy.getGold()+' gold!',
        [200,200,0],
        15 * GAME_WIDTH/800.0+'px Verdana');             
    this.animatedDrawers.push(goldDrawer);
                    
                            
    if(enemy.hooked && enemy.hpGiven!=0)
    {
        var hookDrawer = new AnimatedDrawer(20,3, GAME_WIDTH*0.11,imageTop+GAME_WIDTH*0.14,'+ '+enemy.hpGiven+' hp!',[0,200,0],15 * GAME_WIDTH/800.0+'px Verdana');
        this.animatedDrawers.push(hookDrawer);
    }
}
Level.prototype.draw=function(ctx)
{
    for(var i in this.onScreenEnemies)
    {
        var enemy=this.onScreenEnemies[i];
        enemy.draw(ctx);
    }
    for(var i in this.animatedDrawers)
    {
        var animatedDrawer = this.animatedDrawers[i];
        if(animatedDrawer.draw(ctx))
        {
            this.animatedDrawers.splice(i,1);
        }
    }
}
