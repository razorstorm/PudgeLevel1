/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


function Dagger(x,y,clickedX,clickedY,speed,daggerImage)
{
    this.x=x;
    this.y=y;
    this.speed=speed;
    this.setUpVelocities(clickedX,clickedY);
    this.daggerImage=daggerImage;
    this.dealtDamage=false;
    this.damageCounter=0;
    this.firing=true;
    this.clickedX=clickedX;
    this.clickedY=clickedY;
    this.xImageWidth=20;
    this.yImageWidth=33;
}

Dagger.prototype.setUpVelocities = function(clickedX,clickedY)
{
    var angle = Math.atan(-(clickedY - this.y) / (0.0+clickedX-this.x));
    if(angle<0)
    {
        angle += Math.PI;
    }
    if(clickedY>this.y)
        angle-=Math.PI;
    
    this.angle=angle;
    this.xVel=this.speed * Math.cos(angle);
    this.yVel=this.speed * Math.sin(angle);
}
Dagger.prototype.gameTick = function()
{
    this.x+=this.xVel;
    this.y-=this.yVel;
    
    if(!this.firing || this.x<0 || this.x>GAME_WIDTH || this.y<0 || this.y>GAME_HEIGHT)
    {
        return false;
    }
    return true;
}
Dagger.prototype.draw = function(ctx)
{
    if(!this.dealtDamage)
    {
        var x=this.x-this.xImageWidth/2.0;
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.rotate(-this.angle + Math.PI/2.0);
        ctx.translate(-this.x, -this.y); 
        ctx.drawImage(this.daggerImage,x,this.y,20,20);
        ctx.restore();
    }
    else
    {
        if ( this.damageCounter< 10 )
        {
            ctx.save();
            ctx.textalign= 'center';
            ctx.font= 12 * GAME_WIDTH/800.0+'px Verdana';
            var textWidth = ctx.measureText(this.damageAmount).width;
            drawShadedText(ctx,[255,0,0],this.damageAmount,this.x-textWidth/2.0,this.y-this.damageCounter*3 * (GAME_WIDTH/800.0));
            ctx.restore();
            this.damageCounter++;
            this.xVel=0;
            this.yVel=0;
        }
        else
            this.firing=false;
    }
}

Dagger.prototype.damage = function(damageAmount)
{
    this.dealtDamage=true;
    this.damageAmount=damageAmount.toFixed();
}