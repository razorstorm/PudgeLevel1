function Entity(frameCount,folder)
{
    this.folder=folder;
    this.counter=0;
    this.frameCount=frameCount;
    this.animation=true;
    this.initializeImages();
}
Entity.prototype.initializeImages=function()
{
    this.images=[];
    for(var i=1;i<=this.frameCount;i++)
    {
        var image=new Image();
        image.src=this.folder+'/image'+i+'.png';
        this.images.push(image);
    }
}
Entity.prototype.imageTick = function()
{
    this.counter++;
    this.counter%=this.frameCount;
}
Entity.prototype.drawAnimatedAvatar=function(ctx,x,y,w,h)
{
    ctx.drawImage(this.images[this.counter],x,y,w,h);
}