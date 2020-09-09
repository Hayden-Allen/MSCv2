class Palette
{
  constructor(name, colors)
  {
    if(colors.length != Constants.NUM_COLORS)
      console.log(`Invalid Palette length ${colors.length}`);

    this.name = name;
    this.colors = colors;
    this.selected = 0;
  }

  At(i)
  {
    if(i < 0 || i >= this.colors.length)
      console.log(`Invalid Palette index ${i}`);
    return this.colors[i];
  }
  Select(i)
  {
      if(i < 0 || i >= this.colors.length)
        console.log(`Invalid Palette index ${i}`);
      return this.selected = this.colors[i];
  }
}
