class Canvas
{
  constructor(c, w, h, { style = "", spsize = 5, grid = false } = {})
  {
    c.width = w * Constants.PIXELS_PER_SIDE * spsize;
    c.height = h * Constants.PIXELS_PER_SIDE * spsize;
    c.style = style;

    this.c = c;
    this.ctx = this.c.getContext("2d");

    this.preview = document.createElement('CANVAS');
    this.preview.width = c.width;
    this.preview.height = c.height;
    this.previewctx = this.preview.getContext('2d');

    this.spsize = spsize;
    this.grid = undefined;
    this.spritewidth = w;
    this.spriteheight = h;
    this.tilewidth = 1;
    this.tileheight = 1;


    this.frameCache = new FrameCache(this);
    Tools.AddUILabel('inputFrameTime', 'Time per Frame:');
    this.frameTime = Tools.AddUIInput(
      { type: 'number', id: 'inputFrameTime', value: 200, min: 0, max: 65535 },
      { change: this.UpdateFrameTime.bind(this) }
    );
    this.toggleAnimate = Tools.AddUIButton({}, { click: (e => this.ToggleAnimate()).bind(this) }, { textContent: 'Play' });
    Tools.AddUIBR();

    this.paletteCache = new PaletteCache();

    Tools.AddUILabel('inputGrid', 'Draw Grid:');
    this.toggleGrid = Tools.AddUIInput({ type: 'checkbox', id: 'inputGrid', checked: grid }, { change: this.Draw.bind(this) });
    Tools.AddUIBR();
    Tools.AddUILabel('inputGridColor', 'Grid Color:');
    this.gridColor = Tools.AddUIInput({ type: 'color', id: 'inputGridColor', value: '#000000' }, { change: this.CreateGrid.bind(this) });
    Tools.AddUIBR();
    Tools.AddUILabel('inputGridAlpha', 'Grid Opacity:');
    this.gridAlpha = Tools.AddUIInput({ type: 'range', id: 'inputGridAlpha', min: 0, max: 1, step: .001, value: 1, style: 'vertical-align: bottom;' }, { change: this.UpdateGridAlpha.bind(this, true) });
    this.gridAlphaDisplay = Tools.AddUIInput({ type: 'number', min: 0, max: 1, step: .001, value: 1 }, { change: this.UpdateGridAlpha.bind(this, false) });
    Tools.AddUIBR();
    Tools.AddUILabel('inputBackgroundColor', 'Background Color:');
    this.clearColor = Tools.AddUIInput({ type: 'color', id: 'inputBackgroundColor', value: '#ffffff' }, { change: this.Draw.bind(this) });
    Tools.AddUIBR();

    Tools.AddUILabel('inputWidth', 'Sprite (x, y):');
    Tools.AddUIInput({ type: 'number', id: 'inputWidth', min: 1, max: 256, value: w }, { change: (e => this.UpdateSize(e, 'width')).bind(this) });
    Tools.AddUIInput({ type: 'number', min: 1, max: 256, value: h }, { change: (e => this.UpdateSize(e, 'height')).bind(this) });
    Tools.AddUIBR();

    Tools.AddUILabel('inputTileWidth', 'Tile (x, y):');
    Tools.AddUIInput({ type: 'number', id: 'inputTileWidth', min: 1, max: 4, value: w }, { change: (e => this.UpdateTileSize(e, 'width')).bind(this) });
    Tools.AddUIInput({ type: 'number', min: 1, max: 4, value: w }, { change: (e => this.UpdateTileSize(e, 'height')).bind(this) });
    Tools.AddUIBR();

    Tools.AddUILabel('inputPixelSize', 'Pixel Size:');
    Tools.AddUIInput({ type: 'number', id: 'inputPixelSize', value: 20, min: 1, max: 256 }, { change: (e => this.UpdatePixelSize(e)).bind(this) });
    Tools.AddUIBR(2);


    this.CreateGrid();

    this.playing = false;
    this.lastFrameSwitch = performance.now();
    this.initialized = true;
  }

