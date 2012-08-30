/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


function HookChain(x,y,clickedX,clickedY,speed,daggerImage)
{
    this.startX=x;
    this.startY=y;
    this.x=this.startX;
    this.y=this.startY;
    this.speed=speed;
    this.setUpVelocities(clickedX,clickedY);
    this.daggerImage=daggerImage;
    this.length=20;
    this.firing=true;
    this.chainLinks=[];
}

HookChain.prototype.setUpVelocities = function(clickedX,clickedY)
{
    this.clickedX=clickedX;
    this.clickedY=clickedY;
    
    var angle = Math.atan(-(clickedY - this.startY) / (0.0+clickedX-this.startX));
    if(angle<0)
    {
        angle += Math.PI;
    }
    this.angle=angle;
    this.xVel=this.speed * Math.cos(angle);
    this.yVel=this.speed * Math.sin(angle);
}
HookChain.prototype.gameTick = function()
{
    this.calculateChains();
    this.changeXY();
    return this.firing;
}
HookChain.prototype.draw = function(ctx)
{
    for(var index in this.chainLinks)
    {
        var dagger=this.chainLinks[index];
        dagger.draw(ctx);
    }
}

HookChain.prototype.getLocation=function()
{
    return [this.x,this.y];
}

//returns the x and y of the last chain on the screen
HookChain.prototype.getGraphicalLocation=function()
{
    var lastChain = this.chainLinks[this.chainLinks.length-1];
    return [lastChain.x,lastChain.y];
}


HookChain.prototype.calculateChains = function()
{
    if(this.clickedX != this.startX && this.clickedY!=this.startY)
    {
        var length=this.distance( this.x, this.y, this.startX, this.startY );
        while ( length / this.length > this.chainLinks.length  )
        {
            var newX;
            var prevX;
            var newY;
            var prevY;

            if ( this.chainLinks.length == 0 )
            {
                prevX = this.startX;
                prevY = this.startY;
            }
            else
            {
                prevX = this.chainLinks[this.chainLinks.length-1].x;
                prevY = this.chainLinks[this.chainLinks.length-1].y;
            }

            newX = prevX + this.length* Math.cos( this.angle );
            newY = prevY - this.length * Math.sin( this.angle );
            this.chainLinks.push( new ChainLink( newX, newY, this.angle, this.daggerImage ) );
            length = this.distance( this.x, this.y, this.startX, this.startY );
        }
    }
    if(this.clickedX == this.startX && this.clickedY==this.startY)
    {
        length=this.distance( this.x, this.y, this.clickedX, this.clickedY );
        while ( length / this.length < this.chainLinks.length  )
        {
            //remove one
            this.chainLinks.splice(this.chainLinks.length-1,1);
            length = this.distance( this.x, this.y, this.clickedX, this.clickedY );
        }
    }
}
HookChain.prototype.changeXY=function()
{
    if ( this.clickedX == this.startX && this.clickedY == this.startY )
    {
        this.x -= 4 * this.speed * Math.cos( this.angle );
        this.y += 4 * this.speed * Math.sin( this.angle );
    }
    else if ( this.y>this.clickedY )
    {
        this.x += this.speed * Math.cos( this.angle );
        this.y -= this.speed * Math.sin( this.angle );
    }
    else if ( this.y<=this.clickedY )
    {
        this.clickedX = this.startX;
        this.clickedY = this.startY;
    }
    if ( this.y > this.startY )
    {
        //        $('#console').append('yes');
        this.firing = false;
    }
}

HookChain.prototype.distance = function(x1,y1,x2,y2)
{
    return Math.sqrt( ( x1 - x2 ) * ( x1 - x2 ) + ( y1 - y2 ) * ( y1 - y2 ) );
}

function ChainLink(x,y,angle,image)
{
    this.x=x;
    this.y=y;
    this.angle=angle;
    this.image=image;
}

ChainLink.prototype.draw=function(ctx)
{
    ctx.save();
    ctx.translate(this.x,this.y);
    ctx.rotate(-this.angle + Math.PI/2.0);
    ctx.translate(-this.x, -this.y); 
    ctx.drawImage(this.image,this.x,this.y,20,20);
    ctx.restore();
}