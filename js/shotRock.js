var Helpers;
(function (Helpers) {
    var CartesianPoint = (function () {
        function CartesianPoint(x, y) {
            this.x = x;
            this.y = y;
        }
        Object.defineProperty(CartesianPoint.prototype, "X", {
            get: function () {
                return this.x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CartesianPoint.prototype, "Y", {
            get: function () {
                return this.y;
            },
            enumerable: true,
            configurable: true
        });
        return CartesianPoint;
    }());
    Helpers.CartesianPoint = CartesianPoint;
})(Helpers || (Helpers = {}));
var View;
(function (View) {
    var ArrowView = (function () {
        function ArrowView(canvasElement) {
            this.points = new Array();
            this.color = "#3366ff";
            this.lineWidth = 5;
            this.renderingContext = (canvasElement).getContext('2d');
        }
        ArrowView.prototype.AddPoint = function (x, y) {
            this.points.push(new Helpers.CartesianPoint(x, y));
        };
        ArrowView.prototype.Paint = function () {
            if (this.points.length < 2) {
                return;
            }
            var originalLine = this.renderingContext.lineWidth;
            this.renderingContext.beginPath();
            this.renderingContext.strokeStyle = this.color;
            this.renderingContext.lineWidth = this.lineWidth;
            this.renderingContext.moveTo(this.points[0].X, this.points[0].Y);
            var self = this;
            this.points.forEach(function (point) {
                self.renderingContext.lineTo(point.X, point.Y);
            });
            this.renderingContext.stroke();
            this.renderingContext.lineWidth = originalLine;
        };
        return ArrowView;
    }());
    View.ArrowView = ArrowView;
})(View || (View = {}));
var View;
(function (View) {
    var StoneView = (function () {
        function StoneView(sheet, stone) {
            this.sheet = sheet;
            this.stone = stone;
            this.color = "red";
            this.strokeColor = "black";
        }
        Object.defineProperty(StoneView.prototype, "Stone", {
            get: function () {
                return this.stone;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StoneView.prototype, "PositionOnCanvas", {
            get: function () {
                var point = Helpers.CoordinateSystems.ToCartesian(new Helpers.PolarPoint(this.stone.Position.Angle, this.stone.Position.Radius * this.sheet.HouseRadius));
                return new Helpers.CartesianPoint(point.X + this.sheet.HouseCenterX, point.Y + this.sheet.HouseCenterY);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StoneView.prototype, "PaintedRadius", {
            get: function () {
                return (1 / 12) * this.sheet.HouseRadius;
            },
            enumerable: true,
            configurable: true
        });
        StoneView.prototype.Paint = function () {
            var originalLine = this.sheet.RenderingContext.lineWidth;
            this.sheet.RenderingContext.beginPath();
            this.sheet.RenderingContext.fillStyle = this.color;
            this.sheet.RenderingContext.strokeStyle = this.strokeColor;
            this.sheet.RenderingContext.lineWidth = 2;
            this.sheet.RenderingContext.arc(this.PositionOnCanvas.X, this.PositionOnCanvas.Y, this.PaintedRadius, 0, 2 * Math.PI);
            this.sheet.RenderingContext.fill();
            this.sheet.RenderingContext.stroke();
            this.sheet.RenderingContext.closePath();
            this.sheet.RenderingContext.lineWidth = originalLine;
        };
        StoneView.prototype.ToggleColor = function () {
            if (this.color === "red") {
                this.color = "yellow";
                return;
            }
            this.color = "red";
        };
        StoneView.prototype.IsHit = function (x, y) {
            var centeredX = x - this.PositionOnCanvas.X;
            var centeredY = y - this.PositionOnCanvas.Y;
            return centeredX * centeredX + centeredY * centeredY < Math.pow(this.PaintedRadius, 2);
        };
        return StoneView;
    }());
    View.StoneView = StoneView;
})(View || (View = {}));
var Helpers;
(function (Helpers) {
    var PolarPoint = (function () {
        function PolarPoint(angle, radius) {
            this.angle = angle;
            this.radius = radius;
        }
        Object.defineProperty(PolarPoint.prototype, "Angle", {
            get: function () {
                return this.angle;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PolarPoint.prototype, "Radius", {
            get: function () {
                return this.radius;
            },
            enumerable: true,
            configurable: true
        });
        return PolarPoint;
    }());
    Helpers.PolarPoint = PolarPoint;
})(Helpers || (Helpers = {}));
var Helpers;
(function (Helpers) {
    var CoordinateSystems = (function () {
        function CoordinateSystems() {
        }
        CoordinateSystems.ToPolar = function (x, y) {
            return new Helpers.PolarPoint(Math.atan(y / x) + (x < 0 ? Math.PI : (y < 0 ? 2 * Math.PI : 0)), Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
        };
        CoordinateSystems.ToCartesian = function (polarPoint) {
            return new Helpers.CartesianPoint(polarPoint.Radius * Math.cos(polarPoint.Angle), polarPoint.Radius * Math.sin(polarPoint.Angle));
        };
        return CoordinateSystems;
    }());
    Helpers.CoordinateSystems = CoordinateSystems;
})(Helpers || (Helpers = {}));
var ViewModel;
(function (ViewModel) {
    var StoneModel = (function () {
        function StoneModel(point) {
            this.Place(point);
        }
        Object.defineProperty(StoneModel.prototype, "Position", {
            get: function () {
                return this.point;
            },
            enumerable: true,
            configurable: true
        });
        StoneModel.prototype.Place = function (point) {
            this.point = point;
        };
        return StoneModel;
    }());
    ViewModel.StoneModel = StoneModel;
})(ViewModel || (ViewModel = {}));
var ViewModel;
(function (ViewModel) {
    var SheetModel = (function () {
        function SheetModel() {
            this.stoneAddedHandlers = [];
            this.stones = new Array();
        }
        SheetModel.prototype.AddStone = function (location) {
            var newStone = new ViewModel.StoneModel(location);
            this.stones.push(newStone);
            this.NotifyStoneAdded(newStone);
        };
        SheetModel.prototype.SubscribeToStoneAdded = function (value) {
            this.stoneAddedHandlers.push(value);
        };
        SheetModel.prototype.UnsubscribeFromStoneAdded = function (value) {
            this.stoneAddedHandlers = this.stoneAddedHandlers.filter(function (handler) { return handler !== value; });
        };
        SheetModel.prototype.NotifyStoneAdded = function (stone) {
            if (this.stoneAddedHandlers) {
                this.stoneAddedHandlers.slice(0).forEach(function (handler) { return handler(stone); });
            }
        };
        return SheetModel;
    }());
    ViewModel.SheetModel = SheetModel;
})(ViewModel || (ViewModel = {}));
var View;
(function (View) {
    var SheetView = (function () {
        function SheetView(canvasElement, sheetModel) {
            this.stones = new Array();
            this.arrows = new Array();
            this.canvasElement = canvasElement;
            this.sheetModel = sheetModel;
            this.renderingContext = (canvasElement).getContext('2d');
            var self = this;
            sheetModel.SubscribeToStoneAdded(function (stone) {
                self.stones.push(new View.StoneView(self, stone));
                self.invalid = true;
            });
            this.invalid = true;
        }
        Object.defineProperty(SheetView.prototype, "HouseCenterX", {
            get: function () {
                return this.canvasElement.width / 2;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SheetView.prototype, "HouseCenterY", {
            get: function () {
                return this.canvasElement.height / 4;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SheetView.prototype, "HouseRadius", {
            get: function () {
                return Math.min(this.canvasElement.width, this.canvasElement.height / 2) / 2 - 1;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SheetView.prototype, "RenderingContext", {
            get: function () {
                return this.renderingContext;
            },
            enumerable: true,
            configurable: true
        });
        SheetView.prototype.OnMouseDown = function (x, y) {
            this.mouseDown = true;
            var foundStoneView = this.FindHitStone(x, y);
            if (!foundStoneView) {
                return;
            }
            this.movingStone = foundStoneView.Stone;
        };
        SheetView.prototype.OnMouseMove = function (x, y) {
            if (!this.mouseDown) {
                return;
            }
            if (!this.movingStone) {
                if (this.currentArrow == null) {
                    this.currentArrow = new View.ArrowView(this.canvasElement);
                    this.arrows.push(this.currentArrow);
                }
                this.currentArrow.AddPoint(x, y);
                this.currentArrow.Paint();
                return;
            }
            this.movingStone.Place(this.ToSheetCoordinates(x, y));
            this.Invalidate();
        };
        SheetView.prototype.OnMouseUp = function (x, y) {
            this.currentArrow = null;
            this.movingStone = null;
            this.mouseDown = false;
            var hitStone = this.FindHitStone(x, y);
            if (hitStone) {
                hitStone.ToggleColor();
                this.Invalidate();
                return;
            }
            this.sheetModel.AddStone(this.ToSheetCoordinates(x, y));
        };
        SheetView.prototype.Paint = function () {
            if (!this.invalid && !this.movingStone) {
                return;
            }
            this.renderingContext.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
            this.DrawBorder();
            this.DrawRings();
            this.DrawTLine();
            this.DrawCenterLine();
            this.PaintStones();
            this.PaintArrows();
            this.invalid = false;
        };
        SheetView.prototype.Invalidate = function () {
            this.invalid = true;
            var desiredWidth = this.HouseRadius * 2 + 100;
            if (this.canvasElement.width !== desiredWidth) {
                this.canvasElement.width = desiredWidth;
            }
        };
        SheetView.prototype.PrepareExport = function () {
            this.renderingContext.font = "15px Arial";
            this.renderingContext.fillStyle = "blue";
            var text = "http://dpbackes.github.io/ShotRock";
            var textSize = this.renderingContext.measureText(text);
            this.renderingContext.fillText(text, this.canvasElement.width - textSize.width - 5, this.canvasElement.height - 5);
        };
        SheetView.prototype.FindHitStone = function (x, y) {
            var foundStone = null;
            this.stones.some(function (stoneView) {
                if (stoneView.IsHit(x, y)) {
                    foundStone = stoneView;
                    return true;
                }
            });
            return foundStone;
        };
        SheetView.prototype.ToSheetCoordinates = function (x, y) {
            x = x - this.HouseCenterX;
            y = y - this.HouseCenterY;
            var polarCoord = Helpers.CoordinateSystems.ToPolar(x, y);
            return new Helpers.PolarPoint(polarCoord.Angle, polarCoord.Radius / this.HouseRadius);
        };
        SheetView.prototype.DrawBorder = function () {
            this.renderingContext.strokeRect(0, 0, this.canvasElement.width, this.canvasElement.height);
        };
        SheetView.prototype.DrawRings = function () {
            var x = this.canvasElement.width / 2;
            var y = this.canvasElement.height / 4;
            this.PaintRing(x, y, this.HouseRadius, "blue");
            this.PaintRing(x, y, (8 / 12) * this.HouseRadius, "white");
            this.PaintRing(x, y, (4 / 12) * this.HouseRadius, "red");
            this.PaintRing(x, y, (1 / 12) * this.HouseRadius, "white");
            this.PaintStones();
        };
        SheetView.prototype.DrawTLine = function () {
            var y = this.canvasElement.height / 4;
            var width = this.canvasElement.width;
            this.renderingContext.beginPath();
            this.renderingContext.strokeStyle = "black";
            this.renderingContext.moveTo(0, y);
            this.renderingContext.lineTo(width, y);
            this.renderingContext.stroke();
            this.renderingContext.closePath();
        };
        SheetView.prototype.DrawCenterLine = function () {
            var x = this.canvasElement.width / 2;
            var height = this.canvasElement.height;
            this.renderingContext.beginPath();
            this.renderingContext.strokeStyle = "black";
            this.renderingContext.moveTo(x, 0);
            this.renderingContext.lineTo(x, height);
            this.renderingContext.stroke();
            this.renderingContext.closePath();
        };
        SheetView.prototype.PaintRing = function (x, y, radius, color) {
            this.renderingContext.beginPath();
            this.renderingContext.arc(x, y, radius, 0, 2 * Math.PI);
            this.renderingContext.fillStyle = color;
            this.renderingContext.fill();
            this.renderingContext.closePath();
        };
        SheetView.prototype.PaintStones = function () {
            this.stones.forEach(function (stone) { return stone.Paint(); });
        };
        SheetView.prototype.PaintArrows = function () {
            this.arrows.forEach(function (arrow) { return arrow.Paint(); });
        };
        return SheetView;
    }());
    View.SheetView = SheetView;
})(View || (View = {}));
var sheetView;
window.onload = function () {
    var sheetCanvas = document.getElementById("mainSheet");
    var sheetModel = new ViewModel.SheetModel();
    sheetView = new View.SheetView(sheetCanvas, sheetModel);
    window.onresize = function () {
        paintCanvas();
    };
    sheetCanvas.onmousedown = function (mouseEvent) {
        ConvertToCanvasAndCall(mouseEvent.x, mouseEvent.y, function (x, y) { return sheetView.OnMouseDown(x, y); });
    };
    sheetCanvas.addEventListener("touchstart", function (touchEvent) {
        touchEvent.preventDefault();
        ConvertToCanvasAndCall(touchEvent.touches[0].pageX, touchEvent.touches[0].pageY, function (x, y) { return sheetView.OnMouseDown(x, y); });
    }, false);
    sheetCanvas.onmousemove = function (mouseEvent) {
        ConvertToCanvasAndCall(mouseEvent.x, mouseEvent.y, function (x, y) { return sheetView.OnMouseMove(x, y); });
    };
    sheetCanvas.addEventListener("touchmove", function (touchEvent) {
        touchEvent.preventDefault();
        ConvertToCanvasAndCall(touchEvent.touches[0].pageX, touchEvent.touches[0].pageY, function (x, y) { return sheetView.OnMouseMove(x, y); });
    }, false);
    sheetCanvas.onmouseup = function (mouseEvent) {
        ConvertToCanvasAndCall(mouseEvent.x, mouseEvent.y, function (x, y) { return sheetView.OnMouseUp(x, y); });
    };
    sheetCanvas.addEventListener("touchend", function (touchEvent) {
        touchEvent.preventDefault();
        ConvertToCanvasAndCall(touchEvent.changedTouches[0].pageX, touchEvent.changedTouches[0].pageY, function (x, y) { return sheetView.OnMouseUp(x, y); });
    }, false);
    function paintCanvas() {
        sheetCanvas.width = window.innerWidth;
        sheetCanvas.height = window.innerHeight;
        sheetView.Invalidate();
    }
    setInterval(function () { sheetView.Paint(); }, 30);
    paintCanvas();
};
function Export() {
    var sheetCanvas = document.getElementById("mainSheet");
    sheetView.PrepareExport();
    window.location.href = sheetCanvas.toDataURL();
}
function ConvertToCanvasAndCall(x, y, func) {
    var sheetCanvas = document.getElementById("mainSheet");
    var rect = sheetCanvas.getBoundingClientRect();
    func(x - rect.left, y - rect.top);
}
