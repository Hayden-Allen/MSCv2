class PixelGrid
{
  constructor(w, h)
  {
    this.grid = Tools.Arr2d(w, h, Constants.COLOR_CLEAR);
    this.width = w;
    this.height = h;
  }

  InBounds(x, y)
  {
    return (y > 0 && y < this.height && x > 0 && x < this.width);
  }

  Clear()
  {
    this.grid = Tools.Arr2d(w, h, Constants.COLOR_CLEAR);
  }

  Resize(w, h)
  {
    let temp = Tools.Arr2d(w, h, Constants.COLOR_CLEAR);

    for(var y = 0; y < Math.min(h, this.height); y++)
      for(var x = 0; x < Math.min(w, this.width); x++)
        temp[y][x] = this.grid[y][x];

    this.width = w;
    this.height = h;
    this.grid = temp;
  }
}
