'use client';

import { useState } from 'react';
import { Folder, Plus, Pencil, Trash2, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { useCollections, COLLECTION_COLORS } from '@/hooks/useCollections';
import { cn } from '@/lib/utils';
import { Collection } from '@/lib/db';

interface CollectionsManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CollectionsManager({ open, onOpenChange }: CollectionsManagerProps) {
  const { collections, createCollection, updateCollection, removeCollection } = useCollections();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: COLLECTION_COLORS[0],
  });

  const handleCreateClick = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      color: COLLECTION_COLORS[0],
    });
  };

  const handleEditClick = (collection: Collection) => {
    setIsCreating(false);
    setEditingId(collection.id);
    setFormData({
      name: collection.name,
      description: collection.description,
      color: collection.color,
    });
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      color: COLLECTION_COLORS[0],
    });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) return;

    try {
      if (isCreating) {
        await createCollection(formData.name, formData.description, formData.color);
      } else if (editingId) {
        await updateCollection(editingId, {
          name: formData.name,
          description: formData.description,
          color: formData.color,
        });
      }
      handleCancel();
    } catch (error) {
      console.error('Failed to save collection:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this collection? All articles will be removed from it.')) {
      try {
        await removeCollection(id);
      } catch (error) {
        console.error('Failed to delete collection:', error);
      }
    }
  };

  const isFormMode = isCreating || editingId !== null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-black text-white border-gray-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Folder className="h-5 w-5" />
            Manage Collections
          </DialogTitle>
          <div className="text-sm text-gray-400 mt-1">
            Organize your articles into custom collections
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!isFormMode && (
            <Button onClick={handleCreateClick} className="w-full" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Create New Collection
            </Button>
          )}

          {isFormMode ? (
            // Create/Edit Form
            <div className="space-y-4 border border-gray-800 rounded-lg p-4 bg-gray-900/50">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-200">Collection Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Must Read, Tutorials, Inspiration"
                  className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-200">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional description"
                  className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-200">Color</Label>
                <div className="flex gap-2 flex-wrap">
                  {COLLECTION_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setFormData({ ...formData, color })}
                      className={cn(
                        'w-8 h-8 rounded-full border-2 transition-all',
                        formData.color === color
                          ? 'border-white scale-110'
                          : 'border-gray-700 hover:scale-105'
                      )}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button onClick={handleSave} disabled={!formData.name.trim()} className="flex-1">
                  {isCreating ? 'Create Collection' : 'Save Changes'}
                </Button>
                <Button onClick={handleCancel} variant="outline" className="border-gray-700">
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            // Collections List
            <div className="space-y-2">
              {collections.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Folder className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No collections yet</p>
                  <p className="text-sm">Create your first collection to get started</p>
                </div>
              ) : (
                collections.map((collection) => (
                  <div
                    key={collection.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-800 hover:bg-gray-900/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: collection.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate text-white">{collection.name}</h4>
                        {collection.description && (
                          <p className="text-sm text-gray-400 truncate">
                            {collection.description}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {collection.articleIds.length} article
                          {collection.articleIds.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-gray-800"
                        onClick={() => handleEditClick(collection)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-gray-800"
                        onClick={() => handleDelete(collection.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <DialogFooter className="border-t border-gray-800 pt-4">
          <Button onClick={() => onOpenChange(false)} variant="outline" className="border-gray-700">
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