  UpdateFrameTime()
  {
    this.frameTime.value = Tools.Clamp(parseInt(this.frameTime.value), 0, 65535);
    // stop previous timer
    this.toggleAnimate.click();
    this.toggleAnimate.click();
  }

  UpdateSize(e, axis)
  {
    e.target.value = Tools.Clamp(parseInt(e.target.value), e.target.min, e.target.max);
    this['sprite' + axis] = parseInt(e.target.value);
    this.c[axis] = this.spsize * this['sprite' + axis] * this['tile' + axis] * Constants.PIXELS_PER_SIDE;
    this.preview[axis] = this.spsize * this['sprite' + axis] * Constants.PIXELS_PER_SIDE;
    this.frameCache.Resize(this.spritewidth * Constants.PIXELS_PER_SIDE, this.spriteheight * Constants.PIXELS_PER_SIDE);
    this.CreateGrid();
  }

  UpdateTileSize(e, axis)
  {
    e.target.value = Tools.Clamp(parseInt(e.target.value), e.target.min, e.target.max);
    this['tile' + axis] = parseInt(e.target.value);
    this.c[axis] = this.spsize * this['sprite' + axis] * this['tile' + axis] * Constants.PIXELS_PER_SIDE;
    this.CreateGrid();
  }

  UpdatePixelSize(e)
  {
    this.spsize = parseInt(e.target.value);

    this.c.width = this.spsize * this.spritewidth * this.tilewidth * Constants.PIXELS_PER_SIDE;
    this.c.height = this.spsize * this.spritewidth * this.tileheight * Constants.PIXELS_PER_SIDE;
    this.preview.width = this.spsize * this.spritewidth * Constants.PIXELS_PER_SIDE;
    this.preview.height = this.spsize * this.spriteheight * Constants.PIXELS_PER_SIDE;

    this.CreateGrid();
  }

  UpdateGridAlpha(fromSlider)
  {
    if(fromSlider)
      this.gridAlphaDisplay.value = this.gridAlpha.value;
    else
      this.gridAlpha.value = this.gridAlphaDisplay.value;

    this.gridAlphaDisplay.value = Tools.Clamp(parseFloat(this.gridAlphaDisplay.value), 0, 1);
    this.CreateGrid();
  }

  AdvanceCurrentFrame(dx)
  {
    this.frameCache.AdvanceCurrentFrame(dx);
    this.Draw();
  }

  GetCurrentFrame()
  {
    return this.frameCache.GetCurrentFrame();
  }

  Clear()
  {
    this.ctx.clearRect(0, 0, this.c.width, this.c.height);
    this.ctx.fillStyle = this.clearColor.value;
    this.ctx.fillRect(0, 0, this.c.width, this.c.height);
  }

  CreateGrid()
  {
    this.ctx.clearRect(0, 0, this.c.width, this.c.height);

    const color = new Color(parseInt(this.gridColor.value.substring(1), 16));
    const alpha = parseFloat(this.gridAlpha.value);

    for(var x = 0; x <= this.c.width; x += this.spsize)
      this.Line(x, 0, x, this.c.height, !(x % (this.spsize * this.spritewidth * Constants.PIXELS_PER_SIDE)) ? color.inverseHex : color.hex, alpha);
    for(var y = 0; y <= this.c.height; y += this.spsize)
      this.Line(0, y, this.c.width, y, !(y % (this.spsize * this.spriteheight * Constants.PIXELS_PER_SIDE)) ? color.inverseHex : color.hex, alpha);

    this.grid = new Image();
    this.grid.onload = () => this.Draw();
    this.grid.src = this.c.toDataURL();
  }

  Line(x1, y1, x2, y2, c, a = 1)
  {
    const alpha = this.ctx.globalAlpha;
    this.ctx.globalAlpha = a;
    this.ctx.strokeStyle = c;

    this.ctx.beginPath();
    this.ctx.moveTo(x1 + .5, y1 + .5);
    this.ctx.lineTo(x2 + .5, y2 + .5);
    this.ctx.stroke();
    this.ctx.closePath();

    this.ctx.globalAlpha = alpha;
  }

