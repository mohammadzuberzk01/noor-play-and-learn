
import React, { useState, useRef, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Download, Eraser, Undo, Save, Pen } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

const Calligraphy = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState('#000000');
  const [history, setHistory] = useState<ImageData[]>([]);
  const [currentLetter, setCurrentLetter] = useState('alif');
  const [showGuide, setShowGuide] = useState(true);
  const [score, setScore] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const letters = [
    { id: 'alif', name: 'Alif (ا)', guide: 'A vertical stroke drawn from top to bottom' },
    { id: 'ba', name: 'Ba (ب)', guide: 'A horizontal line with a dot below' },
    { id: 'ta', name: 'Ta (ت)', guide: 'Similar to Ba, but with two dots above' },
    { id: 'tha', name: 'Tha (ث)', guide: 'Similar to Ba, but with three dots above' },
    { id: 'jim', name: 'Jim (ج)', guide: 'A curved stroke with one dot below' },
    { id: 'ha', name: 'Ha (ح)', guide: 'Similar to Jim, but without a dot' },
    { id: 'kha', name: 'Kha (خ)', guide: 'Similar to Jim, but with a dot above' },
    { id: 'dal', name: 'Dal (د)', guide: 'A curved line open to the left' }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Save initial blank canvas
    const initialState = context.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([initialState]);
    
    // Draw guide if enabled
    if (showGuide) {
      drawGuide(context, currentLetter, canvas.width, canvas.height);
    }
  }, [currentLetter, showGuide]);

  const drawGuide = (
    context: CanvasRenderingContext2D, 
    letter: string, 
    width: number, 
    height: number
  ) => {
    context.save();
    context.globalAlpha = 0.2;
    context.strokeStyle = '#888';
    context.lineWidth = 1;
    
    // Draw baseline
    context.beginPath();
    context.moveTo(width * 0.1, height * 0.6);
    context.lineTo(width * 0.9, height * 0.6);
    context.stroke();
    
    // Draw letter guide based on the current letter
    switch (letter) {
      case 'alif':
        // Alif guide - vertical line
        context.beginPath();
        context.moveTo(width * 0.5, height * 0.2);
        context.lineTo(width * 0.5, height * 0.6);
        context.stroke();
        break;
      case 'ba':
        // Ba guide - horizontal line with a dot
        context.beginPath();
        context.moveTo(width * 0.3, height * 0.6);
        context.lineTo(width * 0.7, height * 0.6);
        context.stroke();
        context.beginPath();
        context.arc(width * 0.5, height * 0.65, 3, 0, Math.PI * 2);
        context.fill();
        break;
      case 'ta':
        // Ta guide - horizontal line with two dots
        context.beginPath();
        context.moveTo(width * 0.3, height * 0.6);
        context.lineTo(width * 0.7, height * 0.6);
        context.stroke();
        context.beginPath();
        context.arc(width * 0.45, height * 0.55, 3, 0, Math.PI * 2);
        context.arc(width * 0.55, height * 0.55, 3, 0, Math.PI * 2);
        context.fill();
        break;
      case 'tha':
        // Tha guide - horizontal line with three dots
        context.beginPath();
        context.moveTo(width * 0.3, height * 0.6);
        context.lineTo(width * 0.7, height * 0.6);
        context.stroke();
        context.beginPath();
        context.arc(width * 0.45, height * 0.53, 3, 0, Math.PI * 2);
        context.arc(width * 0.55, height * 0.53, 3, 0, Math.PI * 2);
        context.arc(width * 0.5, height * 0.48, 3, 0, Math.PI * 2);
        context.fill();
        break;
      case 'jim':
        // Jim guide - curved stroke with a dot
        context.beginPath();
        context.moveTo(width * 0.3, height * 0.6);
        context.quadraticCurveTo(width * 0.4, height * 0.8, width * 0.7, height * 0.6);
        context.stroke();
        context.beginPath();
        context.arc(width * 0.5, height * 0.7, 3, 0, Math.PI * 2);
        context.fill();
        break;
      default:
        // Default - simple horizontal line
        context.beginPath();
        context.moveTo(width * 0.3, height * 0.5);
        context.lineTo(width * 0.7, height * 0.5);
        context.stroke();
    }
    
    context.restore();
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    setIsDrawing(true);
    
    const point = getPoint(e, canvas);
    
    context.strokeStyle = brushColor;
    context.lineWidth = brushSize;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    
    context.beginPath();
    context.moveTo(point.x, point.y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    const point = getPoint(e, canvas);
    
    context.lineTo(point.x, point.y);
    context.stroke();
  };

  const endDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    if (isDrawing) {
      context.closePath();
      setIsDrawing(false);
      
      // Save current state to history
      const currentState = context.getImageData(0, 0, canvas.width, canvas.height);
      setHistory(prev => [...prev, currentState]);
    }
  };

  const getPoint = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>, 
    canvas: HTMLCanvasElement
  ): Point => {
    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      // Touch event
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    } else {
      // Mouse event
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    if (showGuide) {
      drawGuide(context, currentLetter, canvas.width, canvas.height);
    }
    
    // Reset history except for initial state
    const initialState = history[0];
    setHistory([initialState]);
  };

  const undo = () => {
    if (history.length <= 1) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Remove current state
    const newHistory = history.slice(0, -1);
    setHistory(newHistory);
    
    // Apply previous state
    const previousState = newHistory[newHistory.length - 1];
    context.putImageData(previousState, 0, 0);
    
    if (showGuide) {
      drawGuide(context, currentLetter, canvas.width, canvas.height);
    }
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Create a temporary canvas without the guide
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempContext = tempCanvas.getContext('2d');
    if (!tempContext) return;
    
    // Copy the main canvas to the temporary canvas (without guide)
    tempContext.drawImage(canvas, 0, 0);
    
    // Convert to image
    const dataUrl = tempCanvas.toDataURL('image/png');
    
    // Create download link
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `arabic-calligraphy-${currentLetter}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success('Calligraphy downloaded successfully!');
  };

  const evaluateCalligraphy = () => {
    // Simple evaluation based on drawing presence
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let pixelCount = 0;
    
    // Count non-transparent pixels (drawn areas)
    for (let i = 3; i < imageData.length; i += 4) {
      if (imageData[i] > 0) pixelCount++;
    }
    
    // Simple evaluation based on how much was drawn
    const minPixels = 100;
    const maxPixels = 5000;
    
    if (pixelCount < minPixels) {
      setFeedbackMessage('Try again! Draw more of the letter.');
      return;
    }
    
    // Calculate score based on drawing amount
    const newScore = Math.min(100, Math.max(0, Math.floor((pixelCount / maxPixels) * 100)));
    setScore(newScore);
    
    // Provide feedback
    if (newScore >= 80) {
      setFeedbackMessage('Excellent! Your calligraphy is beautiful!');
      toast.success('Excellent calligraphy!');
    } else if (newScore >= 60) {
      setFeedbackMessage('Good effort! Keep practicing.');
      toast.success('Good calligraphy!');
    } else {
      setFeedbackMessage('Nice try. Continue to practice this letter.');
    }
  };

  const handleSelectLetter = (value: string) => {
    setCurrentLetter(value);
    clearCanvas();
    setFeedbackMessage('');
    setScore(0);
  };

  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Arabic Calligraphy</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Learn to write Arabic letters with guided practice. Follow the guides and create beautiful Arabic calligraphy.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <div className="bg-gray-100 rounded-lg h-96 relative overflow-hidden">
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={endDrawing}
                  onMouseLeave={endDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={endDrawing}
                  className="w-full h-full cursor-crosshair"
                />
              </div>
              
              <div className="flex flex-wrap justify-between items-center mt-4 gap-2">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={clearCanvas}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Eraser className="h-4 w-4" />
                    Clear
                  </Button>
                  <Button
                    onClick={undo}
                    variant="outline"
                    size="sm"
                    disabled={history.length <= 1}
                    className="flex items-center gap-1"
                  >
                    <Undo className="h-4 w-4" />
                    Undo
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    onClick={evaluateCalligraphy}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Save className="h-4 w-4" />
                    Evaluate
                  </Button>
                  <Button
                    onClick={downloadCanvas}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Brush Size</label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[brushSize]}
                      min={1}
                      max={20}
                      step={1}
                      onValueChange={(value) => setBrushSize(value[0])}
                      className="flex-1"
                    />
                    <div 
                      className="w-8 h-8 rounded-full border flex items-center justify-center"
                      style={{ backgroundColor: brushColor }}
                    >
                      <div 
                        className="rounded-full bg-current"
                        style={{ width: `${brushSize}px`, height: `${brushSize}px` }}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Brush Color</label>
                  <div className="flex flex-wrap gap-2">
                    {['#000000', '#0047AB', '#006400', '#8B0000', '#4B0082'].map(color => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full ${brushColor === color ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setBrushColor(color)}
                      />
                    ))}
                    <input
                      type="color"
                      value={brushColor}
                      onChange={(e) => setBrushColor(e.target.value)}
                      className="w-8 h-8 p-0 border-0 rounded-full overflow-hidden"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {feedbackMessage && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{feedbackMessage}</p>
                  <Badge variant="outline" className="px-4 py-2">
                    Score: {score}/100
                  </Badge>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Letter Selection</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Choose a Letter to Practice</label>
                  <Select value={currentLetter} onValueChange={handleSelectLetter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a letter" />
                    </SelectTrigger>
                    <SelectContent>
                      {letters.map(letter => (
                        <SelectItem key={letter.id} value={letter.id}>
                          {letter.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Show Guide</label>
                  <div className="relative inline-block w-10 align-middle select-none">
                    <input 
                      type="checkbox" 
                      checked={showGuide}
                      onChange={() => setShowGuide(!showGuide)}
                      className="sr-only"
                      id="toggle-guide"
                    />
                    <label 
                      htmlFor="toggle-guide"
                      className={`block h-6 rounded-full cursor-pointer transition-colors ${
                        showGuide ? 'bg-islamic-primary' : 'bg-gray-300'
                      }`}
                    >
                      <span 
                        className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${
                          showGuide ? 'translate-x-4' : 'translate-x-0'
                        }`} 
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Letter Guide</h2>
              
              <div className="space-y-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-2xl font-bold mb-2">
                    {letters.find(l => l.id === currentLetter)?.name || 'Select a letter'}
                  </h3>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">How to Write:</h4>
                  <p className="text-sm text-gray-600">
                    {letters.find(l => l.id === currentLetter)?.guide || 'Select a letter to see writing instructions.'}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Tips:</h4>
                  <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                    <li>Start at the top and follow the guide</li>
                    <li>Practice the stroke several times</li>
                    <li>Pay attention to proportions</li>
                    <li>Arabic is written from right to left</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Calligraphy;
