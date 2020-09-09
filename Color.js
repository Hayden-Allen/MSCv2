class Color
{
  constructor(uint)
  {
    Constants.CreateConst(this, 'uint', uint);
    Constants.CreateConst(this, 'hex', this.Hex(uint));

    const r = uint & 0xff0000;
    const g = uint & 0xff00;
    const b = uint & 0xff;
    const inverse = (0xff0000 - r) | (0xff00 - g) | (0xff - b);

    Constants.CreateConst(this, 'inverse', inverse);
    Constants.CreateConst(this, 'inverseHex', this.Hex(inverse));
  }

  Hex(x)
  {
    let s = x.toString(16).toUpperCase();
    while(s.length < 6)
      s = '0' + s;
    return '#' + s;
  }
}
