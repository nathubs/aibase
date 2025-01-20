const width = 638;
const height = 638;
export class CanvasDraw {
  myCanvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  lineWidth: number = 6;
  isDrawing: boolean = false;
  type: string = "pen";
  constructor() {
    const dpr = window.devicePixelRatio || 1;
    const myCanvas = document.getElementById("myCanvas")! as HTMLCanvasElement;
    myCanvas.width = width;
    myCanvas.height = height;

    const ctx = myCanvas.getContext("2d")!;
    ctx.scale(dpr, dpr);
    ctx.lineWidth = 5; // 线条宽度
    ctx.lineCap = "round"; // 线条端点样式为圆形
    ctx.strokeStyle = "black"; // 线条颜色
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);
    ctx.imageSmoothingEnabled = false;

    this.ctx = ctx;
    this.myCanvas = myCanvas;

    this.initFunc();
  }

  initFunc() {
    const { myCanvas } = this;

    myCanvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
    myCanvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
    myCanvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
    myCanvas.addEventListener("mouseleave", this.handleMouseLeave.bind(this));
  }

  handleMouseDown(e: any) {
    this.isDrawing = true;
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
    ctx.lineWidth = this.lineWidth;
  }
  handleMouseMove(e: any) {
    if (this.isDrawing) {
      this.ctx.lineTo(e.offsetX, e.offsetY);
      this.ctx.stroke();
    }
  }
  handleMouseUp() {
    this.isDrawing = false;
    this.ctx.closePath();
  }
  handleMouseLeave() {
    this.isDrawing = false;
    this.ctx.closePath();
  }

  clear() {
    this.ctx.fillRect(0, 0, this.myCanvas.width, this.myCanvas.height);
  }

  export() {
    let link = document.createElement("a");
    link.href = this.myCanvas.toDataURL("image/jpg");
    link.download = "draw.jpg";
    link.click();
  }

  eraser() {
    const newType = this.type === "pen" ? "eraser" : "pen";

    this.ctx.strokeStyle = newType === "eraser" ? "#fff" : "#000";
    this.type = newType;
  }

  changeLineWidth(lineWidth: number) {
    this.lineWidth = lineWidth;
  }

  destroy() {
    this.myCanvas.removeEventListener("mousedown", this.handleMouseDown);
    this.myCanvas.removeEventListener("mousemove", this.handleMouseMove);
    this.myCanvas.removeEventListener("mouseup", this.handleMouseUp);
    this.myCanvas.removeEventListener("mouseleave", this.handleMouseLeave);
  }
}
