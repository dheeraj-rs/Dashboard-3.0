/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/card';
import { Button } from '@/components/button';
import { Textarea } from '@/components/textarea';
import { ArrowRight, ChevronRight } from 'lucide-react';

interface ComparisonLine {
  text: string;
  type: 'missing' | 'extra' | 'different' | 'matched';
  isHtml: boolean;
}

interface ComparisonResult {
  left: ComparisonLine[];
  right: ComparisonLine[];
}

interface ComparisonLineProps {
  line: ComparisonLine;
  index: number;
}

const Home: React.FC = () => {
  const [leftText, setLeftText] = useState<string>('');
  const [rightText, setRightText] = useState<string>('');
  const [comparison, setComparison] = useState<ComparisonResult>({
    left: [],
    right: []
  });

  const formatJSON = (jsonString: string): string => {
    try {
      const parsed = JSON.parse(jsonString);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return jsonString;
    }
  };

  const findLetterDifferences = (str1: string, str2: string): [string[], string[]] => {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix: number[][] = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));

    // Fill the matrix
    for (let i = 0; i <= len1; i++) matrix[i][0] = i;
    for (let j = 0; j <= len2; j++) matrix[0][j] = j;

    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j - 1] + 1
          );
        }
      }
    }

    // Backtrack to find the differences
    let i = len1;
    let j = len2;
    const diff1: string[] = [];
    const diff2: string[] = [];

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && str1[i - 1] === str2[j - 1]) {
        diff1.unshift(str1[i - 1]);
        diff2.unshift(str2[j - 1]);
        i--;
        j--;
      } else if (j > 0 && (i === 0 || matrix[i][j - 1] <= matrix[i - 1][j])) {
        diff1.unshift('');
        diff2.unshift(str2[j - 1]);
        j--;
      } else {
        diff1.unshift(str1[i - 1]);
        diff2.unshift('');
        i--;
      }
    }

    return [diff1, diff2];
  };

  const findWordDifferences = (str1: string, str2: string): [string, string] => {
    const tokenize = (str: string): string[] => {
      return str.match(/[^\s\{\}\[\],:]+|\s+|[:,.{}\[\]]/g) || [];
    };

    const tokens1 = tokenize(str1);
    const tokens2 = tokenize(str2);
    
    let result1 = '';
    let result2 = '';
    let i = 0;
    let j = 0;

    while (i < tokens1.length || j < tokens2.length) {
      if (i >= tokens1.length) {
        result2 += `<span class="inline-block animate-highlight-addition bg-green-100">${tokens2[j]}</span>`;
        result1 += '<span class="inline-block bg-transparent">&nbsp;</span>'.repeat(tokens2[j].length);
        j++;
      } else if (j >= tokens2.length) {
        result1 += `<span class="inline-block animate-highlight-deletion bg-red-100">${tokens1[i]}</span>`;
        result2 += '<span class="inline-block bg-transparent">&nbsp;</span>'.repeat(tokens1[i].length);
        i++;
      } else if (tokens1[i] === tokens2[j]) {
        result1 += tokens1[i];
        result2 += tokens2[j];
        i++;
        j++;
      } else if (/^\s+$/.test(tokens1[i]) && /^\s+$/.test(tokens2[j])) {
        const space = ' '.repeat(Math.max(tokens1[i].length, tokens2[j].length));
        result1 += space;
        result2 += space;
        i++;
        j++;
      } else {
        // For different tokens, apply letter-level diffing
        const [letterDiff1, letterDiff2] = findLetterDifferences(tokens1[i], tokens2[j]);
        
        let diffStr1 = '';
        let diffStr2 = '';
        
        letterDiff1.forEach((char, idx) => {
          if (char === letterDiff2[idx]) {
            diffStr1 += char;
            diffStr2 += char;
          } else {
            if (char) {
              diffStr1 += `<span class="bg-red-200 text-red-900">${char}</span>`;
            }
            if (letterDiff2[idx]) {
              diffStr2 += `<span class="bg-green-200 text-green-900">${letterDiff2[idx]}</span>`;
            }
          }
        });

        result1 += `<span class="inline-block animate-highlight-deletion bg-red-50">${diffStr1}</span>`;
        result2 += `<span class="inline-block animate-highlight-addition bg-green-50">${diffStr2}</span>`;
        i++;
        j++;
      }
    }

    return [result1, result2];
  };

  const compareLines = useCallback((leftLines: string[], rightLines: string[]): ComparisonResult => {
    const result: ComparisonResult = {
      left: [],
      right: []
    };
    
    let i = 0;
    let j = 0;
    
    while (i < leftLines.length || j < rightLines.length) {
      const leftLine = leftLines[i] || '';
      const rightLine = rightLines[j] || '';
      
      const isStructure = (line: string): boolean => /^[\s]*[{}\[\],][\s]*$/.test(line);
      
      if (leftLine === rightLine) {
        result.left.push({ text: leftLine, type: 'matched', isHtml: false });
        result.right.push({ text: rightLine, type: 'matched', isHtml: false });
        i++;
        j++;
      } else if (isStructure(leftLine) && isStructure(rightLine)) {
        result.left.push({ text: leftLine, type: 'matched', isHtml: false });
        result.right.push({ text: rightLine, type: 'matched', isHtml: false });
        i++;
        j++;
      } else {
        // Check for completely missing or extra lines first
        if (!leftLine.trim()) {
          result.left.push({ text: ' '.repeat(rightLine.length), type: 'missing', isHtml: false });
          result.right.push({ text: rightLine, type: 'extra', isHtml: false });
          j++;
          continue;
        }
        if (!rightLine.trim()) {
          result.left.push({ text: leftLine, type: 'extra', isHtml: false });
          result.right.push({ text: ' '.repeat(leftLine.length), type: 'missing', isHtml: false });
          i++;
          continue;
        }

        // Look ahead for exact matches
        let found = false;
        let lookAhead = 1;
        const maxLookAhead = 3;
        
        while (!found && lookAhead < maxLookAhead) {
          if (j + lookAhead < rightLines.length && 
              leftLine.trim() === rightLines[j + lookAhead].trim()) {
            // Add missing lines
            for (let k = 0; k < lookAhead; k++) {
              result.left.push({ 
                text: ' '.repeat(rightLines[j + k].length), 
                type: 'missing', 
                isHtml: false 
              });
              result.right.push({ 
                text: rightLines[j + k], 
                type: 'extra', 
                isHtml: false 
              });
            }
            found = true;
            j += lookAhead;
          } else if (i + lookAhead < leftLines.length && 
                     rightLine.trim() === leftLines[i + lookAhead].trim()) {
            // Add extra lines
            for (let k = 0; k < lookAhead; k++) {
              result.left.push({ 
                text: leftLines[i + k], 
                type: 'extra', 
                isHtml: false 
              });
              result.right.push({ 
                text: ' '.repeat(leftLines[i + k].length), 
                type: 'missing', 
                isHtml: false 
              });
            }
            found = true;
            i += lookAhead;
          }
          lookAhead++;
        }
        
        if (!found) {
          // Only apply word-level diff if the lines are actually different
          if (leftLine.trim() !== rightLine.trim()) {
            const [leftDiff, rightDiff] = findWordDifferences(leftLine, rightLine);
            result.left.push({ text: leftDiff, type: 'different', isHtml: true });
            result.right.push({ text: rightDiff, type: 'different', isHtml: true });
          } else {
            // Lines are same after trimming, treat as matched
            result.left.push({ text: leftLine, type: 'matched', isHtml: false });
            result.right.push({ text: rightLine, type: 'matched', isHtml: false });
          }
          i++;
          j++;
        }
      }
    }
    
    return result;
  }, []);

  const compareTexts = useCallback(() => {
    try {
      const formattedLeftText = formatJSON(leftText);
      const formattedRightText = formatJSON(rightText);
      const leftLines = formattedLeftText.split('\n');
      const rightLines = formattedRightText.split('\n');
      const result = compareLines(leftLines, rightLines);
      setComparison(result);
    } catch (error) {
      console.error('Error comparing texts:', error);
    }
  }, [leftText, rightText, compareLines]);

  const ComparisonLine: React.FC<ComparisonLineProps> = ({ line, index }) => {
    const baseClassName = "py-2 font-mono whitespace-pre transition-all duration-300 relative group flex";
    
    const typeStyles: Record<ComparisonLine['type'], string> = {
      missing: "bg-red-50 opacity-80 border-l-4 border-red-500",
      extra: "bg-green-50 opacity-80 border-l-4 border-green-500 animate-slide-in",
      different: "bg-yellow-50 opacity-80 border-l-4 border-yellow-500 animate-pulse-once",
      matched: "hover:bg-gray-50/30"
    };

    const lineNumberClass = "select-none w-12 text-xs text-gray-400 border-r border-gray-200 pr-2 text-right mr-3 flex-shrink-0";
    const contentClass = "flex-1 relative";
    const className = `${baseClassName} ${typeStyles[line.type]}`;

    const LineNumber: React.FC = () => (
      <span className={lineNumberClass}>
        {index + 1}
        {line.type !== 'matched' && (
          <ChevronRight className="inline-block w-3 h-3 ml-1 text-gray-400" />
        )}
      </span>
    );

    const getChangeType = (): React.ReactNode => {
      switch (line.type) {
        case 'extra':
          return (
            <div className="absolute invisible group-hover:visible -top-8 left-12 bg-green-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap shadow-lg">
              Added line
              <div className="absolute -bottom-1 left-4 w-2 h-2 bg-green-800 transform rotate-45"></div>
            </div>
          );
        case 'missing':
          return (
            <div className="absolute invisible group-hover:visible -top-8 left-12 bg-red-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap shadow-lg">
              Removed line
              <div className="absolute -bottom-1 left-4 w-2 h-2 bg-red-800 transform rotate-45"></div>
            </div>
          );
        case 'different':
          return (
            <div className="absolute invisible group-hover:visible -top-8 left-12 bg-yellow-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap shadow-lg">
              Modified line
              <div className="absolute -bottom-1 left-4 w-2 h-2 bg-yellow-800 transform rotate-45"></div>
            </div>
          );
        default:
          return null;
      }
    };

    if (line.isHtml) {
      return (
        <div className={className}>
          <LineNumber />
          <div className={contentClass}>
            {getChangeType()}
            <div 
              dangerouslySetInnerHTML={{ 
                __html: line.text
              }} 
            />
          </div>
        </div>
      );
    }

    return (
      <div className={className}>
        <LineNumber />
        <div className={contentClass}>
          {getChangeType()}
          {line.text}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full mx-auto p-8 space-y-8">
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Original Text
          </h3>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
            <Textarea
              value={leftText}
              onChange={(e) => setLeftText(e.target.value)}
              className="relative h-48 font-mono bg-white/90 backdrop-blur-sm rounded-lg border-0 shadow-lg transition-transform duration-300 hover:translate-y-0.5"
              placeholder="Enter JSON here..."
            />
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Modified Text
          </h3>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
            <Textarea
              value={rightText}
              onChange={(e) => setRightText(e.target.value)}
              className="relative h-48 font-mono bg-white/90 backdrop-blur-sm rounded-lg border-0 shadow-lg transition-transform duration-300 hover:translate-y-0.5"
              placeholder="Enter JSON here..."
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={compareTexts}
          className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
        >
          <span className="flex items-center gap-2 text-white">
            Compare
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Original Version
          </h3>
          <Card className="overflow-hidden bg-gradient-to-br from-white to-gray-50 shadow-xl transform transition-all duration-300">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <div className="min-w-full p-4">
                  {comparison.left.map((line, idx) => (
                    <ComparisonLine key={idx} line={line} index={idx} />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Modified Version
          </h3>
          <Card className="overflow-hidden bg-gradient-to-br from-white to-gray-50 shadow-xl transform transition-all duration-300">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <div className="min-w-full p-4">
                  {comparison.right.map((line, idx) => (
                    <ComparisonLine key={idx} line={line} index={idx} />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <style jsx global>{`
        @keyframes highlight-addition {
          0% { 
            background-color: rgba(34, 197, 94, 0.1);
            transform: translateY(-2px);
          }
          50% { 
            background-color: rgba(34, 197, 94, 0.3);
            transform: translateY(0);
          }
          100% { 
            background-color: rgba(34, 197, 94, 0.1);
            transform: translateY(0);
          }
        }

        @keyframes highlight-deletion {
          0% { 
            background-color: rgba(239, 68, 68, 0.1);
            transform: translateY(-2px);
          }
          50% { 
            background-color: rgba(239, 68, 68, 0.3);
            transform: translateY(0);
          }
          100% { 
            background-color: rgba(239, 68, 68, 0.1);
            transform: translateY(0);
          }
        }

        @keyframes slide-in {
          0% { 
            transform: translateX(10px);
            opacity: 0;
          }
          100% { 
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes pulse-once {
          0% { 
            background-color: transparent;
            transform: scale(1);
          }
          50% { 
            background-color: rgba(234, 179, 8, 0.1);
            transform: scale(1.001);
          }
          100% { 
            background-color: transparent;
            transform: scale(1);
          }
        }

        .animate-highlight-addition {
          animation: highlight-addition 1s ease-in-out;
          animation-fill-mode: forwards;
        }

        .animate-highlight-deletion {
          animation: highlight-deletion 1s ease-in-out;
          animation-fill-mode: forwards;
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
          animation-fill-mode: forwards;
        }

        .animate-pulse-once {
          animation: pulse-once 1s ease-in-out;
          animation-fill-mode: forwards;
        }

        @keyframes letter-highlight {
          0% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .bg-red-200, .bg-green-200 {
          animation: letter-highlight 0.5s ease-out;
          animation-fill-mode: forwards;
          border-radius: 2px;
          padding: 0 1px;
          margin: 0 -1px;
        }
      `}</style>
    </div>
  );
};

export default Home;