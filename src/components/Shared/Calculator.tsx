import React, { useState } from 'react';
import { X, Divide, Minus, Plus, X as Multiply, CornerDownLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';

const Calculator: React.FC = () => {
  const { isCalculatorOpen, setIsCalculatorOpen, isDarkMode } = useApp();
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const clearAll = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDot = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operator) {
      const currentValue = prevValue || 0;
      let newValue = currentValue;

      switch (operator) {
        case '+': newValue = currentValue + inputValue; break;
        case '-': newValue = currentValue - inputValue; break;
        case '*': newValue = currentValue * inputValue; break;
        case '/': newValue = currentValue / inputValue; break;
      }

      setPrevValue(newValue);
      setDisplay(String(newValue));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const handleEqual = () => {
    if (!operator) return;
    performOperation(operator);
    setOperator(null);
  };

  if (!isCalculatorOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className={cn(
        "fixed bottom-24 right-8 w-72 z-[60] p-4 rounded-2xl border shadow-2xl",
        isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Calculadora</h3>
        <button 
          onClick={() => setIsCalculatorOpen(false)}
          className="p-1 hover:bg-slate-500/10 rounded-lg transition-colors"
        >
          <X size={14} className="text-slate-500" />
        </button>
      </div>

      <div className={cn(
        "mb-4 p-4 rounded-xl text-right overflow-hidden",
        isDarkMode ? "bg-slate-800" : "bg-slate-100"
      )}>
        <div className="text-[10px] text-slate-500 h-4 font-mono uppercase tracking-widest">
          {operator ? `${prevValue} ${operator}` : ''}
        </div>
        <div className="text-2xl font-bold font-mono tracking-tighter truncate">
          {display}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <button onClick={clearAll} className="col-span-2 p-3 rounded-lg bg-slate-500/10 hover:bg-slate-500/20 font-bold text-xs uppercase">C</button>
        <button onClick={() => performOperation('/')} className="p-3 rounded-lg bg-slate-500/10 hover:bg-slate-500/20 flex items-center justify-center"><Divide size={16} /></button>
        <button onClick={() => performOperation('*')} className="p-3 rounded-lg bg-slate-500/10 hover:bg-slate-500/20 flex items-center justify-center"><Multiply size={16} /></button>
        
        {[7, 8, 9].map(n => (
          <button key={n} onClick={() => inputDigit(String(n))} className="p-3 rounded-lg bg-slate-500/5 hover:bg-slate-500/10 font-bold">{n}</button>
        ))}
        <button onClick={() => performOperation('-')} className="p-3 rounded-lg bg-slate-500/10 hover:bg-slate-500/20 flex items-center justify-center"><Minus size={16} /></button>

        {[4, 5, 6].map(n => (
          <button key={n} onClick={() => inputDigit(String(n))} className="p-3 rounded-lg bg-slate-500/5 hover:bg-slate-500/10 font-bold">{n}</button>
        ))}
        <button onClick={() => performOperation('+')} className="p-3 rounded-lg bg-slate-500/10 hover:bg-slate-500/20 flex items-center justify-center"><Plus size={16} /></button>

        {[1, 2, 3].map(n => (
          <button key={n} onClick={() => inputDigit(String(n))} className="p-3 rounded-lg bg-slate-500/5 hover:bg-slate-500/10 font-bold">{n}</button>
        ))}
        <button onClick={handleEqual} className="row-span-2 p-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center"><CornerDownLeft size={18} /></button>

        <button onClick={() => inputDigit('0')} className="col-span-2 p-3 rounded-lg bg-slate-500/5 hover:bg-slate-500/10 font-bold">0</button>
        <button onClick={inputDot} className="p-3 rounded-lg bg-slate-500/5 hover:bg-slate-500/10 font-bold">,</button>
      </div>
    </motion.div>
  );
};

export default Calculator;