  DrawPixel(x, y, c, a = 1)
  {
    const tempAlpha = this.ctx.globalAlpha;

    this.ctx.fillStyle = c;
    this.ctx.globalAlpha = a;
    this.ctx.fillRect(x * this.spsize, y * this.spsize, this.spsize, this.spsize);

    this.ctx.globalAlpha = tempAlpha;
  }

  GetPixel(x, y)
  {
    const rx = x % (this.spritewidth * Constants.PIXELS_PER_SIDE);
    const ry = y % (this.spriteheight * Constants.PIXELS_PER_SIDE);
    return this.GetCurrentFrame().GetPixel(rx, ry);
  }

  SetPixel(mouse, v = (this.paletteCache.currentPalette ? this.paletteCache.currentPalette.selected : undefined))
  {
    const x = mouse.px % (this.spritewidth * Constants.PIXELS_PER_SIDE);
    const y = mouse.py % (this.spriteheight * Constants.PIXELS_PER_SIDE);
    if(v === undefined || this.GetCurrentFrame().GetPixel(x, y) === v)
      return;
    this.GetCurrentFrame().SetPixel(x, y, v);
    this.Draw();
  }

  FloodFill(mouse)
  {
    this.GetCurrentFrame().FloodFill(mouse.px, mouse.py, this.paletteCache.currentPalette.selected);
    this.Draw();
  }

  Draw()
  {
    this.Clear();

    const pg = this.GetCurrentFrame().grid;

    const palette = this.paletteCache.currentPalette;
    if(pg.height > this.spriteheight * Constants.PIXELS_PER_SIDE || pg.width > this.spritewidth * Constants.PIXELS_PER_SIDE)
      console.log(`PixelGrid dimensions (${pg.width}, ${pg.height}) incompatible with Canvas dimensions (${this.spritewidth}, ${this.spriteheight})`);

    for(var y = 0; y < pg.height; y++)
    {
      for(var x = 0; x < pg.width; x++)
      {
        const cur = pg.grid[y][x];
        if(cur != Constants.COLOR_CLEAR)
          for(var tx = 0; tx < this.tilewidth; tx++)
            for(var ty = 0; ty < this.tileheight; ty++)
              this.DrawPixel(x + this.spritewidth * Constants.PIXELS_PER_SIDE * tx, y + this.spriteheight * Constants.PIXELS_PER_SIDE * ty, palette.At(cur).hex);
      }
    }

    let img = new Image();
    img.onload = ((i) =>
    {
      this.previewctx.drawImage(
        i,
        0, 0, this.spsize * Constants.PIXELS_PER_SIDE, this.spsize * Constants.PIXELS_PER_SIDE,
        0, 0, this.preview.width, this.preview.height
      );
      this.frameCache.UpdatePreview(this.preview.toDataURL());
    }).bind(this, img);
    img.src = this.c.toDataURL();


    if(this.toggleGrid.checked)
    {
      const alpha = this.ctx.globalAlpha;
      this.ctx.globalAlpha = parseFloat(this.gridAlpha.value);
      this.ctx.drawImage(this.grid, 0, 0);
      this.ctx.globalAlpha = alpha;
    }
  }

  ToggleAnimate()
  {
    this.playing = !this.playing;
    this.toggleAnimate.textContent = (this.playing ? 'Pause' : 'Play');
    this.Animate();
  }

  ToggleGrid()
  {
    this.toggleGrid.click();
  }

  async Animate()
  {
    if(this.playing)
    {
      this.lastFrameSwitch = performance.now;
      this.frameCache.AdvanceCurrentFrame(1);
      this.Draw();
      await Tools.Sleep(parseInt(this.frameTime.value));
      this.Animate();
    }
  }
}
