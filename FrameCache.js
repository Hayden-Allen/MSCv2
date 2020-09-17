class FrameCache
{
  constructor(canvas)
  {
    this.frames = [];
    this.display = [];
    this.canvas = canvas;
    this.currentFrame = -1;

    this.AddFrame(canvas);

    const oldAdd = document.getElementById('buttonAddFrame');
    const newAdd = oldAdd.cloneNode(true);
    newAdd.addEventListener('click', this.AddFrame.bind(this), false);
    oldAdd.parentNode.replaceChild(newAdd, oldAdd);

    const oldDelete = document.getElementById('buttonDeleteFrame');
    const newDelete = oldDelete.cloneNode(true);
    newDelete.addEventListener('click', (e => this.RemoveFrame(e)).bind(this), false);
    oldDelete.parentNode.replaceChild(newDelete, oldDelete);

    const oldClear = document.getElementById('buttonClearFrame');
    const newClear = oldClear.cloneNode(true);
    newClear.addEventListener('click', this.ClearFrame.bind(this), false);
    oldClear.parentNode.replaceChild(newClear, oldClear);

    Tools.AddUIBR();
  }

  ClearFrame()
  {
    if(confirm('Clear the current frame? YOU CANNOT UNDO THIS.'))
    {
      this.frames[this.currentFrame] = new Frame(this.canvas.spritewidth * Constants.PIXELS_PER_SIDE, this.canvas.spriteheight * Constants.PIXELS_PER_SIDE);
      this.canvas.Draw();
    }
  }

  Destroy()
  {
    this.display.forEach(d => Constants.PREVIEW_DIV.removeChild(d));
  }

  GetCurrentFrame()
  {
    return this.frames[this.currentFrame];
  }

  SetCurrentFrame(i)
  {
    this.SelectFrame(this.currentFrame = i);
  }

  AdvanceCurrentFrame(dx)
  {
    this.currentFrame += dx;
    if(this.currentFrame < 0)
      this.currentFrame = this.frames.length - 1;
    else if(this.currentFrame >= this.frames.length)
      this.currentFrame = 0;
    this.SelectFrame(this.currentFrame);
  }

  AddFrame()
  {
    let newFrame;
    if(this.currentFrame !== -1)
      newFrame = this.GetCurrentFrame().Copy();
    else
      newFrame = new Frame(this.canvas.spritewidth * Constants.PIXELS_PER_SIDE, this.canvas.spriteheight * Constants.PIXELS_PER_SIDE)
    const index = this.currentFrame + 1;
    this.frames.splice(index, 0, newFrame);

    const button = Tools.AddUIInput(
      { type: 'image', src: this.canvas.c.toDataURL(), class: 'preview', id: index, style: `width: ${Constants.PREVIEW_SIZE}px; height: ${Constants.PREVIEW_SIZE}px;` },
      { click: (e =>
        {
          this.SetCurrentFrame(parseInt(e.target.id));
          if(this.canvas.initialized)
            this.canvas.Draw();
        }).bind(this)
      },
      { draggable: true }
    );
    this.display.splice(index, 0, Tools.InsertPreview(button, this.display[index]));
    this.display.forEach((e, i) => { e.id = i; e.click(); });
    button.click();

    return this.GetCurrentFrame();
  }

  SelectFrame(i)
  {
    if(this.display.length)
    {
      this.display.forEach(preview => preview.setAttribute('class', 'preview'));
      this.display[i].setAttribute('class', 'preview-selected');
      this.currentFrame = i;
    }
  }

  RemoveFrame(e)
  {
    if(this.frames.length === 1)
      return;

    this.frames.splice(this.currentFrame, 1);
    Constants.PREVIEW_DIV.removeChild(this.display[this.currentFrame]);
    this.display.splice(this.currentFrame, 1);

    for(var i = this.currentFrame; i < this.display.length; i++)
      this.display[i].id--;

    this.AdvanceCurrentFrame(-1);
    this.canvas.Draw();
  }

  UpdatePreview(url)
  {
    this.display[this.currentFrame].setAttribute('src', url);
  }

  Resize(w, h)
  {
    this.frames.forEach(f => f.Resize(w, h));
  }
}
