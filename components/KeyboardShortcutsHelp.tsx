'use client';

import { Keyboard, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';

interface KeyboardShortcutsHelpProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Shortcut {
  keys: string[];
  description: string;
  category: 'Navigation' | 'Actions' | 'Search' | 'General';
}

const shortcuts: Shortcut[] = [
  // Navigation
  {
    keys: ['j'],
    description: 'Navigate to next article',
    category: 'Navigation',
  },
  {
    keys: ['k'],
    description: 'Navigate to previous article',
    category: 'Navigation',
  },
  {
    keys: ['o'],
    description: 'Open current article in new tab',
    category: 'Navigation',
  },

  // Actions
  {
    keys: ['b'],
    description: 'Bookmark current article',
    category: 'Actions',
  },

  // Search
  {
    keys: ['/'],
    description: 'Focus search bar',
    category: 'Search',
  },
  {
    keys: ['Esc'],
    description: 'Clear search / Close modals',
    category: 'Search',
  },

  // General
  {
    keys: ['?'],
    description: 'Show keyboard shortcuts',
    category: 'General',
  },
];

function KeyboardKey({ keys }: { keys: string[] }) {
  return (
    <div className="flex items-center gap-1">
      {keys.map((key, index) => (
        <span key={index}>
          <kbd className="px-2 py-1 text-xs font-semibold text-foreground bg-muted border border-border rounded shadow-sm">
            {key}
          </kbd>
          {index < keys.length - 1 && (
            <span className="mx-1 text-muted-foreground">+</span>
          )}
        </span>
      ))}
    </div>
  );
}

export function KeyboardShortcutsHelp({ open, onOpenChange }: KeyboardShortcutsHelpProps) {
  const categories = Array.from(new Set(shortcuts.map((s) => s.category)));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Navigate and interact with the news feed using your keyboard
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {categories.map((category) => (
            <div key={category}>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
                {category}
              </h3>
              <div className="space-y-2">
                {shortcuts
                  .filter((s) => s.category === category)
                  .map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-accent transition-colors"
                    >
                      <span className="text-sm">{shortcut.description}</span>
                      <KeyboardKey keys={shortcut.keys} />
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Press <kbd className="px-1.5 py-0.5 text-xs bg-muted border border-border rounded">?</kbd> anytime to show this dialog
          </p>
          <Button onClick={() => onOpenChange(false)} size="sm">
            <X className="h-4 w-4 mr-1" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
